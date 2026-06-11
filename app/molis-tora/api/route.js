import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import {
  RSS_SOURCES,
  filterBreakingNews,
  getCategoryEmoji,
  getTimeAgo
} from '../services/rssFeeds';
import { CACHE } from '@/src/core/config/appConfig';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Portify.gr Bot 1.0' }
});

export const revalidate = 30;

export async function GET() {
  try {
    const results = await Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
        try {
          const feedParser = source.encoding
  ? new Parser({ timeout: 10000, headers: { 'User-Agent': 'Portify.gr Bot 1.0' }, defaultEncoding: source.encoding })
  : parser;
const feed = await feedParser.parseURL(source.url);
          return feed.items.slice(0, 5).map(item => {
            const pubDate = item.pubDate || item.isoDate;
            const pubTimestamp = pubDate ? new Date(pubDate).getTime() : Date.now();
            const hoursAgo = (Date.now() - pubTimestamp) / (1000 * 60 * 60);
            const recencyScore = Math.max(0, 24 - hoursAgo) * 10;
            const score = (source.priority * 500) + recencyScore;
            return {
              id: `${source.id}-${item.guid || item.link || item.title?.slice(0, 20)}`,
              title: item.title?.trim() || 'Χωρίς τίτλο',
              summary: item.contentSnippet?.slice(0, 120).trim() || item.summary?.slice(0, 120).trim() || null,
              link: item.link || '#',
              timeAgo: getTimeAgo(pubDate),
              source: source.name,
              category: source.category,
              priority: source.priority,
              emoji: getCategoryEmoji(source.category),
              pubDate,
              score
            };
          });
        } catch (err) {
          console.warn(`[molis-tora] RSS failed: ${source.name} — ${err?.message}`);
          return [];
        }
      })
    );

    const allNews = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    const uniqueNews = [];
    const seen = new Set();
    for (const item of allNews) {
      const key = item.title?.toLowerCase().replace(/[^\w\sά-ώα-ω]/gi, '').replace(/\s+/g, ' ').trim();
      if (!seen.has(key)) { seen.add(key); uniqueNews.push(item); }
    }

    const sortedByScore = [...uniqueNews].sort((a, b) => b.score - a.score);
    const breaking = filterBreakingNews(uniqueNews);
    const rankedBreaking = [...breaking].sort((a, b) => b.score - a.score);
    const final = rankedBreaking.length > 0 ? rankedBreaking.slice(0, 20) : sortedByScore.slice(0, 20);

    return NextResponse.json(final, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE.news}, stale-while-revalidate=30`,
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (err) {
    console.error('[molis-tora] RSS fetch failed:', err?.message);
    return NextResponse.json({ error: 'Αποτυχία φόρτωσης' }, { status: 500 });
  }
}



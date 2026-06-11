export const RSS_SOURCES = [
  { id: 'protothema', name: 'Protothema', url: 'https://www.protothema.gr/rss', encoding: 'latin1', category: 'news', priority: 5 },
  { id: 'cnn',        name: 'Naftemporiki',  url: 'https://www.naftemporiki.gr/feed/',       category: 'news', priority: 5 },
  { id: 'in',         name: 'In.gr',       url: 'https://www.in.gr/feed/',       category: 'news', priority: 4 },
  { id: 'iefimerida', name: 'iefimerida',  url: 'https://www.iefimerida.gr/rss.xml', category: 'news', priority: 4 },
  { id: 'lifo',       name: 'Newsbeast',        url: 'https://www.newsbeast.gr/feed',      category: 'news', priority: 3 },
  { id: 'gazzetta',   name: 'Gazzetta',    url: 'https://www.gazzetta.gr/rss',   category: 'sports', priority: 2 },
];

export const CATEGORY_EMOJI = {
  news: 'π“°', politics: 'π›οΈ', sports: 'β½', economy: 'π’°', tech: 'π’»',
};

export function getCategoryEmoji(category) {
  return CATEGORY_EMOJI[category] || 'π“„';
}

export function getTimeAgo(dateString) {
  if (!dateString) return 'Ξ¤ΟΟΞ±';
  const diffMs = new Date() - new Date(dateString);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ξ¤ΟΟΞ±';
  if (diffMin < 60) return `${diffMin}Ξ» Ο€ΟΞΉΞ½`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}Ο‰ Ο€ΟΞΉΞ½`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}Ξ· Ο€ΟΞΉΞ½`;
  return new Date(dateString).toLocaleDateString('el-GR');
}

export function filterBreakingNews(items) {
  const keywords = [
    'Ξ²ΟΞ­ΞΈΞ·ΞΊΞµ','Ξ½ΞµΞΊΟ','Ο„ΟΞ±Ο…ΞΌΞ±Ο„','ΟƒΟ…Ξ»Ξ»Ξ®Ο','ΞµΟ€Ξ―ΞΈΞµΟƒ','Ξ­ΞΊΟΞ·ΞΎ','Ο†Ο‰Ο„ΞΉΞ¬','ΟƒΞµΞΉΟƒΞΌ',
    'Ξ΄ΞΏΞ»ΞΏΟ†ΞΏΞ½','Ξ±Ο€Ξ±Ξ³Ο‰Ξ³','Ο„ΟΞΏΞΌΞΏΞΊΟΞ±Ο„','Ξ½Ξ±Ο…Ξ±Ξ³ΞΉ','Ο€ΟΞ»ΞµΞΌ','ΞΏΟ…ΞΊΟΞ±Ξ½','ΟΟ‰ΟƒΞ―Ξ±',
    'ΞΉΟƒΟΞ±Ξ®Ξ»','ΞΉΟΞ¬Ξ½','Ξ½Ξ±Ο„ΞΏ','ΞµΞΊΞ»ΞΏΞ³','ΞΊΟ…Ξ²Ξ­ΟΞ½Ξ·Οƒ','Ο€Ξ±ΟΞ±Ξ―Ο„Ξ·Οƒ','Ο€ΟΟ‰ΞΈΟ…Ο€ΞΏΟ…ΟΞ³',
    'Ο…Ο€ΞΏΟ…ΟΞ³','Ξ­ΞΊΟ„Ξ±ΞΊΟ„','alert','breaking'
  ];
  return items.filter(item => {
    const text = `${item.title} ${item.summary || ''}`.toLowerCase();
    return keywords.some(k => text.includes(k));
  });
}

export function sortByPriority(items) {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });
}











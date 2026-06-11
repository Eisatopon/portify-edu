'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { API_ROUTES, POLLING } from '@/src/core/config/appConfig';

export function useNews(refreshInterval = POLLING.news) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchNews = useCallback(async () => {
    if (document.visibilityState === 'hidden') return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      setError(null);
      setLoading(prev => (news.length === 0 ? true : prev));
      const res = await fetch(`${API_ROUTES.news}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNews(Array.isArray(data) ? data : (data.items ?? []));
    } catch (err) {
      setError(err?.message || 'Ξ‘Ο€ΞΏΟ„Ο…Ο‡Ξ―Ξ± Ο†ΟΟΟ„Ο‰ΟƒΞ·Ο‚');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [news.length]);

  useEffect(() => {
    fetchNews();
    intervalRef.current = setInterval(fetchNews, refreshInterval);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchNews();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNews, refreshInterval]);

  return { news, loading, error, refetch: fetchNews };
}

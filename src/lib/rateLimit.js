// In-memory token bucket per IP for AI endpoint.
// For multi-region production: swap with Upstash Ratelimit.
// Free tier protection: 12 req / 60s, 60 req / hour.

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_MIN = 12;
const HOUR_MS = 3_600_000;
const MAX_PER_HOUR = 60;

export function checkRateLimit(ip) {
  const now = Date.now();
  const entry = buckets.get(ip) || { minute: [], hour: [] };
  entry.minute = entry.minute.filter(t => now - t < WINDOW_MS);
  entry.hour = entry.hour.filter(t => now - t < HOUR_MS);

  if (entry.minute.length >= MAX_PER_MIN) {
    return { allowed: false, retryAfter: Math.ceil((WINDOW_MS - (now - entry.minute[0])) / 1000) };
  }
  if (entry.hour.length >= MAX_PER_HOUR) {
    return { allowed: false, retryAfter: Math.ceil((HOUR_MS - (now - entry.hour[0])) / 1000) };
  }
  entry.minute.push(now);
  entry.hour.push(now);
  buckets.set(ip, entry);

  // Soft cleanup to avoid leak
  if (buckets.size > 5000) {
    const cutoff = now - HOUR_MS;
    for (const [k, v] of buckets) {
      if (!v.hour.length || v.hour[v.hour.length - 1] < cutoff) buckets.delete(k);
    }
  }
  return { allowed: true };
}

export function getClientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

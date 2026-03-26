const { put } = require('@vercel/blob');

const CACHE_KEY = 'news-cache.json';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const QUERY = 'europe travel kids attraction waterpark theme park museum opening family';

async function fetchFresh(apiKey) {
  const params = new URLSearchParams({
    q: QUERY,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '30',
    apiKey,
  });

  const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
  const data = await res.json();

  const articles = (data.articles || [])
    .filter(a => a.title && a.title !== '[Removed]' && a.url)
    .map(a => ({
      title: a.title.split(' - ')[0].trim(),
      url: a.url,
      source: a.source?.name || null,
      publishedAt: a.publishedAt,
    }));

  return { cachedAt: Date.now(), articles };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing NEWSAPI_KEY' });

  const forceRefresh = req.query.refresh === 'true';

  // --- Check Blob cache ---
  if (!forceRefresh) {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const storeId = token?.match(/vercel_blob_rw_([^_]+)/)?.[1];
      if (storeId) {
        const cacheUrl = `https://${storeId}.public.blob.vercel-storage.com/${CACHE_KEY}`;
        const cacheRes = await fetch(cacheUrl);
        if (cacheRes.ok) {
          const cached = await cacheRes.json();
          if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cached);
          }
        }
      }
    } catch {
      // cache miss — continue to fetch fresh
    }
  }

  // --- Fetch fresh from NewsAPI ---
  try {
    const payload = await fetchFresh(apiKey);

    // Save to Blob
    try {
      await put(CACHE_KEY, JSON.stringify(payload), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
    } catch (blobErr) {
      console.error('Blob save error:', blobErr);
    }

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err) {
    console.error('News fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
};

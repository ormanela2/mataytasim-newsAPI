 const { put } = require('@vercel/blob');                                      
  const CACHE_KEY = 'news-cache.json';                                            const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
                                                                                  const QUERIES = [
    'theme park europe',
    'waterpark family travel',
    'museum kids europe',
    'family travel europe',
  ];

  async function fetchFresh(apiKey, debug) {
    const rawResults = {};
    const results = await Promise.all(QUERIES.map(async (q) => {
      const params = new URLSearchParams({
        q,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '10',
        apiKey,
      });
      try {
        const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
        const data = await res.json();
        if (debug) rawResults[q] = {
          status: res.status,
          totalResults: data.totalResults,
          articleCount: (data.articles || []).length,
          sample: data.articles?.[0] || null,
          apiStatus: data.status,
          message: data.message
        };
        if (!res.ok) return [];
        return data.articles || [];
      } catch (e) {
        if (debug) rawResults[q] = { error: e.message };
        return [];
      }
    }));

    const seen = new Set();
    const articles = [];
    for (const batch of results) {
      for (const a of batch) {
        if (a.title && a.title !== '[Removed]' && a.url && !seen.has(a.url)) {
          seen.add(a.url);
          articles.push({
            title: a.title.split(' - ')[0].trim(),
            url: a.url,
            source: a.source?.name || null,
            publishedAt: a.publishedAt,
          });
        }
      }
    }

    return { cachedAt: Date.now(), articles, ...(debug ? { debug: rawResults } :
   {}) };
  }

  module.exports = async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing NEWSAPI_KEY' });

    const forceRefresh = req.query.refresh === 'true';
    const debug = req.query.debug === 'true';

    // --- Check Blob cache ---
    if (!forceRefresh && !debug) {
      try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        const storeId = token?.match(/vercel_blob_rw_([^_]+)/)?.[1];
        if (storeId) {
          const cacheUrl =
  `https://${storeId}.public.blob.vercel-storage.com/${CACHE_KEY}`;
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
      const payload = await fetchFresh(apiKey, debug);

      // Save to Blob (skip on debug)
      if (!debug) {
        try {
          await put(CACHE_KEY, JSON.stringify(payload), {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
          });
        } catch (blobErr) {
          console.error('Blob save error:', blobErr);
        }
      }

      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    } catch (err) {
      console.error('News fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  };

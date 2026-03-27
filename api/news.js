const CACHE_TTL_MS = 60 * 60 * 1000;                                                                                                                                                                                                                                                                                                                                                                                                const QUERIES = [                                                                                                                                                                                                   'theme park europe',
    'waterpark family europe',
    'museum kids europe',
    'family travel europe',
  ];

  const TRAVEL_KEYWORDS = [
    'travel', 'family', 'kids', 'children', 'theme park', 'waterpark', 'water park',
    'museum', 'vacation', 'holiday', 'resort', 'hotel', 'disney', 'legoland',
    'attraction', 'adventure', 'trip', 'tour', 'destination', 'summer',
    'flight', 'cruise', 'playground', 'zoo', 'aquarium', 'park',
  ];

  const EUROPE_KEYWORDS = [
    'europe', 'european', 'uk', 'england', 'france', 'germany', 'spain', 'italy',
    'netherlands', 'austria', 'switzerland', 'poland', 'czech', 'hungary', 'slovakia',
    'portugal', 'greece', 'sweden', 'norway', 'denmark', 'belgium', 'ireland',
    'london', 'paris', 'berlin', 'rome', 'barcelona', 'amsterdam', 'vienna',
    'prague', 'budapest', 'lisbon', 'athens', 'dublin', 'brussels', 'copenhagen',
    'stockholm', 'warsaw', 'disneyland paris', 'legoland', 'europapark', 'europa-park',
  ];

  let memCache = null;

  async function translateToHebrew(text) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|he`;
      const res = await fetch(url);
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && translated !== text) return translated;
    } catch {}
    return text;
  }

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
          message: data.message,
        };
        if (!res.ok) return [];
        return data.articles || [];
      } catch (e) {
        if (debug) rawResults[q] = { error: e.message };
        return [];
      }
    }));

    const seen = new Set();
    const candidates = [];
    for (const batch of results) {
      for (const a of batch) {
        if (!a.title || !a.url || seen.has(a.url)) continue;
        const titleLower = a.title.toLowerCase();
        if (!TRAVEL_KEYWORDS.some(kw => titleLower.includes(kw))) continue;
        if (!EUROPE_KEYWORDS.some(kw => titleLower.includes(kw))) continue;
        seen.add(a.url);
        candidates.push({
          title: a.title.split(' - ')[0].trim(),
          url: a.url,
          source: a.source?.name || null,
          publishedAt: a.publishedAt,
        });
      }
    }

    const articles = await Promise.all(candidates.map(async (a) => ({
      ...a,
      title: await translateToHebrew(a.title),
    })));

    return { cachedAt: Date.now(), articles, ...(debug ? { debug: rawResults } : {}) };
  }

  module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing NEWSAPI_KEY' });

    const forceRefresh = req.query.refresh === 'true';
    const debug = req.query.debug === 'true';

    if (!forceRefresh && !debug && memCache && (Date.now() - memCache.cachedAt < CACHE_TTL_MS)) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(memCache);
    }

    try {
      const payload = await fetchFresh(apiKey, debug);
      if (!debug) memCache = payload;
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    } catch (err) {
      console.error('News fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  };

const CACHE_TTL_MS = 60 * 60 * 1000;                                                                                                                                                                            
  const QUERIES = [                                                                                                                                                                                                   'family travel destinations europe',
    'traveling with kids europe',                                                                                                                                                                                     'theme park europe kids',
    'water park families europe',
    'kid-friendly cities europe',
    'family vacation europe 2026',
    'interactive museums kids europe',
    'budget family travel europe',
    'budapest with kids',
    'outdoor activities kids europe',
  ];

  const BLOCKED_KEYWORDS = [
    'cannabis', 'drug', 'war', 'oil', 'trump', 'politics', 'murder', 'crime',
    'arrest', 'shooting', 'cancer', 'disease', 'lawsuit', 'court', 'prison',
    'college fund', 'ivy league', 'stock', 'crypto', 'bitcoin', 'massage',
    'bribery', 'corruption', 'military', 'weapons', 'bomb', 'terror',
  ];

  const FAMILY_KEYWORDS = [
    'family', 'families', 'kids', 'with kids', 'for kids', 'kid-friendly',
    'family-friendly', 'toddler', 'traveling with children',
  ];

  const TRAVEL_KEYWORDS = [
    'travel', 'theme park', 'waterpark', 'water park', 'vacation', 'holiday',
    'resort', 'disney', 'legoland', 'attraction', 'trip', 'destination',
    'cruise', 'zoo', 'aquarium', 'amusement park', 'getaway', 'road trip',
  ];

  const TRUSTED_SOURCES = [
    'themeparkinsider.com', 'thepointsguy.com', 'travelandleisure.com',
    'lonelyplanet.com', 'cntraveler.com', 'afar.com', 'tripadvisor.com',
    'familyvacationist.com', 'disneyfoodblog.com', 'insidethemagic.net',
    'skift.com', 'holidaypirates.com',
  ];

  let memCache = null;

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
    const articles = [];
    for (const batch of results) {
      for (const a of batch) {
        if (!a.title || !a.url || seen.has(a.url)) continue;
        const titleLower = a.title.toLowerCase();
        if (BLOCKED_KEYWORDS.some(kw => titleLower.includes(kw))) continue;
        const hasFamily = FAMILY_KEYWORDS.some(kw => titleLower.includes(kw));
        const hasTravel = TRAVEL_KEYWORDS.some(kw => titleLower.includes(kw));
        const trustedSource = TRUSTED_SOURCES.some(s => (a.url || '').includes(s));
        if (!trustedSource && !(hasFamily && hasTravel)) continue;
        seen.add(a.url);
        articles.push({
          title: a.title.split(' - ')[0].trim(),
          url: a.url,
          source: a.source?.name || null,
          publishedAt: a.publishedAt,
        });
      }
    }

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

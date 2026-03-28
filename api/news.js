const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours                                                                                                                                                             
  const QUERIES = [                                                                                                                                                                                                   'family travel europe kids',                                                                                                                                                                                      'theme park europe family',                                                                                                                                                                                       'family vacation europe 2026',
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

  const EUROPE_KEYWORDS = [
    'europe', 'european',
    // countries
    'france', 'french', 'spain', 'spanish', 'italy', 'italian', 'germany', 'german',
    'greece', 'greek', 'portugal', 'portuguese', 'netherlands', 'dutch', 'belgium', 'belgian',
    'austria', 'austrian', 'switzerland', 'swiss', 'czech', 'poland', 'polish',
    'hungary', 'hungarian', 'croatia', 'croatian', 'denmark', 'danish', 'sweden', 'swedish',
    'norway', 'norwegian', 'finland', 'finnish', 'ireland', 'irish', 'scotland', 'scottish',
    'slovakia', 'slovenia', 'romania', 'bulgaria', 'montenegro', 'albania', 'serbia',
    'turkey', 'turkish', 'malta', 'cyprus', 'luxembourg', 'estonia', 'latvia', 'lithuania',
    'uk', 'england', 'british', 'wales', 'welsh',
    // cities
    'paris', 'london', 'rome', 'barcelona', 'madrid', 'amsterdam', 'berlin', 'vienna',
    'prague', 'budapest', 'athens', 'lisbon', 'brussels', 'milan', 'florence', 'venice',
    'copenhagen', 'stockholm', 'oslo', 'dublin', 'edinburgh', 'munich', 'zurich',
    'porto', 'seville', 'naples', 'sicily', 'dubrovnik', 'split', 'warsaw', 'krakow',
    'tallinn', 'riga', 'vilnius', 'reykjavik', 'valletta', 'nicosia', 'tirana',
    'santorini', 'mykonos', 'amalfi', 'tuscany', 'provence', 'andalusia', 'costa brava',
    'costa del sol', 'algarve', 'lake como', 'lake garda', 'bavarian', 'bavaria',
    // theme parks in europe
    'disneyland paris', 'disney paris', 'efteling', 'phantasialand', 'europa-park', 'europa park',
    'tivoli', 'portaventura', 'gardaland', 'legoland windsor', 'alton towers', 'thorpe park',
    // regions
    'mediterranean', 'scandinavia', 'scandinavian', 'alps', 'balkans', 'iberian',
    'adriatic', 'aegean', 'canary islands', 'balearic', 'riviera',
  ];

  const BLOCKED_KEYWORDS = [
    // drugs & health
    'cannabis', 'drug', 'cancer', 'disease', 'overdose',
    // politics & government
    'trump', 'biden', 'putin', 'zelensky', 'politics', 'political', 'election',
    'vote', 'democrat', 'republican', 'senator', 'congress', 'parliament',
    'white house', 'kremlin', 'sanction', 'diplomat', 'diplomacy', 'coup',
    'protest', 'riot', 'activist',
    // military & weapons
    'war', 'army', 'military', 'soldier', 'troops', 'weapon', 'weapons',
    'missile', 'nuclear', 'bomb', 'airstrike', 'air strike', 'warplane',
    'artillery', 'combat', 'battlefield', 'invasion', 'ceasefire', 'nato',
    'militia', 'rebel', 'gunfire', 'sniper', 'ammunition', 'hostage', 'siege',
    'assassination', 'genocide',
    // crime & legal
    'murder', 'crime', 'arrest', 'shooting', 'prison', 'lawsuit', 'court',
    'bribery', 'corruption', 'fraud', 'trafficking',
    // finance
    'oil', 'stock', 'crypto', 'bitcoin', 'college fund', 'ivy league',
    // misc
    'massage', 'terror', 'terrorist',
  ];

  const TRUSTED_SOURCES = [
    'themeparkinsider.com', 'thepointsguy.com', 'travelandleisure.com',
    'lonelyplanet.com', 'cntraveler.com', 'afar.com', 'tripadvisor.com',
    'familyvacationist.com', 'disneyfoodblog.com', 'insidethemagic.net',
    'skift.com', 'holidaypirates.com', 'trekaroo.com', 'travelingmom.com',
    'mommypoppins.com', 'thetravel.com', 'frommers.com', 'fodors.com',
    'roughguides.com', 'worldtravelguide.net', 'timeout.com',
    'theguardian.com/travel', 'telegraph.co.uk/travel', 'bbc.com/travel',
    'independent.co.uk/travel', 'nationalgeographic.com/travel',
    'familytraveler.com', 'euroweeklynews.com', 'planetware.com',
  ];

  let memCache = null;

  const DOMAINS = [
    'themeparkinsider.com', 'thepointsguy.com', 'travelandleisure.com',
    'lonelyplanet.com', 'cntraveler.com', 'afar.com', 'insidethemagic.net',
    'disneyfoodblog.com', 'skift.com', 'holidaypirates.com', 'thetravel.com',
    'matadornetwork.com', 'smartertravel.com', 'timeout.com', 'fodors.com',
    'frommers.com', 'roughguides.com', 'wanderlust.co.uk', 'blooloop.com',
    'amusementtoday.com', 'attractionsmanagement.com', 'euroweeklynews.com',
    'timesofisrael.com', 'jpost.com', 'europeanbestdestinations.com',
  ].join(',');

  async function fetchFresh(apiKey, debug) {
    const rawResults = {};

    // Query 1: keyword queries
    const keywordResults = await Promise.all(QUERIES.map(async (q) => {
      const params = new URLSearchParams({
        q,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '30',
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

    // Query 2: directly from trusted travel domains
    let domainResults = [];
    try {
      const params = new URLSearchParams({
        q: 'travel family kids europe',
        domains: DOMAINS,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '30',
        apiKey,
      });
      const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
      const data = await res.json();
      if (debug) rawResults['_domains'] = {
        status: res.status,
        totalResults: data.totalResults,
        articleCount: (data.articles || []).length,
        apiStatus: data.status,
        message: data.message,
      };
      if (res.ok) domainResults = data.articles || [];
    } catch (e) {
      if (debug) rawResults['_domains'] = { error: e.message };
    }

    const results = [...keywordResults, domainResults];

    const seen = new Set();
    let articles = [];
    for (const batch of results) {
      for (const a of batch) {
        if (!a.title || !a.url || seen.has(a.url)) continue;
        const titleLower = a.title.toLowerCase();
        if (BLOCKED_KEYWORDS.some(kw => titleLower.includes(kw))) continue;
        const hasFamily = FAMILY_KEYWORDS.some(kw => titleLower.includes(kw));
        const hasTravel = TRAVEL_KEYWORDS.some(kw => titleLower.includes(kw));
        const trustedSource = TRUSTED_SOURCES.some(s => (a.url || '').includes(s));
        if (!trustedSource && !(hasFamily && hasTravel)) continue;
        const hasEurope = EUROPE_KEYWORDS.some(kw => titleLower.includes(kw));
        const euroSource = ['holidaypirates', 'euroweeklynews', 'europeanbestdestinations', 'wanderlust'].some(s => (a.url || '').includes(s));
        if (!hasEurope && !euroSource) continue;
        seen.add(a.url);
        articles.push({
          title: a.title.split(' - ')[0].trim(),
          url: a.url,
          source: a.source?.name || null,
          publishedAt: a.publishedAt,
        });
      }
    }

    // Translate titles to Hebrew
    const translateKey = process.env.GOOGLE_TRANSLATE_KEY;
    if (translateKey && articles.length) {
      try {
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${translateKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: articles.map(a => a.title),
              source: 'en',
              target: 'he',
              format: 'text',
            }),
          }
        );
        const data = await res.json();
        const translations = data?.data?.translations;
        if (translations) {
          articles = articles.map((a, i) => ({
            ...a,
            title: translations[i]?.translatedText || a.title,
          }));
        }
      } catch (e) {
        console.error('Translation error:', e.message);
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

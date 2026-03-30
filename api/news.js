const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
                                                                                                                                                                                                                    const NEWSAPI_AI_ENDPOINT = 'https://eventregistry.org/api/v1/article/getArticles';                                                                                                                               const EUROPE_LOCATION_URI = 'http://en.wikipedia.org/wiki/Europe';                                                                                                                                              
  // 3 queries per refresh = 3 tokens. At 4 refreshes/day = 12 tokens/day.                                                                                                                                          // 2000 free tokens lasts ~166 days.                                                                                                                                                                              // NOTE: locationUri must be top-level — inside $query it is ignored by the API.                                                                                                                                                                                                                                                                                                                                                    const NEWS_QUERIES = [
    {
      // Family travel & destinations
      name: 'family-travel',
      keyword: 'family travel OR with kids OR family vacation OR kid-friendly OR traveling with children OR family holiday OR family activities OR family trip Europe',
      count: 50,
    },
    {
      // Parks, attractions & events
      name: 'attractions-events',
      keyword: 'Efteling OR Europa-Park OR "Disneyland Paris" OR Legoland OR Gardaland OR PortAventura OR "Alton Towers" OR "Thorpe Park" OR Energylandia OR Tivoli OR Phantasialand OR "Puy du Fou" OR "Parc
  Asterix" OR Liseberg OR theme park opening OR water park opening OR new attraction OR roller coaster opening OR "Christmas market" OR festival Europe OR museum opening OR "free museum" OR "open air" OR
  "summer season opens"',
      count: 80,
    },
    {
      // Travel alerts: flights, strikes, taxes, logistics
      name: 'travel-alerts',
      keyword: '"tourist tax" OR "city tax" tourism OR transport strike Europe OR airport strike OR "flight disruption" OR "new route" Israel OR "direct flight" Israel Europe OR "Ryanair" OR "Wizz Air" OR
  "easyJet" Israel OR ETIAS OR "low emission zone" OR "airport delay" OR "rail strike" OR "new train" Europe OR "high speed rail" OR "border control" Europe OR "travel warning" Europe',
      count: 70,
    },
  ];

  // RSS feeds — free, no token cost
  const RSS_FEEDS = [
    // Theme parks & attractions
    { url: 'https://www.blooloop.com/feed/', name: 'Blooloop' },
    { url: 'https://www.amusementtoday.com/feed/', name: 'Amusement Today' },
    { url: 'https://insidethemagic.net/feed/', name: 'Inside the Magic' },
    // Aviation & routes
    { url: 'https://simpleflying.com/feed/', name: 'Simple Flying' },
    // General travel
    { url: 'https://www.travelandleisure.com/rss', name: 'Travel + Leisure' },
    { url: 'https://www.lonelyplanet.com/news/feed', name: 'Lonely Planet' },
  ];

  // Used only for RSS article Europe check
  const EUROPE_KEYWORDS = [
    'europe', 'european',
    'france', 'french', 'spain', 'spanish', 'italy', 'italian', 'germany', 'german',
    'greece', 'greek', 'portugal', 'portuguese', 'netherlands', 'dutch', 'belgium', 'belgian',
    'austria', 'austrian', 'switzerland', 'swiss', 'czech', 'poland', 'polish',
    'hungary', 'hungarian', 'croatia', 'croatian', 'denmark', 'danish', 'sweden', 'swedish',
    'norway', 'norwegian', 'finland', 'finnish', 'ireland', 'irish', 'scotland', 'scottish',
    'slovakia', 'slovenia', 'romania', 'bulgaria', 'malta', 'cyprus', 'luxembourg',
    'uk', 'british', 'wales', 'welsh',
    'paris', 'london', 'rome', 'barcelona', 'madrid', 'amsterdam', 'berlin', 'vienna',
    'prague', 'budapest', 'athens', 'lisbon', 'brussels', 'milan', 'florence', 'venice',
    'copenhagen', 'stockholm', 'oslo', 'dublin', 'edinburgh', 'munich', 'zurich',
    'santorini', 'mykonos', 'tuscany', 'provence', 'bavarian', 'bavaria',
    'mediterranean', 'scandinavia', 'scandinavian', 'alps', 'adriatic', 'aegean',
    // parks with no country name in title
    'disneyland paris', 'disney paris', 'efteling', 'phantasialand', 'europa-park', 'europa park',
    'tivoli', 'portaventura', 'gardaland', 'legoland windsor', 'alton towers', 'thorpe park',
    'parc asterix', 'puy du fou', 'walibi', 'heide park', 'movie park germany',
    'energylandia', 'liseberg', 'plopsaland', 'bobbejaanland',
  ];

  const BLOCKED_KEYWORDS = [
    // politics & government
    'trump', 'biden', 'putin', 'zelensky', 'politics', 'political', 'election',
    'vote', 'democrat', 'republican', 'senator', 'congress', 'parliament',
    'white house', 'kremlin', 'sanction', 'diplomat', 'diplomacy', 'coup',
    'protest', 'riot', 'activist',
    // military & weapons
    'war', 'military', 'soldier', 'troops', 'weapon', 'weapons',
    'missile', 'nuclear', 'airstrike', 'air strike', 'warplane',
    'artillery', 'battlefield', 'invasion', 'ceasefire', 'nato',
    'militia', 'gunfire', 'sniper', 'hostage', 'siege', 'assassination', 'genocide',
    // crime & legal
    'murder', 'crime', 'arrest', 'shooting', 'prison', 'lawsuit',
    'bribery', 'corruption', 'fraud', 'trafficking',
    // drugs & health
    'cannabis', 'drug', 'cancer', 'disease', 'overdose',
    // finance
    'oil', 'stock', 'crypto', 'bitcoin',
    // misc
    'terror', 'terrorist', 'massage',
    // cost of living
    'cost to raise', 'cost of raising', 'raise children', 'childcare cost',
    'cost of living', 'raising a child',
    // commercial / pricing — hotels
    'hotel deal', 'hotel deals', 'hotel discount', 'hotel offer', 'hotel sale',
    'hotel price', 'hotel prices', 'hotel rate', 'hotel rates', 'room rate', 'room rates',
    'per night', 'nightly rate', 'book a hotel', 'hotel booking',
    'cheapest hotel', 'cheap hotel', 'budget hotel',
    // commercial / pricing — flights
    'flight deal', 'flight deals', 'cheap flight', 'cheap flights', 'cheapest flight',
    'flight price', 'flight prices', 'flight cost', 'airfare', 'fare deal',
    'ticket price', 'ticket prices', 'lowest fare', 'price drop', 'flight sale',
    // generic promotional
    '% off', 'flash sale', 'limited time offer', 'save on', 'best price',
    'lowest price', 'price alert', 'price comparison',
    // US locations that could be false-positives
    'new england', 'new ireland',
    // sports
    'football', 'soccer', 'tennis', 'golf', 'rugby', 'cricket', 'basketball', 'handball',
    'formula 1', 'formula one', 'grand prix', 'wimbledon', 'champions league',
    'premier league', 'bundesliga', 'serie a', 'la liga', 'ligue 1',
    'midfielder', 'striker', 'goalkeeper', 'transfer window',
    'olympic games', 'olympic torch', 'world cup final', 'euro 2026',
  ];

  let memCache = null;

  // ── RSS parser ────────────────────────────────────────────────
  function extractTag(xml, tag) {
    const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
    const plain = new RegExp(`<${tag}[^>]*>([^<]{0,1000})<\\/${tag}>`, 'i');
    return (xml.match(cdata) || xml.match(plain))?.[1]?.trim() || '';
  }

  function parseRSS(xml, sourceName) {
    const articles = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = extractTag(item, 'title');
      const link = extractTag(item, 'link') || extractTag(item, 'guid');
      const desc = extractTag(item, 'description').replace(/<[^>]+>/g, '').slice(0, 500);
      const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date');
      if (!title || !link || !link.startsWith('http')) continue;
      articles.push({
        title,
        url: link,
        description: desc || null,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source: { name: sourceName },
        _fromRSS: true,
      });
    }
    return articles;
  }

  // ── Main fetch ────────────────────────────────────────────────
  async function fetchFresh(apiKey) {
    const monitor = {
      queries: {},
      rssFeeds: {},
      filter: { blockedKeyword: 0, noEurope: 0, passed: 0 },
      bySource: {},
    };

    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // ── NewsAPI.ai queries ──
    const apiResults = await Promise.all(NEWS_QUERIES.map(async ({ name, keyword, count }) => {
      const body = {
        action: 'getArticles',
        keyword,
        locationUri: EUROPE_LOCATION_URI,
        lang: 'eng',
        dateStart: thirtyDaysAgo,
        dateEnd: today,
        articlesPage: 1,
        articlesCount: count,
        articlesSortBy: 'date',
        articlesSortByAsc: false,
        articleBodyLen: 500,
        resultType: 'articles',
        dataType: ['news', 'blog'],
        apiKey,
      };
      try {
        const res = await fetch(NEWSAPI_AI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        const results = data?.articles?.results || [];
        monitor.queries[name] = { fetched: results.length, passed: 0, totalResults: data?.articles?.totalResults };
        return results.map(a => ({ ...a, _sourceQuery: name }));
      } catch (e) {
        monitor.queries[name] = { fetched: 0, passed: 0, error: e.message };
        return [];
      }
    }));

    // ── RSS feeds ──
    const rssResults = await Promise.all(RSS_FEEDS.map(async ({ url, name }) => {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
          monitor.rssFeeds[name] = { status: 'http_error', code: res.status, fetched: 0, passed: 0 };
          return [];
        }
        const xml = await res.text();
        const items = parseRSS(xml, name);
        monitor.rssFeeds[name] = { status: 'ok', fetched: items.length, passed: 0 };
        return items.map(a => ({ ...a, _sourceQuery: `rss:${name}` }));
      } catch (e) {
        monitor.rssFeeds[name] = { status: 'error', error: e.message, fetched: 0, passed: 0 };
        return [];
      }
    }));

    // ── Filter ──
    const seen = new Set();
    let articles = [];
    const allArticles = [...apiResults.flat(), ...rssResults.flat()];

    for (const a of allArticles) {
      const rawTitle = a.title || '';
      const rawUrl = a.url || '';
      if (!rawTitle || !rawUrl || seen.has(rawUrl)) continue;

      const titleLower = rawTitle.toLowerCase();

      if (BLOCKED_KEYWORDS.some(kw => titleLower.includes(kw))) {
        monitor.filter.blockedKeyword++;
        continue;
      }

      const descLower = (a.description || a.body || '').toLowerCase();
      const hasEurope = EUROPE_KEYWORDS.some(kw => titleLower.includes(kw) || descLower.includes(kw));
      if (!hasEurope) {
        monitor.filter.noEurope++;
        continue;
      }

      seen.add(rawUrl);
      monitor.filter.passed++;

      const sourceQuery = a._sourceQuery || '';
      if (sourceQuery && !sourceQuery.startsWith('rss:') && monitor.queries[sourceQuery]) {
        monitor.queries[sourceQuery].passed++;
      }
      if (sourceQuery.startsWith('rss:')) {
        const rssName = sourceQuery.replace('rss:', '');
        if (monitor.rssFeeds[rssName]) monitor.rssFeeds[rssName].passed++;
      }

      const sourceName = a.source?.title || a.source?.name || 'Unknown';
      monitor.bySource[sourceName] = (monitor.bySource[sourceName] || 0) + 1;

      const description = a.body
        ? a.body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 500)
        : (a.description || null);

      articles.push({
        title: rawTitle.split(' - ')[0].trim(),
        url: rawUrl,
        source: sourceName,
        publishedAt: a.dateTime || a.date || a.publishedAt,
        description,
        image: a.image || null,
      });
    }

    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // ── Translate to Hebrew ──
    const translateKey = process.env.GOOGLE_TRANSLATE_KEY;
    if (translateKey && articles.length) {
      try {
        const textsToTranslate = [
          ...articles.map(a => a.title),
          ...articles.map(a => a.description || ''),
        ];
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${translateKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: textsToTranslate, source: 'en', target: 'he', format: 'text' }),
          }
        );
        const data = await res.json();
        const translations = data?.data?.translations;
        if (translations) {
          const n = articles.length;
          articles = articles.map((a, i) => ({
            ...a,
            title: translations[i]?.translatedText || a.title,
            description: translations[n + i]?.translatedText || a.description,
          }));
        }
      } catch (e) {
        console.error('Translation error:', e.message);
      }
    }

    return { cachedAt: Date.now(), articles, monitor };
  }

  // ── Handler ───────────────────────────────────────────────────
  module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing NEWSAPI_KEY' });

    const forceRefresh = req.query.refresh === 'true';
    const monitorMode = req.query.monitor === 'true';

    if (!forceRefresh && !monitorMode && memCache && (Date.now() - memCache.cachedAt < CACHE_TTL_MS)) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(monitorMode ? memCache : { cachedAt: memCache.cachedAt, articles: memCache.articles });
    }

    try {
      const payload = await fetchFresh(apiKey);
      memCache = payload;
      res.setHeader('X-Cache', 'MISS');
      if (monitorMode) return res.status(200).json(payload);
      return res.status(200).json({ cachedAt: payload.cachedAt, articles: payload.articles });
    } catch (err) {
      console.error('News fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  };

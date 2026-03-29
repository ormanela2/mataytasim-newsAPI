const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours                                                                                                                                                             
  const NEWSAPI_AI_ENDPOINT = 'https://eventregistry.org/api/v1/article/getArticles';                                                                                                                               const EUROPE_LOCATION_URI = 'http://en.wikipedia.org/wiki/Europe';                                                                                                                                                                                                                                                                                                                                                                  // 2 queries per refresh = 2 tokens. At 4 refreshes/day = 8 tokens/day.
  // 2000 free tokens lasts ~250 days.

  // Query 1: broad family travel catch-all (simple format)
  const BROAD_QUERY = {
    name: 'family-travel-broad',
    keyword: 'family travel OR with kids OR family vacation OR kid-friendly OR traveling with children OR family holiday',
    count: 50,
  };

  // Query 2: specific topics using $or with keywordLoc precision (complex format, 1 token)
  const SPECIFIC_OR_KEYWORDS = [
    // Theme parks & attractions
    { keyword: 'new attraction opening',        keywordLoc: 'title' },
    { keyword: 'grand opening museum',          keywordLoc: 'title' },
    { keyword: 'theme park season opening',     keywordLoc: 'title' },
    { keyword: 'theme park expansion',          keywordLoc: 'title' },
    { keyword: 'new roller coaster opening',    keywordLoc: 'body' },
    { keyword: 'water park opening dates',      keywordLoc: 'body' },
    { keyword: 'ski resort opening 2026',       keywordLoc: 'body' },
    { keyword: 'interactive exhibit opening',   keywordLoc: 'body' },
    // Specific parks
    { keyword: 'Efteling',                      keywordLoc: 'body' },
    { keyword: 'Energylandia update',           keywordLoc: 'body' },
    { keyword: 'Europa-Park new ride',          keywordLoc: 'title' },
    { keyword: 'Disneyland Paris update',       keywordLoc: 'body' },
    { keyword: 'Puy du Fou new show',           keywordLoc: 'body' },
    { keyword: 'Legoland new attraction',       keywordLoc: 'title' },
    { keyword: 'Prater Vienna news',            keywordLoc: 'body' },
    // Events & festivals
    { keyword: 'Christmas market opening dates', keywordLoc: 'title' },
    { keyword: 'annual festival dates 2026',    keywordLoc: 'title' },
    { keyword: 'carnival dates 2026',           keywordLoc: 'title' },
    { keyword: 'summer season kickoff',         keywordLoc: 'title' },
    // Nature & outdoors
    { keyword: 'observation deck opening',      keywordLoc: 'title' },
    { keyword: 'new hiking trail',              keywordLoc: 'body' },
    { keyword: 'scenic train route update',     keywordLoc: 'title' },
    { keyword: 'wildlife park new animals',     keywordLoc: 'body' },
    { keyword: 'national park visitor center',  keywordLoc: 'body' },
    // Logistics & travel info
    { keyword: 'new tourist tax',               keywordLoc: 'title' },
    { keyword: 'ETIAS travel authorization',    keywordLoc: 'body' },
    { keyword: 'public transport strike update', keywordLoc: 'title' },
    { keyword: 'low emission zone changes',     keywordLoc: 'body' },
    { keyword: 'free admission museums',        keywordLoc: 'body' },
    { keyword: 'new airport terminal opening',  keywordLoc: 'title' },
    // Flights relevant to Israelis
    { keyword: 'direct flights to Israel',      keywordLoc: 'body' },
    { keyword: 'new flight route Israel',       keywordLoc: 'body' },
    { keyword: 'low cost carrier expansion',    keywordLoc: 'title' },
  ];

  // RSS feeds — confirmed working from monitor
  const RSS_FEEDS = [
    { url: 'https://www.blooloop.com/feed/', name: 'Blooloop' },
    { url: 'https://www.amusementtoday.com/feed/', name: 'Amusement Today' },
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

    // ── Query 1: broad family travel (simple format) ─────────
    const broadResults = await (async () => {
      const body = {
        action: 'getArticles',
        keyword: BROAD_QUERY.keyword,
        keywordSearchMode: 'phrase',
        locationUri: EUROPE_LOCATION_URI,
        lang: 'eng',
        dateStart: thirtyDaysAgo,
        dateEnd: today,
        articlesPage: 1,
        articlesCount: BROAD_QUERY.count,
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
        monitor.queries[BROAD_QUERY.name] = { fetched: results.length, passed: 0, totalResults: data?.articles?.totalResults };
        return results.map(a => ({ ...a, _sourceQuery: BROAD_QUERY.name }));
      } catch (e) {
        monitor.queries[BROAD_QUERY.name] = { fetched: 0, passed: 0, error: e.message };
        return [];
      }
    })();

    // ── Query 2: specific topics via $or + keywordLoc ─────────
    const specificResults = await (async () => {
      const body = {
        action: 'getArticles',
        $query: {
          $and: [
            { $or: SPECIFIC_OR_KEYWORDS },
            { locationUri: EUROPE_LOCATION_URI },
          ],
        },
        lang: 'eng',
        dateStart: thirtyDaysAgo,
        dateEnd: today,
        articlesPage: 1,
        articlesCount: 100,
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
        monitor.queries['specific-topics'] = { fetched: results.length, passed: 0, totalResults: data?.articles?.totalResults };
        return results.map(a => ({ ...a, _sourceQuery: 'specific-topics' }));
      } catch (e) {
        monitor.queries['specific-topics'] = { fetched: 0, passed: 0, error: e.message };
        return [];
      }
    })();

    const apiResults = [broadResults, specificResults];

    // ── RSS feeds ─────────────────────────────────────────────
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

    // ── Filter ────────────────────────────────────────────────
    const seen = new Set();
    let articles = [];

    const allArticles = [...apiResults.flat(), ...rssResults.flat()];

    for (const a of allArticles) {
      const rawTitle = a.title || '';
      const rawUrl = a.url || '';
      if (!rawTitle || !rawUrl || seen.has(rawUrl)) continue;

      const titleLower = rawTitle.toLowerCase();

      // Block unwanted content
      if (BLOCKED_KEYWORDS.some(kw => titleLower.includes(kw))) {
        monitor.filter.blockedKeyword++;
        continue;
      }

      // RSS articles need a Europe keyword check (API results are already filtered by locationUri)
      if (a._fromRSS) {
        const descLower = (a.description || '').toLowerCase();
        const hasEurope = EUROPE_KEYWORDS.some(kw => titleLower.includes(kw) || descLower.includes(kw));
        if (!hasEurope) {
          monitor.filter.noEurope++;
          continue;
        }
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

      // description: use body (newsapi.ai) or RSS description
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

    // Sort by date, newest first
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // ── Translate ─────────────────────────────────────────────
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

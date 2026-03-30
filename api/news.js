const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const NEWSAPI_AI_ENDPOINT = 'https://eventregistry.org/api/v1/article/getArticles';

// 3 queries per refresh = 3 tokens. At 4 refreshes/day = 12 tokens/day.
// 2000 free tokens lasts ~166 days.
// Uses $query format: locationUri + conceptUri(Tourism) + $not(Crime/Politics/War)

const COUNTRY_URIS = [
  'http://en.wikipedia.org/wiki/Poland',
  'http://en.wikipedia.org/wiki/Hungary',
  'http://en.wikipedia.org/wiki/Austria',
  'http://en.wikipedia.org/wiki/Romania',
  'http://en.wikipedia.org/wiki/Slovakia',
  'http://en.wikipedia.org/wiki/Slovenia',
  'http://en.wikipedia.org/wiki/Germany',
  'http://en.wikipedia.org/wiki/Netherlands',
  'http://en.wikipedia.org/wiki/Italy',
  'http://en.wikipedia.org/wiki/France',
  'http://en.wikipedia.org/wiki/Spain',
  'http://en.wikipedia.org/wiki/Greece',
  'http://en.wikipedia.org/wiki/Portugal',
  'http://en.wikipedia.org/wiki/Czech_Republic',
  'http://en.wikipedia.org/wiki/Croatia',
  'http://en.wikipedia.org/wiki/Belgium',
  'http://en.wikipedia.org/wiki/Switzerland',
  'http://en.wikipedia.org/wiki/Denmark',
  'http://en.wikipedia.org/wiki/Sweden',
  'http://en.wikipedia.org/wiki/Ireland',
  'http://en.wikipedia.org/wiki/United_Kingdom',
];

const TOURISM_CONCEPT_URI = 'http://en.wikipedia.org/wiki/Tourism';

const BLOCKED_CONCEPT_URIS = [
  'http://en.wikipedia.org/wiki/Crime',
  'http://en.wikipedia.org/wiki/Politics_of_Europe',
  'http://en.wikipedia.org/wiki/War',
  'http://en.wikipedia.org/wiki/Military',
];

// Free plan limit: 15 keywords (words) per query
const NEWS_QUERIES = [
  {
    // Israel <-> Europe flights (13 words)
    name: 'israel-flights',
    keyword: 'El Al OR Ben Gurion OR Tel Aviv flight OR Wizz Air Israel',
    count: 60,
  },
  {
    // European park & attraction openings (13 words)
    name: 'attractions-openings',
    keyword: 'Efteling OR Legoland OR Alton Towers OR Disneyland Paris OR water park opening',
    count: 70,
  },
  {
    // Travel alerts: borders, strikes, visa, disruptions (13 words)
    name: 'travel-alerts',
    keyword: 'ETIAS OR airport strike OR border closed OR flight disruption OR tourist tax',
    count: 70,
  },
];

// RSS feeds — free, no token cost
const RSS_FEEDS = [
  // Theme parks & attractions (Europe-heavy)
  { url: 'https://www.blooloop.com/feed/', name: 'Blooloop' },
  { url: 'https://insidethemagic.net/feed/', name: 'Inside the Magic' },
  { url: 'https://themeparktourist.com/feed/', name: 'Theme Park Tourist' },
  // Aviation & route news
  { url: 'https://simpleflying.com/feed/', name: 'Simple Flying' },
  { url: 'https://airlinegeeks.com/feed/', name: 'Airline Geeks' },
  // European travel alerts & news
  { url: 'https://www.theguardian.com/travel/rss', name: 'Guardian Travel' },
];

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
  'disneyland paris', 'disney paris', 'efteling', 'phantasialand', 'europa-park', 'europa park',
  'tivoli', 'portaventura', 'gardaland', 'legoland windsor', 'alton towers', 'thorpe park',
  'parc asterix', 'puy du fou', 'walibi', 'heide park', 'movie park germany',
  'energylandia', 'liseberg', 'plopsaland', 'bobbejaanland',
];

const BLOCKED_KEYWORDS = [
  'trump', 'biden', 'putin', 'zelensky', 'politics', 'political', 'election',
  'vote', 'democrat', 'republican', 'senator', 'congress', 'parliament',
  'white house', 'kremlin', 'sanction', 'diplomat', 'diplomacy', 'coup',
  'protest', 'riot', 'activist',
  'war', 'military', 'soldier', 'troops', 'weapon', 'weapons',
  'missile', 'nuclear', 'airstrike', 'air strike', 'warplane',
  'artillery', 'battlefield', 'invasion', 'ceasefire', 'nato',
  'militia', 'gunfire', 'sniper', 'hostage', 'siege', 'assassination', 'genocide',
  'murder', 'crime', 'arrest', 'shooting', 'prison', 'lawsuit',
  'bribery', 'corruption', 'fraud', 'trafficking',
  'cannabis', 'drug', 'cancer', 'disease', 'overdose',
  'oil', 'stock', 'crypto', 'bitcoin',
  'terror', 'terrorist', 'massage',
  // health & immigration (not travel)
  'healthcare', 'health care', 'waiting list', 'deportation', 'detention',
  'immigration rules', 'immigration law',
  // local lifestyle noise
  'charity bash', 'biker', 'motorcycle club', 'humpback', 'stranded whale',
  'fish and chips', 'restaurant review',
  'ticketing partner', 'ticketing provider', 'ticketing technology', 'ticketing solution',
  'speaker lineup', 'keynote speaker', 'conference speaker', 'announces speakers',
  'official partner', 'technology partner', 'signs deal', 'multi-year deal', 'seven-season',
  'cost to raise', 'cost of raising', 'raise children', 'childcare cost',
  'cost of living', 'raising a child',
  'hotel deal', 'hotel deals', 'hotel discount', 'hotel offer', 'hotel sale',
  'hotel price', 'hotel prices', 'hotel rate', 'hotel rates', 'room rate', 'room rates',
  'per night', 'nightly rate', 'book a hotel', 'hotel booking',
  'cheapest hotel', 'cheap hotel', 'budget hotel',
  'flight deal', 'flight deals', 'cheap flight', 'cheap flights', 'cheapest flight',
  'flight price', 'flight prices', 'flight cost', 'airfare', 'fare deal',
  'ticket price', 'ticket prices', 'lowest fare', 'price drop', 'flight sale',
  '% off', 'flash sale', 'limited time offer', 'save on', 'best price',
  'lowest price', 'price alert', 'price comparison',
  'new england', 'new ireland',
  // non-European destinations
  'brazil', 'rio de janeiro', 'rio favela', 'morocco', 'marrakech', 'marrakesh',
  'dubai', 'abu dhabi', 'thailand', 'bali', 'japan', 'tokyo', 'australia', 'sydney',
  'canada', 'mexico', 'india', 'china', 'africa', 'kenya', 'tanzania', 'maldives',
  'caribbean', 'cuba', 'new york', 'las vegas', 'florida', 'hawaii',
  'football', 'soccer', 'tennis', 'golf', 'rugby', 'cricket', 'basketball', 'handball',
  'formula 1', 'formula one', 'grand prix', 'wimbledon', 'champions league',
  'premier league', 'bundesliga', 'serie a', 'la liga', 'ligue 1',
  'midfielder', 'striker', 'goalkeeper', 'transfer window',
  'olympic games', 'olympic torch', 'world cup final', 'euro 2026',
];

let memCache = null;

function extractTag(xml, tag) {
  const cdata = new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>', 'i');
  const plain = new RegExp('<' + tag + '[^>]*>([^<]{0,1000})<\\/' + tag + '>', 'i');
  return (xml.match(cdata) || xml.match(plain)) && (xml.match(cdata) || xml.match(plain))[1]
    ? (xml.match(cdata) || xml.match(plain))[1].trim()
    : '';
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
      title: title,
      url: link,
      description: desc || null,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      source: { name: sourceName },
      _fromRSS: true,
    });
  }
  return articles;
}

async function fetchFresh(apiKey) {
  const monitor = {
    queries: {},
    rssFeeds: {},
    filter: { blockedKeyword: 0, noEurope: 0, passed: 0 },
    bySource: {},
  };

  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const apiResults = await Promise.all(NEWS_QUERIES.map(async function(q) {
    const name = q.name;
    const count = q.count;
    const body = {
      action: 'getArticles',
      keyword: q.keyword,
      dateStart: thirtyDaysAgo,
      dateEnd: today,
      articlesPage: 1,
      articlesCount: count,
      articlesSortBy: 'date',
      articlesSortByAsc: false,
      articleBodyLen: 500,
      resultType: 'articles',
      dataType: ['news', 'blog'],
      apiKey: apiKey,
    };
    try {
      const res = await fetch(NEWSAPI_AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const results = (data && data.articles && data.articles.results) ? data.articles.results : [];
      monitor.queries[name] = { fetched: results.length, passed: 0, totalResults: data && data.articles ? data.articles.totalResults : 0, _debug: data && !data.articles ? JSON.stringify(data).slice(0, 200) : undefined };
      return results.map(function(a) { return Object.assign({}, a, { _sourceQuery: name }); });
    } catch (e) {
      monitor.queries[name] = { fetched: 0, passed: 0, error: e.message };
      return [];
    }
  }));

  const rssResults = await Promise.all(RSS_FEEDS.map(async function(feed) {
    const url = feed.url;
    const name = feed.name;
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
      return items.map(function(a) { return Object.assign({}, a, { _sourceQuery: 'rss:' + name }); });
    } catch (e) {
      monitor.rssFeeds[name] = { status: 'error', error: e.message, fetched: 0, passed: 0 };
      return [];
    }
  }));

  const seen = new Set();
  let articles = [];
  const allArticles = apiResults.reduce(function(acc, val) { return acc.concat(val); }, [])
    .concat(rssResults.reduce(function(acc, val) { return acc.concat(val); }, []));

  for (let i = 0; i < allArticles.length; i++) {
    const a = allArticles[i];
    const rawTitle = a.title || '';
    const rawUrl = a.url || '';
    if (!rawTitle || !rawUrl || seen.has(rawUrl)) continue;

    // Skip articles older than 60 days
    const pubDate = new Date(a.dateTime || a.date || a.publishedAt);
    if (isNaN(pubDate) || (Date.now() - pubDate.getTime()) > 60 * 24 * 60 * 60 * 1000) continue;

    const titleLower = rawTitle.toLowerCase();

    let blocked = false;
    for (let k = 0; k < BLOCKED_KEYWORDS.length; k++) {
      if (titleLower.indexOf(BLOCKED_KEYWORDS[k]) !== -1) { blocked = true; break; }
    }
    if (blocked) { monitor.filter.blockedKeyword++; continue; }

    const descLower = ((a.description || a.body || '')).toLowerCase();
    // For RSS articles from general travel sites, require Europe keyword in title
    // For API articles and theme-park RSS, also check description
    const isGeneralTravel = a._fromRSS && (
      (a.source && (a.source.name === 'Guardian Travel' || a.source.name === 'CN Traveller' || a.source.name === 'Telegraph Travel'))
    );
    let hasEurope = false;
    for (let k = 0; k < EUROPE_KEYWORDS.length; k++) {
      var inTitle = titleLower.indexOf(EUROPE_KEYWORDS[k]) !== -1;
      var inDesc = !isGeneralTravel && descLower.indexOf(EUROPE_KEYWORDS[k]) !== -1;
      if (inTitle || inDesc) { hasEurope = true; break; }
    }
    if (!hasEurope) { monitor.filter.noEurope++; continue; }

    seen.add(rawUrl);
    monitor.filter.passed++;

    const sourceQuery = a._sourceQuery || '';
    if (sourceQuery && sourceQuery.indexOf('rss:') !== 0 && monitor.queries[sourceQuery]) {
      monitor.queries[sourceQuery].passed++;
    }
    if (sourceQuery.indexOf('rss:') === 0) {
      const rssName = sourceQuery.slice(4);
      if (monitor.rssFeeds[rssName]) monitor.rssFeeds[rssName].passed++;
    }

    const sourceName = (a.source && (a.source.title || a.source.name)) ? (a.source.title || a.source.name) : 'Unknown';
    monitor.bySource[sourceName] = (monitor.bySource[sourceName] || 0) + 1;

    const description = a.body
      ? a.body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 500)
      : (a.description || null);

    articles.push({
      title: rawTitle.split(' - ')[0].trim(),
      url: rawUrl,
      source: sourceName,
      publishedAt: a.dateTime || a.date || a.publishedAt,
      description: description,
      image: a.image || null,
    });
  }

  articles.sort(function(a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });

  const translateKey = process.env.GOOGLE_TRANSLATE_KEY;
  if (translateKey && articles.length) {
    try {
      const textsToTranslate = articles.map(function(a) { return a.title; })
        .concat(articles.map(function(a) { return a.description || ''; }));
      const res = await fetch(
        'https://translation.googleapis.com/language/translate/v2?key=' + translateKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: textsToTranslate, source: 'en', target: 'he', format: 'text' }),
        }
      );
      const data = await res.json();
      const translations = data && data.data ? data.data.translations : null;
      if (translations) {
        const n = articles.length;
        articles = articles.map(function(a, i) {
          return Object.assign({}, a, {
            title: (translations[i] && translations[i].translatedText) ? translations[i].translatedText : a.title,
            description: (translations[n + i] && translations[n + i].translatedText) ? translations[n + i].translatedText : a.description,
          });
        });
      }
    } catch (e) {
      console.error('Translation error:', e.message);
    }
  }

  return { cachedAt: Date.now(), articles: articles, monitor: monitor };
}

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

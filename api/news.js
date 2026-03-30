const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// NewsData.io — free plan: 200 credits/day, 10 results per request
// Each query = 1 credit. We run 4 queries = 4 credits per refresh.
const NEWSDATA_ENDPOINT = 'https://newsdata.io/api/1/news';

const NEWS_QUERIES = [
  {
    // Israel <-> Europe flights: cancellations, new routes, disruptions
    name: 'israel-flights',
    q: 'Israel flight Europe OR "El Al" OR "Wizz Air" OR "Ben Gurion" route',
    language: 'en',
  },
  {
    // Theme park & attraction openings in Europe
    name: 'attractions-openings',
    q: 'theme park opening Europe OR Disneyland Paris OR Legoland OR Efteling OR "water park"',
    language: 'en',
    category: 'entertainment',
  },
  {
    // Travel alerts: visa, strikes, border closures, warnings
    name: 'travel-alerts',
    q: 'ETIAS OR "airport strike" OR "border closed" OR "travel warning" OR "tourist visa" Europe',
    language: 'en',
  },
  {
    // General European travel news
    name: 'europe-travel',
    q: 'Europe travel 2025 OR 2026 tourist attraction holiday',
    language: 'en',
  },
];

// RSS feeds — free, no credit cost
const RSS_FEEDS = [
  // Theme parks & attractions (Europe-heavy)
  { url: 'https://www.blooloop.com/feed/', name: 'Blooloop' },
  { url: 'https://insidethemagic.net/feed/', name: 'Inside the Magic' },
  // European travel news
  { url: 'https://www.theguardian.com/travel/rss', name: 'Guardian Travel' },
  { url: 'https://www.lonelyplanet.com/news/feed', name: 'Lonely Planet' },
  { url: 'https://www.timeout.com/travel/news/rss', name: 'Time Out Travel' },
  { url: 'https://skift.com/feed/', name: 'Skift' },
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
  // Israel routes
  'el al', 'wizz air', 'easyjet', 'ryanair', 'ben gurion', 'tel aviv',
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
  var cdata = new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>', 'i');
  var plain = new RegExp('<' + tag + '[^>]*>([^<]{0,1000})<\\/' + tag + '>', 'i');
  var m = xml.match(cdata) || xml.match(plain);
  return (m && m[1]) ? m[1].trim() : '';
}

function parseRSS(xml, sourceName) {
  var articles = [];
  var itemRegex = /<item>([\s\S]*?)<\/item>/g;
  var match;
  while ((match = itemRegex.exec(xml)) !== null) {
    var item = match[1];
    var title = extractTag(item, 'title');
    var link = extractTag(item, 'link') || extractTag(item, 'guid');
    var desc = extractTag(item, 'description').replace(/<[^>]+>/g, '').slice(0, 500);
    var pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date');
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
  var monitor = {
    queries: {},
    rssFeeds: {},
    filter: { blockedKeyword: 0, noEurope: 0, passed: 0 },
    bySource: {},
  };

  // Fetch from NewsData.io
  var apiResults = await Promise.all(NEWS_QUERIES.map(async function(q) {
    var name = q.name;
    var params = new URLSearchParams({
      apikey: apiKey,
      q: q.q,
      language: q.language || 'en',
      size: 10,
    });
    if (q.category) params.set('category', q.category);

    try {
      var res = await fetch(NEWSDATA_ENDPOINT + '?' + params.toString(), {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      });
      var data = await res.json();
      var results = (data && Array.isArray(data.results)) ? data.results : [];
      monitor.queries[name] = {
        fetched: results.length,
        passed: 0,
        totalResults: data && data.totalResults ? data.totalResults : 0,
        _debug: (data && data.status !== 'success') ? JSON.stringify(data).slice(0, 400) : undefined,
      };
      return results.map(function(a) { return Object.assign({}, a, { _sourceQuery: name }); });
    } catch (e) {
      monitor.queries[name] = { fetched: 0, passed: 0, error: e.message };
      return [];
    }
  }));

  // Fetch RSS feeds
  var rssResults = await Promise.all(RSS_FEEDS.map(async function(feed) {
    var url = feed.url;
    var name = feed.name;
    try {
      var res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        monitor.rssFeeds[name] = { status: 'http_error', code: res.status, fetched: 0, passed: 0 };
        return [];
      }
      var xml = await res.text();
      var items = parseRSS(xml, name);
      monitor.rssFeeds[name] = { status: 'ok', fetched: items.length, passed: 0 };
      return items.map(function(a) { return Object.assign({}, a, { _sourceQuery: 'rss:' + name }); });
    } catch (e) {
      monitor.rssFeeds[name] = { status: 'error', error: e.message, fetched: 0, passed: 0 };
      return [];
    }
  }));

  var seen = new Set();
  var articles = [];
  var allArticles = apiResults.reduce(function(acc, val) { return acc.concat(val); }, [])
    .concat(rssResults.reduce(function(acc, val) { return acc.concat(val); }, []));

  for (var i = 0; i < allArticles.length; i++) {
    var a = allArticles[i];
    // NewsData.io uses `link` and `pubDate`; RSS uses `url` and `publishedAt`
    var rawTitle = a.title || '';
    var rawUrl = a.link || a.url || '';
    if (!rawTitle || !rawUrl || seen.has(rawUrl)) continue;

    // Skip articles older than 60 days
    var pubDate = new Date(a.pubDate || a.publishedAt);
    if (isNaN(pubDate) || (Date.now() - pubDate.getTime()) > 60 * 24 * 60 * 60 * 1000) continue;

    var titleLower = rawTitle.toLowerCase();

    var blocked = false;
    for (var k = 0; k < BLOCKED_KEYWORDS.length; k++) {
      if (titleLower.indexOf(BLOCKED_KEYWORDS[k]) !== -1) { blocked = true; break; }
    }
    if (blocked) { monitor.filter.blockedKeyword++; continue; }

    var descLower = (a.description || a.content || '').toLowerCase();
    // For general travel RSS sources, require Europe keyword in title only
    var isGeneralTravel = a._fromRSS && (
      a.source && (a.source.name === 'Guardian Travel' || a.source.name === 'CN Traveller' || a.source.name === 'Telegraph Travel' || a.source.name === 'Lonely Planet' || a.source.name === 'Time Out Travel')
    );
    var hasEurope = false;
    for (var j = 0; j < EUROPE_KEYWORDS.length; j++) {
      var inTitle = titleLower.indexOf(EUROPE_KEYWORDS[j]) !== -1;
      var inDesc = !isGeneralTravel && descLower.indexOf(EUROPE_KEYWORDS[j]) !== -1;
      if (inTitle || inDesc) { hasEurope = true; break; }
    }
    if (!hasEurope) { monitor.filter.noEurope++; continue; }

    seen.add(rawUrl);
    monitor.filter.passed++;

    var sourceQuery = a._sourceQuery || '';
    if (sourceQuery && sourceQuery.indexOf('rss:') !== 0 && monitor.queries[sourceQuery]) {
      monitor.queries[sourceQuery].passed++;
    }
    if (sourceQuery.indexOf('rss:') === 0) {
      var rssName = sourceQuery.slice(4);
      if (monitor.rssFeeds[rssName]) monitor.rssFeeds[rssName].passed++;
    }

    // NewsData.io source_id vs RSS source.name
    var sourceName = (a.source_id) ? a.source_id : ((a.source && (a.source.title || a.source.name)) ? (a.source.title || a.source.name) : 'Unknown');
    monitor.bySource[sourceName] = (monitor.bySource[sourceName] || 0) + 1;

    var description = a.content
      ? a.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 500)
      : (a.description || null);

    var publishedAt = a.pubDate || a.publishedAt;

    articles.push({
      title: rawTitle.split(' - ')[0].trim(),
      url: rawUrl,
      source: sourceName,
      publishedAt: publishedAt,
      description: description,
      image: a.image_url || a.image || null,
    });
  }

  articles.sort(function(a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });

  var translateKey = process.env.GOOGLE_TRANSLATE_KEY;
  if (translateKey && articles.length) {
    try {
      var textsToTranslate = articles.map(function(a) { return a.title; })
        .concat(articles.map(function(a) { return a.description || ''; }));
      var tres = await fetch(
        'https://translation.googleapis.com/language/translate/v2?key=' + translateKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: textsToTranslate, source: 'en', target: 'he', format: 'text' }),
        }
      );
      var tdata = await tres.json();
      var translations = tdata && tdata.data ? tdata.data.translations : null;
      if (translations) {
        var n = articles.length;
        articles = articles.map(function(a, idx) {
          return Object.assign({}, a, {
            title: (translations[idx] && translations[idx].translatedText) ? translations[idx].translatedText : a.title,
            description: (translations[n + idx] && translations[n + idx].translatedText) ? translations[n + idx].translatedText : a.description,
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

  var apiKey = process.env.NEWSDATA_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing NEWSDATA_KEY env var' });

  var forceRefresh = req.query.refresh === 'true';
  var monitorMode = req.query.monitor === 'true';

  if (!forceRefresh && !monitorMode && memCache && (Date.now() - memCache.cachedAt < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(monitorMode ? memCache : { cachedAt: memCache.cachedAt, articles: memCache.articles });
  }

  try {
    var payload = await fetchFresh(apiKey);
    memCache = payload;
    res.setHeader('X-Cache', 'MISS');
    if (monitorMode) return res.status(200).json(payload);
    return res.status(200).json({ cachedAt: payload.cachedAt, articles: payload.articles });
  } catch (err) {
    console.error('News fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
};

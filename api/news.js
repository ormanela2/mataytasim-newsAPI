const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const DESTINATIONS = [
  // Central Europe
  'Slovakia', 'Czech Republic', 'Poland', 'Austria', 'Hungary', 'Romania',
  // Western Europe
  'Germany', 'Netherlands', 'Belgium', 'France', 'Switzerland',
  // Southern Europe
  'Spain', 'Italy', 'Greece', 'Portugal', 'Croatia',
  // British Isles
  'England', 'Scotland', 'Ireland',
  // Northern Europe
  'Denmark', 'Sweden', 'Norway',
  // Cities
  'Paris', 'Rome', 'Barcelona', 'Prague', 'Vienna', 'Amsterdam', 'Copenhagen',
];

const FAMILY_QUERY_KEYWORDS = [
  // general family travel
  'family travel',
  'with kids',
  'family vacation',
  'theme park',
  'attractions for families',
  // new openings
  'new attraction opening 2026',
  'newly opened museum',
  'upcoming theme park',
  'new interactive exhibit kids',
  // seasonality
  'water park summer season',
  'amusement park opening season',
  'theme park new season',
  // insider knowledge
  'top-rated family activities',
  'hidden gems families',
  'kid-friendly tours',
  'best things to do with kids',
];

const GENERAL_QUERIES = [
  'flight delays europe travel 2026',
  'train strike europe travel',
  'new theme park europe 2026',
  'new family attraction europe 2026',
  'europe travel tips families 2026',
  'best european destinations families 2026',
];

// Option A — major European attraction queries
const ATTRACTION_QUERIES = [
  // Germany
  'Europa-Park new 2026',
  'Phantasialand new attraction 2026',
  'Heide Park new ride 2026',
  'Movie Park Germany new 2026',
  'Legoland Deutschland new 2026',
  // Netherlands
  'Efteling new season 2026',
  'Walibi Holland new 2026',
  // France
  'Disneyland Paris new 2026',
  'Parc Asterix new 2026',
  'Puy du Fou new season 2026',
  'Futuroscope new 2026',
  // Spain
  'PortAventura new season 2026',
  'Isla Magica new 2026',
  'Tibidabo new 2026',
  // Italy
  'Gardaland opening 2026',
  'Mirabilandia new ride 2026',
  'Leolandia new 2026',
  'Rainbow MagicLand new 2026',
  // UK
  'Alton Towers new ride 2026',
  'Thorpe Park new 2026',
  'Chessington World of Adventures new 2026',
  'Legoland Windsor new 2026',
  // Belgium
  'Plopsaland new 2026',
  'Bobbejaanland new 2026',
  'Walibi Belgium new 2026',
  // Denmark & Scandinavia
  'Tivoli Gardens new 2026',
  'Liseberg new ride 2026',
  'Grona Lund new 2026',
  'Djurs Sommerland new 2026',
  // Poland
  'Energylandia new attraction 2026',
  // Austria
  'Familypark Austria new 2026',
  // Czech Republic
  'Legoland Brno new 2026',
  // Croatia
  'Aquacolors waterpark Croatia 2026',
  // Portugal
  'Zoomarine Portugal new 2026',
  // Greece
  'Allou Fun Park new 2026',
  'Watercity waterpark Greece 2026',
  // Slovakia
  'Tatralandia new 2026',
  // Hungary
  'Aquaworld Budapest new 2026',
  // Romania
  'Therme Bucharest new 2026',
];

// Option B — RSS feeds from attractions & industry sites
const RSS_FEEDS = [
  // Industry news (most reliable)
  { url: 'https://www.blooloop.com/feed/', name: 'Blooloop' },
  { url: 'https://www.amusementtoday.com/feed/', name: 'Amusement Today' },
  { url: 'https://www.attractionsmanagement.com/rss/news', name: 'Attractions Management' },
  // Germany
  { url: 'https://www.europapark.de/en/news/rss', name: 'Europa-Park' },
  { url: 'https://www.phantasialand.de/en/news/rss', name: 'Phantasialand' },
  { url: 'https://www.heide-park.de/en/news/rss', name: 'Heide Park' },
  // Netherlands
  { url: 'https://www.efteling.com/en/service/press/rss', name: 'Efteling' },
  // France
  { url: 'https://press.disneylandparis.com/en/rss/', name: 'Disneyland Paris' },
  { url: 'https://www.parcasterix.fr/en/news/rss', name: 'Parc Asterix' },
  { url: 'https://www.puydufou.com/en/news/rss', name: 'Puy du Fou' },
  { url: 'https://www.futuroscope.com/en/news/rss', name: 'Futuroscope' },
  // Spain
  { url: 'https://www.portaventuraworld.com/en/press-room/rss', name: 'PortAventura' },
  // Italy
  { url: 'https://www.gardaland.it/en/news/rss/', name: 'Gardaland' },
  { url: 'https://www.mirabilandia.it/en/news/rss', name: 'Mirabilandia' },
  // UK
  { url: 'https://www.altontowers.com/news/rss', name: 'Alton Towers' },
  { url: 'https://www.thorpepark.com/news/rss', name: 'Thorpe Park' },
  { url: 'https://www.legoland.co.uk/news/rss', name: 'Legoland Windsor' },
  // Denmark & Scandinavia
  { url: 'https://www.tivoli.dk/en/news/rss', name: 'Tivoli Gardens' },
  { url: 'https://www.liseberg.com/en/news/rss', name: 'Liseberg' },
  // Poland
  { url: 'https://energylandia.pl/en/news/rss', name: 'Energylandia' },
  // Belgium
  { url: 'https://www.plopsaland.be/en/news/rss', name: 'Plopsaland' },
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
  'parc asterix', 'puy du fou', 'walibi', 'heide park', 'movie park germany',
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
  'war', 'military', 'soldier', 'troops', 'weapon', 'weapons',
  'missile', 'nuclear', 'airstrike', 'air strike', 'warplane',
  'artillery', 'battlefield', 'invasion', 'ceasefire', 'nato',
  'militia', 'gunfire', 'sniper', 'ammunition', 'hostage', 'siege',
  'assassination', 'genocide',
  // crime & legal
  'murder', 'crime', 'arrest', 'shooting', 'prison', 'lawsuit',
  'bribery', 'corruption', 'fraud', 'trafficking',
  // finance
  'oil', 'stock', 'crypto', 'bitcoin', 'college fund', 'ivy league',
  // misc
  'massage', 'terror', 'terrorist',
  // cost of living (not travel)
  'cost to raise', 'cost of raising', 'raise children', 'childcare cost',
  'cost of living', 'raising a child',
  // commercial / pricing — hotels
  'hotel deal', 'hotel deals', 'hotel discount', 'hotel offer', 'hotel sale',
  'hotel price', 'hotel prices', 'hotel rate', 'hotel rates', 'room rate', 'room rates',
  'per night', 'a night', 'nightly rate', 'book a hotel', 'hotel booking',
  'cheapest hotel', 'cheap hotel', 'budget hotel', 'best hotel price',
  // commercial / pricing — flights
  'flight deal', 'flight deals', 'cheap flight', 'cheap flights', 'cheapest flight',
  'flight price', 'flight prices', 'flight cost', 'airfare', 'fare deal',
  'ticket price', 'ticket prices', 'lowest fare', 'price drop', 'flight sale',
  // generic promotional
  '% off', 'flash sale', 'book now', 'limited time', 'save on', 'best price',
  'lowest price', 'price alert', 'price comparison',
];

const TRUSTED_SOURCES = [
  // global editorial travel
  'travelandleisure.com', 'lonelyplanet.com', 'cntraveler.com', 'afar.com',
  'thetravel.com', 'frommers.com', 'fodors.com', 'roughguides.com',
  'worldtravelguide.net', 'timeout.com', 'matadornetwork.com',
  'condenasttraveller.com', 'thetravelmagazine.net', 'coolplaces.co.uk',
  // editorial UK/European press — travel sections
  'theguardian.com/travel', 'telegraph.co.uk/travel', 'bbc.com/travel',
  'independent.co.uk/travel', 'nationalgeographic.com/travel',
  'euronews.com', 'expatica.com',
  // family travel editorial
  'familytraveler.com', 'planetware.com', 'wanderlust.co.uk',
  // theme park & attractions editorial
  'blooloop.com', 'amusementtoday.com', 'attractionsmanagement.com',
  // attraction sites (RSS)
  'europapark.de', 'efteling.com', 'disneylandparis.com', 'gardaland.it',
  'portaventuraworld.com', 'tivoli.dk', 'altontowers.com', 'phantasialand.de',
  'parcasterix.fr', 'puydufou.com', 'walibi.com', 'heide-park.de',
  'futuroscope.com', 'mirabilandia.it', 'thorpepark.com', 'legoland.co.uk',
  'liseberg.com', 'energylandia.pl', 'plopsaland.be', 'bobbejaanland.be',
  'gronaland.com', 'legoland.de', 'tibidabo.cat', 'leolandia.it',
  // European editorial news
  'euroweeklynews.com', 'europeanbestdestinations.com',
  'thelocal.de', 'thelocal.fr', 'thelocal.es', 'thelocal.it',
  'thelocal.at', 'thelocal.se', 'thelocal.ch',
  'dutchnews.nl', 'iamsterdam.com', 'dutchreview.com',
  'notesfrompoland.com', 'thefirstnews.com', 'inyourpocket.com',
  'hungarytoday.hu', 'dailynewshungary.com', 'welovebudapest.com',
  'romania-insider.com', 'business-review.eu',
];

let memCache = null;

const DOMAINS = [
  // global editorial travel
  'travelandleisure.com', 'lonelyplanet.com', 'cntraveler.com', 'afar.com',
  'thetravel.com', 'fodors.com', 'frommers.com', 'roughguides.com',
  'timeout.com', 'matadornetwork.com', 'condenasttraveller.com',
  'thetravelmagazine.net', 'coolplaces.co.uk',
  // European editorial travel & attractions
  'euronews.com', 'expatica.com', 'euroweeklynews.com',
  'europeanbestdestinations.com', 'wanderlust.co.uk',
  'blooloop.com', 'amusementtoday.com', 'attractionsmanagement.com',
  // The Local network (English news from across Europe)
  'thelocal.de', 'thelocal.fr', 'thelocal.es', 'thelocal.it',
  'thelocal.at', 'thelocal.se', 'thelocal.ch',
  // country-specific Europe
  'dutchnews.nl', 'iamsterdam.com', 'dutchreview.com',
  'notesfrompoland.com', 'thefirstnews.com', 'inyourpocket.com',
  'hungarytoday.hu', 'dailynewshungary.com', 'welovebudapest.com',
  'romania-insider.com', 'business-review.eu',
].join(',');

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
    });
  }
  return articles;
}

// ── Main fetch ────────────────────────────────────────────────
async function fetchFresh(apiKey, debug) {
  const monitor = {
    queries: {},
    rssFeeds: {},
    filter: { blockedKeyword: 0, noRelevance: 0, noEurope: 0, passed: 0 },
    bySource: {},
  };

  // ── Query 1: destination × random family keyword ──────────
  const queries = DESTINATIONS.map(dest => {
    const kw = FAMILY_QUERY_KEYWORDS[Math.floor(Math.random() * FAMILY_QUERY_KEYWORDS.length)];
    return `${dest} ${kw}`;
  });

  const keywordResults = await Promise.all(queries.map(async (q) => {
    const params = new URLSearchParams({ q, language: 'en', sortBy: 'publishedAt', pageSize: '10', apiKey });
    try {
      const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
      const data = await res.json();
      monitor.queries[q] = { fetched: (data.articles || []).length, passed: 0, status: data.status };
      if (!res.ok) return [];
      return (data.articles || []).map(a => ({ ...a, _sourceQuery: q }));
    } catch (e) {
      monitor.queries[q] = { fetched: 0, passed: 0, error: e.message };
      return [];
    }
  }));

  // ── Query 2: general Europe queries ──────────────────────
  const generalResults = await Promise.all(GENERAL_QUERIES.map(async (q) => {
    const params = new URLSearchParams({ q, language: 'en', sortBy: 'publishedAt', pageSize: '10', apiKey });
    try {
      const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
      const data = await res.json();
      monitor.queries[q] = { fetched: (data.articles || []).length, passed: 0, status: data.status };
      if (!res.ok) return [];
      return (data.articles || []).map(a => ({ ...a, _sourceQuery: q }));
    } catch (e) {
      monitor.queries[q] = { fetched: 0, passed: 0, error: e.message };
      return [];
    }
  }));

  // ── Query 3: attraction-specific queries (Option A) ───────
  const attractionResults = await Promise.all(ATTRACTION_QUERIES.map(async (q) => {
    const params = new URLSearchParams({ q, language: 'en', sortBy: 'publishedAt', pageSize: '10', apiKey });
    try {
      const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
      const data = await res.json();
      monitor.queries[q] = { fetched: (data.articles || []).length, passed: 0, status: data.status };
      if (!res.ok) return [];
      return (data.articles || []).map(a => ({ ...a, _sourceQuery: q }));
    } catch (e) {
      monitor.queries[q] = { fetched: 0, passed: 0, error: e.message };
      return [];
    }
  }));

  // ── Query 4: trusted domains ──────────────────────────────
  let domainResults = [];
  try {
    const params = new URLSearchParams({ q: 'travel family kids', domains: DOMAINS, language: 'en', sortBy: 'publishedAt', pageSize: '30', apiKey });
    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    const data = await res.json();
    monitor.queries['_domains'] = { fetched: (data.articles || []).length, passed: 0, status: data.status };
    if (res.ok) domainResults = (data.articles || []).map(a => ({ ...a, _sourceQuery: '_domains' }));
  } catch (e) {
    monitor.queries['_domains'] = { fetched: 0, passed: 0, error: e.message };
  }

  // ── Query 5: RSS feeds (Option B) ────────────────────────
  const rssResults = await Promise.all(RSS_FEEDS.map(async ({ url, name }) => {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
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
  const allBatches = [...keywordResults, ...generalResults, ...attractionResults, domainResults, ...rssResults];
  const seen = new Set();
  let articles = [];

  for (const batch of allBatches) {
    for (const a of batch) {
      if (!a.title || !a.url || seen.has(a.url)) continue;
      const titleLower = a.title.toLowerCase();

      if (BLOCKED_KEYWORDS.some(kw => titleLower.includes(kw))) {
        monitor.filter.blockedKeyword++;
        continue;
      }

      const hasFamily  = FAMILY_KEYWORDS.some(kw => titleLower.includes(kw));
      const hasTravel  = TRAVEL_KEYWORDS.some(kw => titleLower.includes(kw));
      const trustedSource = TRUSTED_SOURCES.some(s => (a.url || '').includes(s));
      if (!trustedSource && !(hasFamily && hasTravel)) {
        monitor.filter.noRelevance++;
        continue;
      }

      const hasEurope  = EUROPE_KEYWORDS.some(kw => titleLower.includes(kw));
      const euroSource = ['euroweeklynews', 'europeanbestdestinations', 'wanderlust', 'thelocal.', 'expatica', 'euronews',
        'europapark', 'efteling', 'gardaland', 'portaventura', 'tivoli', 'altontowers',
        'phantasialand', 'parcasterix', 'puydufou', 'walibi', 'heide-park', 'futuroscope',
        'mirabilandia', 'thorpepark', 'liseberg', 'energylandia', 'plopsaland',
        'bobbejaanland', 'gronaland', 'legoland.de', 'legoland.co.uk', 'tibidabo',
        'leolandia'].some(s => (a.url || '').includes(s));
      if (!hasEurope && !euroSource) {
        monitor.filter.noEurope++;
        continue;
      }

      seen.add(a.url);
      monitor.filter.passed++;
      if (a._sourceQuery && monitor.queries[a._sourceQuery]) monitor.queries[a._sourceQuery].passed++;
      if (a._sourceQuery?.startsWith('rss:')) {
        const rssName = a._sourceQuery.replace('rss:', '');
        if (monitor.rssFeeds[rssName]) monitor.rssFeeds[rssName].passed++;
      }
      const sourceName = a.source?.name || 'Unknown';
      monitor.bySource[sourceName] = (monitor.bySource[sourceName] || 0) + 1;

      articles.push({
        title: a.title.split(' - ')[0].trim(),
        url: a.url,
        source: sourceName,
        publishedAt: a.publishedAt,
        description: a.description || null,
      });
    }
  }

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

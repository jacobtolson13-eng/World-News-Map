// Open outlet ratings table. Edit freely; every field is shown in the app.
//
// lean:     -2 Left, -1 Lean Left, 0 Center, 1 Lean Right, 2 Right, null = not rated on a left/right scale
// funding:  "Private" | "Public (independent)" | "State-controlled" | "State-aligned"
// audience: who the outlet mainly writes for
// basis:    where the rating comes from. All entries below are STARTER ratings drawn from
//           widely cited public assessments and need independent review before launch.
const STARTER = "Starter rating, pending review";

window.SOURCES = {
  // ---- North America ----
  "nytimes.com":        { name: "The New York Times", city: "New York, US", lat: 40.7561, lng: -73.9903, lean: -1, funding: "Private", audience: "US national, college-educated readers", basis: STARTER },
  "washingtonpost.com": { name: "The Washington Post", city: "Washington DC, US", lat: 38.9035, lng: -77.0283, lean: -1, funding: "Private", audience: "US national, politics-focused readers", basis: STARTER },
  "wsj.com":            { name: "The Wall Street Journal", city: "New York, US", lat: 40.7577, lng: -73.9857, lean: 0, funding: "Private", audience: "Business and finance professionals", basis: STARTER + " (news pages; opinion pages lean right)" },
  "foxnews.com":        { name: "Fox News", city: "New York, US", lat: 40.7590, lng: -73.9845, lean: 2, funding: "Private", audience: "US conservative general audience", basis: STARTER },
  "cnn.com":            { name: "CNN", city: "Atlanta, US", lat: 33.7580, lng: -84.3947, lean: -1, funding: "Private", audience: "US and international general audience", basis: STARTER },
  "apnews.com":         { name: "Associated Press", city: "New York, US", lat: 40.7128, lng: -74.0150, lean: 0, funding: "Private (non-profit co-op)", audience: "Wire service for newsrooms worldwide", basis: STARTER },
  "npr.org":            { name: "NPR", city: "Washington DC, US", lat: 38.8995, lng: -77.0129, lean: -1, funding: "Public (independent)", audience: "US public radio listeners", basis: STARTER },
  "nbcnews.com":        { name: "NBC News", city: "New York, US", lat: 40.7587, lng: -73.9787, lean: -1, funding: "Private", audience: "US general audience", basis: STARTER },
  "cbsnews.com":        { name: "CBS News", city: "New York, US", lat: 40.7685, lng: -73.9886, lean: -1, funding: "Private", audience: "US general audience", basis: STARTER },
  "msnbc.com":          { name: "MSNBC", city: "New York, US", lat: 40.7593, lng: -73.9794, lean: -2, funding: "Private", audience: "US progressive audience", basis: STARTER },
  "usatoday.com":       { name: "USA Today", city: "McLean VA, US", lat: 38.9339, lng: -77.2297, lean: -1, funding: "Private", audience: "US general audience", basis: STARTER },
  "thehill.com":        { name: "The Hill", city: "Washington DC, US", lat: 38.9007, lng: -77.0430, lean: 0, funding: "Private", audience: "US politics and policy followers", basis: STARTER },
  "axios.com":          { name: "Axios", city: "Arlington VA, US", lat: 38.8951, lng: -77.0716, lean: -1, funding: "Private", audience: "US professionals, policy and business", basis: STARTER },
  "bloomberg.com":      { name: "Bloomberg", city: "New York, US", lat: 40.7622, lng: -73.9680, lean: 0, funding: "Private", audience: "Investors and business professionals", basis: STARTER },
  "nypost.com":         { name: "New York Post", city: "New York, US", lat: 40.7577, lng: -73.9850, lean: 1, funding: "Private", audience: "New York and US tabloid readers", basis: STARTER },
  "washingtonexaminer.com": { name: "Washington Examiner", city: "Washington DC, US", lat: 38.9010, lng: -77.0300, lean: 1, funding: "Private", audience: "US conservative politics readers", basis: STARTER },
  "dailywire.com":      { name: "The Daily Wire", city: "Nashville, US", lat: 36.1627, lng: -86.7816, lean: 2, funding: "Private", audience: "US conservative audience", basis: STARTER },
  "breitbart.com":      { name: "Breitbart", city: "Los Angeles, US", lat: 34.0522, lng: -118.2437, lean: 2, funding: "Private", audience: "US populist-right audience", basis: STARTER },
  "cbc.ca":             { name: "CBC News", city: "Toronto, CA", lat: 43.6440, lng: -79.3881, lean: -1, funding: "Public (independent)", audience: "Canadian general audience", basis: STARTER },
  "globalnews.ca":      { name: "Global News", city: "Toronto, CA", lat: 43.6532, lng: -79.3832, lean: 0, funding: "Private", audience: "Canadian general audience", basis: STARTER },

  // ---- Latin America ----
  "folha.uol.com.br":   { name: "Folha de S.Paulo", city: "São Paulo, BR", lat: -23.5505, lng: -46.6333, lean: -1, funding: "Private", audience: "Brazilian national readers", basis: STARTER },
  "clarin.com":         { name: "Clarín", city: "Buenos Aires, AR", lat: -34.6037, lng: -58.3816, lean: 1, funding: "Private", audience: "Argentine national readers", basis: STARTER },
  "eluniversal.com.mx": { name: "El Universal", city: "Mexico City, MX", lat: 19.4326, lng: -99.1332, lean: 0, funding: "Private", audience: "Mexican national readers", basis: STARTER },

  // ---- Europe ----
  "reuters.com":        { name: "Reuters", city: "London, UK", lat: 51.5054, lng: -0.0235, lean: 0, funding: "Private", audience: "Wire service, global business and newsrooms", basis: STARTER },
  "bbc.com":            { name: "BBC News", city: "London, UK", lat: 51.5186, lng: -0.1440, lean: 0, funding: "Public (independent)", audience: "UK and international general audience", basis: STARTER },
  "bbc.co.uk":          { name: "BBC News", city: "London, UK", lat: 51.5186, lng: -0.1440, lean: 0, funding: "Public (independent)", audience: "UK general audience", basis: STARTER },
  "theguardian.com":    { name: "The Guardian", city: "London, UK", lat: 51.5347, lng: -0.1222, lean: -1, funding: "Private (trust-owned)", audience: "UK and international progressive readers", basis: STARTER },
  "independent.co.uk":  { name: "The Independent", city: "London, UK", lat: 51.5010, lng: -0.1910, lean: -1, funding: "Private", audience: "UK general online audience", basis: STARTER },
  "telegraph.co.uk":    { name: "The Telegraph", city: "London, UK", lat: 51.5045, lng: -0.0190, lean: 1, funding: "Private", audience: "UK conservative readers", basis: STARTER },
  "dailymail.co.uk":    { name: "Daily Mail", city: "London, UK", lat: 51.4993, lng: -0.1946, lean: 2, funding: "Private", audience: "UK tabloid readers, right-of-centre", basis: STARTER },
  "ft.com":             { name: "Financial Times", city: "London, UK", lat: 51.5113, lng: -0.0937, lean: 0, funding: "Private", audience: "Global business and finance readers", basis: STARTER },
  "economist.com":      { name: "The Economist", city: "London, UK", lat: 51.5155, lng: -0.1300, lean: 0, funding: "Private", audience: "Global policy and business readers", basis: STARTER },
  "france24.com":       { name: "France 24", city: "Paris, FR", lat: 48.8300, lng: 2.2700, lean: 0, funding: "Public (independent)", audience: "International audience", basis: STARTER },
  "lemonde.fr":         { name: "Le Monde", city: "Paris, FR", lat: 48.8400, lng: 2.3700, lean: -1, funding: "Private", audience: "French national readers", basis: STARTER },
  "lefigaro.fr":        { name: "Le Figaro", city: "Paris, FR", lat: 48.8720, lng: 2.3050, lean: 1, funding: "Private", audience: "French conservative readers", basis: STARTER },
  "dw.com":             { name: "Deutsche Welle", city: "Bonn, DE", lat: 50.7174, lng: 7.1300, lean: 0, funding: "Public (independent)", audience: "International audience", basis: STARTER },
  "spiegel.de":         { name: "Der Spiegel", city: "Hamburg, DE", lat: 53.5426, lng: 10.0040, lean: -1, funding: "Private", audience: "German national readers", basis: STARTER },
  "elpais.com":         { name: "El País", city: "Madrid, ES", lat: 40.4168, lng: -3.7038, lean: -1, funding: "Private", audience: "Spanish and Latin American readers", basis: STARTER },
  "abc.es":             { name: "ABC", city: "Madrid, ES", lat: 40.4380, lng: -3.6800, lean: 1, funding: "Private", audience: "Spanish conservative readers", basis: STARTER },
  "corriere.it":        { name: "Corriere della Sera", city: "Milan, IT", lat: 45.4642, lng: 9.1900, lean: 0, funding: "Private", audience: "Italian national readers", basis: STARTER },
  "kyivindependent.com":{ name: "The Kyiv Independent", city: "Kyiv, UA", lat: 50.4501, lng: 30.5234, lean: 0, funding: "Private", audience: "International readers following Ukraine", basis: STARTER },
  "themoscowtimes.com": { name: "The Moscow Times", city: "Amsterdam, NL (in exile)", lat: 52.3676, lng: 4.9041, lean: -1, funding: "Private", audience: "International readers following Russia", basis: STARTER },
  "rt.com":             { name: "RT", city: "Moscow, RU", lat: 55.7558, lng: 37.6173, lean: null, funding: "State-controlled", audience: "International audience, Russian state messaging", basis: STARTER },
  "tass.com":           { name: "TASS", city: "Moscow, RU", lat: 55.7600, lng: 37.6000, lean: null, funding: "State-controlled", audience: "Wire service, Russian state", basis: STARTER },

  // ---- Middle East & Africa ----
  "aljazeera.com":      { name: "Al Jazeera", city: "Doha, QA", lat: 25.3167, lng: 51.4924, lean: -1, funding: "State-aligned", audience: "International and Arab-world audience", basis: STARTER + " (funded by the State of Qatar)" },
  "arabnews.com":       { name: "Arab News", city: "Riyadh, SA", lat: 24.7136, lng: 46.6753, lean: null, funding: "State-aligned", audience: "English-language Gulf readers", basis: STARTER },
  "haaretz.com":        { name: "Haaretz", city: "Tel Aviv, IL", lat: 32.0853, lng: 34.7818, lean: -2, funding: "Private", audience: "Israeli and international liberal readers", basis: STARTER },
  "timesofisrael.com":  { name: "The Times of Israel", city: "Jerusalem, IL", lat: 31.7683, lng: 35.2137, lean: 0, funding: "Private", audience: "Israeli and diaspora readers", basis: STARTER },
  "news24.com":         { name: "News24", city: "Cape Town, ZA", lat: -33.9249, lng: 18.4241, lean: 0, funding: "Private", audience: "South African national readers", basis: STARTER },
  "punchng.com":        { name: "Punch", city: "Lagos, NG", lat: 6.5244, lng: 3.3792, lean: 0, funding: "Private", audience: "Nigerian national readers", basis: STARTER },
  "nation.africa":      { name: "Nation", city: "Nairobi, KE", lat: -1.2921, lng: 36.8219, lean: 0, funding: "Private", audience: "Kenyan and East African readers", basis: STARTER },

  // ---- Asia-Pacific ----
  "xinhuanet.com":      { name: "Xinhua", city: "Beijing, CN", lat: 39.9042, lng: 116.4074, lean: null, funding: "State-controlled", audience: "Wire service, Chinese state", basis: STARTER },
  "news.cn":            { name: "Xinhua", city: "Beijing, CN", lat: 39.9042, lng: 116.4074, lean: null, funding: "State-controlled", audience: "Wire service, Chinese state", basis: STARTER },
  "globaltimes.cn":     { name: "Global Times", city: "Beijing, CN", lat: 39.9200, lng: 116.4400, lean: null, funding: "State-controlled", audience: "International audience, Chinese state messaging", basis: STARTER },
  "scmp.com":           { name: "South China Morning Post", city: "Hong Kong", lat: 22.2800, lng: 114.1700, lean: 0, funding: "Private", audience: "Hong Kong and international China watchers", basis: STARTER },
  "japantimes.co.jp":   { name: "The Japan Times", city: "Tokyo, JP", lat: 35.6762, lng: 139.6503, lean: 0, funding: "Private", audience: "English readers in and about Japan", basis: STARTER },
  "asahi.com":          { name: "Asahi Shimbun", city: "Tokyo, JP", lat: 35.6640, lng: 139.7670, lean: -1, funding: "Private", audience: "Japanese national readers", basis: STARTER },
  "en.yna.co.kr":       { name: "Yonhap", city: "Seoul, KR", lat: 37.5665, lng: 126.9780, lean: 0, funding: "Public (independent)", audience: "Wire service, Korea", basis: STARTER },
  "timesofindia.indiatimes.com": { name: "The Times of India", city: "Mumbai, IN", lat: 19.0760, lng: 72.8777, lean: 0, funding: "Private", audience: "Indian national readers", basis: STARTER },
  "thehindu.com":       { name: "The Hindu", city: "Chennai, IN", lat: 13.0827, lng: 80.2707, lean: -1, funding: "Private", audience: "Indian national readers", basis: STARTER },
  "ndtv.com":           { name: "NDTV", city: "New Delhi, IN", lat: 28.6139, lng: 77.2090, lean: 0, funding: "Private", audience: "Indian national audience", basis: STARTER },
  "dawn.com":           { name: "Dawn", city: "Karachi, PK", lat: 24.8607, lng: 67.0011, lean: 0, funding: "Private", audience: "Pakistani national readers", basis: STARTER },
  "straitstimes.com":   { name: "The Straits Times", city: "Singapore", lat: 1.2897, lng: 103.8501, lean: 0, funding: "State-aligned", audience: "Singapore national readers", basis: STARTER },
  "abc.net.au":         { name: "ABC News Australia", city: "Sydney, AU", lat: -33.8688, lng: 151.2093, lean: 0, funding: "Public (independent)", audience: "Australian general audience", basis: STARTER },
  "smh.com.au":         { name: "The Sydney Morning Herald", city: "Sydney, AU", lat: -33.8700, lng: 151.2000, lean: -1, funding: "Private", audience: "Sydney and Australian readers", basis: STARTER },
};

// Rough country centres, used to place outlets not yet in the table above.
window.COUNTRY_CENTERS = {
  "United States": [39.8, -98.6], "Canada": [56.1, -106.3], "Mexico": [23.6, -102.5], "Brazil": [-14.2, -51.9],
  "Argentina": [-38.4, -63.6], "Chile": [-35.7, -71.5], "Colombia": [4.6, -74.3], "Peru": [-9.2, -75.0], "Venezuela": [6.4, -66.6],
  "United Kingdom": [54.0, -2.0], "Ireland": [53.4, -8.2], "France": [46.2, 2.2], "Germany": [51.2, 10.4], "Spain": [40.5, -3.7],
  "Portugal": [39.4, -8.2], "Italy": [41.9, 12.6], "Netherlands": [52.1, 5.3], "Belgium": [50.5, 4.5], "Switzerland": [46.8, 8.2],
  "Austria": [47.5, 14.6], "Poland": [51.9, 19.1], "Sweden": [60.1, 18.6], "Norway": [60.5, 8.5], "Denmark": [56.3, 9.5],
  "Finland": [61.9, 25.7], "Greece": [39.1, 21.8], "Turkey": [39.0, 35.2], "Ukraine": [48.4, 31.2], "Russia": [61.5, 105.3],
  "Romania": [45.9, 25.0], "Hungary": [47.2, 19.5], "Czech Republic": [49.8, 15.5], "Israel": [31.0, 34.9], "Iran": [32.4, 53.7],
  "Iraq": [33.2, 43.7], "Saudi Arabia": [23.9, 45.1], "United Arab Emirates": [23.4, 53.8], "Qatar": [25.4, 51.2], "Egypt": [26.8, 30.8],
  "Lebanon": [33.9, 35.9], "Jordan": [30.6, 36.2], "Syria": [34.8, 39.0], "Nigeria": [9.1, 8.7], "South Africa": [-30.6, 22.9],
  "Kenya": [-0.02, 37.9], "Ethiopia": [9.1, 40.5], "Ghana": [7.9, -1.0], "Morocco": [31.8, -7.1], "Algeria": [28.0, 1.7],
  "Tanzania": [-6.4, 34.9], "Uganda": [1.4, 32.3], "Zimbabwe": [-19.0, 29.2], "India": [20.6, 79.0], "Pakistan": [30.4, 69.3],
  "Bangladesh": [23.7, 90.4], "Sri Lanka": [7.9, 80.8], "Nepal": [28.4, 84.1], "China": [35.9, 104.2], "Hong Kong": [22.3, 114.2],
  "Taiwan": [23.7, 121.0], "Japan": [36.2, 138.3], "South Korea": [35.9, 127.8], "Philippines": [12.9, 121.8], "Vietnam": [14.1, 108.3],
  "Thailand": [15.9, 100.99], "Malaysia": [4.2, 102.0], "Singapore": [1.35, 103.82], "Indonesia": [-0.8, 113.9],
  "Australia": [-25.3, 133.8], "New Zealand": [-40.9, 174.9],
};

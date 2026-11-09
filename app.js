/* World News Map: pins each article where the story happens, with outlet lean, audience and topic tags. */
(function () {
  "use strict";

  // ---------- Lean scale ----------
  const LEANS = [
    { key: "-2", label: "Left", color: "var(--l2)", hex: "#1f4fa8" },
    { key: "-1", label: "Lean Left", color: "var(--l1)", hex: "#5b8fe0" },
    { key: "0", label: "Center", color: "var(--c0)", hex: "#7c6fb0" },
    { key: "1", label: "Lean Right", color: "var(--r1)", hex: "#e0796b" },
    { key: "2", label: "Right", color: "var(--r2)", hex: "#b8322a" },
    { key: "state", label: "State media", color: "var(--state)", hex: "#b7791f" },
    { key: "unrated", label: "Not yet rated", color: "var(--unrated)", hex: "#9aa3ad" },
  ];
  const LEAN_BY_KEY = Object.fromEntries(LEANS.map(l => [l.key, l]));

  function leanKeyFor(src) {
    if (!src) return "unrated";
    if (src.funding === "State-controlled" || (src.lean === null && /State/.test(src.funding))) return "state";
    if (src.lean === null || src.lean === undefined) return "unrated";
    return String(src.lean);
  }

  // ---------- Topic tags (keyword based) ----------
  const TOPICS = {
    "Politics": /\b(election|elections|vote|voters|voting|parliament|congress|senate|president|prime minister|minister|government|campaign|lawmakers|party|ballot|poll|polls|referendum|coalition)\b/i,
    "Conflict & war": /\b(war|military|troops|army|missile|missiles|drone|drones|airstrike|strike|strikes|attack|attacks|ceasefire|invasion|bomb|shelling|militants|hostages|soldiers|frontline)\b/i,
    "Economy": /\b(economy|economic|inflation|interest rate|rates|gdp|recession|jobs|unemployment|tariff|tariffs|trade|markets|stocks|stock|bank|banks|budget|debt|prices|exports|imports|earnings|investors)\b/i,
    "Climate & environment": /\b(climate|emissions|carbon|warming|wildfire|wildfires|bushfire|deforestation|pollution|environment|environmental|heatwave|heat|drought|renewable)\b/i,
    "Disasters & weather": /\b(earthquake|tsunami|flood|flooding|floods|hurricane|typhoon|cyclone|storm|tornado|landslide|volcano|monsoon)\b/i,
    "Health": /\b(health|hospital|hospitals|vaccine|vaccines|virus|outbreak|disease|covid|cancer|medical|doctors|patients|pandemic|mpox|measles|drug|drugs)\b/i,
    "Technology": /\b(tech|technology|ai|artificial intelligence|chip|chips|semiconductor|software|cyber|cyberattack|hack|hackers|data|apple|google|microsoft|meta|openai|startup|app|robot)\b/i,
    "Science & space": /\b(science|scientists|researchers|study|space|nasa|rocket|satellite|moon|mars|telescope|discovery)\b/i,
    "Immigration": /\b(immigration|immigrants|migrants|migrant|asylum|refugees|refugee|border|deportation|deportations)\b/i,
    "Crime & justice": /\b(court|courts|judge|trial|police|arrest|arrested|crime|murder|shooting|charged|lawsuit|sentenced|prison|supreme court|verdict)\b/i,
    "Energy": /\b(energy|oil|gas|power|electricity|nuclear|solar|wind power|opec|fuel|pipeline)\b/i,
    "Human rights": /\b(human rights|protest|protests|protesters|rights|freedom|censorship|discrimination|abuse)\b/i,
    "Diplomacy": /\b(summit|talks|diplomat|diplomatic|sanctions|treaty|un|united nations|nato|ambassador|negotiations|deal|relations)\b/i,
    "Sports": /\b(football|soccer|cricket|nba|nfl|olympics|olympic|world cup|tennis|match|tournament|league|championship|coach|goal)\b/i,
    "Culture & entertainment": /\b(film|movie|music|album|festival|celebrity|art|museum|book|tv|series|actor|actress|singer)\b/i,
    "Education": /\b(school|schools|university|universities|students|teachers|education|college)\b/i,
  };
  function tagsFor(text) {
    const out = [];
    for (const [tag, re] of Object.entries(TOPICS)) if (re.test(text)) out.push(tag);
    return out.length ? out : ["General"];
  }

  // ---------- Story location (gazetteer match) ----------
  const placeIndex = []; // { re, name, lat, lng, kind }
  for (const [name, v] of Object.entries(window.PLACES || {})) {
    const [lat, lng, kind, ...aliases] = v;
    for (const term of [name, ...aliases]) {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Case-sensitive so "US" doesn't match "us"; allow possessive 's.
      placeIndex.push({ re: new RegExp("(^|[^\\p{L}])" + esc + "(?=$|[^\\p{L}])", "u"), name, lat, lng, kind });
    }
  }
  function locate(text, outletCountry) {
    const hits = new Map();
    for (const p of placeIndex) {
      const m = p.re.exec(text);
      if (m && !hits.has(p.name)) hits.set(p.name, { ...p, pos: m.index });
    }
    if (!hits.size) return null;
    const list = [...hits.values()];
    // Prefer specific places (cities/regions), then places outside the outlet's home country, then earliest mention.
    list.sort((a, b) =>
      (a.kind === "city" ? 0 : 1) - (b.kind === "city" ? 0 : 1) ||
      (a.name === outletCountry ? 1 : 0) - (b.name === outletCountry ? 1 : 0) ||
      a.pos - b.pos);
    return { best: list[0], all: list.map(p => p.name) };
  }

  // ---------- Build an article record ----------
  function domainOf(urlOrDomain) {
    try { return new URL(urlOrDomain).hostname.replace(/^www\./, ""); } catch { return String(urlOrDomain).replace(/^www\./, ""); }
  }
  function findSource(domain) {
    const S = window.SOURCES;
    if (S[domain]) return { domain, ...S[domain] };
    const parts = domain.split(".");
    for (let i = 1; i < parts.length - 1; i++) {
      const d = parts.slice(i).join(".");
      if (S[d]) return { domain: d, ...S[d] };
    }
    return null;
  }
  function makeArticle({ url, title, domain, seendate, sourcecountry, language, demo }) {
    const dom = domainOf(domain || url);
    const src = findSource(dom);
    const loc = locate(title, sourcecountry);
    let lat, lng, placeLabel, placeExact = true;
    if (loc) { lat = loc.best.lat; lng = loc.best.lng; placeLabel = loc.best.name; }
    else if (src) { lat = src.lat; lng = src.lng; placeLabel = src.city + " (outlet location; story place not detected)"; placeExact = false; }
    else if (sourcecountry && window.COUNTRY_CENTERS[sourcecountry]) {
      [lat, lng] = window.COUNTRY_CENTERS[sourcecountry]; placeLabel = sourcecountry + " (outlet country; story place not detected)"; placeExact = false;
    } else return null;
    // Small offset so stacked pins at one spot can still be told apart when zoomed in.
    const j = () => (Math.random() - 0.5) * 0.02;
    return {
      url, title, demo: !!demo,
      date: seendate ? parseGdeltDate(seendate) : null,
      language: language || "",
      domain: dom,
      source: src,
      outletName: src ? src.name : dom,
      outletCountry: sourcecountry || (src ? src.city : ""),
      lean: leanKeyFor(src),
      audience: src ? src.audience : "Not yet rated",
      tags: tagsFor(title),
      lat: lat + j(), lng: lng + j(), placeLabel, placeExact,
      mentions: loc ? loc.all : [],
    };
  }
  function parseGdeltDate(s) {
    const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(s);
    return m ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6])) : null;
  }

  // ---------- Data loading ----------
  // A scheduled GitHub workflow (scripts/fetch-news.mjs) pulls the last 24 hours from GDELT every 15 minutes
  // and writes data/articles.js. The page just reloads that file, so it works on phones and needs no API calls.
  let articles = [];
  let currentTopic = "";
  function loadFeedScript() {
    return new Promise(resolve => {
      const old = document.getElementById("feed"); if (old) old.remove();
      const s = document.createElement("script");
      s.id = "feed"; s.src = "data/articles.js?t=" + Date.now();
      s.onload = () => resolve(window.NEWS_FEED || null);
      s.onerror = () => resolve(null);
      document.body.appendChild(s);
    });
  }
  async function load(topic) {
    currentTopic = topic;
    setStatus("Loading news…");
    hideNotice();
    const feed = await loadFeedScript();
    const rows = feed && Array.isArray(feed.articles) ? feed.articles : [];
    const words = topic.toLowerCase().split(/\s+/).filter(Boolean);
    const seen = new Set();
    articles = [];
    for (const r of rows) {
      if (seen.has(r.url)) continue;
      if (words.length && !words.every(w => r.title.toLowerCase().includes(w))) continue;
      const a = makeArticle(r);
      if (a) { articles.push(a); seen.add(r.url); }
    }
    if (!rows.length) {
      showNotice("The news feed hasn't been generated yet. Showing demo placeholder headlines, not real articles.");
      articles = window.SAMPLE_ARTICLES.map(([d, t]) => makeArticle({ url: "#", title: t, domain: d, demo: true })).filter(Boolean);
    }
    const when = feed && feed.updated ? timeAgo(new Date(feed.updated)) : "";
    setStatus(articles[0] && articles[0].demo ? `${articles.length} demo articles`
      : `${articles.length} articles${topic ? ` matching "${topic}"` : ""} · feed updated ${when} · auto-refreshes`);
    render();
  }

  // ---------- Map ----------
  const map = L.map("map", { worldCopyJump: true, minZoom: 2, maxZoom: 18 }).setView([25, 10], 2);
  // Base map: bundled country shapes (Natural Earth), so the map always works with no tile service or key.
  const dark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  map.getContainer().style.background = dark ? "#0f1a24" : "#cfe3f0"; // ocean
  // Draw the shapes in a pane *below* the tile layer, so street tiles fully replace them when zoomed in.
  map.createPane("base").style.zIndex = 150;
  L.geoJSON(window.WORLD_GEOJSON, {
    pane: "base",
    style: { color: dark ? "#3a4654" : "#9aa8b5", weight: 0.8, fillColor: dark ? "#25303b" : "#f4f1ea", fillOpacity: 1 },
    onEachFeature: (f, layer) => layer.bindTooltip(f.properties.n, { sticky: true, direction: "top", opacity: 0.85 }),
  }).addTo(map);
  // Street-level detail: OpenStreetMap tiles, only when served from a real website (OSM blocks local files).
  // They appear above the country shapes when zoomed in; if they fail to load the shapes stay visible.
  if (location.protocol === "https:") {
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, minZoom: 5, className: dark ? "tiles-dark" : "",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    let errors = 0;
    osm.on("tileerror", () => { if (++errors > 6 && map.hasLayer(osm)) map.removeLayer(osm); });
    osm.addTo(map);
  }
  map.attributionControl.addAttribution("Country shapes: Natural Earth");

  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false, maxClusterRadius: 45, spiderfyOnMaxZoom: true,
    iconCreateFunction(c) {
      const counts = {};
      for (const m of c.getAllChildMarkers()) counts[m.article.lean] = (counts[m.article.lean] || 0) + 1;
      const n = c.getChildCount();
      let acc = 0; const stops = [];
      for (const l of LEANS) if (counts[l.key]) { const s = acc; acc += counts[l.key] / n * 360; stops.push(`${l.hex} ${s}deg ${acc}deg`); }
      const size = n < 10 ? 32 : n < 50 ? 40 : 50;
      return L.divIcon({ html: `<div class="cluster" style="width:${size}px;height:${size}px;background:conic-gradient(${stops.join(",")})">${n}</div>`, className: "", iconSize: [size, size] });
    },
  });
  map.addLayer(cluster);
  map.on("moveend", renderSidebar);

  // ---------- Filters ----------
  const activeLeans = new Set(LEANS.map(l => l.key));
  let activeTag = null;
  function visible(a) { return activeLeans.has(a.lean) && (!activeTag || a.tags.includes(activeTag)); }

  function renderFilters() {
    const lf = document.getElementById("leanFilters");
    lf.innerHTML = "";
    for (const l of LEANS) {
      const b = el("button", { class: "chip" + (activeLeans.has(l.key) ? " on" : ""), type: "button" });
      b.innerHTML = `<span class="dot" style="background:${l.color}"></span>${l.label}`;
      b.onclick = () => { activeLeans.has(l.key) ? activeLeans.delete(l.key) : activeLeans.add(l.key); render(); };
      lf.appendChild(b);
    }
    const tf = document.getElementById("tagFilters");
    tf.innerHTML = "";
    const counts = {};
    for (const a of articles) for (const t of a.tags) counts[t] = (counts[t] || 0) + 1;
    const all = el("button", { class: "chip" + (activeTag ? "" : " on"), type: "button" }, "All");
    all.onclick = () => { activeTag = null; render(); };
    tf.appendChild(all);
    for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
      const b = el("button", { class: "chip" + (activeTag === t ? " on" : ""), type: "button" }, `${t} (${n})`);
      b.onclick = () => { activeTag = activeTag === t ? null : t; render(); };
      tf.appendChild(b);
    }
  }

  // ---------- Render ----------
  function render() {
    cluster.clearLayers();
    const markers = [];
    for (const a of articles) {
      if (!visible(a)) continue;
      const lean = LEAN_BY_KEY[a.lean];
      const m = L.marker([a.lat, a.lng], {
        icon: L.divIcon({ html: `<div class="pin" style="background:${lean.hex}"></div>`, className: "", iconSize: [14, 14] }),
        title: a.title,
      });
      m.article = a;
      m.bindPopup(() => popupHtml(a), { maxWidth: 320 });
      a.marker = m;
      markers.push(m);
    }
    cluster.addLayers(markers);
    renderFilters();
    renderSidebar();
  }

  function renderSidebar() {
    const bounds = map.getBounds();
    const inView = articles.filter(a => visible(a) && bounds.contains([a.lat, a.lng]));
    // Lean bar
    const bar = document.getElementById("leanbar");
    bar.innerHTML = "";
    const counts = {};
    for (const a of inView) counts[a.lean] = (counts[a.lean] || 0) + 1;
    for (const l of LEANS) if (counts[l.key]) {
      const s = el("span"); s.style.background = l.color; s.style.width = (counts[l.key] / inView.length * 100) + "%";
      s.title = `${l.label}: ${counts[l.key]}`; bar.appendChild(s);
    }
    document.getElementById("legend").innerHTML = LEANS.filter(l => counts[l.key])
      .map(l => `<span><span class="dot" style="background:${l.color}"></span>${l.label} ${Math.round(counts[l.key] / inView.length * 100)}%</span>`).join("")
      || "<span>No articles in this view</span>";
    // List
    const list = document.getElementById("list");
    list.innerHTML = "";
    inView.sort((a, b) => (b.date || 0) - (a.date || 0));
    for (const a of inView.slice(0, 200)) {
      const card = el("div", { class: "card" });
      card.innerHTML = articleHtml(a);
      card.onclick = e => {
        if (e.target.tagName === "A") return;
        cluster.zoomToShowLayer(a.marker, () => a.marker.openPopup());
      };
      list.appendChild(card);
    }
  }

  function articleHtml(a) {
    const lean = LEAN_BY_KEY[a.lean];
    const when = a.date ? timeAgo(a.date) : "";
    const link = a.demo ? `<span style="font-weight:600">${esc(a.title)}</span>` : `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)}</a>`;
    return `${link}
      <div class="meta"><span class="badge" style="background:${lean.hex}">${lean.label}</span> ${esc(a.outletName)}${when ? " · " + when : ""}</div>
      <div class="meta">📍 ${esc(a.placeLabel)}</div>
      <div class="meta">👥 Audience: ${esc(a.audience)}</div>
      <div class="tags">${a.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  }
  function popupHtml(a) {
    const s = a.source;
    const srcInfo = s
      ? `<div class="src-detail"><b>About ${esc(s.name)}</b><br>Based in ${esc(s.city)} · ${esc(s.funding)}<br>Rating basis: ${esc(s.basis)}</div>`
      : `<div class="src-detail"><b>${esc(a.domain)}</b> is not in the ratings table yet.</div>`;
    const mentions = a.mentions.length > 1 ? `<div class="src-detail">Places mentioned: ${a.mentions.map(esc).join(", ")}</div>` : "";
    return `<h3>${a.demo ? esc(a.title) : `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)}</a>`}</h3>${articleHtml(a).replace(/^[\s\S]*?<\/(a|span)>/, "")}${mentions}${srcInfo}`;
  }

  // ---------- Helpers ----------
  function el(tag, attrs = {}, text) { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function timeAgo(d) { const m = Math.round((Date.now() - d) / 60000); return m < 60 ? m + "m ago" : m < 1440 ? Math.round(m / 60) + "h ago" : Math.round(m / 1440) + "d ago"; }
  function setStatus(t) { document.getElementById("status").textContent = t; }
  function showNotice(t) { const n = document.getElementById("notice"); n.textContent = t; n.hidden = false; }
  function hideNotice() { document.getElementById("notice").hidden = true; }

  document.getElementById("search").addEventListener("submit", e => { e.preventDefault(); load(document.getElementById("q").value.trim()); });
  render();
  load("");
  // Auto-refresh: every 15 minutes (GDELT updates every 15), and when the tab comes back into view after 15+ minutes.
  const REFRESH_MS = 15 * 60 * 1000;
  let lastLoad = Date.now();
  const refresh = () => { lastLoad = Date.now(); load(currentTopic); };
  setInterval(() => { if (!document.hidden) refresh(); }, REFRESH_MS);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && Date.now() - lastLoad > REFRESH_MS) refresh(); });
})();

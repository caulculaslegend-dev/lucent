/* Lucent website: the parts that come from Lucent's servers.
   - a popup when a new version is out
   - Most popular wallpapers (ranked by likes in the app) and categories
   - real numbers (people with a Lucent page, likes)
   - the accessory shop showcase, and wallpapers people shared */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const https = (u) => /^https:\/\//i.test(String(u || ''));
  const V = 'v=240';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } } };

  // ---------------------------------------------------------------- config + Supabase (public, read-only)
  let cfgP = null;
  function cfg() {
    if (!cfgP) cfgP = (async () => {
      for (const u of ['lucent.json', 'https://raw.githubusercontent.com/caulculaslegend-dev/lucent/main/lucent.json']) {
        try { const r = await fetch(u, { cache: 'no-store' }); if (r.ok) return await r.json(); } catch (e) { /* next */ }
      }
      return {};
    })();
    return cfgP;
  }
  async function rpc(name, body) {
    const c = await cfg(); if (!c.supabaseUrl || !c.supabaseAnonKey) return null;
    const r = await fetch(`${c.supabaseUrl}/rest/v1/rpc/${name}`, { method: 'POST', headers: { apikey: c.supabaseAnonKey, Authorization: `Bearer ${c.supabaseAnonKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
    return r.ok ? r.json() : null;
  }
  async function rest(path) {
    const c = await cfg(); if (!c.supabaseUrl || !c.supabaseAnonKey) return null;
    const r = await fetch(`${c.supabaseUrl}/rest/v1/${path}`, { headers: { apikey: c.supabaseAnonKey, Authorization: `Bearer ${c.supabaseAnonKey}` } });
    return r.ok ? r.json() : null;
  }
  const collections = fetch(`collections.json?${V}`).then((r) => r.json()).catch(() => ({ items: [], sets: [] }));

  // ---------------------------------------------------------------- 1. "A new version is out" popup
  // Shows once per version: when there's a release you haven't seen, and it came out in the last 3 weeks.
  (async function updatePopup() {
    const repo = String(window.LUCENT_RELEASES || '').trim(); if (!repo) return;
    let j = null; try { const r = await fetch(`https://api.github.com/repos/${repo}/releases/latest`); j = r.ok ? await r.json() : null; } catch (e) { return; }
    if (!j || !j.tag_name) return;
    const ver = String(j.tag_name).replace(/^v/, '');
    const num = (v) => v.split('.').map((x) => parseInt(x, 10) || 0); const [a, b] = num(ver);
    if (a < 2 || (a === 2 && b < 4)) return; // the popup started with 2.4
    const seen = store.get('lucent-seen-version');
    const fresh = Date.now() - new Date(j.published_at || 0).getTime() < 21 * 864e5;
    if (seen === ver || !fresh) { store.set('lucent-seen-version', ver); return; }
    const notes = String(j.body || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => /^[-*•]\s+/.test(l)).map((l) => l.replace(/^[-*•]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1')).slice(0, 5);
    const box = document.createElement('div');
    box.className = 'upd'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-labelledby', 'updT');
    box.innerHTML = `<div class="upd-card"><button class="upd-x" type="button" aria-label="Close">×</button>
      <div class="upd-top"><img src="assets/icon-256.png?${V}" alt="" width="56" height="56"><div><span class="upd-tag">New update</span><h3 id="updT">Lucent ${esc(ver)} is here</h3></div></div>
      ${notes.length ? `<ul>${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : '<p>A new version with fixes and new things to try.</p>'}
      <p class="upd-note">Already have Lucent? It updates itself. Open it and it’ll offer the new version.</p>
      <div class="upd-row"><button type="button" class="upd-go">Get Lucent ${esc(ver)}</button><button type="button" class="upd-later">Later</button></div></div>`;
    const close = () => { store.set('lucent-seen-version', ver); box.classList.remove('on'); setTimeout(() => box.remove(), 350); };
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.upd-x,.upd-later')) close(); });
    box.querySelector('.upd-go').onclick = () => { close(); const b = document.querySelector('[data-dl="auto"]'); if (b) b.click(); else location.hash = '#download'; };
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.isConnected) close(); });
    setTimeout(() => { document.body.appendChild(box); requestAnimationFrame(() => box.classList.add('on')); }, 1800);
  })();

  // ---------------------------------------------------------------- 2. most popular + categories
  // Only wallpapers that are free to show here: the built-in collections and ones people shared.
  const showable = (x) => x && https(x.thumb) && (x.source === 'collections' || x.source === 'community');
  function rankCard(x, i) {
    const likes = x.likes ? `<span class="pl">♥ ${x.likes >= 1000 ? `${(x.likes / 1000).toFixed(1)}k` : x.likes}</span>` : '';
    return `<a class="pcard" href="#wallpapers" data-set="${esc(x.set || '')}" aria-label="${i + 1}. ${esc(x.title)}"><img src="${esc(x.thumb)}" alt="" loading="lazy" width="640" height="400"><span class="rank" aria-hidden="true">${i + 1}</span><span class="pinfo"><b>${esc(x.title)}</b><span>${likes}${esc(x.author || '')}</span></span></a>`;
  }
  (async function popular() {
    const track = $('#popTrack'); if (!track) return;
    const j = await collections;
    const byId = Object.fromEntries((j.items || []).map((x) => [x.id, x]));
    let list = [];
    try {
      const rows = await rpc('popular_wallpapers', { lim: 30, days: 0 });
      if (Array.isArray(rows)) list = rows.map((r) => ({ ...(r.meta || {}), key: r.wallpaper, likes: Number(r.likes) || 0 })).filter(showable)
        .map((x) => { const id = String(x.key).split(':')[1]; const c = byId[id]; return c ? { ...x, title: c.title, author: c.author, thumb: `${c.thumb}?${V}`, set: (c.sets || [])[0] } : x; });
    } catch (e) { /* not set up yet */ }
    const ranked = list.length >= 3;
    const PICK = ['antelope-canyon', 'saturn', 'neon-bridge', 'scarlet-tree', 'glass-chip', 'orionids', 'pastel-tubes', 'red-dune', 'pink-dahlia', 'fold'];
    for (const id of PICK) { if (list.length >= 10) break; const c = byId[id]; if (c && !list.some((x) => String(x.key).endsWith(`:${id}`))) list.push({ key: `collections:${id}`, title: c.title, author: c.author, thumb: `${c.thumb}?${V}`, set: (c.sets || [])[0] }); }
    track.innerHTML = list.slice(0, 10).map(rankCard).join('');
    $('#popSub').textContent = ranked ? 'Ranked by likes from people using Lucent.' : 'Our picks for now. Like wallpapers in the app and the ranking follows you.';
    $$('#popTrack .pcard').forEach((a) => a.addEventListener('click', () => { const s = a.dataset.set; if (s && window.LucentWalls) window.LucentWalls.show(s); }));
    const go = (d) => track.scrollBy({ left: d * track.clientWidth * 0.8, behavior: calm ? 'auto' : 'smooth' });
    $('#popPrev').onclick = () => go(-1); $('#popNext').onclick = () => go(1);
  })();

  (async function categories() {
    const grid = $('#catGrid'); if (!grid) return;
    const j = await collections;
    const sets = (j.sets || []).filter((s) => s.id);
    const cover = { aesthetic: 'pastel-tubes', night: 'orionids', abstract: 'glass-chip', illustrated: 'scarlet-tree', scenery: 'antelope-canyon' };
    const byId = Object.fromEntries((j.items || []).map((x) => [x.id, x]));
    sets.push({ id: '', name: 'Everything' }); cover[''] = 'saturn';
    grid.innerHTML = sets.map((s) => {
      const c = byId[cover[s.id]] || (j.items || []).find((x) => (x.sets || []).includes(s.id));
      const n = s.id ? (j.items || []).filter((x) => (x.sets || []).includes(s.id)).length : (j.items || []).length;
      return `<button type="button" class="ctile" data-set="${esc(s.id)}">${c ? `<img src="${esc(c.thumb)}?${V}" alt="" loading="lazy" width="640" height="400">` : ''}<b>${esc(s.name)}</b><span>${n} wallpapers</span></button>`;
    }).join('');
    grid.addEventListener('click', (e) => { const b = e.target.closest('[data-set]'); if (b && window.LucentWalls) { if (!b.dataset.set) { window.LucentWalls.show(''); } else window.LucentWalls.show(b.dataset.set); $('#wallpapers').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' }); } });
  })();

  // ---------------------------------------------------------------- 3. real numbers
  (async function stats() {
    const box = $('#stats'); if (!box) return;
    const j = await collections;
    const s = await rpc('lucent_stats', {}).catch(() => null);
    const fmt = (n) => (n >= 10000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
    const cells = [];
    if (s && s.profiles > 0) cells.push([fmt(s.profiles), s.profiles === 1 ? 'person with a Lucent page' : 'people with a Lucent page']);
    if (s && s.likes > 0) cells.push([fmt(s.likes), 'wallpapers liked']);
    if (s && s.community > 0) cells.push([fmt(s.community), 'wallpapers shared by people']);
    cells.push([String((j.items || []).length || 56), 'free wallpapers built in'], ['16', 'widgets to put anywhere'], ['11', 'things in the Dynamic Island']);
    box.innerHTML = cells.slice(0, 4).map(([n, t]) => `<div><b>${esc(n)}</b><span>${esc(t)}</span></div>`).join('');
  })();

  // ---------------------------------------------------------------- 4. shop showcase
  (async function shop() {
    const stage = $('#shopCard'); const list = $('#shopList'); if (!stage || !window.LucentAccessories) return;
    const A = window.LucentAccessories;
    const FALLBACK = { lights: 199, santa: 149, snow: 149, holly: 99, candy: 149, pumpkin: 149, bats: 99, crown: 199, halo: 149, catears: 99, neon: 149, aurora: 199, sakura: 149, stars: 99, sparkle: 0 };
    let prices = FALLBACK; let cur = 'aud';
    try { const rows = await rest('shop_items?select=id,price_cents,currency&active=eq.true'); if (Array.isArray(rows) && rows.length) { prices = Object.fromEntries(rows.map((r) => [r.id, r.price_cents])); cur = rows[0].currency || 'aud'; } } catch (e) { /* fallback prices */ }
    const money = (c) => (!c ? 'Free' : new Intl.NumberFormat(undefined, { style: 'currency', currency: cur.toUpperCase() }).format(c / 100));
    const LOOKS = [['lights', 'santa', 'snow'], ['candy', 'holly', 'crown'], ['neon', 'aurora', 'halo'], ['pumpkin', 'bats', 'catears'], ['sakura', 'stars', 'sparkle']];
    let k = 0;
    const show = () => {
      const ids = LOOKS[k % LOOKS.length];
      A.apply(stage, $('.av', stage), ids, { seed: k + 2, nameEl: $('.nm span', stage) });
      $$('#shopList [data-id]').forEach((b) => b.classList.toggle('on', ids.includes(b.dataset.id)));
    };
    list.innerHTML = A.LIST.map((a) => `<button type="button" data-id="${a.id}"><span>${esc(a.name)}</span><small>${money(prices[a.id] ?? FALLBACK[a.id])}</small></button>`).join('');
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-id]'); if (!b) return;
      const idx = LOOKS.findIndex((l) => l.includes(b.dataset.id));
      clearInterval(t); A.apply(stage, $('.av', stage), [b.dataset.id], { seed: 9, nameEl: $('.nm span', stage) });
      $$('#shopList [data-id]').forEach((x) => x.classList.toggle('on', x === b));
      if (idx < 0) return;
    });
    let t = null;
    const io = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { show(); if (!calm && !t) t = setInterval(() => { k++; show(); }, 4200); } else { clearInterval(t); t = null; } }, { threshold: 0.3 });
    io.observe(stage);
  })();

  // ---------------------------------------------------------------- 5. shared by people
  (async function shared() {
    const box = $('#shared'); if (!box) return;
    const rows = await rest('community_wallpapers?select=id,title,thumb,kind,profiles(username)&status=eq.public&order=created_at.desc&limit=12').catch(() => null);
    if (!Array.isArray(rows) || !rows.length) return;
    $('#sharedWrap').hidden = false;
    box.innerHTML = rows.filter((r) => https(r.thumb)).map((r) => `<figure><img src="${esc(r.thumb)}" alt="" loading="lazy" width="640" height="400">${r.kind === 'video' ? '<i class="live">Live</i>' : ''}<figcaption>${esc(r.title)}<span>@${esc((r.profiles && r.profiles.username) || 'someone')}</span></figcaption></figure>`).join('');
  })();
})();

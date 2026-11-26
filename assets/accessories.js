/* Lucent profile-card accessories: Christmas lights, a Santa hat, snow, frames and more.
   Shared by the app (profile, shop) and the website's profile pages.
   LucentAccessories.apply(card, avatar, ids)  draws the given accessories on a card
   LucentAccessories.LIST                     every accessory: { id, name, slot, set, blurb }
   Card markup it expects: a positioned card element, and the avatar element inside it. */
(function () {
  'use strict';
  const LIST = [
    { id: 'lights', name: 'Fairy lights', slot: 'top', set: 'christmas', blurb: 'A string of twinkling lights across your card' },
    { id: 'santa', name: 'Santa hat', slot: 'head', set: 'christmas', blurb: 'A fluffy red hat on your profile picture' },
    { id: 'snow', name: 'Snowfall', slot: 'fx', set: 'christmas', blurb: 'Soft snow drifting down your card' },
    { id: 'holly', name: 'Holly', slot: 'corner', set: 'christmas', blurb: 'Holly and berries in the corners' },
    { id: 'candy', name: 'Candy cane frame', slot: 'frame', set: 'christmas', blurb: 'Red and white stripes around your card' },
    { id: 'pumpkin', name: 'Jack-o’-lantern', slot: 'corner', set: 'halloween', blurb: 'A glowing pumpkin in the corner' },
    { id: 'bats', name: 'Night bats', slot: 'banner', set: 'halloween', blurb: 'Bats flitting across your banner' },
    { id: 'crown', name: 'Gold crown', slot: 'head', set: 'classic', blurb: 'A little gold crown with gems' },
    { id: 'halo', name: 'Halo', slot: 'head', set: 'classic', blurb: 'A glowing ring that floats above you' },
    { id: 'catears', name: 'Cat ears', slot: 'head', set: 'classic', blurb: 'Two pointy ears on your picture' },
    { id: 'neon', name: 'Neon frame', slot: 'frame', set: 'classic', blurb: 'A moving neon edge in your accent colour' },
    { id: 'aurora', name: 'Aurora banner', slot: 'banner', set: 'classic', blurb: 'Northern lights rolling over your banner' },
    { id: 'sakura', name: 'Sakura petals', slot: 'fx', set: 'classic', blurb: 'Pink petals floating past' },
    { id: 'stars', name: 'Starfield', slot: 'fx', set: 'classic', blurb: 'Tiny stars twinkling behind everything' },
    { id: 'sparkle', name: 'Sparkles', slot: 'name', set: 'free', blurb: 'Little sparkles around your name' }
  ];
  const BY = Object.fromEntries(LIST.map((a) => [a.id, a]));

  const CSS = `
.lx-layer{position:absolute;inset:0;pointer-events:none;z-index:6;overflow:hidden;border-radius:inherit}
.lx-over{position:absolute;inset:0;pointer-events:none;z-index:7;border-radius:inherit}
.lx-head{position:absolute;pointer-events:none;z-index:8}
.lx-lights{position:absolute;left:-2%;right:-2%;top:-4px;height:46px}
.lx-lights svg{width:100%;height:100%;overflow:visible}
.lx-lights .b{animation:lxTw 2.4s ease-in-out infinite}
@keyframes lxTw{0%,100%{opacity:1}50%{opacity:.45}}
.lx-snow i,.lx-sakura i,.lx-stars i{position:absolute;top:-12px;display:block;border-radius:50%}
.lx-snow i{width:var(--s);height:var(--s);background:#fff;opacity:.85;box-shadow:0 0 4px rgba(255,255,255,.8);animation:lxFall var(--d) linear infinite;animation-delay:var(--dl)}
@keyframes lxFall{to{transform:translate(var(--dx),calc(100cqh + 24px))}}
.lx-layer.fx{container-type:size}
.lx-snowcap{position:absolute;left:0;right:0;top:0;height:16px}
.lx-sakura i{width:calc(var(--s)*1.3);height:var(--s);border-radius:80% 0 80% 0;background:linear-gradient(135deg,#ffd1e4,#ff8fbf);opacity:.9;animation:lxPetal var(--d) linear infinite;animation-delay:var(--dl)}
@keyframes lxPetal{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(var(--dx),calc(100cqh + 24px)) rotate(540deg)}}
.lx-stars i{top:var(--y);left:var(--x);width:var(--s);height:var(--s);background:#fff;animation:lxTw var(--d) ease-in-out infinite;animation-delay:var(--dl);box-shadow:0 0 6px #fff}
.lx-holly{position:absolute;width:74px;height:74px}
.lx-holly.tl{left:-6px;top:-6px}
.lx-holly.br{right:-6px;bottom:-6px;transform:rotate(180deg)}
.lx-pumpkin{position:absolute;left:8px;bottom:6px;width:62px;height:58px;filter:drop-shadow(0 6px 14px rgba(255,140,0,.45))}
.lx-pumpkin .glow{animation:lxFlick 1.8s ease-in-out infinite}
@keyframes lxFlick{0%,100%{opacity:1}40%{opacity:.7}60%{opacity:.9}}
.lx-candy{position:absolute;inset:0;border-radius:inherit;padding:5px;background:repeating-linear-gradient(45deg,#e8202f 0 9px,#fff 9px 18px);-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);-webkit-mask-composite:xor}
.lx-neon{position:absolute;inset:0;border-radius:inherit;padding:2px;background:conic-gradient(from var(--lxa,0deg),var(--acc,#8b7bff),#ff5fb8,#5ef0ff,var(--acc,#8b7bff));-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);-webkit-mask-composite:xor;animation:lxSpin 4s linear infinite;filter:drop-shadow(0 0 8px var(--acc,#8b7bff))}
@property --lxa{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes lxSpin{to{--lxa:360deg}}
.lx-aurora{position:absolute;left:0;right:0;top:0;height:var(--bh,120px);background:linear-gradient(115deg,transparent 10%,rgba(52,211,153,.55) 30%,rgba(56,189,248,.45) 48%,rgba(167,139,250,.55) 66%,transparent 85%);background-size:250% 100%;mix-blend-mode:screen;animation:lxAur 9s ease-in-out infinite alternate;filter:blur(6px)}
@keyframes lxAur{to{background-position:100% 0}}
.lx-bats{position:absolute;left:0;right:0;top:0;height:var(--bh,120px);overflow:hidden}
.lx-bats svg{position:absolute;width:28px;height:14px;animation:lxBat var(--d) linear infinite;animation-delay:var(--dl);top:var(--y)}
@keyframes lxBat{0%{left:-40px;transform:translateY(0)}25%{transform:translateY(-8px)}50%{transform:translateY(4px)}75%{transform:translateY(-6px)}100%{left:calc(100% + 40px);transform:translateY(0)}}
.lx-bats .w{animation:lxFlap .25s ease-in-out infinite alternate;transform-origin:50% 50%}
@keyframes lxFlap{to{transform:scaleY(.4)}}
.lx-head svg{width:100%;height:auto;display:block;overflow:visible}
.lx-crown{filter:drop-shadow(0 3px 6px rgba(0,0,0,.4))}
.lx-halo{animation:lxBob 3s ease-in-out infinite}
@keyframes lxBob{50%{translate:0 -4px}}
.lx-spark{position:absolute;width:14px;height:14px;animation:lxTw 1.6s ease-in-out infinite;animation-delay:var(--dl);z-index:8;pointer-events:none}
.lx-spark svg{width:100%;height:100%}
@media (prefers-reduced-motion:reduce){.lx-layer *,.lx-over,.lx-over *,.lx-head{animation:none!important}}
`;
  function ensureCSS(doc) {
    if (doc.getElementById('lx-css')) return;
    const s = doc.createElement('style'); s.id = 'lx-css'; s.textContent = CSS; doc.head.appendChild(s);
  }

  // Seeded random, so the same card always looks the same.
  function rng(seed) { let x = seed || 7; return () => { x = (x * 16807) % 2147483647; return (x & 0xffff) / 0xffff; }; }

  function lights(w) {
    const n = Math.max(8, Math.round(w / 34));
    const cols = ['#ff3b3b', '#ffd23f', '#2ee66b', '#3fa8ff', '#ff6bd6'];
    let wire = 'M0 8'; const bulbs = [];
    for (let i = 0; i < n; i++) {
      const x0 = (i / n) * 400; const x1 = ((i + 1) / n) * 400; const mx = (x0 + x1) / 2;
      wire += ` Q${mx.toFixed(1)} 26 ${x1.toFixed(1)} 8`;
      const c = cols[i % cols.length];
      // bulb hangs from the lowest point of each loop
      bulbs.push(`<g transform="translate(${mx.toFixed(1)} 17)"><rect x="-2.6" y="0" width="5.2" height="4" rx="1" fill="#3a4a3a"/><ellipse class="b" style="animation-delay:${(i * 0.37) % 2.4}s" cx="0" cy="10" rx="4.4" ry="6.6" fill="${c}"/><ellipse cx="-1.4" cy="8" rx="1.2" ry="2.2" fill="#fff" opacity=".55"/><circle class="b" style="animation-delay:${(i * 0.37) % 2.4}s" cx="0" cy="10" r="11" fill="${c}" opacity=".22"/></g>`);
    }
    return `<div class="lx-lights"><svg viewBox="0 0 400 46" preserveAspectRatio="none"><path d="${wire}" fill="none" stroke="#2c3a2c" stroke-width="1.6"/>${bulbs.join('')}</svg></div>`;
  }
  function particles(kind, seed) {
    const r = rng(seed); const n = kind === 'stars' ? 34 : kind === 'snow' ? 40 : 18; let h = '';
    for (let i = 0; i < n; i++) {
      if (kind === 'stars') h += `<i style="--x:${(r() * 100).toFixed(1)}%;--y:${(r() * 100).toFixed(1)}%;--s:${(1 + r() * 2).toFixed(1)}px;--d:${(1.6 + r() * 3).toFixed(1)}s;--dl:-${(r() * 4).toFixed(1)}s"></i>`;
      else h += `<i style="left:${(r() * 100).toFixed(1)}%;--s:${(kind === 'snow' ? 2 + r() * 4 : 6 + r() * 6).toFixed(1)}px;--d:${(kind === 'snow' ? 6 + r() * 7 : 7 + r() * 6).toFixed(1)}s;--dl:-${(r() * 12).toFixed(1)}s;--dx:${((r() - 0.5) * 60).toFixed(0)}px"></i>`;
    }
    return `<div class="lx-layer fx lx-${kind}">${h}${kind === 'snow' ? '<svg class="lx-snowcap" viewBox="0 0 400 16" preserveAspectRatio="none"><path d="M0 0H400V7c-14 6-24-2-38 3s-22 7-36 1-26 5-40 2-20-6-36-1-26 6-40 1-22-4-38 1-24 6-40 2-22-6-38-1-24 5-40 1-20-5-34-1V0Z" fill="#fff" opacity=".95"/></svg>' : ''}</div>`;
  }
  const HOLLY = '<svg class="lx-holly X" viewBox="0 0 80 80"><path d="M10 34c6-2 10-8 9-14 5 3 10 2 13-2 0 6 4 10 9 11-5 3-6 9-3 14-6-1-11 2-12 8-3-5-9-7-14-5 2-6 0-10-2-12Z" fill="#1f8a3a" stroke="#0f5c25" stroke-width="1.5"/><path d="M34 12c5 3 11 2 14-3 1 6 6 9 12 9-4 4-4 10 0 14-6 0-10 4-11 10-4-4-10-5-14-1 0-6-4-10-9-11 4-4 5-12 8-18Z" fill="#26a046" stroke="#0f5c25" stroke-width="1.5"/><circle cx="36" cy="34" r="6" fill="#e3262f"/><circle cx="45" cy="40" r="5.4" fill="#cf1f2a"/><circle cx="33" cy="44" r="5" fill="#e3262f"/><circle cx="34.5" cy="32" r="1.6" fill="#fff" opacity=".7"/><circle cx="43.5" cy="38.4" r="1.4" fill="#fff" opacity=".6"/></svg>';
  const PUMPKIN = '<svg class="lx-pumpkin" viewBox="0 0 64 60"><path d="M30 8c0-5 4-7 7-6-3 2-3 5-2 8Z" fill="#3c6b1e"/><ellipse cx="20" cy="36" rx="14" ry="20" fill="#e8731a"/><ellipse cx="44" cy="36" rx="14" ry="20" fill="#e8731a"/><ellipse cx="32" cy="36" rx="14" ry="21" fill="#f58a24"/><path d="M32 15v42M20 17c-3 12-3 26 0 38M44 17c3 12 3 26 0 38" stroke="#c75d10" stroke-width="1.4" fill="none" opacity=".6"/><g class="glow" fill="#ffd34d"><path d="M19 30l6-6 5 7Z"/><path d="M34 31l5-7 6 6Z"/><path d="M17 41c4 6 26 6 30 0l-4 5-3-3-3 4-3-4-3 4-3-4-3 3Z"/></g></svg>';
  const BAT = '<svg viewBox="0 0 40 20"><path class="w" d="M20 8c-2-3-6-6-10-5 2 1 2 3 1 4-3-2-7-2-11 0 4 1 6 4 6 7 2-2 5-2 7 0 1-2 4-3 7-3 3 0 6 1 7 3 2-2 5-2 7 0 0-3 2-6 6-7-4-2-8-2-11 0-1-1-1-3 1-4-4-1-8 2-10 5Z" fill="#14101f"/><circle cx="20" cy="9" r="2.6" fill="#14101f"/></svg>';
  const SANTA = '<svg viewBox="0 0 100 80"><path d="M14 58C22 30 46 8 70 12c12 2 20 12 22 24-8-8-18-10-24-4-8 8-6 22-4 30Z" fill="#d81f2a"/><path d="M60 14c10-2 22 4 26 16" stroke="#a5141d" stroke-width="3" fill="none" opacity=".5"/><circle cx="91" cy="40" r="9" fill="#fff"/><circle cx="88" cy="37" r="3" fill="#e9eef5"/><rect x="6" y="52" width="66" height="20" rx="10" fill="#fff"/><g fill="#e9eef5"><circle cx="16" cy="62" r="4"/><circle cx="30" cy="64" r="4"/><circle cx="44" cy="61" r="4"/><circle cx="58" cy="64" r="4"/></g></svg>';
  const CROWN = '<svg viewBox="0 0 100 64"><path d="M8 54 4 16l22 18L50 4l24 30 22-18-4 38Z" fill="#f6c13d" stroke="#b9861b" stroke-width="3" stroke-linejoin="round"/><rect x="8" y="50" width="84" height="10" rx="3" fill="#e2a82a" stroke="#b9861b" stroke-width="2.5"/><circle cx="50" cy="34" r="6" fill="#e3263b"/><circle cx="27" cy="40" r="4.5" fill="#3aa0ff"/><circle cx="73" cy="40" r="4.5" fill="#2fd07c"/><circle cx="48" cy="32" r="1.8" fill="#fff" opacity=".7"/></svg>';
  const HALO = '<svg viewBox="0 0 100 34"><ellipse cx="50" cy="17" rx="40" ry="11" fill="none" stroke="#ffe8a3" stroke-width="7" opacity=".35"/><ellipse cx="50" cy="17" rx="40" ry="11" fill="none" stroke="#ffd95a" stroke-width="3.5"/></svg>';
  const EARS = '<svg viewBox="0 0 120 50"><path d="M6 48 16 4l30 28Z" fill="#2a2a33" stroke="#15151b" stroke-width="2" stroke-linejoin="round"/><path d="M15 40 20 16l16 15Z" fill="#ff9ec4"/><path d="M114 48 104 4 74 32Z" fill="#2a2a33" stroke="#15151b" stroke-width="2" stroke-linejoin="round"/><path d="M105 40l-5-24-16 15Z" fill="#ff9ec4"/></svg>';
  const SPARK = '<svg viewBox="0 0 20 20"><path d="M10 0c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="#fff6c9"/></svg>';

  const HEAD_FIT = { santa: { x: -0.2, y: -0.42, w: 0.9, r: -18 }, crown: { x: 0.22, y: -0.36, w: 0.56 }, halo: { x: 0.1, y: -0.26, w: 0.8 }, catears: { x: -0.06, y: -0.24, w: 1.12 } };
  function bannerHeight(card) { const b = card.querySelector('.banner'); return b ? b.offsetHeight || 120 : 120; }

  // Removes old accessories, then draws `ids` (one per slot) on the card.
  function apply(card, avatar, ids, opts = {}) {
    if (!card) return;
    ensureCSS(card.ownerDocument);
    card.querySelectorAll('.lx-layer,.lx-over,.lx-head,.lx-spark').forEach((x) => x.remove());
    const pick = {};
    for (const id of (ids || [])) { const a = BY[id]; if (a && !pick[a.slot]) pick[a.slot] = a; }
    const list = Object.values(pick);
    if (!list.length) return;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const seed = (opts.seed || 1) + 1;
    const bh = bannerHeight(card);
    const back = []; const over = [];
    for (const a of list) {
      if (a.id === 'snow' || a.id === 'sakura' || a.id === 'stars') back.push(particles(a.id, seed));
      if (a.id === 'lights') over.push(lights(card.offsetWidth || 400));
      if (a.id === 'holly') over.push(HOLLY.replace('X', 'tl') + HOLLY.replace('X', 'br'));
      if (a.id === 'pumpkin') over.push(PUMPKIN);
      if (a.id === 'candy') over.push('<div class="lx-candy"></div>');
      if (a.id === 'neon') over.push('<div class="lx-neon"></div>');
      if (a.id === 'aurora') back.push(`<div class="lx-layer" style="--bh:${bh}px"><div class="lx-aurora"></div></div>`);
      if (a.id === 'bats') { const r = rng(seed + 3); back.push(`<div class="lx-layer" style="--bh:${bh}px"><div class="lx-bats">${[0, 1, 2].map((i) => BAT.replace('<svg ', `<svg style="--y:${(14 + r() * (bh - 40)).toFixed(0)}px;--d:${(7 + r() * 5).toFixed(1)}s;--dl:-${(i * 3.1).toFixed(1)}s" `)).join('')}</div></div>`); }
    }
    if (back.length) card.insertAdjacentHTML('beforeend', back.join(''));
    if (over.length) card.insertAdjacentHTML('beforeend', `<div class="lx-over">${over.join('')}</div>`);
    const head = pick.head;
    if (head && avatar) {
      // Placed in the card (not inside the round, clipped avatar), sized and positioned from the avatar.
      const svg = { santa: SANTA, crown: CROWN, halo: HALO, catears: EARS }[head.id];
      const g = HEAD_FIT[head.id];
      const cr = card.getBoundingClientRect(); const ar = avatar.getBoundingClientRect();
      const k = cr.width && card.offsetWidth ? cr.width / card.offsetWidth : 1;
      const ax = (ar.left - cr.left) / k; const ay = (ar.top - cr.top) / k; const aw = ar.width / k;
      card.insertAdjacentHTML('beforeend', `<div class="lx-head lx-${head.id}" style="left:${(ax + aw * g.x).toFixed(1)}px;top:${(ay + aw * g.y).toFixed(1)}px;width:${(aw * g.w).toFixed(1)}px;rotate:${g.r || 0}deg">${svg}</div>`);
    }
    if (pick.name && opts.nameEl) {
      const n = opts.nameEl; if (getComputedStyle(n).position === 'static') n.style.position = 'relative';
      n.insertAdjacentHTML('beforeend', [[-14, -4, 0], [100, -8, 0.5], [92, 70, 1]].map(([x, y, d]) => `<span class="lx-spark" style="left:${x}%;top:${y}%;--dl:${d}s">${SPARK}</span>`).join(''));
    }
  }

  window.LucentAccessories = { LIST, BY, apply };
})();

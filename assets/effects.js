/* Lucent overlay effects — particles drawn over any wallpaper, reacting to the cursor.
   LucentFX.create(canvas, { type, density, color, cursor, fps }) -> { set, cursor, pause, destroy } */
(function () {
  'use strict';
  const TYPES = ['none', 'snow', 'rain', 'sparkles', 'stars', 'fireflies', 'sakura', 'bubbles', 'embers'];

  function create(canvas, opts) {
    const ctx = canvas.getContext('2d');
    let o = { type: 'none', density: 0.5, color: '#ffffff', cursor: true, fps: 60, ...opts };
    let W = 0; let H = 0; let dpr = 1; let parts = []; let raf = 0; let paused = false; let last = 0;
    const mouse = { x: -1, y: -1, active: false };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || window.innerWidth; H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    const rnd = (a, b) => a + Math.random() * (b - a);
    function spawn(initial) {
      const t = o.type;
      const p = { x: rnd(0, W), y: initial ? rnd(0, H) : -20, vx: 0, vy: 0, r: 1, a: 1, ph: rnd(0, Math.PI * 2), rot: rnd(0, 6.28), vr: rnd(-0.02, 0.02) };
      if (t === 'snow') { p.r = rnd(1, 3.6); p.vy = rnd(0.3, 1.2) * (p.r / 2); p.vx = rnd(-0.3, 0.3); p.a = rnd(0.4, 0.95); }
      else if (t === 'rain') { p.r = rnd(10, 22); p.vy = rnd(9, 15); p.vx = -1.5; p.a = rnd(0.15, 0.45); }
      else if (t === 'sparkles') { p.y = rnd(0, H); p.r = rnd(1, 2.6); p.life = 0; p.max = rnd(80, 220); p.vy = rnd(-0.3, -0.05); }
      else if (t === 'stars') { p.y = rnd(0, H); p.r = rnd(0.4, 1.8); p.vx = rnd(0.02, 0.12); p.a = rnd(0.3, 1); }
      else if (t === 'fireflies') { p.y = rnd(0, H); p.r = rnd(1.5, 3); p.vx = rnd(-0.4, 0.4); p.vy = rnd(-0.4, 0.4); }
      else if (t === 'sakura') { p.r = rnd(5, 10); p.vy = rnd(0.6, 1.4); p.vx = rnd(0.3, 1.2); p.a = rnd(0.6, 0.95); }
      else if (t === 'bubbles') { p.y = initial ? rnd(0, H) : H + 20; p.r = rnd(4, 18); p.vy = -rnd(0.3, 1.1); p.a = rnd(0.2, 0.5); }
      else if (t === 'embers') { p.y = initial ? rnd(0, H) : H + 10; p.r = rnd(1, 2.8); p.vy = -rnd(0.5, 1.8); p.vx = rnd(-0.3, 0.3); p.life = 0; p.max = rnd(200, 500); }
      return p;
    }

    function seed() {
      const base = { snow: 260, rain: 380, sparkles: 160, stars: 420, fireflies: 70, sakura: 70, bubbles: 60, embers: 140 }[o.type] || 0;
      const n = Math.round(base * Math.max(0.1, o.density * 2) * (W * H) / (1920 * 1080));
      parts = Array.from({ length: n }, () => spawn(true));
    }

    function rgb(hex) { const n = parseInt(String(hex || '#fff').replace('#', '').padEnd(6, 'f').slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      if (paused || o.type === 'none') return;
      const interval = 1000 / (o.fps || 60);
      if (ts - last < interval - 1) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      const [R, G, B] = rgb(o.color);
      const mx = mouse.x * W; const my = mouse.y * H;
      const t = o.type;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.ph += 0.02;
        if (o.cursor && mouse.active) {
          const dx = p.x - mx; const dy = p.y - my; const d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 1) {
            const f = (t === 'fireflies' ? -0.6 : 1.6) / Math.sqrt(d2);
            p.x += dx * f; p.y += dy * f;
          }
        }
        if (t === 'snow') { p.x += p.vx + Math.sin(p.ph) * 0.4; p.y += p.vy; ctx.fillStyle = `rgba(${R},${G},${B},${p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
        else if (t === 'rain') { p.x += p.vx; p.y += p.vy; ctx.strokeStyle = `rgba(${R},${G},${B},${p.a})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 1.5, p.y + p.r); ctx.stroke(); }
        else if (t === 'sparkles') {
          p.life++; p.y += p.vy; const k = Math.sin((p.life / p.max) * Math.PI); const s = p.r * (1 + k * 2.4);
          ctx.fillStyle = `rgba(${R},${G},${B},${k})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y - s * 2); ctx.quadraticCurveTo(p.x, p.y, p.x + s * 2, p.y); ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 2); ctx.quadraticCurveTo(p.x, p.y, p.x - s * 2, p.y); ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 2); ctx.fill();
          if (p.life > p.max) parts[i] = spawn(true), parts[i].life = 0;
          continue;
        }
        else if (t === 'stars') { p.x += p.vx; const k = p.a * (0.55 + 0.45 * Math.sin(p.ph * 2)); ctx.fillStyle = `rgba(${R},${G},${B},${k})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); if (p.x > W + 5) p.x = -5; continue; }
        else if (t === 'fireflies') {
          p.vx += rnd(-0.05, 0.05); p.vy += rnd(-0.05, 0.05); p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          const k = 0.5 + 0.5 * Math.sin(p.ph * 1.6);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6); g.addColorStop(0, `rgba(${R},${G},${B},${0.9 * k})`); g.addColorStop(1, `rgba(${R},${G},${B},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.283); ctx.fill(); continue;
        }
        else if (t === 'sakura') {
          p.x += p.vx + Math.sin(p.ph) * 0.6; p.y += p.vy; p.rot += p.vr * 2;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.6 + 0.4 * Math.sin(p.ph * 2));
          ctx.fillStyle = `rgba(${R},${G},${B},${p.a})`; ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.bezierCurveTo(p.r, -p.r, p.r, p.r * 0.6, 0, p.r); ctx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r, 0, -p.r); ctx.fill(); ctx.restore();
        }
        else if (t === 'bubbles') { p.y += p.vy; p.x += Math.sin(p.ph) * 0.5; ctx.strokeStyle = `rgba(${R},${G},${B},${p.a})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.stroke(); ctx.fillStyle = `rgba(${R},${G},${B},${p.a * 0.5})`; ctx.beginPath(); ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.22, 0, 6.283); ctx.fill(); if (p.y < -30) parts[i] = spawn(false); continue; }
        else if (t === 'embers') { p.life++; p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * 0.4; const k = 1 - p.life / p.max; ctx.fillStyle = `rgba(${R},${Math.round(G * 0.6)},${Math.round(B * 0.3)},${Math.max(0, k)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); if (p.life > p.max || p.y < -10) parts[i] = spawn(false); continue; }
        if (p.y > H + 30 || p.x > W + 40 || p.x < -40) parts[i] = spawn(false);
      }
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    resize();
    raf = requestAnimationFrame(frame);

    return {
      set(next) { const prevType = o.type; const prevD = o.density; o = { ...o, ...next }; if (o.type !== prevType || o.density !== prevD) seed(); if (o.type === 'none') ctx.clearRect(0, 0, W, H); },
      cursor(x, y) { mouse.x = x; mouse.y = y; mouse.active = x >= 0 && x <= 1 && y >= 0 && y <= 1; },
      pause(v) { paused = v; },
      destroy() { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); }
    };
  }

  window.LucentFX = { create, TYPES };
})();

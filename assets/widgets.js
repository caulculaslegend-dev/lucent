/* Lucent widget engine — shared by the desktop layer, the in-app editor and share pages.
   LucentWidgets.mount(layer, opts) -> controller
   opts: { widgets, screenW, screenH, editable, interactive, selectedId, accent, ctx, onChange, onSelect }
   ctx:  { media, stats, profile, weather(city, units) -> Promise, control(cmd, value), open(url), onProps(id, props) } */
(function () {
  'use strict';

  const I = {
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4.2" height="16" rx="1.4" fill="currentColor"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.4" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M4 5.5v13a1 1 0 0 0 1.55.83l9.2-6.5a1 1 0 0 0 0-1.66l-9.2-6.5A1 1 0 0 0 4 5.5Z" fill="currentColor"/><rect x="17" y="5" width="3" height="14" rx="1.2" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M20 5.5v13a1 1 0 0 1-1.55.83l-9.2-6.5a1 1 0 0 1 0-1.66l9.2-6.5A1 1 0 0 1 20 5.5Z" fill="currentColor"/><rect x="4" y="5" width="3" height="14" rx="1.2" fill="currentColor"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    'cloud-sun': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4"/><path d="M15.9 13A4 4 0 0 0 8.4 9.6"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/></svg>',
    rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 14v6M8 14v6M12 16v6"/></svg>',
    drizzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/></svg>',
    snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/></svg>',
    storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 9"/><path d="m13 12-3 5h4l-3 5"/></svg>',
    fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 17H7M17 21H9"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>'
  };

  const FONTS = {
    system: '-apple-system, "SF Pro Display", "Segoe UI", Inter, system-ui, sans-serif',
    rounded: 'ui-rounded, "SF Pro Rounded", "Nunito", -apple-system, sans-serif',
    mono: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
    serif: '"New York", ui-serif, "Iowan Old Style", Georgia, serif',
    condensed: '"Avenir Next Condensed", "Helvetica Neue", "Arial Narrow", sans-serif'
  };

  const CATALOG = {
    clock: { name: 'Clock', w: 300, h: 150, props: { mode: 'digital', seconds: false, showDate: true, label: '' } },
    date: { name: 'Date', w: 180, h: 180, props: {} },
    greeting: { name: 'Greeting', w: 460, h: 110, props: { name: '' } },
    weather: { name: 'Weather', w: 260, h: 150, props: { city: '', units: 'c' } },
    nowplaying: { name: 'Now Playing', w: 360, h: 132, props: { onlyPlaying: true, controls: true, progress: true } },
    system: { name: 'System', w: 250, h: 120, props: {} },
    battery: { name: 'Battery', w: 150, h: 150, props: {} },
    calendar: { name: 'Calendar', w: 260, h: 250, props: {} },
    notes: { name: 'Sticky note', w: 240, h: 200, props: { text: 'Double-click to edit in interact mode ✏️' } },
    todo: { name: 'To-do', w: 260, h: 240, props: { title: 'Today', items: [{ t: 'Pick a new wallpaper', done: true }, { t: 'Arrange widgets', done: false }] } },
    countdown: { name: 'Countdown', w: 260, h: 130, props: { title: 'Holidays', date: '' } },
    pomodoro: { name: 'Focus timer', w: 220, h: 160, props: { work: 25, rest: 5 } },
    photo: { name: 'Photo', w: 240, h: 240, props: { src: '', caption: '' } },
    text: { name: 'Text', w: 420, h: 100, props: { text: 'stay creative.', size: 48, weight: 700, align: 'left' } },
    links: { name: 'Quick links', w: 300, h: 90, props: { items: [{ label: 'YouTube', url: 'https://youtube.com', emoji: '▶️' }, { label: 'GitHub', url: 'https://github.com', emoji: '🐙' }, { label: 'Discord', url: 'https://discord.com/app', emoji: '💬' }] } },
    profile: { name: 'Profile card', w: 320, h: 140, props: {} }
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const fmtTime = (s) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
  const hexA = (hex, a) => {
    const m = String(hex || '#000').replace('#', '');
    const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m.padEnd(6, '0');
    const n = parseInt(v.slice(0, 6), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const pomodoro = {};   // per-widget runtime timer state

  function clockHTML(w, now) {
    let p = w.props;
    let h = now.getHours(); const m = now.getMinutes(); const s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    // No choice made: use the computer's own 12/24-hour setting.
    const h12 = p.h12 == null ? !window.LucentWidgets.sys24 : !!p.h12;
    p = { ...p, h12 };
    if (h12) h = h % 12 || 12;
    const dateLine = p.showDate ? `<div class="lw-sub">${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}</div>` : '';
    const label = p.label ? `<div class="lw-label">${esc(p.label)}</div>` : '';
    if (p.mode === 'analog') {
      const ha = ((h % 12) + m / 60) * 30; const ma = (m + s / 60) * 6; const sa = s * 6;
      const ticks = Array.from({ length: 12 }, (_, i) => `<i style="transform:rotate(${i * 30}deg)"></i>`).join('');
      return `<div class="lw-analog"><div class="lw-face">${ticks}<b class="hh" style="transform:rotate(${ha}deg)"></b><b class="mh" style="transform:rotate(${ma}deg)"></b>${p.seconds ? `<b class="sh" style="transform:rotate(${sa}deg)"></b>` : ''}<span class="dot"></span></div>${label}</div>`;
    }
    if (p.mode === 'stacked') {
      return `<div class="lw-stacked"><div>${pad(h)}</div><div class="acc">${pad(m)}</div>${dateLine}</div>`;
    }
    if (p.mode === 'minimal') {
      return `<div class="lw-minimal">${label}<div class="t">${p.h12 ? h : pad(h)}:${pad(m)}${p.h12 ? `<small>${ampm}</small>` : ''}</div>${dateLine}</div>`;
    }
    return `<div class="lw-digital">${label}<div class="t">${p.h12 ? h : pad(h)}<span class="colon">:</span>${pad(m)}${p.seconds ? `<span class="sec">${pad(s)}</span>` : ''}${p.h12 ? `<small>${ampm}</small>` : ''}</div>${dateLine}</div>`;
  }

  function mediaProgress(m) {
    if (!m || !m.duration) return 0;
    const pos = m.playing ? m.position + (Date.now() - (m.at || Date.now())) / 1000 : m.position;
    return Math.min(1, pos / m.duration);
  }

  function nowPlayingHTML(w, ctx, interactive) {
    const m = ctx.media;
    if (!m || !m.title) {
      return `<div class="lw-np empty"><div class="art ph">${I.music}</div><div class="meta"><div class="ttl">Nothing playing</div><div class="art-sub">Open Spotify or Apple Music</div>${interactive ? '<button class="lw-btn" data-act="open">Open player</button>' : ''}</div></div>`;
    }
    const prog = mediaProgress(m);
    const pos = m.duration * prog;
    const p = w.props || {};
    return `<div class="lw-np${m.playing ? ' playing' : ''}${p.controls === false ? ' no-ctl' : ''}${p.progress === false ? ' no-bar' : ''}">
      <div class="art" style="${m.art ? `background-image:url('${esc(m.art)}')` : ''}">${m.art ? '' : I.music}</div>
      <div class="meta">
        <div class="ttl">${esc(m.title)}</div>
        <div class="art-sub">${esc(m.artist)}</div>
        <div class="bar" data-act="seek"><i style="width:${(prog * 100).toFixed(2)}%"></i></div>
        <div class="row"><span class="tm">${fmtTime(pos)}</span>
          <div class="ctl"><button data-act="previous">${I.prev}</button><button class="pp" data-act="playpause">${m.playing ? I.pause : I.play}</button><button data-act="next">${I.next}</button></div>
          <span class="tm">${fmtTime(m.duration)}</span></div>
      </div>
      <div class="eq"><i></i><i></i><i></i><i></i></div>
    </div>`;
  }

  function systemHTML(ctx) {
    const s = ctx.stats || {};
    const bar = (label, v, txt) => `<div class="lw-meter"><div class="lbl"><span>${label}</span><b>${txt}</b></div><div class="track"><i style="width:${Math.max(2, v || 0)}%"></i></div></div>`;
    const b = s.battery;
    return `<div class="lw-system">${bar('CPU', s.cpu, `${s.cpu ?? '–'}%`)}${bar('Memory', s.mem, s.memUsedGB ? `${s.memUsedGB} / ${s.memTotalGB} GB` : `${s.mem ?? '–'}%`)}${b ? bar(`Battery${b.charging ? ' ⚡' : ''}`, b.level, `${b.level}%`) : ''}</div>`;
  }

  function batteryHTML(ctx) {
    const b = (ctx.stats && ctx.stats.battery) || null;
    const lvl = b ? b.level : 100;
    const C = 2 * Math.PI * 42;
    return `<div class="lw-battery${b && b.charging ? ' charging' : ''}${lvl <= 20 ? ' low' : ''}"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="bg"/><circle cx="50" cy="50" r="42" class="fg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - lvl / 100)}"/></svg><div class="v">${b ? `${lvl}<small>%</small>` : '—'}</div><div class="s">${b ? (b.charging ? `${I.bolt} Charging` : 'Battery') : 'Desktop'}</div></div>`;
  }

  function calendarHTML(now) {
    const y = now.getFullYear(); const mo = now.getMonth();
    const first = new Date(y, mo, 1).getDay(); const days = new Date(y, mo + 1, 0).getDate();
    let cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="h">${d}</span>`).join('');
    for (let i = 0; i < first; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) cells += `<span class="${d === now.getDate() ? 'today' : ''}">${d}</span>`;
    return `<div class="lw-cal"><div class="hd"><b>${MONTHS[mo]}</b><span>${y}</span></div><div class="grid">${cells}</div></div>`;
  }

  function countdownHTML(w, now) {
    const p = w.props;
    let target = p.date ? new Date(p.date) : null;
    if (!target || isNaN(target)) { target = new Date(now.getFullYear(), 11, 25); if (target < now) target = new Date(now.getFullYear() + 1, 11, 25); }
    let diff = Math.max(0, (target - now) / 1000);
    const d = Math.floor(diff / 86400); diff -= d * 86400;
    const h = Math.floor(diff / 3600); diff -= h * 3600;
    const m = Math.floor(diff / 60);
    return `<div class="lw-count"><div class="lw-label">${esc(p.title || 'Countdown')}</div><div class="nums"><div><b>${d}</b><span>days</span></div><div><b>${pad(h)}</b><span>hrs</span></div><div><b>${pad(m)}</b><span>min</span></div></div></div>`;
  }

  function pomodoroHTML(w, interactive) {
    const st = pomodoro[w.id] || (pomodoro[w.id] = { phase: 'work', left: (w.props.work || 25) * 60, running: false, last: 0 });
    if (st.running) {
      const now = Date.now(); st.left -= (now - st.last) / 1000; st.last = now;
      if (st.left <= 0) { st.phase = st.phase === 'work' ? 'rest' : 'work'; st.left = (st.phase === 'work' ? w.props.work || 25 : w.props.rest || 5) * 60; }
    }
    const total = (st.phase === 'work' ? w.props.work || 25 : w.props.rest || 5) * 60;
    return `<div class="lw-pomo ${st.phase}"><div class="lw-label">${st.phase === 'work' ? 'Focus' : 'Break'}</div><div class="t">${fmtTime(st.left)}</div><div class="track"><i style="width:${(1 - st.left / total) * 100}%"></i></div>${interactive ? `<div class="btns"><button class="lw-btn" data-act="pomo-toggle">${st.running ? 'Pause' : 'Start'}</button><button class="lw-btn ghost" data-act="pomo-reset">Reset</button></div>` : ''}</div>`;
  }

  function weatherHTML(w, ctx, node) {
    const p = w.props;
    const key = `${p.city}|${p.units}`;
    if (!node._wx || node._wxKey !== key || Date.now() - node._wxAt > 15 * 60 * 1000) {
      node._wxKey = key; node._wxAt = Date.now();
      if (ctx.weather) {
        node._wx = node._wx || { loading: true };
        Promise.resolve(ctx.weather(p.city, p.units)).then((d) => { node._wx = d || { error: 'Unavailable' }; node._paint && node._paint(true); }).catch(() => { node._wx = { error: 'Unavailable' }; });
      } else node._wx = { error: 'Weather' };
    }
    const d = node._wx || {};
    if (d.loading) return '<div class="lw-wx"><div class="lw-sub">Loading weather…</div></div>';
    if (d.error) return `<div class="lw-wx err">${I.cloud}<div class="lw-sub">${esc(d.error)}</div></div>`;
    const days = (d.days || []).slice(1, 5).map((x) => `<div><span>${DAYS[new Date(x.t + 'T12:00').getDay()].slice(0, 3)}</span>${I[x.icon] || I.cloud}<b>${x.hi}°</b></div>`).join('');
    return `<div class="lw-wx"><div class="top"><div><div class="city">${esc(d.city)}</div><div class="temp">${d.temp}°</div></div><div class="ico">${I[d.icon] || I.cloud}</div></div><div class="lw-sub">${esc(d.text)} · H ${d.hi}° L ${d.lo}°</div>${w.h >= 200 ? `<div class="days">${days}</div>` : ''}</div>`;
  }

  function profileHTML(ctx) {
    const p = ctx.profile || {};
    return `<div class="lw-prof"><div class="av" style="${p.avatarUrl ? `background-image:url('${esc(p.avatarUrl)}')` : ''}">${p.avatarUrl ? '' : esc((p.name || 'L')[0] || 'L')}</div><div><div class="nm">${esc(p.name || 'Your name')}</div><div class="un">@${esc(p.username || 'username')}</div><div class="bio">${esc(p.bio || '')}</div></div></div>`;
  }

  function greetingHTML(w, ctx, now) {
    const h = now.getHours();
    const g = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const name = w.props.name || (ctx.profile && ctx.profile.name) || '';
    return `<div class="lw-greet"><div class="g">${g}${name ? `, <span class="acc">${esc(name)}</span>` : ''}.</div><div class="lw-sub">${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}</div></div>`;
  }

  function contentHTML(w, ctx, node, interactive, now) {
    const p = w.props || {};
    switch (w.type) {
      case 'clock': return clockHTML(w, now);
      case 'date': return `<div class="lw-date"><div class="dow">${DAYS[now.getDay()]}</div><div class="num">${now.getDate()}</div><div class="mon">${MONTHS[now.getMonth()]}</div></div>`;
      case 'greeting': return greetingHTML(w, ctx, now);
      case 'weather': return weatherHTML(w, ctx, node);
      case 'nowplaying': return nowPlayingHTML(w, ctx, interactive);
      case 'system': return systemHTML(ctx);
      case 'battery': return batteryHTML(ctx);
      case 'calendar': return calendarHTML(now);
      case 'notes': return `<div class="lw-notes"><div class="txt" ${interactive ? 'contenteditable="true" data-edit="text"' : ''}>${esc(p.text || '')}</div></div>`;
      case 'todo': return `<div class="lw-todo"><div class="lw-label">${esc(p.title || 'To-do')}</div><ul>${(p.items || []).map((it, i) => `<li class="${it.done ? 'done' : ''}" data-act="todo-toggle" data-i="${i}"><span class="box">${it.done ? I.check : ''}</span><span class="t">${esc(it.t)}</span>${interactive ? `<span class="x" data-act="todo-del" data-i="${i}">×</span>` : ''}</li>`).join('')}</ul>${interactive ? '<input class="add" placeholder="Add a task and press Enter" data-edit="todo-add">' : ''}</div>`;
      case 'countdown': return countdownHTML(w, now);
      case 'pomodoro': return pomodoroHTML(w, interactive);
      case 'photo': return `<div class="lw-photo" style="${p.src ? `background-image:url('${esc(p.src)}')` : ''}">${p.src ? '' : '<span>Choose a photo in widget settings</span>'}${p.caption ? `<div class="cap">${esc(p.caption)}</div>` : ''}</div>`;
      case 'text': return textHTML(p);
      case 'links': return `<div class="lw-links">${(p.items || []).map((l) => `<a data-act="open-url" data-url="${esc(l.url)}"><span class="em">${esc(l.emoji || '🔗')}</span><span>${esc(l.label)}</span></a>`).join('')}</div>`;
      case 'profile': return profileHTML(ctx);
      default: return `<div class="lw-sub">${esc(w.type)}</div>`;
    }
  }

  // Animated text: typewriter, wave, bounce, glow, gradient, rainbow, neon, shimmer, glitch
  const TEXT_ANIMS = { none: 'None', typewriter: 'Typewriter', wave: 'Wave', bounce: 'Bounce', glow: 'Glow', gradient: 'Gradient', rainbow: 'Rainbow', neon: 'Neon', shimmer: 'Shimmer', glitch: 'Glitch' };
  function textHTML(p) {
    const anim = TEXT_ANIMS[p.anim] ? p.anim : 'none';
    const txt = String(p.text || '');
    const vars = `--c1:${esc(p.c1 || '#8b7bff')};--c2:${esc(p.c2 || '#3ee0d0')};--spd:${Math.max(0.25, Math.min(3, +p.speed || 1))}`;
    let inner = esc(txt);
    if (anim === 'typewriter' || anim === 'wave' || anim === 'bounce') {
      const chars = [...txt];
      inner = chars.map((ch, i) => (ch === '\n' ? '<br>' : `<span class="ch" style="--i:${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`)).join('') + (anim === 'typewriter' ? '<span class="caret"></span>' : '');
      return `<div class="lw-text anim-${anim}" style="font-size:${p.size || 48}px;font-weight:${p.weight || 700};text-align:${p.align || 'left'};${vars};--n:${chars.length}">${inner}</div>`;
    }
    if (anim === 'glitch') inner = `<span class="gl" data-t="${esc(txt)}">${esc(txt)}</span>`;
    return `<div class="lw-text anim-${anim}" style="font-size:${p.size || 48}px;font-weight:${p.weight || 700};text-align:${p.align || 'left'};${vars}">${inner}</div>`;
  }

  function applyStyle(node, w, accent) {
    const s = w.style || {};
    const theme = s.theme || 'glass';
    const op = s.opacity == null ? 0.55 : s.opacity;
    node.dataset.theme = theme;
    node.style.setProperty('--wbg', theme === 'solid' ? hexA(s.bg, Math.max(op, 0.85)) : theme === 'glass' ? hexA(s.bg, op) : 'transparent');
    node.style.setProperty('--wbf', theme === 'glass' ? `blur(${s.blur == null ? 22 : s.blur}px) saturate(1.6)` : 'none');
    node.style.setProperty('--wfg', s.color || '#fff');
    node.style.setProperty('--wacc', s.accent || accent || '#8b7bff');
    node.style.setProperty('--wrad', `${s.radius == null ? 22 : s.radius}px`);
    node.style.setProperty('--wfont', FONTS[s.font] || FONTS.system);
    node.classList.toggle('shadow', s.shadow !== false && theme !== 'clear');
  }

  function mount(layer, opts) {
    const state = { ...opts, widgets: (opts.widgets || []).map((w) => ({ ...w })), ctx: opts.ctx || {} };
    const nodes = new Map();
    layer.classList.add('lw-layer');
    if (state.editable) layer.classList.add('lw-editable');
    if (state.interactive) layer.classList.add('lw-interactive');
    const guides = document.createElement('div');
    guides.className = 'lw-guides';
    guides.innerHTML = '<i class="gx"></i><i class="gy"></i>';
    layer.appendChild(guides);

    const scale = () => (layer.clientWidth || state.screenW) / (state.screenW || 1440);

    function place(node, w) {
      const k = scale();
      const ss = (w.style && w.style.scale) || 1;
      node.style.left = `${w.x * layer.clientWidth}px`;
      node.style.top = `${w.y * layer.clientHeight}px`;
      node.style.width = `${w.w}px`;
      node.style.height = `${w.h}px`;
      node.style.transform = `scale(${k * ss})`;
    }

    function paint(node, w, force) {
      // Now Playing can hide itself while nothing is playing (on by default; right-click it in Edit Desktop to change).
      if (w.type === 'nowplaying') {
        const idle = (w.props || {}).onlyPlaying !== false && !(state.ctx.media && state.ctx.media.playing);
        node.classList.toggle('lw-off', idle && !state.editable);
        node.classList.toggle('lw-idle', idle && !!state.editable);
      }
      const html = contentHTML(w, state.ctx, node, state.interactive, new Date());
      if (force || node._html !== html) {
        // Keep focus inside editable widgets while typing.
        if (node.contains(document.activeElement) && document.activeElement.matches('[contenteditable], input')) return;
        node._html = html;
        node.querySelector('.lw-body').innerHTML = html;
      }
    }

    function build() {
      const ids = new Set(state.widgets.map((w) => w.id));
      for (const [id, n] of nodes) if (!ids.has(id)) { n.remove(); nodes.delete(id); }
      state.widgets.forEach((w, i) => {
        let node = nodes.get(w.id);
        if (!node) {
          node = document.createElement('div');
          node.className = `lw lw-${w.type}`;
          node.dataset.id = w.id;
          node.innerHTML = '<div class="lw-body"></div>' + (state.editable ? '<div class="lw-handle" data-resize="1"></div>' : '');
          node._paint = (f) => paint(node, state.widgets.find((x) => x.id === node.dataset.id) || w, f);
          layer.appendChild(node);
          nodes.set(w.id, node);
          requestAnimationFrame(() => node.classList.add('in'));
        }
        node.className = `lw lw-${w.type} in${state.selectedId === w.id ? ' selected' : ''}`;
        node.style.zIndex = String(10 + i);
        applyStyle(node, w, state.accent);
        place(node, w);
        paint(node, w, true);
      });
    }

    // ---- interaction (interact mode: real controls)
    layer.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]');
      const node = e.target.closest('.lw');
      if (!node) { if (state.editable && e.target === layer && state.onSelect) state.onSelect(null); return; }
      if (!act || !state.interactive) return;
      const w = state.widgets.find((x) => x.id === node.dataset.id);
      const a = act.dataset.act;
      const ctx = state.ctx;
      if (['playpause', 'next', 'previous', 'open'].includes(a)) ctx.control && ctx.control(a);
      else if (a === 'seek') { const r = act.getBoundingClientRect(); const f = (e.clientX - r.left) / r.width; if (ctx.media && ctx.media.duration) ctx.control && ctx.control('seek', f * ctx.media.duration); }
      else if (a === 'open-url') ctx.open && ctx.open(act.dataset.url);
      else if (a === 'todo-toggle' && !e.target.closest('[data-act="todo-del"]')) { const items = [...w.props.items]; items[+act.dataset.i] = { ...items[+act.dataset.i], done: !items[+act.dataset.i].done }; setProps(w, { items }); }
      else if (a === 'todo-del') { const items = w.props.items.filter((_, i) => i !== +act.dataset.i); setProps(w, { items }); }
      else if (a === 'pomo-toggle') { const st = pomodoro[w.id]; st.running = !st.running; st.last = Date.now(); node._paint(true); }
      else if (a === 'pomo-reset') { delete pomodoro[w.id]; node._paint(true); }
    });
    layer.addEventListener('keydown', (e) => {
      const ed = e.target.closest('[data-edit="todo-add"]');
      if (ed && e.key === 'Enter' && ed.value.trim()) {
        const w = state.widgets.find((x) => x.id === e.target.closest('.lw').dataset.id);
        setProps(w, { items: [...(w.props.items || []), { t: ed.value.trim(), done: false }] });
        ed.value = '';
      }
    });
    layer.addEventListener('input', (e) => {
      const ed = e.target.closest('[data-edit="text"]');
      if (!ed) return;
      const w = state.widgets.find((x) => x.id === e.target.closest('.lw').dataset.id);
      clearTimeout(ed._t); ed._t = setTimeout(() => setProps(w, { text: ed.innerText }, true), 400);
    });

    function setProps(w, patch, silentPaint) {
      w.props = { ...w.props, ...patch };
      if (!silentPaint) nodes.get(w.id)._paint(true);
      state.ctx.onProps && state.ctx.onProps(w.id, w.props);
      state.onChange && state.onChange(state.widgets);
    }

    // ---- editing (drag / resize with snapping guides)
    let drag = null;
    layer.addEventListener('pointerdown', (e) => {
      if (!state.editable) return;
      const node = e.target.closest('.lw');
      if (!node || (state.interactive && e.target.closest('[data-act],[contenteditable],input,button'))) return;
      const w = state.widgets.find((x) => x.id === node.dataset.id);
      state.onSelect && state.onSelect(w.id);
      e.preventDefault();
      node.setPointerCapture(e.pointerId);
      drag = { w, node, resize: !!e.target.dataset.resize, sx: e.clientX, sy: e.clientY, ox: w.x, oy: w.y, ow: w.w, oh: w.h };
      node.classList.add('dragging');
    });
    layer.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const { w, node } = drag;
      const k = scale() * ((w.style && w.style.scale) || 1);
      const dx = e.clientX - drag.sx; const dy = e.clientY - drag.sy;
      const LW = layer.clientWidth; const LH = layer.clientHeight;
      if (drag.resize) {
        w.w = Math.max(90, Math.round((drag.ow + dx / k) / 4) * 4);
        w.h = Math.max(60, Math.round((drag.oh + dy / k) / 4) * 4);
      } else {
        let nx = drag.ox + dx / LW; let ny = drag.oy + dy / LH;
        const bw = (w.w * k) / LW; const bh = (w.h * k) / LH;
        let gx = false; let gy = false;
        const snapX = [[0.5 - bw / 2, 0.5], [0.02, null], [0.98 - bw, null]];
        const snapY = [[0.5 - bh / 2, 0.5], [0.03, null], [0.97 - bh, null]];
        for (const [v, g] of snapX) if (Math.abs(nx - v) < 0.008) { nx = v; if (g) gx = true; }
        for (const [v, g] of snapY) if (Math.abs(ny - v) < 0.01) { ny = v; if (g) gy = true; }
        w.x = Math.min(1 - bw, Math.max(0, nx)); w.y = Math.min(1 - bh, Math.max(0, ny));
        guides.classList.toggle('x', gx); guides.classList.toggle('y', gy);
      }
      place(node, w);
      if (drag.resize) node._paint(true);
    });
    const end = () => {
      if (!drag) return;
      drag.node.classList.remove('dragging');
      guides.classList.remove('x', 'y');
      const moved = drag.w.x !== drag.ox || drag.w.y !== drag.oy || drag.w.w !== drag.ow || drag.w.h !== drag.oh;
      drag = null;
      if (moved && state.onChange) state.onChange(state.widgets);
    };
    layer.addEventListener('pointerup', end);
    layer.addEventListener('pointercancel', end);

    const ro = new ResizeObserver(() => { for (const w of state.widgets) { const n = nodes.get(w.id); if (n) place(n, w); } });
    ro.observe(layer);

    const tick = setInterval(() => {
      for (const w of state.widgets) {
        if (['clock', 'countdown', 'pomodoro', 'greeting', 'date', 'calendar', 'weather'].includes(w.type) || (w.type === 'nowplaying' && state.ctx.media && state.ctx.media.playing)) {
          const n = nodes.get(w.id); if (n) paint(n, w);
        }
      }
    }, 1000);

    build();

    return {
      update(widgets, extra) { state.widgets = (widgets || []).map((w) => ({ ...w })); if (extra) Object.assign(state, extra); build(); },
      setData(patch) {
        Object.assign(state.ctx, patch);
        for (const w of state.widgets) {
          if ((patch.media !== undefined && w.type === 'nowplaying') || (patch.stats && ['system', 'battery'].includes(w.type)) || (patch.profile && ['profile', 'greeting'].includes(w.type))) {
            const n = nodes.get(w.id); if (n) paint(n, w);
          }
        }
      },
      select(id) { state.selectedId = id; for (const [k, n] of nodes) n.classList.toggle('selected', k === id); },
      get widgets() { return state.widgets; },
      destroy() { clearInterval(tick); ro.disconnect(); layer.innerHTML = ''; nodes.clear(); }
    };
  }

  window.LucentWidgets = { TEXT_ANIMS, mount, CATALOG, FONTS, icons: I, hexA, sys24: (() => { try { const hc = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle; return hc === 'h23' || hc === 'h24'; } catch { return false; } })() };
})();

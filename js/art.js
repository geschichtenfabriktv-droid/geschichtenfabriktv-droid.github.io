/* Prozedurale Vektor-Landschaften (SVG) – Hero, Wochen-Himmel, Foto-Platzhalter, Finale */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const rng = (s) => () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);

  // Gebirgslinie als geschlossener Pfad
  function ridge(seed, w, h, base, amp, steps = 28, rough = 0.5) {
    const r = rng(seed); const pts = []; let y = base;
    for (let i = 0; i <= steps; i++) { y += (r() - 0.5) * amp * rough * 2; y = base + (y - base) * 0.82 + (r() - 0.5) * amp * (1 - rough); pts.push([(i / steps) * w, y]); }
    let d = `M0 ${h} L${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${x0 + (x1 - x0) / 2} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2} T${x1} ${y1}`; }
    return d + ` L${w} ${h} Z`;
  }
  function cloudBand(seed, w, y, amp, n) {
    const r = rng(seed); let d = `M0 ${y + 300} L0 ${y}`; const seg = w / n;
    for (let i = 0; i < n; i++) { const x = i * seg; d += ` C${x + seg * 0.25} ${y - amp * (0.4 + r())} ${x + seg * 0.75} ${y - amp * (0.4 + r())} ${x + seg} ${y + (r() - 0.5) * amp * 0.3}`; }
    return d + ` L${w} ${y + 300} Z`;
  }
  function pines(seed, w, h, count, minH, maxH, side) {
    const r = rng(seed); let d = '';
    for (let i = 0; i < count; i++) {
      const x = side === 'left' ? r() * w * 0.34 : w - r() * w * 0.3; const ph = minH + r() * (maxH - minH); const pw = ph * (0.22 + r() * 0.08);
      const base = h + 10; let y = base - ph;
      d += `M${x} ${base} L${x} ${y} `;
      for (let t = 0; t < 5; t++) { const ty = y + t * ph * 0.16, tw = pw * (0.45 + t * 0.2); d += `M${x - tw} ${ty + ph * 0.2} L${x} ${ty} L${x + tw} ${ty + ph * 0.2} Z `; }
      d += `M${x - 3} ${base} L${x - 3} ${base - ph * 0.3} L${x + 3} ${base - ph * 0.3} L${x + 3} ${base} Z `;
    }
    return d;
  }
  const el = (tag, attrs = {}, html) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };
  const mono = '<svg xmlns="http://www.w3.org/2000/svg">';

  const NUBLO = (x, s, base) => { // Roque-Nublo-artiger Monolith
    const p = (a, b) => `${x + a * s} ${base - b * s}`;
    return `M${p(-135, 0)} L${p(-98, 120)} L${p(-72, 230)} Q${p(-60, 300)} ${p(-74, 350)} L${p(-94, 420)} Q${p(-100, 485)} ${p(-70, 545)} L${p(-38, 578)} Q${p(0, 596)} ${p(34, 574)} L${p(72, 530)} Q${p(104, 480)} ${p(94, 420)} L${p(80, 360)} Q${p(62, 300)} ${p(68, 240)} L${p(98, 110)} L${p(140, 0)} Z`;
  };

  function sceneSVG({ id, w = 1600, h = 900, sky, sun, stars = 60, ridges, cloud, monolith, pine, moon }) {
    const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid slice', role: 'img', 'aria-hidden': 'true' });
    const gid = id + 'g';
    svg.innerHTML = `<defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">${sky.map(([o, c]) => `<stop offset="${o}" stop-color="${c}" class="sky-bg"/>`).join('')}</linearGradient>
      <radialGradient id="${id}s"><stop offset="0" stop-color="${sun.c}" stop-opacity=".95"/><stop offset=".25" stop-color="${sun.c}" stop-opacity=".45"/><stop offset="1" stop-color="${sun.c}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <style>.${id}d{animation:${id}d 90s linear infinite}.${id}d2{animation:${id}d 140s linear infinite reverse}@keyframes ${id}d{to{transform:translateX(-1600px)}}.tw{animation:tw 4s ease-in-out infinite}@keyframes tw{50%{opacity:.15}}.pt{animation:pt 14s ease-in-out infinite}@keyframes pt{0%,100%{transform:translateY(0);opacity:0}20%,80%{opacity:.8}50%{transform:translateY(-70px)}}</style>
    <rect width="${w}" height="${h}" fill="url(#${gid})"/>`;
    const r = rng(id.length * 77 + w);
    const g = (cls, speed) => { const e = el('g', { class: 'layer ' + cls, 'data-speed': speed }); svg.appendChild(e); return e; };
    const gs = g('l-stars', 0.02);
    for (let i = 0; i < stars; i++) gs.appendChild(el('circle', { cx: r() * w, cy: r() * h * 0.5, r: r() * 1.6 + 0.3, fill: '#fff', opacity: 0.25 + r() * 0.6, class: i % 3 ? '' : 'tw', style: `animation-delay:${r() * 4}s` }));
    if (moon) gs.appendChild(el('circle', { cx: moon.x, cy: moon.y, r: moon.r, fill: '#f3e9d2', opacity: 0.92 }));
    const gsun = g('l-sun', 0.06);
    gsun.appendChild(el('circle', { cx: sun.x, cy: sun.y, r: sun.r * 5.5, fill: `url(#${id}s)`, class: 'sun-glow' }));
    gsun.appendChild(el('circle', { cx: sun.x, cy: sun.y, r: sun.r, fill: sun.c, class: 'sun' }));
    ridges.forEach((rg, i) => { const gl = g('l-r' + i, rg.speed); gl.appendChild(el('path', { d: ridge(rg.seed, w, h + 100, rg.y, rg.amp, rg.steps || 26, rg.rough ?? 0.5), fill: rg.c, opacity: rg.o ?? 1 })); if (i === cloud.after) { const gc = el('g'); gl.appendChild(gc); }
      if (monolith && i === monolith.after) gl.appendChild(el('path', { d: NUBLO(monolith.x, monolith.s, monolith.base), fill: monolith.c })); });
    if (cloud) {
      cloud.bands.forEach((b, i) => { const gl = g('l-c' + i, b.speed); const inner = el('g', { class: i % 2 ? id + 'd2' : id + 'd' }); inner.appendChild(el('path', { d: cloudBand(b.seed, w * 2, b.y, b.amp, 14), fill: b.c, opacity: b.o })); inner.appendChild(el('path', { d: cloudBand(b.seed, w * 2, b.y, b.amp, 14), fill: `url(#${id}f)`, opacity: .6 })); gl.appendChild(inner); });
    }
    if (pine) { const gl = g('l-p', pine.speed); gl.appendChild(el('path', { d: pines(11, w, h, pine.n, pine.min, pine.max, 'left'), fill: pine.c })); gl.appendChild(el('path', { d: pines(23, w, h, Math.round(pine.n / 2), pine.min * 0.8, pine.max * 0.9, 'right'), fill: pine.c })); }
    const gp = g('l-dust', 0.12);
    for (let i = 0; i < 26; i++) gp.appendChild(el('circle', { cx: r() * w, cy: h * 0.45 + r() * h * 0.5, r: 1 + r() * 2.2, fill: sun.c, class: 'pt', style: `animation-delay:${-r() * 14}s;animation-duration:${10 + r() * 10}s`, opacity: 0 }));
    return svg;
  }

  const HERO = {
    id: 'h', sky: [[0, '#1d1b33'], [.38, '#5b3a55'], [.62, '#c4623a'], [.82, '#f0a86a'], [1, '#f6cf92']],
    sun: { x: 1020, y: 470, r: 62, c: '#ffd9a0' }, stars: 70,
    ridges: [
      { seed: 5, y: 560, amp: 70, c: '#7a4a5d', o: .75, speed: 0.1, rough: .6 },
      { seed: 9, y: 610, amp: 90, c: '#5a3548', speed: 0.18 },
      { seed: 14, y: 680, amp: 80, c: '#3b2536', speed: 0.3 },
      { seed: 21, y: 760, amp: 70, c: '#241822', speed: 0.45 }],
    cloud: { after: -1, bands: [{ seed: 3, y: 640, amp: 40, c: '#f8d9b0', o: .55, speed: 0.22 }, { seed: 8, y: 700, amp: 50, c: '#e8b58b', o: .6, speed: 0.34 }] },
    monolith: { after: 2, x: 1210, s: .95, base: 780, c: '#2a1a26' },
    pine: { n: 14, min: 220, max: 480, c: '#120d10', speed: 0.7 }
  };
  const NIGHT = {
    id: 'n', sky: [[0, '#0f0d1a'], [.5, '#2a1f38'], [.8, '#6b3a45'], [1, '#b0623e']],
    sun: { x: 400, y: 640, r: 30, c: '#f2c38a' }, stars: 120, moon: { x: 1250, y: 200, r: 34 },
    ridges: [{ seed: 31, y: 560, amp: 90, c: '#3a2638', speed: .08 }, { seed: 33, y: 650, amp: 80, c: '#241824', speed: .16 }, { seed: 35, y: 740, amp: 60, c: '#150f14', speed: .26 }],
    cloud: { after: -1, bands: [{ seed: 4, y: 700, amp: 40, c: '#8f5a63', o: .35, speed: .12 }] },
    monolith: { after: 1, x: 1080, s: .8, base: 770, c: '#1b121b' },
    pine: { n: 10, min: 200, max: 400, c: '#0b080b', speed: .4 }
  };

  const SLOTS = {
    caldera: { id: 'c1', sky: [[0, '#47345a'], [.55, '#d77b4e'], [1, '#f7d39b']], sun: { x: 900, y: 460, r: 50, c: '#ffe2b0' }, stars: 0, ridges: [{ seed: 41, y: 430, amp: 80, c: '#8b5560', o: .8, speed: 0 }, { seed: 43, y: 520, amp: 90, c: '#5d3a48', speed: 0 }, { seed: 47, y: 640, amp: 90, c: '#2f1f2c', speed: 0 }], cloud: { after: -1, bands: [{ seed: 5, y: 600, amp: 30, c: '#f6d2a6', o: .55, speed: 0 }] }, monolith: { after: 1, x: 780, s: .7, base: 560, c: '#3a2434' } },
    forest: { id: 'c2', sky: [[0, '#9fb8a7'], [1, '#e9e0c0']], sun: { x: 300, y: 260, r: 40, c: '#fff2c6' }, stars: 0, ridges: [{ seed: 51, y: 470, amp: 60, c: '#7e9a85', speed: 0 }, { seed: 53, y: 560, amp: 70, c: '#4d6b57', speed: 0 }], cloud: { after: -1, bands: [] }, pine: { n: 26, min: 280, max: 620, c: '#1f3328', speed: 0 } },
    sea: { id: 'c3', sky: [[0, '#2b5b78'], [.6, '#8fb7c9'], [1, '#f2e4c8']], sun: { x: 1100, y: 330, r: 44, c: '#fff3d0' }, stars: 0, ridges: [{ seed: 61, y: 600, amp: 70, c: '#3b5668', speed: 0 }], cloud: { after: -1, bands: [{ seed: 7, y: 520, amp: 50, c: '#ffffff', o: .85, speed: 0 }, { seed: 9, y: 590, amp: 60, c: '#eef3f5', o: .9, speed: 0 }, { seed: 11, y: 650, amp: 60, c: '#dbe6ea', o: 1, speed: 0 }] } }
  };

  function portrait(el_, k) {
    const c = k === 'portrait1' ? ['#c4623a', '#46303a'] : ['#3e5645', '#1c1612'];
    el_.innerHTML = `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="400" height="500" fill="url(#${k})"/><circle cx="270" cy="150" r="46" fill="#ffd9a0" opacity=".85"/><path d="M0 380 Q90 300 170 350 T400 310 V500 H0Z" fill="#1c1612" opacity=".5"/><path d="M0 430 Q120 360 220 410 T400 380 V500 H0Z" fill="#1c1612" opacity=".7"/></svg>`;
  }

  // Wochen-Himmel mit Tagesstimmung
  const DAYS = [
    { t: '#2b2a4a', m: '#8a5a6a', b: '#e8a46b', sx: .22, sy: .78, sc: '#ffd9a0' },
    { t: '#3d5f58', m: '#8fa98a', b: '#e9d7a5', sx: .35, sy: .55, sc: '#fff0b8' },
    { t: '#4f86a4', m: '#9ec3d1', b: '#f3e2bf', sx: .5, sy: .26, sc: '#fffbe6' },
    { t: '#302848', m: '#7a5a8a', b: '#c98a8a', sx: .5, sy: .62, sc: '#f3e9d2' },
    { t: '#6e2f3d', m: '#c4623a', b: '#f2a65a', sx: .68, sy: .5, sc: '#ffd18a' },
    { t: '#254f6d', m: '#5f93a5', b: '#efc690', sx: .78, sy: .6, sc: '#ffe5b4' },
    { t: '#4d3366', m: '#c07a7a', b: '#f7c07a', sx: .82, sy: .82, sc: '#ffd9a0' }];
  function weekSky(host) {
    host.innerHTML = `<svg viewBox="0 0 300 560" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="wk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-bg" id="wk0" stop-color="${DAYS[0].t}"/><stop offset=".6" class="sky-bg" id="wk1" stop-color="${DAYS[0].m}"/><stop offset="1" class="sky-bg" id="wk2" stop-color="${DAYS[0].b}"/></linearGradient><radialGradient id="wks"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="300" height="560" fill="url(#wk)"/><g class="sun" id="wksun" style="transform:translate(66px,436px)"><circle r="70" fill="url(#wks)"/><circle r="22" fill="${DAYS[0].sc}" id="wksunc"/></g><path d="${ridge(71, 300, 560, 390, 50, 12)}" fill="#000" opacity=".28"/><path d="${ridge(75, 300, 560, 440, 40, 12)}" fill="#000" opacity=".45"/><path d="${NUBLO(205, .22, 470)}" fill="#000" opacity=".6"/><path d="${ridge(79, 300, 560, 495, 25, 12)}" fill="#000" opacity=".8"/></svg>`;
    window.IL = window.IL || {};
    window.IL.setDay = (n) => { const d = DAYS[n - 1] || DAYS[0]; const set = (id, k, v) => { const e = host.querySelector('#' + id); e && e.setAttribute(k, v); };
      set('wk0', 'stop-color', d.t); set('wk1', 'stop-color', d.m); set('wk2', 'stop-color', d.b); set('wksunc', 'fill', d.sc);
      const s = host.querySelector('#wksun'); if (s) s.style.transform = `translate(${d.sx * 300}px,${d.sy * 560}px)`; };
  }

  function footerArt(host) {
    host.innerHTML = '';
    const svg = el('svg', { viewBox: '0 0 1600 90', preserveAspectRatio: 'none' });
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    svg.appendChild(el('path', { d: ridge(91, 1600, 90, 40, 36, 30), fill: '#1d1511' }));
    host.appendChild(svg);
  }

  function init() {
    const hero = document.getElementById('hero-art'); if (hero) { hero.appendChild(sceneSVG(HERO)); }
    const fin = document.getElementById('finale-art'); if (fin) fin.appendChild(sceneSVG(NIGHT));
    const wk = document.getElementById('week-sky'); if (wk) weekSky(wk);
    const fa = document.getElementById('footer-art'); if (fa) footerArt(fa);
    document.querySelectorAll('.ph').forEach((ph) => {
      const k = ph.dataset.art, host = ph.querySelector('.ph-art'); if (!host || host.firstChild) return;
      if (k && k.startsWith('portrait')) portrait(host, k); else if (SLOTS[k]) host.appendChild(sceneSVG({ w: 1200, h: 900, ...SLOTS[k] }));
    });
    document.dispatchEvent(new Event('art:ready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Geo – gemeinsames 3D-Landschaftsmodul (MapLibre, echte PNOA-Luftbilder + Geländemodell)
   Genutzt von: Hero-Hintergrund, 3D-Flug, Buchungsseite.  Robust: nie schwarz (Himmelsverlauf + Poster zuerst). */
(function () {
  if (/[?&]debug/.test(location.search)) { const log = (t) => { let p = document.getElementById('dbg-err'); if (!p) { p = document.createElement('pre'); p.id = 'dbg-err'; p.style.cssText = 'position:fixed;left:6px;top:80px;z-index:99999;background:#400c;color:#ffb;font:11px/1.3 monospace;padding:6px;max-width:92vw;white-space:pre-wrap;pointer-events:none'; document.body.appendChild(p); } p.textContent += t + String.fromCharCode(10); }; addEventListener('error', (e) => log('JS: ' + e.message + ' @' + String(e.filename).split('/').pop() + ':' + e.lineno)); addEventListener('unhandledrejection', (e) => log('Promise: ' + (e.reason && e.reason.message || e.reason))); }
  const IL = (window.IL = window.IL || {});
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  const ISLAND = [-15.87, 27.69, -15.33, 28.21], CORE = [-15.745, 27.915, -15.515, 28.085], HERO = [-15.665, 27.955, -15.585, 28.015];
  const STOPS = [
    { n: 'Gran Canaria', tag: 'Überblick', img: 'sea', d: 'Eine runde Vulkaninsel, in deren Mitte Tejeda liegt. Flieg mit uns hinein.', c: [-15.6, 27.97], z: 9.7, p: 48, b: 15 },
    { n: 'Tejeda', tag: 'Tag 1 · Basis', img: 'hero', d: 'Unser Standort auf rund tausend Metern, mitten in der Caldera. Hier beginnen und enden die Tage.', c: [-15.6139, 27.9974], z: 14.3, p: 73, b: 150, mk: 1 },
    { n: 'Pinar de Tamadaba', tag: 'Tag 2 · Der Wald', img: 'forest', d: 'Kanarischer Kiefernwald, wie gemacht für langsames, achtsames Gehen.', c: [-15.7245, 28.035], z: 13.9, p: 72, b: 100, mk: 1 },
    { n: 'Pico de las Nieves', tag: 'Tag 3 · Perspektive', img: 'pico', d: 'Der höchste Punkt der Insel mit weiten Blicken, ein möglicher Aussichtspunkt für unseren Perspektivtag.', c: [-15.5717, 27.9619], z: 14.1, p: 74, b: 285, mk: 1 },
    { n: 'Roque Nublo', tag: 'Tag 5 · Entscheidung', img: 'rocks', d: 'Das Wahrzeichen der Insel. Der Weg ist offiziell rund 3,2 km lang und gut machbar.', c: [-15.6127, 27.9708], z: 15.1, p: 76, b: 20, mk: 1 },
    { n: 'Roque Bentayga', tag: 'Tag 5 · Alternative', img: 'bentayga', d: 'Der zweite große Monolith, Teil der UNESCO-Kulturlandschaft „Risco Caído und die Heiligen Berge“.', c: [-15.6419, 27.9914], z: 15, p: 76, b: 260, mk: 1 },
    { n: 'Maspalomas', tag: 'Tag 6 · Integration', img: 'dunes', d: 'Dünen und Küstenblick, ein möglicher Ort für den Integrationstag.', c: [-15.595, 27.745], z: 11.6, p: 62, b: 350, mk: 1 },
    { n: 'Zurück nach Tejeda', tag: 'Tag 7 · Der Beginn', img: 'night', d: 'Am Ende der Woche beginnt der Return Path. Du nimmst die Weite mit.', c: [-15.61, 27.96], z: 10.4, p: 55, b: 330 }
  ];
  const KEYS = { // Tageszeit: [tod, rgb]
    tint: [[0, [205, 225, 255]], [0.3, [255, 255, 255]], [0.52, [255, 250, 240]], [0.7, [255, 198, 142]], [0.86, [170, 130, 200]], [1, [58, 76, 128]]],
    sky: [[0, [111, 159, 224]], [0.3, [79, 143, 224]], [0.55, [106, 151, 214]], [0.72, [123, 111, 176]], [0.88, [42, 48, 102]], [1, [12, 18, 42]]],
    hor: [[0, [240, 207, 168]], [0.3, [207, 228, 248]], [0.55, [244, 220, 182]], [0.72, [255, 179, 109]], [0.88, [212, 106, 122]], [1, [34, 50, 92]]],
    fog: [[0, [227, 211, 192]], [0.3, [219, 232, 244]], [0.55, [236, 217, 192]], [0.72, [241, 185, 138]], [0.88, [124, 90, 134]], [1, [22, 34, 66]]]
  };
  const keyAt = (arr, t) => { for (let i = 0; i < arr.length - 1; i++) if (t <= arr[i + 1][0]) { const k = clamp((t - arr[i][0]) / (arr[i + 1][0] - arr[i][0])); return arr[i][1].map((v, n) => Math.round(lerp(v, arr[i + 1][1][n], k))); } return arr[arr.length - 1][1]; };
  const rgb = (c, a) => (a === undefined ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`);
  const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');

  let lib = null;
  function load() {
    if (lib) return lib;
    lib = new Promise((ok, no) => {
      if (window.maplibregl) return ok();
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/css/maplibre-gl.css'; document.head.appendChild(l);
      const s = document.createElement('script'); s.src = '/js/vendor/maplibre-gl.js'; s.onload = ok; s.onerror = () => { lib = null; no(); }; document.head.appendChild(s);
    });
    return lib;
  }
  function webgl() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

  /* Kamera zwischen Stationen (mit „Anflug-Dip“ bei langen Strecken) */
  function camAt(u, stops) {
    stops = stops || STOPS; const n = stops.length - 1; u = clamp(u, 0, n); const i = Math.min(n - 1, Math.floor(u)); const f = u - i; const e = smoother(clamp((f - 0.16) / 0.68));
    const A = stops[i], B = stops[i + 1]; const km = Math.hypot((B.c[0] - A.c[0]) * 98, (B.c[1] - A.c[1]) * 111);
    const dip = clamp(km / 14, 0, 1) * 1.8 * Math.sin(Math.PI * e); const db = ((B.b - A.b + 540) % 360) - 180;
    return { center: [lerp(A.c[0], B.c[0], e), lerp(A.c[1], B.c[1], e)], zoom: lerp(A.z, B.z, e) - dip, pitch: lerp(A.p, B.p, e) - dip * 5, bearing: A.b + db * e };
  }
  const camOf = (i) => ({ center: STOPS[i].c, zoom: STOPS[i].z, pitch: STOPS[i].p, bearing: STOPS[i].b });

  /* Himmel-/Horizontverlauf hinter der Karte (sofort sichtbar, nie schwarz) */
  function skyBg(host, tod) {
    host.style.background = `linear-gradient(180deg,${rgb(keyAt(KEYS.sky, tod))} 0%,${rgb(keyAt(KEYS.sky, tod))} 18%,${rgb(keyAt(KEYS.hor, tod))} 52%,${rgb(keyAt(KEYS.fog, tod))} 100%)`;
  }

  function make(container, o) {
    o = o || {};
    const T = (k, ext) => `${location.origin}/tiles/${k}/{z}/{x}/{y}.${ext}`;
    const ras = (minzoom, maxzoom, bounds) => ({ type: 'raster', tiles: [T('sat', 'jpg')], tileSize: 256, minzoom, maxzoom, bounds });
    const c0 = o.cam || camAt(0);
    const m = new maplibregl.Map({
      container, center: c0.center, zoom: c0.zoom, pitch: c0.pitch, bearing: c0.bearing, maxPitch: 85, minZoom: 8, maxZoom: 17.5,
      attributionControl: false, renderWorldCopies: false, fadeDuration: 0, interactive: !!o.interactive,
      pixelRatio: Math.min(window.devicePixelRatio || 1, o.dpr || (matchMedia('(pointer:coarse)').matches ? 1.25 : 1.5)), canvasContextAttributes: { antialias: !!o.aa },
      style: {
        version: 8,
        sources: {
          dem: { type: 'raster-dem', tiles: [T('dem', 'png')], tileSize: 256, encoding: 'terrarium', minzoom: 7, maxzoom: 12, bounds: ISLAND },
          sat: ras(8, 13, ISLAND), sat2: ras(14, 15, CORE), sat3: ras(16, 16, HERO)
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': '#2f7295' } },
          { id: 'sat', type: 'raster', source: 'sat' }, { id: 'sat2', type: 'raster', source: 'sat2' }, { id: 'sat3', type: 'raster', source: 'sat3' }
        ],
        terrain: { source: 'dem', exaggeration: 1.25 }
      }
    });
    if (!o.interactive) ['dragPan', 'dragRotate', 'scrollZoom', 'touchZoomRotate', 'touchPitch', 'keyboard', 'doubleClickZoom', 'boxZoom'].forEach((h) => m[h] && m[h].disable());
    // Größe zuverlässig nachziehen (Container kann beim Erzeugen noch 0 hoch sein, z. B. in Safari/auf dem Handy)
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    const fit = () => { try { const c = m.getCanvas(); if (el && (c.clientWidth !== el.clientWidth || c.clientHeight !== el.clientHeight)) m.resize(); } catch (e) {} };
    if (window.ResizeObserver && el) new ResizeObserver(fit).observe(el);
    [0, 200, 800, 2000, 4500].forEach((t) => setTimeout(fit, t)); m.on('load', fit); m.on('idle', fit);
    return m;
  }

  /* Tageszeit auf Karte anwenden. t = { map, host, last } */
  function paintTod(t, tod, force) {
    if (!t.map) return; if (!t.styled) { if (!t.map.isStyleLoaded()) return; t.styled = true; force = true; }
    if (!force && Math.abs(tod - (t.last === undefined ? -9 : t.last)) < 0.004) return; t.last = tod; const m = t.map;
    const night = sm(0.78, 1, tod);
    try {
      ['sat', 'sat2', 'sat3'].forEach((id) => { m.setPaintProperty(id, 'raster-brightness-min', lerp(0.1, 0, night)); m.setPaintProperty(id, 'raster-brightness-max', lerp(1, 0.62, night)); m.setPaintProperty(id, 'raster-saturation', lerp(0.22, -0.25, night)); m.setPaintProperty(id, 'raster-contrast', 0.14); });
      m.setPaintProperty('bg', 'background-color', hex(keyAt([[0, [47, 114, 149]], [0.8, [40, 96, 130]], [1, [14, 34, 62]]], tod)));
      m.setSky({ 'sky-color': hex(keyAt(KEYS.sky, tod)), 'horizon-color': hex(keyAt(KEYS.hor, tod)), 'fog-color': hex(keyAt(KEYS.fog, tod)), 'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.7, 'fog-ground-blend': 0.55, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 12, 1, 16, 0.4] });
    } catch (e) {}
    if (t.host) skyBg(t.host, tod);
  }

  /* Sonne/Mond/Sterne/Tönung über der Karte (DOM) */
  function paintUI(root, tod) {
    const tint = root.querySelector('.fly-tint'), sun = root.querySelector('.fly-sun'), stars = root.querySelector('.fly-stars');
    if (tint) tint.style.background = rgb(keyAt(KEYS.tint, tod));
    if (!sun) return;
    const sx = lerp(10, 90, tod), sy = 64 - 54 * Math.sin(Math.PI * clamp(tod * 1.03));
    const vis = sm(0.02, 0.12, tod) * (1 - sm(0.84, 0.94, tod)), night = sm(0.88, 1, tod);
    sun.style.opacity = Math.max(vis, night * 0.9).toFixed(3);
    sun.style.background = night > 0.2
      ? `radial-gradient(circle at 78% 18%,rgba(215,225,255,${(0.55 * night).toFixed(2)}),rgba(190,205,255,${(0.16 * night).toFixed(2)}) 7%,transparent 18%)`
      : `radial-gradient(circle at ${sx}% ${sy}%,rgba(255,236,190,.85),rgba(255,176,96,.38) 8%,rgba(255,150,70,.12) 22%,transparent 42%)`;
    if (stars) stars.style.opacity = night.toFixed(3);
  }

  IL.geo = { ISLAND, CORE, HERO, STOPS, KEYS, keyAt, rgb, hex, load, make, webgl, camAt, camOf, skyBg, paintTod, paintUI, clamp, lerp, smoother, sm };
})();

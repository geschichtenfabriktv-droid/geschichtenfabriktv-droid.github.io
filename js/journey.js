/* Journey-Engine v3
   – WebGL-Übergänge zwischen 4K-Fotos (Nebel, Schwenk, Iris, Abstieg), bedarfsgesteuertes Rendering
   – überlappende Abschnitte (Stack), Lenis-Smooth-Scroll, Buchstaben-Choreografie, Zeilen-Reveals
   – Höhenlinien-Karte, Panorama-Schwenk, Menü, Trail, Buchungsleiste, Seitenübergang              */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IL = (window.IL = window.IL || {});
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sm = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isEditing = () => document.body.classList.contains('editing');
  let portals = [], ticks = [], lenis = null, sections = [], theme = '';
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, px: -1, py: -1 };
  let introT = 0, introStart = 0;
  const upQueue = [];

  /* ===================== WebGL ===================== */
  const VERT = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uA,uB;
uniform vec2 uRes,uSizeA,uSizeB,uMouse,uHor;
uniform float uT,uP,uIntro,uZoom,uTod;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 cover(vec2 uv,vec2 img){float rs=uRes.x/uRes.y,ri=img.x/img.y;vec2 s=rs>ri?vec2(1.,ri/rs):vec2(rs/ri,1.);return uv*s+(1.-s)*.5;}
vec3 tex(sampler2D t,vec2 size,vec2 uv){return texture2D(t,clamp(cover(uv,size),.002,.998)).rgb;}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
// geschätzte Nähe (1 = nah): unten, dunkel = nah; Himmel und diesige Ferne = weit
float estNear(sampler2D t,vec2 size,vec2 uv,float hor){
  vec3 c=tex(t,size,uv);
  vec3 s=(tex(t,size,uv+vec2(.014,0.))+tex(t,size,uv-vec2(.014,0.))+tex(t,size,uv+vec2(0.,.014))+tex(t,size,uv-vec2(0.,.014)))*.25;
  float l=lum(mix(c,s,.6));
  float ground=smoothstep(hor+.08,-.02,uv.y);
  float dark=1.-smoothstep(.12,.72,l);
  float sky=smoothstep(.52,.74,l)*smoothstep(hor-.06,hor+.1,uv.y)*smoothstep(-.02,.1,c.b-c.r+.06);
  return clamp(ground*.7+dark*.45-.1,0.,1.)*(1.-sky);
}
vec2 warp(vec2 uv,float near,float d,vec2 m){
  float s=1.+d*(.05+near*.95*d);
  return (uv-vec2(.5,.46))/s+vec2(.5,.46)+m*(.006+near*.03);
}
void main(){
  vec2 uv=vUv;vec2 m=(uMouse-.5)*-1.;float asp=uRes.x/uRes.y;
  vec2 uvz=(uv-.5)/uZoom+.5;
  float nA=estNear(uA,uSizeA,uvz,uHor.x);
  vec3 a=tex(uA,uSizeA,warp(uvz,nA,uT,m));
  vec3 col=a;float haze=0.;
  if(uP>.002){
    float nB=estNear(uB,uSizeB,uvz,uHor.y);
    float sB=1.-(1.-uP)*(.012+nB*.045);
    vec3 b=tex(uB,uSizeB,(uvz-vec2(.5,.46))/sB+vec2(.5,.46)+m*(.006+nB*.03));
    float tA=1.-nA*.75;float visA=1.-smoothstep(tA-.3,tA,uP);
    float tB=.22+nB*.78;float visB=smoothstep(tB-.34,tB,uP);
    float cov=clamp(visA+visB,0.,1.);
    haze=sin(3.14159*uP);
    vec3 fog=mix(vec3(.96,.9,.82),vec3(.78,.84,.94),.35)*(.55+.45*smoothstep(.1,.9,uTod));
    col=a*visA+b*visB+fog*(1.-cov)*(.55+.45*haze);
    col=mix(col,fog,haze*.12);
  }
  // Tageszeit: Licht und Farbe wandern mit dem Scrollen
  float l0=lum(col);
  vec3 tint;float gain;
  if(uTod<.35){float k=uTod/.35;tint=mix(vec3(.94,.98,1.06),vec3(1.),k);gain=mix(.95,1.,k);}
  else if(uTod<.7){float k=(uTod-.35)/.35;tint=mix(vec3(1.),vec3(1.15,.95,.75),k);gain=mix(1.,1.04,k);}
  else if(uTod<.88){float k=(uTod-.7)/.18;tint=mix(vec3(1.15,.95,.75),vec3(.84,.72,.96),k);gain=mix(1.04,.8,k);}
  else{float k=(uTod-.88)/.12;tint=mix(vec3(.84,.72,.96),vec3(.4,.5,.86),k);gain=mix(.8,.46,k);}
  col*=tint*gain;
  float skyish=smoothstep(.5,.75,l0)*smoothstep(.35,.65,uv.y);
  float sun=smoothstep(.02,.12,uTod)*(1.-smoothstep(.84,.94,uTod));
  vec2 sp=vec2(mix(.1,.9,uTod),.1+.5*sin(3.14159*clamp(uTod*1.04,0.,1.)));
  float dS=length((uv-sp)*vec2(asp,1.));
  col+=vec3(1.,.72,.42)*(exp(-dS*3.2)*.36+exp(-dS*12.)*.5)*sun*(.55+.45*smoothstep(.35,.75,uTod));
  float night=smoothstep(.86,1.,uTod);
  vec2 mp=vec2(.8,.8);float dM=length((uv-mp)*vec2(asp,1.));
  col+=vec3(.7,.78,1.)*(smoothstep(.034,.03,dM)*.8+exp(-dM*9.)*.25)*night;
  float st=step(.9972,hash(floor(uv*uRes/2.8)))*skyish*night;
  col+=vec3(1.)*st*(.5+.5*hash(uv*91.));
  // Grading
  float l=lum(col);
  col=mix(vec3(l),col,1.06);col=(col-.5)*1.05+.5;
  float vig=smoothstep(1.2,.3,length((uv-.5)*vec2(1.05,1.)));col*=mix(.74,1.,vig);
  col+=(hash(uv*uRes)-.5)*.02;
  col*=uIntro;
  gl_FragColor=vec4(col,1.);
}`;

  function makeGL(P) {
    const canvas = document.createElement('canvas'); canvas.className = 'pgl'; canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG); if (!vs || !fs) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['uA', 'uB', 'uRes', 'uSizeA', 'uSizeB', 'uMouse', 'uHor', 'uT', 'uP', 'uIntro', 'uZoom', 'uTod'].forEach((k) => (U[k] = gl.getUniformLocation(pr, k)));
    const tex = P.imgs.map(() => null), size = P.imgs.map(() => [1, 1]);
    const imgOf = (i) => P.imgs[i].querySelector('img');
    const api = {
      canvas,
      has: (i) => !!tex[i],
      upload(i) {
        const img = imgOf(i); if (!img || !img.complete || !img.naturalWidth) return false;
        if (!tex[i]) tex[i] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex[i]);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        size[i] = [img.naturalWidth, img.naturalHeight]; return true;
      },
      release() { tex.forEach((t, i) => { if (t) { gl.deleteTexture(t); tex[i] = null; } }); },
      draw(posSm, mouseV, intro, zoom, tod) {
        const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return false;
        const dpr = Math.min(devicePixelRatio || 1, 2, 3840 / w);
        const W = Math.round(w * dpr), H = Math.round(h * dpr);
        if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); }
        const n = P.imgs.length, i = Math.min(n - 2, Math.max(0, Math.floor(posSm))), t = clamp(posSm - i);
        if (!tex[i] || !tex[i + 1]) return false;
        const p = smoother(clamp((t - 0.38) / 0.62));
        const hor = (k) => parseFloat(P.imgs[k].dataset.hor) || 0.45;
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[i]); gl.uniform1i(U.uA, 0);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[i + 1]); gl.uniform1i(U.uB, 1);
        gl.uniform2f(U.uRes, W, H); gl.uniform2f(U.uSizeA, size[i][0], size[i][1]); gl.uniform2f(U.uSizeB, size[i + 1][0], size[i + 1][1]);
        gl.uniform2f(U.uMouse, mouseV.x, 1 - mouseV.y); gl.uniform2f(U.uHor, hor(i), hor(i + 1));
        gl.uniform1f(U.uT, t); gl.uniform1f(U.uP, p); gl.uniform1f(U.uIntro, intro); gl.uniform1f(U.uZoom, zoom); gl.uniform1f(U.uTod, tod);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); return true;
      }
    };
    P.imgs.forEach((f, i) => { const img = imgOf(i); if (img) img.addEventListener('load', () => { if (P.res && api.upload(i)) P.dirty = true; }); });
    P.stage.insertBefore(canvas, P.stage.firstChild);
    return api;
  }

  /* ===================== Setup ===================== */
  function setup() {
    portals = $$('[data-portal]').map((el) => {
      const P = {
        el, stage: $('.portal-stage', el), sticky: $('.portal-sticky', el), imgs: $$('.pimg', el), types: (el.dataset.types || '0,1,2,3').split(',').map(Number),
        pts: $$('.pt', el).map((p) => { const [a, b] = p.dataset.show.split(',').map(Number); return { p, a, b, letters: $$('.ch>span', p), desc: $(':scope > span', p) }; }),
        tod0: (el.dataset.tod || '0.3,0.5').split(',').map(Number), tod: 0.3, scrubs: $$('.scrub', el), prog: 0, pos: 0, posSm: 0, vis: false, near: false, res: false, active: false, dirty: true, over: el.classList.contains('over')
      };
      if (!reduce && !el.hasAttribute('data-nogl')) { P.gl = makeGL(P); if (P.gl) el.classList.add('gl'); }
      if (el.id === 'kapitel') { const w = P.pts.filter((o) => o.p.classList.contains('pword')); const c = document.createElement('div'); c.className = 'pdots'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = w.map(() => '<i></i>').join(''); P.sticky.appendChild(c); P.dots = [...c.children]; }
      return P;
    });
    sections = $$('main>section');
    buildGraphics(); initFly(); buildTrail(); initMenu(); initLenis();
    IL.update = update; update();
    requestAnimationFrame(loop);
  }
  IL.refresh = () => { portals.forEach((P) => P.pts.forEach((o) => { o.letters = $$('.ch>span', o.p); })); update(); };

  function activate(P) {
    if (P.active) return; P.active = true;
    P.imgs.forEach((f) => { const im = $('img', f); if (im && im.dataset.srcset) { im.srcset = im.dataset.srcset; im.src = im.dataset.src; delete im.dataset.srcset; } });
  }

  /* ===================== Lenis ===================== */
  function initLenis() {
    if (lenis || reduce || typeof Lenis === 'undefined' || isEditing() || matchMedia('(pointer:coarse)').matches) return;
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    IL.lenis = lenis; document.documentElement.classList.add('lenis');
  }
  IL.motionOff = () => { portals.forEach(activate); if (lenis) { lenis.destroy(); lenis = null; IL.lenis = null; document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling'); } };
  IL.motionOn = () => { initLenis(); IL.lines && IL.lines(); update(); };
  IL.scrollTo = (target, opts = {}) => {
    const el = typeof target === 'string' ? $(target) : target; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: opts.offset || 0, duration: opts.duration || 2.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ===================== Frame-Loop (rendert nur bei Änderung) ===================== */
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (lenis) lenis.raf(now);
    mouse.x = lerp(mouse.x, mouse.tx, 0.06); mouse.y = lerp(mouse.y, mouse.ty, 0.06);
    const mMoved = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py) > 0.0006;
    if (introStart) introT = clamp((now - introStart) / 2800);
    const introRun = introStart && introT < 1;
    const intro = introStart ? smoother(clamp(introT * 1.6)) : 0;
    const zoomIn = 1 + (1 - smoother(introT)) * 0.3;
    if (!isEditing()) {
      if (upQueue.length) { const [P, i] = upQueue.shift(); if (P.gl && !P.gl.has(i) && P.gl.upload(i)) P.dirty = true; }
      portals.forEach((P) => {
        if (!P.gl) return;
        if (P.near && !P.res && !P.queued) { P.queued = true; P.imgs.forEach((_, i) => upQueue.push([P, i])); P.res = true; }
        if (P.far && P.res) { P.gl.release(); P.res = false; P.queued = false; P.drawn = false; P.el.classList.remove('gl-ready'); }
        if (!P.vis) return;
        P.posSm = lerp(P.posSm, P.pos, 1 - Math.pow(0.0009, dt));
        const moving = Math.abs(P.posSm - P.pos) > 0.0004;
        const first = P.el.hasAttribute('data-intro');
        if (moving || mMoved || P.dirty || (first && introRun)) {
          if (P.gl.draw(P.posSm, mouse, first ? intro : 1, (first ? zoomIn : 1) * 1.04, P.tod)) { P.dirty = false; if (!P.drawn) { P.drawn = true; P.el.classList.add('gl-ready'); } }
        }
      });
    }
    mouse.px = mouse.x; mouse.py = mouse.y;
    flyFrame(dt, now);
    requestAnimationFrame(loop);
  }
  IL.introStart = () => { introStart = performance.now(); portals.forEach((P) => (P.dirty = true)); };

  /* ===================== Update (Scroll) ===================== */
  function update() {
    const vh = innerHeight;
    if (isEditing()) return;
    portals.forEach((P) => {
      const r = P.el.getBoundingClientRect();
      const dist = r.top > vh ? r.top - vh : r.bottom < 0 ? -r.bottom : 0;
      P.vis = dist === 0; P.near = dist < vh * 2.6; P.far = dist > vh * 4;
      if (P.near) activate(P);
      if (!P.vis) return;
      const total = Math.max(1, P.el.offsetHeight - (P.over ? vh * 2.3 : vh));
      const prog = clamp(-r.top / total); P.prog = prog;
      P.pos = prog * (P.imgs.length - 1); P.tod = lerp(P.tod0[0], P.tod0[1], prog);
      if (P.imgs.length > 1 && (!P.gl || !P.drawn)) domFallback(P, prog);
      if (P.over && P.el.nextElementSibling) { const nt = P.el.nextElementSibling.getBoundingClientRect().top; P.sticky.style.setProperty('--c', clamp((vh - nt) / vh).toFixed(3)); }
      P.pts.forEach((o) => textStep(o, prog)); dotsUpdate(P);
      P.scrubs.forEach((m) => {
        const [a, b] = (m.dataset.range || '0,1').split(',').map(Number); const k = clamp((prog - a) / (b - a));
        const ws = $$('.sw', m); const nn = Math.round(k * ws.length); ws.forEach((w, x) => w.classList.toggle('on', x < nn));
      });
    });
    $$('.ph:not(.pimg) img').forEach((im) => {
      const f = im.parentElement; const b = f.getBoundingClientRect(); if (b.bottom < -80 || b.top > vh + 80) return;
      const q = (b.top + b.height / 2 - vh / 2) / (vh / 2 + b.height / 2);
      im.style.translate = `0 ${(q * -6).toFixed(2)}%`;
    });
    $$('[data-parallax]').forEach((img) => {
      const box = img.parentElement.getBoundingClientRect(); if (box.bottom < 0 || box.top > vh) return;
      const q = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2);
      img.style.transform = `translate3d(0,${(q * -9).toFixed(2)}%,0) scale(1.2)`;
    });
    $$('[data-float]').forEach((el) => {
      const b = el.getBoundingClientRect(); if (b.bottom < -200 || b.top > vh + 200) return;
      const q = (b.top + b.height / 2 - vh / 2) / vh; el.style.translate = `0 ${(q * -parseFloat(el.dataset.float)).toFixed(1)}px`;
    });
    $$('[data-floatx]').forEach((el) => {
      const b = el.parentElement.getBoundingClientRect(); if (b.bottom < -200 || b.top > vh + 200) return;
      const q = (b.top + b.height / 2 - vh / 2) / vh; el.style.translate = `${(q * parseFloat(el.dataset.floatx)).toFixed(1)}px 0`;
    });
    const mid = vh * 0.5; let th = 'ink';
    for (const s of sections) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { th = s.hasAttribute('data-portal') || s.hasAttribute('data-fly') ? 'ink' : (s.dataset.theme || 'light'); break; } }
    if (th !== theme) { theme = th; document.body.dataset.theme = th; }
    flyUpdate(vh); trailUpdate(); stickyUpdate(vh);
  }

  function textStep({ p, a, b, letters, desc }, prog) {
    if (p.classList.contains('pword')) {
      const A = a < 0 ? -0.2 : a, B = b > 1 ? 1.2 : b; const local = (prog - A) / (B - A);
      const vis = local > -0.02 && local < 1.02;
      p.style.visibility = vis ? 'visible' : 'hidden'; p.style.opacity = vis ? 1 : 0; p.style.pointerEvents = 'none';
      if (!vis) return;
      letters.forEach((ch, i) => {
        const tin = a < 0 ? 1 : clamp((local - i * 0.014) / 0.2), tout = b > 1 ? 0 : clamp((local - 0.78 - i * 0.012) / 0.2);
        const e = smoother(tin), x = smoother(tout);
        ch.style.opacity = (e * (1 - x)).toFixed(3);
        ch.style.transform = `translate3d(0,${((1 - e) * 46 - x * 46).toFixed(1)}%,0)`;
      });
      const bEl = $('b', p); if (bEl) bEl.style.transform = `translate3d(${((local - 0.5) * -5).toFixed(2)}vw,0,0)`;
      if (desc) { const o = a < 0 ? 1 - sm(0.82, 0.96, local) : sm(0.1, 0.26, local) * (1 - sm(0.82, 0.96, local)); desc.style.opacity = o.toFixed(3); desc.style.transform = `translate3d(0,${((1 - o) * 22).toFixed(1)}px,0)`; }
      return;
    }
    const vin = sm(a, a + 0.04, prog), vout = 1 - sm(b - 0.04, b, prog);
    const o = a < 0 ? vout : vin * vout;
    p.style.opacity = o.toFixed(3); p.style.visibility = o < 0.01 ? 'hidden' : 'visible'; p.style.pointerEvents = o < 0.5 ? 'none' : '';
    p.style.transform = `translate3d(0,${((1 - vin) * 40 - (1 - vout) * 40).toFixed(1)}px,0)`;
  }
  function dotsUpdate(P) {
    if (!P.dots) return; const words = P.pts.filter((o) => o.p.classList.contains('pword'));
    let act = -1; words.forEach((o, i) => { const A = o.a < 0 ? -0.2 : o.a, B = o.b > 1 ? 1.2 : o.b; if (P.prog >= A && P.prog < B) act = i; });
    P.dots.forEach((d, i) => d.classList.toggle('on', i === act));
  }
  function domFallback(P, prog) { // ohne WebGL: ruhige Überblendung
    const n = P.imgs.length, pos = prog * (n - 1), i = Math.min(n - 2, Math.floor(pos)), t = pos - i; const e = smoother(clamp((t - 0.1) / 0.8));
    P.imgs.forEach((img, j) => {
      let o = 0, s = 1; if (j === i) { s = 1 + e * 0.12; o = 1 - sm(0.3, 1, e); } else if (j === i + 1) { s = 1.08 - 0.08 * e; o = sm(0, 0.7, e); }
      img.style.zIndex = n - j; img.style.opacity = o; img.style.visibility = o < 0.005 ? 'hidden' : 'visible'; img.style.transform = `scale(${s.toFixed(3)})`;
    });
  }

  /* ===================== Zeilen für Überschriften ===================== */
  IL.lines = () => {
    $$('.split').forEach((h) => { let top = null, idx = -1; $$('.w', h).forEach((w) => { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 6) { idx++; top = t; } if (w.firstChild) w.firstChild.style.setProperty('--i', idx); }); });
  };
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (!isEditing()) IL.lines(); }, 180); });

  /* ===================== Trail ===================== */
  function buildTrail() {
    const trail = $('#trail'); if (!trail) return;
    $$('.trail-tick', trail).forEach((t) => t.remove());
    const H = document.documentElement.scrollHeight;
    ticks = $$('[data-chapter]').filter((s) => s.id).map((s) => {
      const a = document.createElement('a'); a.className = 'trail-tick'; a.href = '#' + s.id; a.dataset.label = s.dataset.chapter;
      a.style.top = clamp((s.getBoundingClientRect().top + scrollY) / Math.max(1, H - innerHeight / 2), 0, 1) * 100 + '%';
      a.addEventListener('click', (e) => { e.preventDefault(); IL.scrollTo('#' + s.id); });
      trail.appendChild(a); return { a, s };
    });
  }
  function trailUpdate() {
    const dot = $('#trail-dot'); if (!dot) return;
    const H = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const g = clamp(scrollY / H);
    dot.style.top = g * 100 + '%';
    const stops = [[0, [255, 236, 170]], [0.3, [255, 246, 205]], [0.62, [255, 168, 88]], [0.84, [226, 120, 150]], [1, [205, 216, 255]]];
    let c = stops[stops.length - 1][1];
    for (let i = 0; i < stops.length - 1; i++) if (g >= stops[i][0] && g <= stops[i + 1][0]) { const k = (g - stops[i][0]) / (stops[i + 1][0] - stops[i][0]); c = stops[i][1].map((v, n) => Math.round(lerp(v, stops[i + 1][1][n], k))); }
    const col = `rgb(${c[0]},${c[1]},${c[2]})`;
    dot.style.background = `radial-gradient(circle,#fff 0 30%,${col} 58%,rgba(${c[0]},${c[1]},${c[2]},0) 74%)`;
    dot.style.boxShadow = `0 0 ${g > 0.9 ? 10 : 18}px ${g > 0.9 ? 3 : 6}px rgba(${c[0]},${c[1]},${c[2]},${g > 0.9 ? 0.35 : 0.5})`;
    document.body.classList.toggle('trail-on', scrollY > innerHeight * 0.6);
  }

  /* ===================== Menü ===================== */
  function initMenu() {
    const btn = $('#menu-btn'), menu = $('#menu'); if (!btn || !menu) return;
    const set = (o) => { document.body.classList.toggle('menu-open', o); btn.setAttribute('aria-expanded', o); menu.setAttribute('aria-hidden', !o); if (lenis) o ? lenis.stop() : lenis.start(); };
    btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    $$('.menu-links a', menu).forEach((a) => {
      a.addEventListener('mouseenter', () => { $$('.menu-pre img', menu).forEach((im) => im.classList.toggle('on', im.dataset.pv === a.dataset.pv)); });
      a.addEventListener('click', (e) => {
        const h = a.getAttribute('href');
        if (h.startsWith('/#') && (location.pathname === '/' || location.pathname.endsWith('index.html'))) { e.preventDefault(); set(false); setTimeout(() => IL.scrollTo(h.slice(1)), 250); } else set(false);
      });
    });
    IL.closeMenu = () => set(false);
  }

  /* ===================== Woche ===================== */
  IL.setDay = (n) => { $$('#week-sky img').forEach((im) => im.classList.toggle('on', +im.dataset.d === n)); };

  /* ===================== Höhenlinien (Karte & Hintergründe) ===================== */
  const hash2 = (x, y, s) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const vnoise = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return lerp(lerp(hash2(xi, yi, s), hash2(xi + 1, yi, s), u), lerp(hash2(xi, yi + 1, s), hash2(xi + 1, yi + 1, s), u), v); };
  const fbm2 = (x, y, s) => { let a = 0.5, f = 0; for (let i = 0; i < 4; i++) { f += a * vnoise(x, y, s + i); x = x * 2.03 + 17; y = y * 2.03 + 9; a *= 0.5; } return f; };
  function contours(field, w, h, step, levels) {
    const nx = Math.ceil(w / step) + 1, ny = Math.ceil(h / step) + 1, F = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) F[j * nx + i] = field(i * step, j * step);
    return levels.map((L) => {
      let d = '';
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = F[j * nx + i], b = F[j * nx + i + 1], c = F[(j + 1) * nx + i + 1], dd = F[(j + 1) * nx + i];
        const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (dd > L ? 1 : 0); if (idx === 0 || idx === 15) continue;
        const x = i * step, y = j * step, t = (p, q) => (L - p) / (q - p);
        const top = [x + step * t(a, b), y], right = [x + step, y + step * t(b, c)], bottom = [x + step * t(dd, c), y + step], left = [x, y + step * t(a, dd)];
        const seg = (p, q) => { d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
        switch (idx) { case 1: case 14: seg(left, bottom); break; case 2: case 13: seg(bottom, right); break; case 3: case 12: seg(left, right); break; case 4: case 11: seg(top, right); break; case 5: seg(top, left); seg(bottom, right); break; case 6: case 9: seg(top, bottom); break; case 7: case 8: seg(top, left); break; case 10: seg(top, right); seg(left, bottom); break; }
      }
      return d;
    });
  }
  function buildTopoBg(host, seed) {
    const W = 1200, H = 800, off = seed * 37;
    const field = (x, y) => fbm2(x * 0.0042 + off, y * 0.0048 + off * 0.5, seed) * 1.15 - 0.05;
    const lv = [0.18, 0.26, 0.34, 0.42, 0.5, 0.58, 0.66, 0.74];
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">${contours(field, W, H, 12, lv).map((d) => `<path class="lv" d="${d}"/>`).join('')}</svg>`;
  }
  function initRP() {
    const rp = $('.rp'); if (!rp) return; const tip = $('#rp-tip'); if (!tip) return;
    const show = (b) => { $$('.d.sel', rp).forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); $('b', tip).textContent = b.dataset.h; $('span', tip).textContent = b.dataset.b; };
    rp.addEventListener('mouseover', (e) => { const b = e.target.closest('button.d'); if (b) show(b); });
    rp.addEventListener('focusin', (e) => { const b = e.target.closest('button.d'); if (b) show(b); });
    rp.addEventListener('click', (e) => { const b = e.target.closest('button.d'); if (b) show(b); });
  }
  function buildGraphics() {
    initRP();
    $$('[data-topo]').forEach((s) => { const b = $('.topo-bg', s); if (b && !b.firstChild) buildTopoBg(b, +s.dataset.topo || 3); });
  }


  /* ===================== 3D-Flug + Hero-Flug (gemeinsames Modul: geo.js) ===================== */
  const G = IL.geo, STOPS = G.STOPS;
  let fly = null, hero = null;

  function initFly() {
    initHero();
    const el = $('[data-fly]'); if (!el || !G) return;
    const stage = $('.fly-map', el).parentElement;
    const poster = document.createElement('div'); poster.className = 'fly-poster'; poster.setAttribute('aria-hidden', 'true'); $('.fly-map', el).after(poster);
    fly = { el, sticky: $('.fly-sticky', el), poster, u: 0, uSm: 0, s: 0, idx: -1, ready: false, explore: false, vis: false, near: false, t: { map: null, host: $('.fly-sticky', el), styled: false } };
    const chips = $('#fly-chips');
    chips.innerHTML = STOPS.map((s, i) => `<button type="button" data-i="${i}">${s.n}</button>`).join('');
    chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) goStop(+b.dataset.i); });
    $('#fly-explore').addEventListener('click', toggleExplore);
    $('#fly-zin').addEventListener('click', () => fly.map && fly.map.zoomBy(0.8, { duration: 500 }));
    $('#fly-zout').addEventListener('click', () => fly.map && fly.map.zoomBy(-0.8, { duration: 500 }));
    G.skyBg(fly.sticky, 0.1); G.paintUI(el, 0.1);
    showStop(0, true);
  }
  function goStop(i) {
    if (!fly) return;
    if (fly.explore && fly.map) { fly.map.flyTo({ ...G.camOf(i), duration: 3400, essential: true, curve: 1.5 }); showStop(i); return; }
    const n = STOPS.length - 1, vh = innerHeight, y = fly.el.offsetTop + (i / n) * (fly.el.offsetHeight - vh);
    if (lenis) lenis.scrollTo(y, { duration: 3.2, easing: (t) => 1 - Math.pow(1 - t, 3) }); else scrollTo({ top: y, behavior: 'smooth' });
  }
  function showStop(i, instant) {
    if (!fly || fly.idx === i) return; fly.idx = i; const s = STOPS[i]; const card = $('#fly-card');
    $$('#fly-chips button').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    $$('.mkr', fly.el).forEach((m) => m.classList.toggle('on', +m.dataset.i === i));
    fly.poster.style.backgroundImage = `url(/img/photos/${s.img}-l.jpg)`;
    const apply = () => { $('#fly-card-img').src = `/img/photos/${s.img}-m.jpg`; $('#fly-card-tag').textContent = s.tag; $('#fly-card-name').textContent = s.n; $('#fly-card-text').textContent = s.d; card.classList.remove('swap'); };
    if (instant) apply(); else { card.classList.add('swap'); setTimeout(apply, 240); }
  }
  function toggleExplore() {
    if (!fly.map) return; fly.explore = !fly.explore; const m = fly.map, on = fly.explore;
    ['dragPan', 'dragRotate', 'touchZoomRotate', 'touchPitch', 'keyboard', 'doubleClickZoom'].forEach((h) => m[h][on ? 'enable' : 'disable']());
    $('#fly-explore').setAttribute('aria-pressed', on); $('#fly-explore').textContent = on ? 'Zurück zum Flug' : 'Selbst steuern';
    $('#fly-zin').hidden = $('#fly-zout').hidden = !on; fly.el.classList.toggle('exploring', on);
    if (!on) { fly.lastU = -1; }
  }
  function createMap() {
    if (!G.webgl()) { fly.el.classList.add('nofly'); return; }
    let m; try { m = G.make('fly-map', {}); } catch (e) { fly.el.classList.add('nofly'); return; }
    fly.map = m; fly.t.map = m;
    m.once('style.load', () => { fly.t.styled = true; fly.ready = true; fly.lastU = -1; G.paintTod(fly.t, 0.1, true); });
    const reveal = () => fly.poster.classList.add('off');
    m.once('idle', reveal); m.once('load', () => setTimeout(reveal, 2500));
    m.getCanvas().addEventListener('webglcontextlost', () => fly.poster.classList.remove('off'));
    m.on('load', () => {
      STOPS.forEach((s, i) => {
        if (!s.mk) return; const e = document.createElement('div'); e.className = 'mkr'; e.dataset.i = i; e.innerHTML = `<span>${s.n}</span><i></i>`;
        e.addEventListener('click', () => goStop(i)); new maplibregl.Marker({ element: e, anchor: 'bottom' }).setLngLat(s.c).addTo(m);
      });
      showStop(fly.idx, true);
    });
    m.on('error', (e) => { if (e && e.error && !/404|Failed to fetch|AJAXError/.test(String(e.error.message || e.error))) console.warn('[3D]', e.error.message || e.error); });
  }
  function flyUpdate(vh) {
    heroUpdate(vh);
    if (!fly) return; const r = fly.el.getBoundingClientRect();
    const dist = r.top > vh ? r.top - vh : r.bottom < 0 ? -r.bottom : 0; fly.vis = dist === 0; fly.near = dist < vh * 2.2;
    if (fly.near && !fly.map && !fly.loading) { fly.loading = true; G.load().then(createMap).catch(() => { fly.el.classList.add('nofly'); }); }
    if (!fly.vis) return;
    const total = Math.max(1, fly.el.offsetHeight - vh); fly.s = clamp(-r.top / total); fly.u = fly.s * (STOPS.length - 1);
    const bar = $('.fly-bar i', fly.el); if (bar) bar.style.transform = `scaleX(${fly.s.toFixed(4)})`;
  }
  function flyFrame(dt, now) {
    heroFrame(dt, now);
    if (fly && fly.map && !fly.ready && fly.map.isStyleLoaded()) { fly.ready = true; fly.lastU = -1; }
    if (!fly || !fly.ready || !fly.vis || isEditing()) return;
    if (fly.explore) return;
    fly.uSm = lerp(fly.uSm, fly.u, 1 - Math.pow(0.0008, dt));
    if (Math.abs(fly.uSm - (fly.lastU === undefined ? -9 : fly.lastU)) > 0.0006) {
      fly.map.jumpTo(G.camAt(fly.uSm)); fly.lastU = fly.uSm;
      showStop(Math.round(fly.uSm));
      const tod = 0.1 + 0.9 * clamp(fly.uSm / (STOPS.length - 1)); G.paintTod(fly.t, tod); G.paintUI(fly.el, tod);
    }
  }

  /* Hero: Der Flug läuft als Hintergrund – langsamer Gleitflug Tejeda ⇄ Roque Nublo, Licht wandert mit */
  const DBG = /[?&]debug/.test(location.search); let dbgEl = null;
  function dbg(k, v) { if (!DBG) return; if (!dbgEl) { dbgEl = document.createElement('pre'); dbgEl.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;background:#000c;color:#9f9;font:11px/1.4 monospace;padding:8px;max-width:90vw;white-space:pre-wrap;pointer-events:none'; dbgEl.__s = {}; document.body.appendChild(dbgEl); } dbgEl.__s[k] = v; dbgEl.textContent = Object.entries(dbgEl.__s).map(([a, b]) => a + ': ' + b).join(String.fromCharCode(10)); }
  function initHero() {
    const P = portals.find((p) => p.el.id === 'hero'); if (!P || !G || !G.webgl()) { console.warn('[Hero-Flug] nicht gestartet', { portal: !!P, geo: !!G, webgl: G && G.webgl() }); return; }
    const host = document.createElement('div'); host.className = 'hero-map'; host.setAttribute('data-noedit', ''); host.setAttribute('aria-hidden', 'true');
    host.innerHTML = '<div class="hm-in"><div class="hm-map"></div><div class="fly-tint"></div><div class="fly-sun"></div></div><div class="hm-shade"></div>';
    P.stage.insertBefore(host, $('.pgrade', P.stage));
    hero = { P, host, inn: $('.hm-in', host), box: $('.hm-map', host), map: null, loading: false, shown: false, o: 1, last: 0, t0: 0, u: 0, uSm: 0, t: { map: null, host: $('.hm-in', host), styled: false } };
    G.skyBg(hero.inn, 0.12);
    hero.ready = true; IL.heroDebug = () => hero; heroUpdate(innerHeight); setTimeout(() => heroUpdate(innerHeight), 600);
  }
  function heroUpdate(vh) {
    if (!hero || !hero.ready) return; const P = hero.P;
    if (P.vis) { hero.o = 1; hero.u = P.prog; hero.host.style.opacity = hero.o.toFixed(3); }
    if (isEditing()) return;
    if (P.far && hero.map) { try { hero.map.remove(); } catch (e) {} hero.map = null; hero.t.map = null; hero.t.styled = false; hero.shown = false; hero.loading = false; hero.inn.classList.remove('on'); return; }
    if ((P.near || P.vis || P.prog === 0) && !hero.map && !hero.loading) { hero.loading = true; G.load().then(heroCreate).catch(() => { hero.loading = false; }); }
  }
  function heroCreate() {
    if (hero.map) { hero.loading = false; return; }
    let m; try { m = G.make(hero.box, { cam: G.camAt(0, HS), aa: false, dpr: 1.25 }); } catch (e) { console.warn('[Hero-Flug]', e); hero.loading = false; return; }
    hero.map = m; hero.t.map = m; hero.t0 = performance.now() / 1000;
    m.once('style.load', () => { hero.t.styled = true; G.paintTod(hero.t, 0.12, true); G.paintUI(hero.host, 0.12); });
    const reveal = () => { if (hero.shown) return; hero.shown = true; hero.inn.classList.add('on'); };
    m.once('idle', reveal); m.once('load', () => setTimeout(reveal, 1200)); setTimeout(reveal, 9000);
    m.on('error', (e) => { console.warn('[Hero-Flug]', e && e.error && e.error.message); dbg('hero-error', String(e && e.error && e.error.message).slice(0, 160)); });
    dbg('hero', 'map erstellt'); m.once('style.load', () => dbg('hero', 'style.load')); m.once('load', () => dbg('hero', 'load')); m.once('idle', () => dbg('hero', 'idle'));
  }
  /* Hero-Route: Anflug über die Caldera, dann Tejeda → Roque Nublo → Roque Bentayga – gesteuert vom Scrollen */
  const HS = [{ c: [-15.6139, 27.9974], z: 12.3, p: 60, b: 160 }, STOPS[1], STOPS[4], STOPS[5]];
  function heroFrame(dt, now) {
    if (!hero || !hero.map || hero.o < 0.02 || isEditing()) return;
    hero.uSm = lerp(hero.uSm, hero.u, 1 - Math.pow(0.0008, dt));
    if (now - hero.last < 28) return; hero.last = now; const sec = now / 1000;
    const c = G.camAt(clamp(hero.uSm) * (HS.length - 1), HS);
    c.bearing += Math.sin(sec * 0.13) * 2.2 + (mouse.x - 0.5) * 6; c.pitch = Math.min(80, c.pitch + Math.sin(sec * 0.17) * 0.8);
    if (!hero.t.styled) G.paintTod(hero.t, 0.1, true);
    hero.map.jumpTo(c); const tod = 0.1 + 0.3 * clamp(hero.uSm); G.paintTod(hero.t, tod); G.paintUI(hero.host, tod);
  }
  IL.flyDebug = () => fly;
  addEventListener('resize', () => { if (fly && fly.map) fly.map.resize(); });

  /* ===================== Sticky-Buchungsleiste ===================== */
  function stickyUpdate(vh) {
    const sc = $('#sticky-cta'); if (!sc) return;
    const blick = $('#blick'), bk = $('#buchen'), fin = $('#finale');
    let show = blick ? blick.getBoundingClientRect().top < vh * 0.55 : false;
    const inR = (el, a = 0.7, b = 0.15) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < vh * a && r.bottom > vh * b; };
    const fl = $('#flug'); if (inR(bk) || inR(fl, 0.85, 0.2) || (fin && fin.getBoundingClientRect().top < vh * 0.4) || document.body.classList.contains('menu-open')) show = false;
    sc.classList.toggle('show', show); sc.setAttribute('aria-hidden', !show);
  }

  /* ===================== Seitenübergang (Bogen-Vorhang) ===================== */
  const SCENES = ['/img/photos/sea-l.jpg', '/img/photos/forest-l.jpg', '/img/photos/nublo-l.jpg', '/img/photos/sunset-l.jpg', '/img/photos/hero-l.jpg', '/img/photos/drone-l.jpg'];
  IL.flyTo = (href) => {
    const cur = $('#curtain'); if (!cur) { location.href = href; return; }
    const src = SCENES[Math.floor(Math.random() * SCENES.length)]; $('#curtain-img').src = src;
    try { sessionStorage.setItem('il-fly', src); } catch {}
    cur.classList.remove('out'); cur.classList.add('in');
    setTimeout(() => { location.href = href; }, reduce ? 0 : 950);
  };
  IL.arrive = () => {
    const cur = $('#curtain'); const root = document.documentElement; if (!cur) return;
    let src = null; try { src = sessionStorage.getItem('il-fly'); sessionStorage.removeItem('il-fly'); } catch {}
    if (!src) return;
    $('#curtain-img').src = src; root.classList.add('arrive');
    let done = false; const go = () => { if (done) return; done = true; cur.classList.add('out'); setTimeout(() => { root.classList.remove('arrive'); cur.classList.remove('out', 'in'); }, 1300); };
    const im = $('#curtain-img'); (im.complete ? requestAnimationFrame(go) : (im.onload = go)); setTimeout(go, 1500);
  };

  /* ===================== Events ===================== */
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { buildTrail(); portals.forEach((P) => (P.dirty = true)); update(); });
  addEventListener('load', () => { buildTrail(); update(); });
  addEventListener('mousemove', (e) => { mouse.tx = e.clientX / innerWidth; mouse.ty = e.clientY / innerHeight; }, { passive: true });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', setup) : setup();
})();

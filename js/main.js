/* Inner Landscapes – Inhalte, Reveal, Formulare, Navigation */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IL = (window.IL = window.IL || {});
  const PAGE = location.pathname.replace(/\/index\.html$/, '/') || '/';

  /* ---------- 1. Schlüssel für editierbare Elemente (vor jeder DOM-Veränderung) ---------- */
  const EDIT_SEL = 'h1,h2,h3,h4,p,li,blockquote,figcaption,summary,.btn,.day-no,.eyebrow,.price-label,.price-amount,.path-steps div,.hero-facts b,.hero-facts span,.phase-no,.role,.pword b,.pword>span,.glance small,.glance b,.glance span,.give b,.give span,.guarantee b,.guarantee span,.price-rows dt,.price-rows dd,.sticky-info b,.tags span,.tl-k,.tl-seg b,.group-dia figcaption,.rp-legend span,.count,.faq-list details>div p';
  const BLOCK_SEL = 'main>section,.prow,.person,.ph,.price-card,.stay,.day,.facts li,.path-steps li,.glance li,.give li,.guarantee,.step,.who-yes,.who-no,.whisper-list li,.faq-list details,.hero-facts li,.price-lists>div,.booking-card,.seats,.trust,.pt,.map-card,.tl,.rp,.group-dia';
  const REORDER_PARENTS = 'main,.prows,.days,.team-grid,.faq-list,.path-steps,.facts,.whisper-list,.price-lists,.glance,.give,.steps';

  IL.isEditable = (e) => !e.closest('[data-noedit],form,.loader,.curtain');
  function assignKeys() {
    const all = $$(EDIT_SEL).filter((e) => IL.isEditable(e) && !e.querySelector(EDIT_SEL));
    IL.pristine = {}; IL.pristineOrder = {};
    all.forEach((e, i) => { e.dataset.k = 'e' + i; IL.pristine['e' + i] = e.innerHTML; });
    $$(BLOCK_SEL).filter((e) => !e.closest('[data-noedit]') || e.matches('main>section')).forEach((e, i) => { e.dataset.b = 'b' + i; });
    IL.pristineSrc = {};
    $$('[data-img]').forEach((e, i) => { e.dataset.p = 'p' + i; const im = $('img', e); IL.pristineSrc['p' + i] = im ? (im.getAttribute('src') || im.dataset.src || '') : ''; });
    $$(REORDER_PARENTS).forEach((e, i) => { e.dataset.g = 'g' + i; IL.pristineOrder['g' + i] = [...e.children].filter((x) => x.dataset.b).map((x) => x.dataset.b); });
  }
  IL.EDIT_SEL = EDIT_SEL;

  /* ---------- 2. Gespeicherte Änderungen anwenden ---------- */
  IL.content = { pages: {} };
  async function applyContent() {
    try { const r = await fetch('/content.json?' + Date.now(), { cache: 'no-store' }); if (r.ok) IL.content = await r.json(); } catch {}
    IL.applyPage((IL.content.pages && IL.content.pages[PAGE]) || {});
  }
  IL.applyPage = (c) => {
    for (const k in c.t || {}) { if (k.startsWith('alt-')) { const im = $(`[data-p="${k.slice(4)}"] img`); if (im) im.alt = c.t[k]; continue; } const e = $(`[data-k="${k}"]`); if (e) e.innerHTML = c.t[k]; }
    for (const k in c.s || {}) { const e = $(`[data-k="${k}"],[data-b="${k}"],[data-p="${k}"]`); if (e) e.style.cssText += ';' + c.s[k]; }
    for (const k in c.i || {}) { const f = $(`[data-p="${k}"]`); const e = f && $('img', f); if (e) { ['srcset', 'sizes', 'data-srcset', 'data-src'].forEach((a) => e.removeAttribute(a)); e.src = c.i[k]; f.classList.remove('ph-placeholder'); } }
    (c.h || []).forEach((k) => { const e = $(`[data-b="${k}"]`); if (e) e.setAttribute('data-hidden', ''); });
    for (const g in c.o || {}) {
      const parent = $(`[data-g="${g}"]`); if (!parent) continue;
      const kids = [...parent.children].filter((x) => x.dataset.b);
      const marks = kids.map((k) => { const m = document.createComment(''); parent.insertBefore(m, k); return m; });
      const sorted = c.o[g].map((k) => kids.find((x) => x.dataset.b === k)).filter(Boolean).concat(kids.filter((x) => !c.o[g].includes(x.dataset.b)));
      marks.forEach((m, i) => { m.replaceWith(sorted[i]); });
    }
  };
  const hiddenCss = document.createElement('style');
  hiddenCss.textContent = '[data-hidden]{display:none!important}.editing [data-hidden]{display:block!important;opacity:.35;outline:2px dashed #c4623a}';
  document.head.appendChild(hiddenCss);

  /* ---------- 3. Text aufbereiten: Wörter/Zeilen, Manifest, Buchstaben ---------- */
  function splitWords(node, cls, wrapInner, letters) {
    if (node._orig !== undefined) return;
    node._orig = node.innerHTML;
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          if (letters) { [...c.textContent].forEach((ch) => { if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; } const s = document.createElement('span'); s.className = 'ch'; s.innerHTML = `<span>${ch}</span>`; frag.appendChild(s); }); c.replaceWith(frag); return; }
          c.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            if (wrapInner) { s.className = 'w'; s.innerHTML = `<span>${w}</span>`; } else { s.className = cls; s.textContent = w; }
            frag.appendChild(s);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(node);
  }
  IL.split = () => { $$('.split').forEach((e) => splitWords(e, '', true)); $$('.scrub').forEach((e) => splitWords(e, 'sw', false)); $$('.letters').forEach((e) => splitWords(e, '', false, true)); IL.lines && IL.lines(); };
  IL.unsplit = () => { $$('.split,.scrub,.letters').forEach((e) => { if (e._orig !== undefined) { e.innerHTML = e._orig; delete e._orig; } }); };
  IL.resplit = () => { IL.split(); observe(); IL.refresh && IL.refresh(); };

  /* ---------- 4. Reveal ---------- */
  let io;
  function observe() {
    if (!io) io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting && (en.intersectionRatio >= 0.12 || en.target.classList.contains('ph'))) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: [0, 0.12], rootMargin: '0px 0px -6% 0px' });
    $$('.reveal:not(.in),.split:not(.in),.ph:not(.in),.tl:not(.in),.map-card:not(.in),.rp:not(.in),.group-dia:not(.in)').forEach((e) => {
      if (!e.style.getPropertyValue('--d') && e.classList.contains('reveal') && e.parentElement) {
        const sib = [...e.parentElement.children].filter((x) => x.classList.contains('reveal')); e.style.setProperty('--d', Math.min(sib.indexOf(e), 6) * 0.09 + 's');
      }
      io.observe(e);
    });
  }

  /* ---------- 5. Header & Fortschritt ---------- */
  let ticking = false, lastY = 0;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    const pr = $('#progress'); if (pr) pr.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const hd = $('#header');
    if (hd) { hd.classList.toggle('solid', y > 40); hd.classList.toggle('hide', y > 500 && y > lastY + 4 && !document.body.classList.contains('menu-open')); if (y < lastY - 4) hd.classList.remove('hide'); }
    lastY = y; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- 6. Woche, FAQ, Tabs ---------- */
  function week() {
    const days = $$('.day'); if (!days.length) return;
    const o = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return; days.forEach((d) => d.classList.remove('active')); en.target.classList.add('active');
      const n = +en.target.dataset.day; $$('#day-chips button').forEach((b) => b.classList.toggle('on', +b.dataset.d === n)); $('#week-day').textContent = 'Tag ' + n; $('#week-name').textContent = en.target.dataset.name; IL.setDay && IL.setDay(n);
    }), { rootMargin: '-42% 0px -48% 0px' });
    days.forEach((d) => o.observe(d)); days[0].classList.add('active');
    const chips = $('#day-chips');
    if (chips) { chips.innerHTML = days.map((d) => `<button type="button" data-d="${d.dataset.day}" aria-label="Tag ${d.dataset.day}">${d.dataset.day}</button>`).join(''); chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) IL.scrollTo($(`.day[data-day="${b.dataset.d}"]`), { offset: -Math.round(innerHeight * 0.3) }); }); }
  }
  function tabs() {
    const set = (k) => { $$('.tab').forEach((t) => { const on = t.id === 'tab-' + k; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); }); $$('.panel').forEach((p) => p.classList.toggle('is-active', p.id === 'panel-' + k)); };
    $$('.tab').forEach((t) => t.addEventListener('click', () => set(t.id.replace('tab-', ''))));
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-pick]'); if (b) set(b.dataset.pick); });
  }
  function faq() { // nur ein Eintrag gleichzeitig offen
    $$('.faq-list details').forEach((d) => d.addEventListener('toggle', () => { if (d.open && !document.body.classList.contains('editing')) $$('.faq-list details[open]').forEach((o) => { if (o !== d) o.open = false; }); }));
  }


  /* ---------- Selbstcheck ---------- */
  function quiz() {
    const box = $('#selbstcheck'); if (!box) return;
    const chips = $$('.chip', box), ring = $('#check-ring'), title = $('#check-title'), text = $('#check-text'), cta = $('#check-cta');
    const btn = (label, pick, cls = 'btn-ember') => `<a href="#buchen" class="btn ${cls} btn-small" data-pick="${pick}">${label}</a>`;
    const upd = () => {
      const on = chips.filter((c) => c.classList.contains('on')), y = on.filter((c) => c.dataset.k === 'y').length;
      const crisis = on.some((c) => c.dataset.k === 'crisis'), sport = on.some((c) => c.dataset.k === 'sport');
      ring.style.strokeDashoffset = 213.6 * (1 - y / 3);
      let t, x, c = '';
      if (!on.length) { t = 'Tippe an, was zutrifft.'; x = 'Wir zeigen dir ehrlich, ob das Format zu dir passt.'; }
      else if (crisis) { t = 'Danke für deine Offenheit.'; x = 'In einer akuten Krise ist professionelle therapeutische Hilfe der richtige erste Schritt. Unser Retreat ist Selbsterfahrung und ersetzt keine Therapie. Wenn du magst, sprechen wir persönlich darüber, was jetzt passt.'; c = btn('Kennenlerngespräch', 'call', 'btn-ghost'); }
      else if (sport) { t = 'Ruhiger, als du vielleicht denkst.'; x = 'Wir gehen langsam auf einfachen Wegen. Die Tiefe entsteht durch Stille, nicht durch Anstrengung. Wenn dich das trotzdem anspricht, ist es genau richtig.'; c = btn('Kennenlerngespräch', 'call', 'btn-ghost'); }
      else if (y >= 3) { t = 'Das klingt nach einem guten Match.'; x = 'Alles, was du angetippt hast, ist genau das, wofür dieses Retreat gedacht ist. Sichere dir deinen Platz oder lerne uns zuerst kennen.'; c = btn('Platz reservieren', 'reserve') + btn('Kennenlerngespräch', 'call', 'btn-ghost'); }
      else if (y === 2) { t = 'Wahrscheinlich passt es.'; x = 'Zwei von drei Dingen treffen zu. Im Kennenlerngespräch klären wir den Rest, ohne Verpflichtung.'; c = btn('Kennenlerngespräch', 'call') + btn('Platz reservieren', 'reserve', 'btn-ghost'); }
      else { t = 'Vielleicht noch nicht ganz.'; x = 'Im Kennenlerngespräch klären wir ehrlich, ob jetzt der richtige Moment ist. Ohne Verpflichtung.'; c = btn('Kennenlerngespräch', 'call'); }
      title.textContent = t; text.textContent = x; cta.innerHTML = c;
    };
    chips.forEach((c) => { c.setAttribute('aria-pressed', 'false'); c.addEventListener('click', () => { c.classList.toggle('on'); c.setAttribute('aria-pressed', c.classList.contains('on')); upd(); }); });
  }

  /* ---------- 7. Formulare & Verfügbarkeit ---------- */
  function forms() {
    const post = async (url, data) => { const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Etwas ist schiefgelaufen.'); return j; };
    $$('.panel').forEach((f) => f.addEventListener('submit', async (e) => {
      e.preventDefault(); const msg = $('.form-msg', f), btn = $('button[type=submit]', f), d = Object.fromEntries(new FormData(f)); d.consent = f.consent.checked; msg.className = 'form-msg'; msg.textContent = '';
      btn.disabled = true; const lab = $('span', btn), old = lab.textContent; lab.textContent = 'Einen Moment …';
      try {
        if (f.id === 'panel-reserve') { const r = await post('/api/reserve', d); location.href = r.checkoutUrl; return; }
        await post('/api/call', d); f.reset(); msg.className = 'form-msg ok'; msg.textContent = 'Danke! Wir melden uns persönlich bei dir, meist innerhalb von zwei Tagen.';
      } catch (err) { msg.textContent = err.message === 'Failed to fetch' ? 'Dies ist die Online-Vorschau: Das Formular ist hier noch nicht aktiv.' : err.message; }
      btn.disabled = false; lab.textContent = old;
    }));
    fetch('/api/seats').then((r) => r.json()).then((s) => {
      const free = s.total - s.taken; const dd = (n) => Array.from({ length: s.total }, (_, i) => '<i class="' + (i < s.taken ? 'taken' : '') + '"></i>').join('');
      const dots = $('#seat-dots'); if (dots) dots.innerHTML = dd();
      $$('.js-dots').forEach((e) => (e.innerHTML = dd())); $$('.js-seats').forEach((e) => (e.textContent = free > 0 ? free + ' von ' + s.total + ' Plätzen frei' : 'Ausgebucht – Warteliste möglich'));
      const st = $('#seat-text'); if (st) st.textContent = free > 0 ? free + ' von ' + s.total + ' Plätzen frei' : 'Aktuell ausgebucht – schreib uns für die Warteliste';
      const ss = $('#sticky-seats'); if (ss) ss.textContent = free > 0 ? free + ' Plätze frei' : 'ausgebucht';
    }).catch(() => {});
  }

  /* ---------- 8. Navigation ---------- */
  function nav() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]'); if (!a || document.body.classList.contains('editing') || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const u = new URL(a.href, location.href); if (u.origin !== location.origin) return;
      const same = u.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '');
      if (same) { if (u.hash && IL.scrollTo) { e.preventDefault(); IL.closeMenu && IL.closeMenu(); IL.scrollTo(u.hash); } return; }
      if ('onpageswap' in window) return; // native View Transitions übernehmen
      e.preventDefault(); IL.flyTo(a.href);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { const c = $('#curtain'); c && c.classList.remove('in', 'out'); } });
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }

  function thanks() {
    const id = new URLSearchParams(location.search).get('id'); if (!$('#thanks-title') || !id) return;
    fetch('/api/status?id=' + encodeURIComponent(id)).then((r) => r.json()).then((s) => {
      if (!s.status) return; const t = $('#thanks-title'), x = $('#thanks-text'), eb = $('#thanks-eyebrow');
      if (s.status === 'paid') { t.textContent = `Dein Platz ist reserviert, ${s.name}.`; }
      else if (s.status === 'demo') { eb.textContent = 'Demo-Modus'; t.textContent = `Danke, ${s.name}.`; x.textContent = 'Es wurde keine echte Zahlung ausgelöst, weil noch kein Mollie-Schlüssel hinterlegt ist. Die Reservierung wurde lokal gespeichert.'; }
      else if (['failed', 'canceled', 'expired'].includes(s.status)) { eb.textContent = 'Zahlung nicht abgeschlossen'; t.textContent = 'Das hat leider nicht geklappt.'; x.textContent = 'Deine Zahlung wurde nicht abgeschlossen. Du kannst es jederzeit erneut versuchen – wir halten dir den Platz nicht reserviert, bis die Zahlung vorliegt.'; }
      else { eb.textContent = 'Zahlung wird geprüft'; t.textContent = `Danke, ${s.name}.`; x.textContent = 'Wir warten noch auf die Bestätigung deiner Zahlung und melden uns persönlich bei dir.'; }
    }).catch(() => {});
  }

  /* ---------- 9. Start ---------- */
  let finished = false;
  function finishLoad() {
    if (finished) return; finished = true;
    const l = $('#loader'); document.body.classList.remove('is-loading');
    if (l) { l.classList.add('done'); setTimeout(() => l.remove(), 1400); }
    document.body.classList.add('loaded'); onScroll(); observe(); IL.introStart && IL.introStart();
  }
  async function boot() {
    assignKeys();
    await applyContent();
    IL.split(); IL.refresh && IL.refresh(); week(); tabs(); quiz(); faq(); forms(); nav(); thanks(); onScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => IL.lines && IL.lines());
    const arriving = document.documentElement.classList.contains('arrive');
    IL.arrive && IL.arrive();
    const seen = sessionStorage.getItem('il-seen') || arriving; sessionStorage.setItem('il-seen', '1');
    if (seen) { const l0 = $('#loader'); if (l0) l0.remove(); }
    const wait = reduce ? 0 : seen ? 250 : 2000;
    const go = () => setTimeout(finishLoad, wait);
    if (document.readyState === 'complete') go(); else addEventListener('load', go);
    setTimeout(finishLoad, 6500); // Sicherheitsnetz bei langsamer Verbindung
    if (location.hash) setTimeout(() => { const t = $(decodeURIComponent(location.hash)); t && (IL.lenis ? IL.scrollTo(t, { duration: 0.01 }) : t.scrollIntoView()); }, wait + 150);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();

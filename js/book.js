/* Buchungs-Konfigurator: Bedürfnisse wählen → Landschaft, Licht und Wochenprofil verschieben sich mit */
(function () {
  const G = window.IL && IL.geo; const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const form = $('#bk-form'); if (!form) return;
  const NEEDS = {
    ruhe: { l: 'Ruhe und Erholung', stop: 2, tod: 0.08, w: [0.9, 0.3, 0.2, 0.5], line: 'Wir betonen Stille, lange Pausen und den Wald von Tamadaba.' },
    klarheit: { l: 'Klarheit für eine Entscheidung', stop: 4, tod: 0.5, w: [0.6, 0.5, 0.4, 0.7], line: 'Der Roque Nublo am Tag 5 wird dein Ort der Entscheidung.' },
    perspektive: { l: 'Neue Perspektive', stop: 3, tod: 0.3, w: [0.4, 0.4, 0.5, 0.95], line: 'Weite Blicke vom höchsten Punkt der Insel stehen im Mittelpunkt.' },
    koerper: { l: 'Zurück in den Körper', stop: 5, tod: 0.6, w: [0.4, 0.3, 0.95, 0.6], line: 'Mehr Gehen, Spüren und Natur, rund um die Monolithen.' },
    gemeinschaft: { l: 'Echte Gemeinschaft', stop: 1, tod: 0.7, w: [0.3, 0.9, 0.4, 0.4], line: 'Mehr Zeit in der Gruppe, an Tisch und Feuer in Tejeda.' },
    neubeginn: { l: 'Neubeginn nach einem Umbruch', stop: 7, tod: 0.95, w: [0.5, 0.6, 0.4, 0.7], line: 'Dein Weg endet am Anfang: der Return Path trägt dich weiter.' }
  };
  const sel = []; let step = 0, route = 'reserve', pace = 'mittel', todPref = 0.5, talk = 45;
  const bars = $$('[data-bar]'); const placeEl = $('#bk-place'), tagEl = $('#bk-place-tag'), sumEl = $('#bk-sum');

  /* ---------- Landschaft ---------- */
  const sc = { map: null, t: { map: null, host: $('#bk-sky'), styled: false }, tod: 0.5, tg: 0.5, idx: 1 };
  const poster = $('#bk-poster');
  function showPoster(i) { poster.style.backgroundImage = `url(/img/photos/${G.STOPS[i].img}-l.jpg)`; }
  function initMap() {
    if (!G || !G.webgl()) return; G.skyBg($('#bk-sky'), 0.5); showPoster(1);
    G.load().then(() => {
      let m; try { m = G.make('bk-map', { cam: G.camOf(1) }); } catch (e) { return; }
      sc.map = m; sc.t.map = m;
      m.once('style.load', () => { sc.t.styled = true; G.paintTod(sc.t, sc.tod, true); });
      const reveal = () => poster.classList.add('off'); m.once('idle', reveal); m.once('load', () => setTimeout(reveal, 2500));
    }).catch(() => {});
    requestAnimationFrame(tick);
  }
  function tick() {
    sc.tod += (sc.tg - sc.tod) * 0.04; if (Math.abs(sc.tg - sc.tod) < 0.002) sc.tod = sc.tg;
    G.paintTod(sc.t, sc.tod); G.skyBg($('#bk-sky'), sc.tod); G.paintUI($('#bk-scene'), sc.tod);
    requestAnimationFrame(tick);
  }
  function fly(i, instant) {
    if (i === sc.idx && !instant) return; sc.idx = i; const s = G.STOPS[i]; placeEl.textContent = s.n; tagEl.textContent = s.tag === 'Überblick' ? 'Gran Canaria' : 'Gran Canaria · ' + s.tag;
    showPoster(i);
    if (sc.map) sc.map.flyTo({ ...G.camOf(i), duration: instant ? 0 : 5200, curve: 1.6, essential: true });
  }

  /* ---------- Profil ---------- */
  function profile() {
    let w = [0.5, 0.5, 0.5, 0.5];
    if (sel.length) { w = [0, 0, 0, 0]; sel.forEach((k) => NEEDS[k].w.forEach((v, n) => (w[n] += v / sel.length))); }
    w[1] = Math.min(1, Math.max(0.1, w[1] + (talk - 50) / 160)); w[0] = Math.min(1, Math.max(0.1, w[0] - (talk - 50) / 160));
    w[2] = Math.min(1, Math.max(0.1, w[2] + (pace === 'aktiv' ? 0.22 : pace === 'sanft' ? -0.22 : 0)));
    return w;
  }
  function render() {
    const w = profile(); bars.forEach((b, n) => (b.style.transform = `scaleX(${w[n].toFixed(2)})`));
    const names = sel.map((k) => NEEDS[k].l);
    sumEl.textContent = sel.length ? `Du suchst ${names.length > 1 ? names.slice(0, -1).join(', ').toLowerCase() + ' und ' + names.slice(-1)[0].toLowerCase() : names[0].toLowerCase()}. ${NEEDS[sel[sel.length - 1]].line}` : 'Wähle, was dich herführt. Die Landschaft und dein Wochenrhythmus passen sich an.';
    $('#bk-talk-hint').textContent = talk < 30 ? 'Viel Stille: Gespräche gibt es, aber du bestimmst, wann.' : talk > 70 ? 'Viel Austausch: mehr Zeit in der Gruppe und im Gespräch mit uns.' : 'Ausgewogen: Zeit für dich allein und Zeit mit der Gruppe und uns.';
    const last = sel.length ? NEEDS[sel[sel.length - 1]] : null;
    sc.tg = step === 1 || !last ? todPref : (last.tod * 0.6 + todPref * 0.4);
  }

  /* ---------- Schritte ---------- */
  function ok() {
    if (step === 0 && !sel.length) return 'Wähle mindestens eine Sache aus.';
    return '';
  }
  function go(n) {
    if (n > step && ok()) { $('#bk-hint').textContent = ok(); return; }
    step = Math.max(0, Math.min(3, n)); $('#bk-hint').textContent = '';
    $$('.bk-step').forEach((s) => s.classList.toggle('on', +s.dataset.step === step));
    $$('#bk-steps li').forEach((li, i) => { li.classList.toggle('on', i === step); li.classList.toggle('done', i < step); });
    $('#bk-prev').hidden = step === 0; $('#bk-next').hidden = step === 3;
    if (step === 3) recap(); render();
    const top = $('.bk-panel').getBoundingClientRect().top + scrollY - 90; if (scrollY > top + 40) scrollTo({ top, behavior: 'smooth' });
  }
  function recap() {
    const paceL = { sanft: 'sanft', mittel: 'ausgewogen', aktiv: 'aktiv' }[pace];
    const todL = $('#bk-time .on b').textContent;
    $('#bk-recap').innerHTML = `<div><span>Du suchst</span><b>${sel.map((k) => NEEDS[k].l).join(' · ') || 'noch offen'}</b></div><div><span>Rhythmus</span><b>${talk < 30 ? 'viel Stille' : talk > 70 ? 'viel Gespräch' : 'ausgewogen'} · ${paceL} · ${todL}</b></div><div><span>Start</span><b>${route === 'reserve' ? 'Platz reservieren, 150 €' : 'Kennenlerngespräch, kostenlos'}</b></div>`;
    const r = route === 'reserve';
    $('#bk-final-h').textContent = r ? 'Dein Platz wartet.' : 'Lass uns sprechen.';
    $('#bk-final-p').textContent = r ? 'Nur noch ein paar Angaben, dann geht es zur sicheren Zahlung.' : 'Nur noch ein paar Angaben. Wir melden uns meist innerhalb von zwei Tagen.';
    $('#bk-submit span').textContent = r ? 'Weiter zur sicheren Zahlung · 150 €' : 'Gespräch anfragen';
    $('#bk-pay').style.display = r ? '' : 'none'; $('.when', form).style.display = r ? 'none' : '';
    $('#bk-consent').innerHTML = r ? 'Ich habe die <a href="/agb.html" target="_blank">Teilnahmebedingungen</a> und die <a href="/datenschutz.html" target="_blank">Datenschutzhinweise</a> gelesen und akzeptiere sie.' : 'Ich stimme zu, dass ihr mich zur Terminabsprache kontaktiert. Siehe <a href="/datenschutz.html" target="_blank">Datenschutz</a>.';
  }

  $('#bk-needs').addEventListener('click', (e) => {
    const b = e.target.closest('.need'); if (!b) return; const k = b.dataset.need; const i = sel.indexOf(k);
    if (i >= 0) sel.splice(i, 1); else { if (sel.length >= 3) { const old = sel.shift(); $(`.need[data-need="${old}"]`).setAttribute('aria-pressed', 'false'); } sel.push(k); }
    b.setAttribute('aria-pressed', i < 0); $$('.need').forEach((n) => n.classList.toggle('on', n.getAttribute('aria-pressed') === 'true'));
    $('#bk-hint').textContent = ''; if (sel.length) fly(NEEDS[sel[sel.length - 1]].stop); else fly(1);
    render();
  });
  const pick = (id, cb) => $(id).addEventListener('click', (e) => { const b = e.target.closest('.opt'); if (!b) return; $$('.opt', $(id)).forEach((o) => { o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); }); cb(b.dataset.v); render(); });
  pick('#bk-pace', (v) => (pace = v)); pick('#bk-time', (v) => (todPref = +v));
  $('#bk-talk').addEventListener('input', (e) => { talk = +e.target.value; render(); });
  $('#bk-routes').addEventListener('click', (e) => { const b = e.target.closest('.route'); if (!b) return; route = b.dataset.route; $$('.route').forEach((o) => { o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); }); });
  $('#bk-next').addEventListener('click', () => go(step + 1)); $('#bk-prev').addEventListener('click', () => go(step - 1));
  $('#bk-steps').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(+b.dataset.go); });
  const q = new URLSearchParams(location.search); if (q.get('route') === 'call') { route = 'call'; $$('.route').forEach((o) => { const on = o.dataset.route === 'call'; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on); }); }

  /* ---------- Senden ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); const msg = $('.form-msg', form), btn = $('#bk-submit'), lab = $('span', btn), old = lab.textContent; msg.className = 'form-msg'; msg.textContent = '';
    const d = Object.fromEntries(new FormData(form)); d.consent = form.consent.checked;
    d.needs = `Sucht: ${sel.map((k) => NEEDS[k].l).join(', ') || '–'} | Stille↔Gespräch: ${talk}/100 | Tempo: ${pace} | Tageszeit: ${$('#bk-time .on b').textContent}`;
    btn.disabled = true; lab.textContent = 'Einen Moment …';
    try {
      const r = await fetch(route === 'reserve' ? '/api/reserve' : '/api/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Etwas ist schiefgelaufen.');
      if (route === 'reserve') { location.href = j.checkoutUrl; return; }
      form.reset(); msg.className = 'form-msg ok'; msg.textContent = 'Danke! Wir melden uns persönlich bei dir, meist innerhalb von zwei Tagen.';
    } catch (err) { msg.textContent = err.message === 'Failed to fetch' ? 'Dies ist die Online-Vorschau: Das Formular ist hier noch nicht aktiv.' : err.message; }
    btn.disabled = false; lab.textContent = old;
  });
  fetch('/api/seats').then((r) => r.json()).then((s) => { const f = s.total - s.taken; $('#bk-seats').textContent = f > 0 ? `${f} von ${s.total} Plätzen frei` : 'Ausgebucht – schreib uns für die Warteliste'; }).catch(() => {});

  render(); go(0); G && setTimeout(initMap, 600);
})();

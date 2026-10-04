/* Live-Editor: Texte bearbeiten, Blöcke verschieben/ausblenden/umordnen, Bilder ersetzen – speichert in public/content.json */
(function () {
  const IL = window.IL || (window.IL = {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PAGE = location.pathname.replace(/\/index\.html$/, '/') || '/';
  const REORDER = 'main,.phases,.days,.team-grid,.faq-list,.path-steps,.facts,.whisper-list,.price-lists,.glance,.give,.steps';
  const ICON = '<svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>';
  let editing = false, dirty = false, cur = null;

  const mk = (html, cls) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; document.body.appendChild(d); return d; };
  const fab = mk(ICON + 'Bearbeiten', 'ed-fab');
  const bar = mk('<span>Bearbeitungsmodus – klicke auf Texte, ziehe ⠿ zum Verschieben</span><button data-a="reset">Seite zurücksetzen</button><button data-a="discard">Verwerfen</button><button data-a="save" class="primary">Speichern</button><button data-a="done">Fertig</button>', 'ed-bar');
  const tools = mk('<button data-c="bold"><b>B</b></button><button data-c="italic"><i style="font-style:italic">I</i></button><button data-c="link">🔗</button><i class="sep"></i><button data-c="smaller">A−</button><button data-c="bigger">A+</button><i class="sep"></i><button data-c="left">⇤</button><button data-c="center">↔</button><i class="sep"></i><button class="sw" data-col="#faf5ea" style="background:#faf5ea"></button><button class="sw" data-col="#15110e" style="background:#15110e"></button><button class="sw" data-col="#c4623a" style="background:#c4623a"></button><button class="sw" data-col="#ecb877" style="background:#ecb877"></button><button class="sw" data-col="#3e5645" style="background:#3e5645"></button><button data-c="clear">✕</button>', 'ed-tools');
  const blk = mk('<button class="drag" title="Ziehen zum Verschieben">⠿</button><button data-b="up" title="Nach oben">↑</button><button data-b="down" title="Nach unten">↓</button><button data-b="reset" title="Position zurücksetzen">⟲</button><button data-b="parent" title="Übergeordneten Block wählen">⬈</button><button data-b="hide" title="Ausblenden / Einblenden">👁</button>', 'ed-blk');
  const toast = mk('', 'ed-toast');
  const say = (t) => { toast.textContent = t; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('show'), 2200); };
  const markDirty = () => { dirty = true; $('[data-a=save]').classList.add('dirty'); };

  /* ---------- Modus ---------- */
  function enter() {
    editing = true; document.body.classList.add('editing', 'loaded'); document.documentElement.classList.add('editing');
    IL.motionOff && IL.motionOff(); IL.unsplit(); $$('.reveal,.split,.ph').forEach((e) => e.classList.add('in'));
    $$('[data-k]').forEach((e) => { e.contentEditable = 'true'; e.spellcheck = true; });
    $$('[data-p]').forEach((ph) => { if (ph.querySelector('.ph-edit')) return; const o = document.createElement('div'); o.className = 'ph-edit'; o.setAttribute('data-noedit', ''); o.innerHTML = '<button data-i="up">Foto ersetzen</button><button class="sec" data-i="alt">Alt-Text</button><button class="sec" data-i="rm">Entfernen</button>'; ph.appendChild(o); });
    say('Bearbeitungsmodus an');
  }
  function leave() {
    editing = false; document.body.classList.remove('editing'); document.documentElement.classList.remove('editing');
    $$('[data-k]').forEach((e) => e.removeAttribute('contenteditable')); $$('.ph-edit').forEach((e) => e.remove());
    tools.classList.remove('show'); blk.classList.remove('show'); clearHover(); IL.resplit(); IL.motionOn && IL.motionOn();
    $$('.reveal,.split').forEach((e) => e.classList.add('in'));
  }
  fab.addEventListener('click', enter);
  bar.addEventListener('click', async (e) => {
    const a = e.target.closest('button')?.dataset.a; if (!a) return;
    if (a === 'save') await save();
    if (a === 'done') { if (dirty && confirm('Es gibt ungespeicherte Änderungen. Jetzt speichern?')) await save(); leave(); }
    if (a === 'discard') { if (!dirty || confirm('Alle ungespeicherten Änderungen verwerfen?')) { dirty = false; location.reload(); } }
    if (a === 'reset') { if (confirm('Alle Änderungen dieser Seite zurücksetzen und den Original-Entwurf wiederherstellen? (Es wird automatisch ein Backup angelegt.)')) { IL.content.pages[PAGE] = {}; await post(); dirty = false; location.reload(); } }
  });
  addEventListener('keydown', (e) => { if (editing && (e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(); } if (!editing && e.shiftKey && e.altKey && e.key.toLowerCase() === 'e') enter(); });
  addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- Speichern ---------- */
  function collect() {
    const c = { t: {}, s: {}, i: {}, h: [], o: {} };
    $$('[data-k]').forEach((e) => {
      const k = e.dataset.k, html = e.innerHTML;
      if (html !== IL.pristine[k]) c.t[k] = html;
      const css = ['fontSize', 'color', 'textAlign'].map((p) => (e.style[p] ? `${p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${e.style[p]}` : '')).filter(Boolean).join(';');
      if (css) c.s[k] = css;
    });
    $$('[data-b]').forEach((e) => { const k = e.dataset.b; const css = [e.style.translate && !e.hasAttribute('data-float') && !e.hasAttribute('data-floatx') ? `translate:${e.style.translate}` : ''].filter(Boolean).join(';'); if (css) c.s[k] = (c.s[k] ? c.s[k] + ';' : '') + css; if (e.hasAttribute('data-hidden')) c.h.push(k); });
    $$('[data-p]').forEach((ph) => { const img = ph.querySelector('img'); if (img && img.getAttribute('src') && img.getAttribute('src') !== IL.pristineSrc[ph.dataset.p]) c.i[ph.dataset.p] = img.getAttribute('src'); const alt = img?.getAttribute('alt'); if (alt && img.dataset.altEdited) { c.t['alt-' + ph.dataset.p] = alt; } });
    $$('[data-g]').forEach((p) => { const now = [...p.children].filter((x) => x.dataset.b).map((x) => x.dataset.b); if (now.join() !== (IL.pristineOrder[p.dataset.g] || []).join()) c.o[p.dataset.g] = now; });
    return c;
  }
  async function post() {
    const r = await fetch('/api/edit/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(IL.content) });
    if (!r.ok) throw new Error('Speichern fehlgeschlagen');
  }
  async function save() {
    try { IL.content.pages = IL.content.pages || {}; IL.content.pages[PAGE] = collect(); await post(); dirty = false; $('[data-a=save]').classList.remove('dirty'); say('Gespeichert ✓'); }
    catch (e) { say('Fehler: ' + e.message); }
  }

  /* ---------- Text ---------- */
  document.addEventListener('input', (e) => { if (editing && e.target.closest('[data-k]')) markDirty(); });
  document.addEventListener('keydown', (e) => {
    if (!editing || !e.target.closest?.('[data-k]')) return;
    if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); }
  });
  document.addEventListener('keyup', (e) => { if (editing && e.key === ' ' && e.target.closest?.('summary')) e.preventDefault(); });
  document.addEventListener('paste', (e) => { if (!editing || !e.target.closest?.('[data-k]')) return; e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain')); });
  document.addEventListener('click', (e) => { // Links & Buttons im Editor nicht auslösen
    if (!editing) return; const t = e.target;
    if (t.closest('.ed-bar,.ed-tools,.ed-blk,.ed-fab,.ed-toast,.ph-edit')) return;
    if (t.closest('a,button,label,.tab')) e.preventDefault();
  }, true);
  document.addEventListener('selectionchange', () => {
    if (!editing) return; const s = getSelection();
    if (!s.rangeCount) return tools.classList.remove('show');
    const n = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement); const el = n && n.closest('[data-k]');
    if (!el) { if (!tools.matches(':hover')) tools.classList.remove('show'); return; }
    cur = el; const r = s.getRangeAt(0).getBoundingClientRect(); const box = r.width || r.height ? r : el.getBoundingClientRect();
    tools.classList.add('show'); const tw = tools.offsetWidth;
    tools.style.left = Math.max(10, Math.min(innerWidth - tw - 10, box.left + box.width / 2 - tw / 2)) + 'px';
    tools.style.top = Math.max(70, box.top - 52) + 'px';
  });
  tools.addEventListener('mousedown', (e) => e.preventDefault());
  tools.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !cur) return; const c = b.dataset.c;
    const size = () => parseFloat(getComputedStyle(cur).fontSize);
    if (c === 'bold' || c === 'italic') document.execCommand(c);
    else if (c === 'link') { const u = prompt('Link-Adresse (z. B. /#buchen oder https://…):'); if (u) document.execCommand('createLink', false, u); }
    else if (c === 'bigger') cur.style.fontSize = size() * 1.1 + 'px';
    else if (c === 'smaller') cur.style.fontSize = size() / 1.1 + 'px';
    else if (c === 'left' || c === 'center') cur.style.textAlign = c;
    else if (c === 'clear') { document.execCommand('removeFormat'); cur.style.fontSize = ''; cur.style.color = ''; cur.style.textAlign = ''; }
    else if (b.dataset.col) { const s = getSelection(); if (s.isCollapsed) cur.style.color = b.dataset.col; else document.execCommand('foreColor', false, b.dataset.col); }
    markDirty();
  });

  /* ---------- Blöcke ---------- */
  let hov = null;
  const clearHover = () => { hov && hov.classList.remove('ed-hover'); hov = null; };
  const place = () => { if (!hov) return; const r = hov.getBoundingClientRect(); blk.style.left = Math.max(8, Math.min(innerWidth - blk.offsetWidth - 8, r.left + 8)) + 'px'; blk.style.top = Math.max(62, r.top + 8) + 'px'; };
  const setHover = (b) => { if (hov === b) return; clearHover(); hov = b; if (!b) return blk.classList.remove('show'); b.classList.add('ed-hover'); blk.classList.add('show'); place(); };
  document.addEventListener('mouseover', (e) => {
    if (!editing || dragging) return; if (e.target.closest('.ed-blk,.ed-tools,.ed-bar')) return;
    const b = e.target.closest('[data-b]'); if (b && !b.closest('[data-noedit]') || (b && b.matches('main>section'))) setHover(b);
  });
  addEventListener('scroll', place, { passive: true });
  blk.addEventListener('mouseleave', () => {});
  blk.addEventListener('click', (e) => {
    const t = e.target.closest('button'); const a = t && t.dataset.b; if (!a || !hov) return;
    if (a === 'hide') { hov.toggleAttribute('data-hidden'); markDirty(); }
    if (a === 'reset') { hov.style.translate = ''; markDirty(); place(); }
    if (a === 'parent') { const p = hov.parentElement.closest('[data-b]'); if (p) setHover(p); }
    if (a === 'up' || a === 'down') {
      const sibs = [...hov.parentElement.children].filter((x) => x.dataset.b); const i = sibs.indexOf(hov); const j = a === 'up' ? i - 1 : i + 1;
      if (!hov.parentElement.matches(REORDER)) return say('Dieser Block kann nur verschoben (⠿), nicht umsortiert werden.');
      if (j < 0 || j >= sibs.length) return;
      if (a === 'up') hov.parentElement.insertBefore(hov, sibs[j]); else hov.parentElement.insertBefore(sibs[j], hov);
      markDirty(); place(); hov.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
  let dragging = null;
  blk.querySelector('.drag').addEventListener('pointerdown', (e) => {
    if (!hov) return; e.preventDefault(); const el = hov; if (el.hasAttribute('data-float') || el.hasAttribute('data-floatx')) return say('Dieses Element bewegt sich beim Scrollen (Parallax). Du kannst Text und Bild ändern, aber nicht verschieben.'); const m = /(-?[\d.]+)px\s+(-?[\d.]+)px/.exec(el.style.translate || '') || [0, 0, 0];
    dragging = { el, x: e.clientX, y: e.clientY, ox: +m[1], oy: +m[2] }; blk.setPointerCapture?.(e.pointerId);
    blk.querySelector('.drag').setPointerCapture(e.pointerId);
  });
  addEventListener('pointermove', (e) => { if (!dragging) return; const d = dragging; d.el.style.translate = `${d.ox + e.clientX - d.x}px ${d.oy + e.clientY - d.y}px`; place(); });
  addEventListener('pointerup', () => { if (dragging) { dragging = null; markDirty(); } });

  /* ---------- Bilder ---------- */
  async function upload(file, ph) {
    if (!file || !file.type.startsWith('image/')) return say('Bitte eine Bilddatei wählen');
    try {
      const r = await fetch('/api/edit/upload', { method: 'POST', headers: { 'Content-Type': file.type }, body: file }); const j = await r.json(); if (!r.ok) throw new Error(j.error);
      const img = ph.querySelector('img'); ['srcset', 'sizes', 'data-srcset', 'data-src'].forEach((a) => img.removeAttribute(a)); img.src = j.src; ph.classList.remove('ph-placeholder'); markDirty(); say('Bild eingefügt – denk ans Speichern');
    } catch (err) { say('Upload fehlgeschlagen: ' + err.message); }
  }
  const picker = document.createElement('input'); picker.type = 'file'; picker.accept = 'image/*'; picker.style.display = 'none'; document.body.appendChild(picker);
  let pickTarget = null; picker.addEventListener('change', () => { if (picker.files[0] && pickTarget) upload(picker.files[0], pickTarget); picker.value = ''; });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.ph-edit button'); if (!b || !editing) return; const ph = b.closest('.ph'), img = ph.querySelector('img');
    if (b.dataset.i === 'up') { pickTarget = ph; picker.click(); }
    if (b.dataset.i === 'rm') { img.removeAttribute('src'); markDirty(); }
    if (b.dataset.i === 'alt') { const v = prompt('Bildbeschreibung (wichtig für Google & Barrierefreiheit):', img.alt || ''); if (v !== null) { img.alt = v; img.dataset.altEdited = '1'; markDirty(); } }
  });
  ['dragover', 'dragleave', 'drop'].forEach((t) => document.addEventListener(t, (e) => {
    if (!editing) return; const ph = e.target.closest?.('[data-p]'); if (!ph) return; e.preventDefault();
    if (t === 'dragover') ph.classList.add('drop'); else ph.classList.remove('drop');
    if (t === 'drop') upload(e.dataTransfer.files[0], ph);
  }));

  // Alt-Texte laden
  document.addEventListener('DOMContentLoaded', () => {});
})();

// Lädt den Editor nur, wenn die Seite lokal auf diesem Rechner geöffnet ist.
(function () {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/css/editor.css'; document.head.appendChild(l);
  const s = document.createElement('script'); s.src = '/js/editor.js'; s.defer = true; document.body.appendChild(s);
})();

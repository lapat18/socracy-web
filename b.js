/* Versión B · añadidos sobre socracy.js: copiar el correo desde cualquier botón [data-copy],
   la ventana «Lo que te llevas» que se escribe columna a columna, y las teclas 1, 2 y 3 para las pestañas de «Cómo trabajamos». Respeta prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Copiar el correo (el botón #copy del contacto ya lo lleva socracy.js) */
  [].forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var addr = btn.getAttribute('data-copy'), out = document.getElementById(btn.getAttribute('data-status')), link = document.getElementById(btn.getAttribute('data-target'));
      function say(t) { if (out) out.textContent = t; }
      function sel() { if (!link) return; var r = document.createRange(); r.selectNodeContents(link); var s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Seleccionado: pulsa Cmd+C o Ctrl+C'); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(function () { say('Copiado: ' + addr); }, sel); else sel();
    });
  });

  /* «Lo que te llevas»: las columnas aparecen una a una, con el cursor en la última escrita */
  [].forEach.call(document.querySelectorAll('[data-take]'), function (win) {
    var items = [].slice.call(win.querySelectorAll('.b-cols li'));
    if (!items.length || reduce || !('IntersectionObserver' in window)) return;
    win.classList.add('b-anim');
    var started = false;
    function run() {
      if (started) return; started = true;
      items.forEach(function (li, i) {
        setTimeout(function () {
          items.forEach(function (o) { var p = o.querySelector('.card p'); if (p) p.classList.remove('b-type'); });
          li.classList.add('on');
          var p = li.querySelector('.card p'); if (p) p.classList.add('b-type');
        }, 350 + i * 900);
      });
    }
    new IntersectionObserver(function (es, ob) { if (es[0].isIntersecting) { run(); ob.disconnect(); } }, { threshold: 0.25 }).observe(win);
  });

  /* Teclas 1, 2 y 3: eligen la pestaña de «Cómo trabajamos» */
  var tabs = document.querySelectorAll('.tablist [role="tab"]');
  if (tabs.length) document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.isContentEditable || /input|textarea|select/i.test(e.target.tagName || '')) return;
    var n = ['1', '2', '3'].indexOf(e.key);
    if (n >= 0 && tabs[n]) { e.preventDefault(); tabs[n].click(); }
  });
})();

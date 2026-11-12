(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  /* ---------- Posición al cargar y URL por sección (puntos 4 y 5) ----------
     Causa de que una página de caso se abriera al final: el navegador (o el visor que la aloja) conservaba
     la posición de la página anterior, y nuestro scrollTo(0, 0) iba con «scroll-behavior: smooth» del CSS,
     así que era una animación que se cortaba en cuanto cambiaba el alto de la página (fuentes, lienzos).
     Ahora: restauración manual, salto instantáneo arriba (o al ancla) en cada momento en que el alto puede
     cambiar, y se respeta si la persona ya ha empezado a desplazarse. */
  var html = document.documentElement;
  var ALIAS = { problema: 'el-problema', metodo: 'como-funciona', casos: 'casos-de-uso', hablamos: 'contacto', top: 'inicio' };
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function setHash(id) {
    var url = location.pathname + location.search + (id ? '#' + id : '');
    if (url === location.pathname + location.search + location.hash) return;
    try { history.replaceState(history.state, '', url); } catch (e) {}
  }
  (function () {
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (h === 'detalles' && $('h-metodo') && !$('detalles')) { location.replace('como-funciona.html'); return; }
    if (ALIAS[h] && !$(h) && $(ALIAS[h])) setHash(ALIAS[h]);
  })();
  function jump(to) {
    var prev = html.style.scrollBehavior; html.style.scrollBehavior = 'auto';
    if (to) to.scrollIntoView({ block: 'start', behavior: 'instant' }); else { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); html.scrollTop = 0; document.body.scrollTop = 0; }
    html.style.scrollBehavior = prev;
  }
  var userMoved = false;
  ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) { addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true }); });
  function settle() {
    if (userMoved) return;
    var id = decodeURIComponent((location.hash || '').slice(1)), el = id ? document.getElementById(id) : null;
    if (id === 'inicio') el = null;
    jump(el);
  }
  settle();
  document.addEventListener('DOMContentLoaded', settle);
  addEventListener('load', function () { settle(); requestAnimationFrame(settle); setTimeout(settle, 250); });
  addEventListener('pageshow', function (e) { if (e.persisted) { userMoved = false; settle(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);

  /* Enlaces a una sección de la misma página: desplazamiento suave y la URL se reemplaza, sin sumar historial. */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1)); id = ALIAS[id] && !$(id) ? ALIAS[id] : id;
    var el = document.getElementById(id); if (!el) return;
    e.preventDefault(); userMoved = true; if (a.classList.contains('skip')) { el.focus({ preventScroll: true }); }
    if (id === 'inicio') { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); setHash(''); }
    else { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); setHash(id); }
  });

  /* La URL refleja la sección visible (history.replaceState, sin ensuciar el historial). */
  var anchors = [].slice.call(document.querySelectorAll('[data-anchor][id]'));
  if (anchors.length) {
    var ticking = false;
    function spy() {
      ticking = false; if (!userMoved) return;
      var line = innerHeight * 0.35, cur = '';
      anchors.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= line && r.bottom > 0) cur = s.id; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = anchors[anchors.length - 1].id;
      setHash(cur);
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  }
  [].forEach.call(document.querySelectorAll('[data-w]'), function (el) { el.style.setProperty('--w', el.getAttribute('data-w') + '%'); });
  var C = { ink: '#0C120F', g: '#0E4A3A', g2: '#4FB08D', mint: '#CFE7DB', sage: '#A9C2B5', sand: '#E4DCCB', w: '#FFFFFF', mid: '#5E7A6C', faint: '#DCE5E0' };

  /* Pixel icons, authored on 12x12 grids */
  var ICONS = {
    people: ['000000000000','001100011000','011110111100','011110111100','001100011000','000000000000','011110111100','111111111110','111111111110','111111111110','000000000000','000000000000'],
    link:   ['000000000000','000011110000','000110011000','000100001000','000110011000','001111110000','011001100000','010000100000','011001100000','001111000000','000000000000','000000000000'],
    lang:   ['000000000000','011111100000','010000100000','011110100000','010000100000','011111111110','000001000010','000001011110','000001000010','000001111110','000000000000','000000000000'],
    lock:   ['000000000000','000111100000','001000010000','001000010000','001000010000','011111111000','011111111000','011100111000','011100111000','011111111000','000000000000','000000000000'],
    eye:    ['000000000000','000000000000','000111110000','011000001100','110011100110','100111110010','110011100110','011000001100','000111110000','000000000000','000000000000','000000000000'],
    chat:   ['000000000000','011111111100','010000000100','010110110100','010000000100','010111100100','010000000100','011111111100','011100000000','011000000000','010000000000','000000000000'],
    map:    ['000000000000','011101110111','010101010101','011101110111','000000000000','011101110000','010101010000','011101110000','000000000000','011100000000','010100000000','011100000000'],
    disk:   ['111111111110','100000000010','101111111010','101111111010','100000000010','100000000010','101111111010','101000001010','101011001010','101000001010','111111111110','000000000000'],
    site:   ['000000000000','000001100000','000011110000','000111111000','001111111100','011111111110','001000000100','001011010100','001011010100','001000000100','001111111100','000000000000'],
    flag:   ['000000000000','010000000000','011111111000','011111111000','011111111000','011111111000','010000000000','010000000000','010000000000','010000000000','010000000000','000000000000']
  };
  function icon(name, fill) {
    var g = ICONS[name], s = '<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">';
    for (var y = 0; y < 12; y++) for (var x = 0; x < 12; x++) if (g[y][x] === '1') s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + fill + '"/>';
    return s + '</svg>';
  }
  window.socracyIcon = icon;
  [].forEach.call(document.querySelectorAll('[data-icon]'), function (el) { el.innerHTML = icon(el.dataset.icon, el.dataset.fill || C.ink); });

  /* Facts and guarantees (home) */
  var FACTS = [
    ['people', 'Todo el equipo', 'Cada persona, o los equipos que elijas.'],
    ['link', 'Sin instalar nada', 'Un enlace por persona, móvil u ordenador.'],
    ['lang', 'Español e inglés', 'La entrevista, en español o en inglés.'],
    ['lock', 'Datos en la UE', 'Con contrato y sin entrenar modelos.'],
    ['eye', 'Nadie es evaluado', 'Ni juzgado ni sancionado por lo que cuenta.']
  ];
  if ($('facts')) $('facts').innerHTML = FACTS.map(function (f) { return '<div class="fact">' + icon(f[0], C.g) + '<div><b>' + f[1] + '</b><span>' + f[2] + '</span></div></div>'; }).join('');

  var GUAR = [
    ['Evaluación', 'green-2', 'Nadie es evaluado', 'Lo que se cuenta nunca sirve para juzgar ni sancionar a nadie.'],
    ['Anonimato', 'sage', 'Siempre se explica antes', 'Cada persona sabe si es anónimo o identificado antes de empezar.'],
    ['Datos', 'mint', 'Tus datos, con contrato', 'Tratados con contrato y nunca usados para entrenar modelos de IA.'],
    ['Trato', 'sand', 'Equipo, siempre', 'Un socio lleva tu reto de principio a fin, sin intermediarios.']
  ];
  if ($('guar')) $('guar').innerHTML = GUAR.map(function (g, i) { return '<div class="g"><span class="mono"><span class="key" data-k="' + g[1] + '">' + (i + 1) + '</span>' + g[0] + '</span><b>' + g[2] + '</b><span>' + g[3] + '</span></div>'; }).join('');

  function meter(n, of) { var on = Math.round(n / of * 10), s = '<span class="meter" aria-hidden="true">'; for (var i = 0; i < 10; i++) s += '<i' + (i < on ? ' class="on"' : '') + '></i>'; return s + '</span>'; }
  var COLS = [
    ['Qué falla', [
      ['Los palés no están donde dice el sistema.', 'Anoche lo dejaron en el muelle porque no había hueco.', [['area', 'Almacén'], ['', 'Noche']], 19],
      ['Los pedidos urgentes se meten a mano y rompen la ruta.', '', [['area', 'Expedición'], ['', 'Mañana']], 14],
      ['Las averías de noche se avisan por WhatsApp y se pierden.', '', [['area', 'Mantenimiento'], ['', 'Noche']], 9]]],
    ['Por qué pasa', [
      ['No hay huecos asignados cuando el almacén se llena.', '', [['', 'Procedimiento']], 0],
      ['El ERP no deja marcar la prioridad del pedido.', '', [['', 'Sistemas']], 0],
      ['No hay un canal para avisar fuera de horario.', 'Depende de a quién llames.', [['', 'Comunicación']], 0]]],
    ['Mejorar primero', [
      ['Zona de desborde con ubicación en el sistema.', '', [['hi', 'Impacto alto'], ['', 'Esfuerzo bajo']], 0],
      ['Un campo de prioridad y una franja fija para urgentes.', '', [['hi', 'Impacto alto'], ['', 'Esfuerzo medio']], 0],
      ['Aviso automático de averías al responsable de turno.', '', [['ai', 'Automatización'], ['', 'Esfuerzo bajo']], 0]]]
  ];
  if ($('cols')) $('cols').innerHTML = COLS.map(function (c) {
    return '<div class="col"><div class="col-h">' + c[0] + '<span class="c">' + c[1].length + '</span></div>' + c[1].map(function (k) {
      var chips = k[2].map(function (t) { return '<span class="chip ' + t[0] + '">' + t[1] + '</span>'; }).join('');
      return '<article class="card"><p>' + k[0] + '</p>' + (k[1] ? '<q>' + k[1] + '</q>' : '') + '<div class="chips">' + chips + '</div>' + (k[3] ? '<div class="voices">' + meter(k[3], 42) + k[3] + ' de 42 lo dicen</div>' : '') + '</article>';
    }).join('') + '</div>';
  }).join('');
  if ($('mani-icon')) $('mani-icon').innerHTML = icon('disk', C.ink);

  /* Method carousel (home) */
  var STEPS = [
    ['Eliges a quién escuchamos', 'Toda la plantilla o los equipos que tú decidas: un almacén, un turno, una planta. Antes de empezar lo explicamos a la gente y, si hace falta, al comité de empresa.', ['people', 'chat']],
    ['Cada persona, un enlace', 'Desde el móvil o el ordenador, cuando le venga bien, en español o en inglés. Un entrevistador de IA pregunta, escucha y repregunta hasta entender cómo se hace el trabajo de verdad. No es un formulario.', ['link', 'chat', 'lang']],
    ['El diagnóstico, en tu mesa', 'Los socios leen todo lo escuchado y te entregan el diagnóstico: qué falla, por qué pasa y qué mejorar primero. Cada conclusión dice cuántas personas lo plantean y se apoya en frases anónimas.', ['map', 'people']]
  ];
  var cur = 0, method = $('method');
  function show(i, anim) {
    if (!method) return;
    cur = (i + STEPS.length) % STEPS.length;
    $('m-num').textContent = '04.' + (cur + 1);
    $('m-h').textContent = STEPS[cur][0];
    $('m-p').textContent = STEPS[cur][1];
    $('m-icons').innerHTML = STEPS[cur][2].map(function (n) { return icon(n, C.ink); }).join('');
    [].forEach.call($('m-prog').children, function (b, k) { b.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    if (anim) { method.classList.remove('swap'); void method.offsetWidth; method.classList.add('swap'); }
  }
  if (method) {
    $('m-prog').innerHTML = STEPS.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-label="Paso ' + (i + 1) + ': ' + s[0] + '"><span>' + (i + 1) + '</span><i></i></button>'; }).join('');
    $('m-prev').onclick = function () { show(cur - 1, true); };
    $('m-next').onclick = function () { show(cur + 1, true); };
    $('m-prog').onclick = function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i, true); };
    show(0, false);
  }

  /* Cases menu (dropdown) */
  var mt = $('menu-btn'), mp = $('menu-panel');
  function closeMenu() { if (mp && !mp.hidden) { mp.hidden = true; mt.setAttribute('aria-expanded', 'false'); } }
  if (mt && mp) {
    mt.addEventListener('click', function (e) { e.stopPropagation(); var open = mp.hidden; mp.hidden = !open; mt.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', function (e) { if (!mp.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); mt.focus(); } });
    /* Teclado: flecha abajo abre y entra; flechas arriba/abajo, Inicio y Fin recorren los enlaces; Tab fuera del menú lo cierra. */
    var links = function () { return [].slice.call(mp.querySelectorAll('a')); };
    mt.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); if (mp.hidden) { mp.hidden = false; mt.setAttribute('aria-expanded', 'true'); } links()[0].focus(); } });
    mp.addEventListener('keydown', function (e) {
      var l = links(), i = l.indexOf(document.activeElement); if (i < 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); l[(i + 1) % l.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (i === 0) mt.focus(); else l[i - 1].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); l[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); l[l.length - 1].focus(); }
    });
    document.addEventListener('focusin', function (e) { if (!mp.hidden && !mp.contains(e.target) && e.target !== mt) closeMenu(); });
  }

  /* Keycaps */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.isContentEditable || /input|textarea|select/i.test(e.target.tagName || '')) return;
    var k = (e.key || '').toLowerCase(), t = document.querySelector('[data-key="' + k + '"]');
    if (t) { e.preventDefault(); userMoved = true; if (t.tagName === 'BUTTON') t.click(); else if (t.getAttribute('href').charAt(0) === '#') { var id = t.getAttribute('href').slice(1), el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setHash(id); } } else location.href = t.href; }
    if (method && (k === '1' || k === '2' || k === '3')) show(+k - 1, true);
  });

  /* Copy e-mail */
  if ($('copy')) $('copy').addEventListener('click', function () {
    var out = $('status'), mail = $('mail'), addr = this.getAttribute('data-mail') || mail.textContent.trim();
    function sel() { var r = document.createRange(); r.selectNodeContents(mail); var s = getSelection(); s.removeAllRanges(); s.addRange(r); out.textContent = 'Seleccionado: pulsa Cmd+C o Ctrl+C'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(function () { out.textContent = 'Copiado: ' + addr; }, sel); else sel();
  });

  /* ---------- Canvases ---------- */
  [].forEach.call(document.querySelectorAll('canvas[data-fit]'), function (c) {
    var k = +c.dataset.fit || 7;
    function fit() { if (!c.clientWidth) return; c.width = Math.max(40, Math.round(c.clientWidth / k)); c.height = Math.max(20, Math.round(c.clientHeight / k)); }
    fit(); addEventListener('resize', fit);
  });
  var B4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  function dith(v, x, y) { return v * 16 > B4[y & 3][x & 3] + 0.5; }
  function rand(x, y, s) { var n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); }
  function loop(el, draw) {
    var on = true, t0 = performance.now(), pending = false;
    draw(reduce ? 60 : 0);
    if (reduce) return;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; if (on) req(); }).observe(el);
    function req() { if (!pending) { pending = true; requestAnimationFrame(tick); } }
    function tick(now) { pending = false; if (!on) return; draw((now - t0) / 1000); req(); }
    req();
  }


  /* Lienzos de trazo limpio: se dibujan a la resolución de la pantalla, en píxeles CSS */
  function hd(c, draw) {
    var ctx = c.getContext('2d'), W = 0, H = 0;
    function fit() { var r = c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; if (!W || !H) return; c.width = Math.round(W * d); c.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); }
    fit(); addEventListener('resize', fit);
    loop(c, function (t) { if (!W || !H) fit(); if (!W || !H) return; ctx.clearRect(0, 0, W, H); draw(ctx, W, H, t); });
  }
  function ease(k) { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); }
  function dot(x, cx, cy, r, fill, stroke, lw) { x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 1; x.stroke(); } }
  function alpha(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }

  /* Lateral: todo el equipo, escuchado uno a uno; luego se agrupa por temas y vuelve a empezar */
  var pc = $('people');
  if (pc && pc.offsetParent !== null) {
    var PC = 7, PR = 8, PN = PC * PR, order = [];
    for (var i = 0; i < PN; i++) order.push(i);
    order.sort(function (a, b) { return rand(a, 1, 4) - rand(b, 1, 4); });
    var theme = order.map(function (k) { return Math.floor(rand(k, 3, 9) * 3); });
    var counter = $('people-n');
    hd(pc, function (x, w, h, t) {
      var ph = t % 26, heard = Math.min(PN, Math.floor(ph / 18 * PN)), grouped = ph > 19, cw = w / PC, ch = h / PR, r = Math.min(cw, ch) * 0.26;
      for (var k = 0; k < PN; k++) {
        var idx = order.indexOf(k), done = idx < heard, active = idx === heard && !grouped;
        var cx = (k % PC + 0.5) * cw, cy = (Math.floor(k / PC) + 0.5) * ch;
        var col = grouped ? [C.g, C.g2, C.sage][theme[idx]] : done ? C.g2 : null;
        dot(x, cx, cy, r, col, col ? null : C.sage, 1.2);
        if (active) { var a = (t * 1.2) % 1; dot(x, cx, cy, r + a * r * 1.6, null, alpha(C.g, 1 - a), 1.2); }
      }
      if (counter) counter.textContent = grouped ? 'Agrupado por temas' : 'Escuchadas: ' + heard + ' de ' + PN;
    });
  }

  /* Qué hacemos: muchas voces que llegan a una sola respuesta */
  var v = $('voices');
  if (v) {
    var VS = [];
    for (var i = 0; i < 30; i++) VS.push({ c: i % 5, j: rand(i, 2, 8), o: rand(i, 5, 1) });
    hd(v, function (x, w, h, t) {
      var n = w < 520 ? 16 : 30, T = 10, ph = t % T, fade = 1 - ease((ph - 8.6) / 1.2), hx = w * 0.7, hy = h / 2, arrived = 0;
      x.globalAlpha = fade; x.lineCap = 'round';
      for (var i = 0; i < n; i++) {
        var s = VS[i], sx = w * (0.04 + ((i * 0.618 + s.j * 0.35) % 1) * 0.28), sy = 16 + ((i + 0.5) / n) * (h - 32) + (s.o - 0.5) * 6;
        var t0 = 0.3 + s.o * 3, k = ease((ph - t0) / 1.6), mx = sx + (hx - sx) * 0.55;
        if (k > 0) {
          x.beginPath(); x.moveTo(sx, sy);
          for (var q = 1; q <= 32 * k; q++) { var u = q / 32, a = 1 - u; x.lineTo(a * a * a * sx + 3 * a * a * u * mx + 3 * a * u * u * mx + u * u * u * hx, a * a * a * sy + 3 * a * a * u * sy + 3 * a * u * u * hy + u * u * u * hy); }
          x.strokeStyle = alpha(C.g, k < 1 ? 0.45 : 0.16); x.lineWidth = 1.2; x.stroke();
          if (k < 1) { var u2 = k, a2 = 1 - u2; dot(x, a2 * a2 * a2 * sx + 3 * a2 * a2 * u2 * mx + 3 * a2 * u2 * u2 * mx + u2 * u2 * u2 * hx, a2 * a2 * a2 * sy + 3 * a2 * a2 * u2 * sy + 3 * a2 * u2 * u2 * hy + u2 * u2 * u2 * hy, 2.6, C.g2); }
          else arrived++;
        }
        dot(x, sx, sy, 4, k >= 1 ? C.g2 : C.w, k >= 1 ? null : C.sage, 1.2);
      }
      var full = arrived / n, out = ease((ph - 5.6) / 1.4), ex = hx + (w * 0.94 - hx) * out;
      if (out > 0) { x.beginPath(); x.moveTo(hx, hy); x.lineTo(ex, hy); x.strokeStyle = C.g; x.lineWidth = 3; x.stroke(); }
      if (out >= 1) { dot(x, w * 0.94, hy, 9, C.g); x.beginPath(); x.moveTo(w * 0.94 - 4, hy); x.lineTo(w * 0.94 - 1, hy + 3); x.lineTo(w * 0.94 + 4.5, hy - 3.5); x.strokeStyle = C.w; x.lineWidth = 2; x.stroke(); }
      dot(x, hx, hy, 5 + full * 6, C.g);
      x.globalAlpha = 1;
    });
  }


  /* Problema: de lo que cuentan unos pocos a lo que cuenta toda la plantilla */
  var rf = $('reach');
  if (rf) {
    var NS = 'http://www.w3.org/2000/svg', svg = rf.querySelector('svg'), COLS_N = 14, ROWS_N = 6, few = [17, 38, 51, 74];
    var hub = [240, 340], gl = document.createElementNS(NS, 'g'), gd = document.createElementNS(NS, 'g');
    svg.appendChild(gl); svg.appendChild(gd);
    for (var r = 0; r < ROWS_N; r++) for (var c = 0; c < COLS_N; c++) {
      var i = r * COLS_N + c, x = 32 + c * 32, y = 28 + r * 34, k = few.indexOf(i) >= 0;
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', x); ln.setAttribute('y1', y); ln.setAttribute('x2', hub[0]); ln.setAttribute('y2', hub[1]);
      ln.setAttribute('class', k ? 'k' : ''); ln.style.transitionDelay = (k ? 0 : (r * 0.09 + Math.abs(c - 6.5) * 0.03)) + 's';
      gl.appendChild(ln);
      var dt = document.createElementNS(NS, 'rect');
      dt.setAttribute('x', x - 5); dt.setAttribute('y', y - 5); dt.setAttribute('width', 10); dt.setAttribute('height', 10); dt.setAttribute('rx', 5);
      dt.setAttribute('class', k ? 'k' : ''); dt.style.transitionDelay = ln.style.transitionDelay;
      gd.appendChild(dt);
    }
    var hb = document.createElementNS(NS, 'g'); hb.setAttribute('class', 'hub');
    hb.innerHTML = '<rect x="' + (hub[0] - 46) + '" y="' + (hub[1] - 15) + '" width="92" height="30" rx="2"/><text x="' + hub[0] + '" y="' + (hub[1] + 4) + '" text-anchor="middle">Dirección</text>';
    svg.appendChild(hb);
    if (reduce) rf.classList.add('all');
    else {
      var phase = 0, onR = true, tmr;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onR = es[0].isIntersecting; }).observe(rf);
      (function step() { if (onR) { phase = 1 - phase; rf.classList.toggle('all', phase === 1); } tmr = setTimeout(step, phase === 1 ? 5200 : 3800); })();
    }
  }

  /* Por qué Socracy: rápido, fiable y cercano; tres círculos que se acercan hasta compartir el centro */
  [].forEach.call(document.querySelectorAll('canvas.b-plus'), function (c) {
    hd(c, function (x, w, h, t) {
      var cx = w / 2, cy = h / 2 + h * 0.03, r = Math.min(w, h) * 0.24, k = ease((Math.sin(t * 0.7) + 1) / 2), d = r * (1.05 - k * 0.55);
      var P3 = [0, 1, 2].map(function (i) { var a = -Math.PI / 2 + i * Math.PI * 2 / 3; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });
      x.save(); x.beginPath(); x.arc(P3[0][0], P3[0][1], r, 0, Math.PI * 2); x.clip(); x.beginPath(); x.arc(P3[1][0], P3[1][1], r, 0, Math.PI * 2); x.clip();
      x.beginPath(); x.arc(P3[2][0], P3[2][1], r, 0, Math.PI * 2); x.fillStyle = alpha(C.mint, 0.25 + k * 0.6); x.fill(); x.restore();
      P3.forEach(function (p) { dot(x, p[0], p[1], r, null, C.w, 1.6); });
    });
  });

  /* Contacto: un bocadillo que se escribe solo */
  var pl = $('plus');
  if (pl) hd(pl, function (x, w, h, t) {
    var s = Math.min(w, h), bw = s * 0.76, bh = s * 0.5, bx = (w - bw) / 2, by = (h - bh) / 2 - s * 0.06, rr = s * 0.07, ph = t % 6.4;
    x.lineJoin = 'round'; x.lineCap = 'round';
    x.beginPath(); x.moveTo(bx + rr, by); x.lineTo(bx + bw - rr, by); x.arcTo(bx + bw, by, bx + bw, by + rr, rr); x.lineTo(bx + bw, by + bh - rr); x.arcTo(bx + bw, by + bh, bx + bw - rr, by + bh, rr);
    x.lineTo(bx + bw * 0.34, by + bh); x.lineTo(bx + bw * 0.16, by + bh + s * 0.13); x.lineTo(bx + bw * 0.2, by + bh); x.lineTo(bx + rr, by + bh); x.arcTo(bx, by + bh, bx, by + bh - rr, rr); x.lineTo(bx, by + rr); x.arcTo(bx, by, bx + rr, by, rr); x.closePath();
    x.strokeStyle = C.w; x.lineWidth = Math.max(1.5, s * 0.018); x.stroke();
    if (ph < 2.6) { for (var i = 0; i < 3; i++) { var b = Math.max(0, Math.sin(t * 5 - i * 0.9)); dot(x, w / 2 + (i - 1) * s * 0.11, by + bh / 2 - b * s * 0.025, s * 0.028, alpha(C.w, 0.45 + b * 0.55)); } }
    else { var f = 1 - ease((ph - 5.6) / 0.8); x.strokeStyle = alpha(C.mint, f); x.lineWidth = Math.max(2, s * 0.026);
      [[0.62, 0], [0.42, 0.7]].forEach(function (L, i) { var k = ease((ph - 2.6 - L[1]) / 0.9); if (k <= 0) return; var y = by + bh * (0.36 + i * 0.3), x0 = bx + bw * 0.16; x.beginPath(); x.moveTo(x0, y); x.lineTo(x0 + bw * L[0] * k, y); x.stroke(); }); }
  });

  /* Operaciones: tres centros; la solución de uno viaja a los otros dos */
  var sm = $('sites');
  if (sm) hd(sm, function (x, w, h, t) {
    x.fillStyle = C.ink; x.fillRect(0, 0, w, h);
    var s = Math.min(w, h), ph = (t % 9) / 9, sites = [[0.3, 0.64], [0.55, 0.3], [0.78, 0.66]].map(function (p) { return [w * p[0], h * p[1]]; }), from = sites[1];
    [0, 2].forEach(function (j) { var to = sites[j]; x.beginPath(); x.moveTo(from[0], from[1]); x.quadraticCurveTo((from[0] + to[0]) / 2, Math.min(from[1], to[1]) - s * 0.08, to[0], to[1]); x.strokeStyle = alpha(C.mint, 0.18); x.lineWidth = 1; x.setLineDash([3, 5]); x.stroke(); x.setLineDash([]); });
    [0, 2].forEach(function (j, n) { var to = sites[j], k = ease((ph - 0.2 - n * 0.12) / 0.35); if (k <= 0 || k >= 1) return; var cx = (from[0] + to[0]) / 2, cy = Math.min(from[1], to[1]) - s * 0.08, a = 1 - k;
      dot(x, a * a * from[0] + 2 * a * k * cx + k * k * to[0], a * a * from[1] + 2 * a * k * cy + k * k * to[1], s * 0.022, C.w); });
    sites.forEach(function (p, i) { var solved = i === 1 || ph > 0.55 + i * 0.12; dot(x, p[0], p[1], s * 0.075, null, C.mid, 1.4); dot(x, p[0], p[1], s * 0.032, solved ? C.g2 : C.sand); });
  });


  /* ---------- Tabs «Cómo funciona»: auto-advance with progress, pause on interaction ---------- */
  var tl = document.querySelector('.tablist');
  if (tl) {
    var tabs = [].slice.call(tl.querySelectorAll('[role="tab"]')), panel = $('tab-panel'), cur2 = 0, start = performance.now(), DUR = 7000, paused = reduce, tcv = $('tab-canvas');
    var DATA = window.SOCRACY_TABS || [];
    function sel(i, user) {
      cur2 = (i + tabs.length) % tabs.length; start = performance.now();
      if (user) paused = true;
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === cur2 ? 'true' : 'false'); t.tabIndex = k === cur2 ? 0 : -1; t.style.setProperty('--p', k === cur2 && paused ? '100%' : '0%'); });
      var d = DATA[cur2]; if (d) { var tx = panel.querySelector('.txt'); tx.innerHTML = '<h3>' + d[0] + '</h3><p>' + d[1] + '</p>'; tx.classList.remove('in'); void tx.offsetWidth; tx.classList.add('in'); }
      panel.setAttribute('aria-labelledby', tabs[cur2].id);
      document.dispatchEvent(new Event('socracy:tab'));
    }
    window.SOCRACY_TABCTL = { cur: function () { return cur2; }, pause: function () { paused = true; tabs.forEach(function (t, k) { t.style.setProperty('--p', k === cur2 ? '100%' : '0%'); }); }, render: function () { var d = DATA[cur2]; if (d) { var tx = panel.querySelector('.txt'); tx.innerHTML = '<h3>' + d[0] + '</h3><p>' + d[1] + '</p>'; } } };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { sel(i, true); }); });
    tl.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { sel(cur2 + 1, true); tabs[cur2].focus(); e.preventDefault(); } if (e.key === 'ArrowLeft') { sel(cur2 - 1, true); tabs[cur2].focus(); e.preventDefault(); } });
    sel(0, false);
    if (!reduce) (function tick(now) {
      if (!paused) { var k = Math.min(1, (now - start) / DUR); tabs[cur2].style.setProperty('--p', (k * 100) + '%'); if (k >= 1) sel(cur2 + 1, false); }
      requestAnimationFrame(tick);
    })(performance.now());
    if (tcv) hd(tcv, function (x, w, h, t) {
      var cols = 10, rows = 3, cw = w / cols, ch = h / rows, r = Math.min(cw, ch) * 0.3, tt = (performance.now() - start) / DUR;
      for (var rr = 0; rr < rows; rr++) for (var c = 0; c < cols; c++) {
        var idx = rr * cols + c, col = null;
        if (cur2 === 0) col = idx < Math.floor(tt * 34) ? C.g2 : null;
        if (cur2 === 1) col = tt < 0.25 ? (idx % 3 === 0 ? C.g2 : null) : [C.g, C.g2, C.sage][(rand(c, rr, 5) * 3) | 0];
        if (cur2 === 2) col = rr === 0 ? C.g : (rr === 1 ? C.sage : null);
        if (cur2 === 2 && rr === 0 && c === Math.floor((t * 4) % cols)) col = C.ink;
        dot(x, (c + 0.5) * cw, (rr + 0.5) * ch, r, col, col ? null : C.sage, 1.2);
      }
    });
  }

  var no = $('noise');
  if (no) { var nx = no.getContext('2d'), drawNoise;
    function size() { no.width = Math.max(60, Math.round(no.clientWidth / 9)); no.height = Math.max(14, Math.round(no.clientHeight / 9)); if (drawNoise) drawNoise(2.2); }
    size(); addEventListener('resize', size);
    loop(no, drawNoise = function (t) { var w = no.width, h = no.height, f = Math.floor(t * 6); nx.fillStyle = C.ink; nx.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var r = rand(x, y, f % 50); if (r > 0.62) { var r2 = rand(x + f, y, 9); nx.fillStyle = r2 > 0.82 ? C.sand : r2 > 0.55 ? C.g2 : r2 > 0.3 ? C.mid : C.mint; nx.fillRect(x, y, 1, 1); } } }); }
})();

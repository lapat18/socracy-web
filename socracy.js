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
    ['people', 'Toda la plantilla', 'O los equipos que tú elijas.'],
    ['link', 'Sin instalar nada', 'Un enlace por persona, móvil u ordenador.'],
    ['lang', 'Español e inglés', 'La entrevista, en español o en inglés.'],
    ['lock', 'Datos en la UE', 'Con contrato y sin entrenar modelos.'],
    ['eye', 'Nadie es evaluado', 'Ni juzgado ni sancionado por lo que cuenta.']
  ];
  if ($('facts')) $('facts').innerHTML = FACTS.map(function (f) { return '<div class="fact">' + icon(f[0], C.g) + '<div><b>' + f[1] + '</b><span>' + f[2] + '</span></div></div>'; }).join('');

  var GUAR = [
    ['Evaluación', 'green-2', 'Nadie es evaluado', 'Lo que se cuenta nunca sirve para juzgar ni sancionar a nadie.'],
    ['Anonimato', 'sage', 'Siempre se explica antes', 'Cada persona sabe si es anónimo o identificado antes de empezar.'],
    ['Datos', 'mint', 'Tus datos, en la UE', 'Tratados con contrato y nunca usados para entrenar modelos de IA.'],
    ['Trato', 'sand', 'Marta y Javier, siempre', 'Llevan tu cuenta de principio a fin, sin intermediarios.']
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
    ['El diagnóstico, en tu mesa', 'Marta y Javier, los socios, leen todo lo escuchado y te entregan el diagnóstico: qué falla, por qué pasa y qué mejorar primero. Cada conclusión dice cuántas personas lo plantean y se apoya en frases anónimas.', ['map', 'people']]
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

  /* Side panel: the whole workforce, heard one by one. Each figure lights up after its conversation,
     a speech mark blinks over the one being interviewed, then they group by theme and start again. */
  var P = ['01100','11110','11110','01100','00000','11110','11111','11111'];
  var pc = $('people');
  if (pc && pc.offsetParent !== null) {
    var px = pc.getContext('2d'), COLS_N = 7, ROWS_N = 8, CW = 7, CH = 10, N = COLS_N * ROWS_N;
    var order = []; for (var i = 0; i < N; i++) order.push(i);
    order.sort(function (a, b) { return rand(a, 1, 4) - rand(b, 1, 4); });
    var theme = order.map(function (k) { return Math.floor(rand(k, 3, 9) * 3); });
    var counter = $('people-n');
    loop(pc, function (t) {
      var cycle = 26, ph = t % cycle, heard = Math.min(N, Math.floor(ph / 18 * N)), grouped = ph > 19;
      px.fillStyle = C.w; px.fillRect(0, 0, pc.width, pc.height);
      for (var r = 0; r < N; r++) {
        var k = r, idx = order.indexOf(k), done = idx < heard, active = idx === heard && !grouped;
        var col = grouped ? C.g : done ? C.g2 : C.faint;
        if (grouped) col = [C.g, C.g2, C.sage][theme[idx]];
        var gx = (k % COLS_N) * CW + 2, gy = Math.floor(k / COLS_N) * CH + 3;
        px.fillStyle = col;
        for (var yy = 0; yy < P.length; yy++) for (var xx = 0; xx < 5; xx++) if (P[yy][xx] === '1') px.fillRect(gx + xx, gy + yy, 1, 1);
        if (active && Math.floor(t * 3) % 2 === 0) { px.fillStyle = C.ink; px.fillRect(gx + 4, gy - 2, 3, 2); px.fillRect(gx + 4, gy, 1, 1); }
      }
      if (counter) counter.textContent = grouped ? 'Agrupado por temas' : 'Conversaciones: ' + heard + ' de ' + N;
    });
  }

  var v = $('voices');
  function field(w, h, t, x, y, seed) {
    var p = (Math.sin(t * 0.45 - 1.2) + 1) / 2, e = p * p * (3 - 2 * p);
    var noise = rand(Math.floor(x / 2), Math.floor(y / 2), seed + Math.floor(t * 1.6)) * 0.95;
    var colW = w / 3, cx = x % colW, inCol = cx > colW * 0.14 && cx < colW * 0.86;
    var rowH = h / 9, row = Math.floor(y / rowH), ry = (y % rowH) / rowH;
    var ci = Math.min(2, Math.floor(x / colW)), filled = row < [7, 5, 3][ci] + 1;
    var struct = inCol && ry > 0.18 && ry < 0.82 && filled && y > h * 0.06 ? 0.92 : 0.04;
    return noise * (1 - e) + struct * e;
  }
  if (v) { var vx = v.getContext('2d'); loop(v, function (t) {
    var w = v.width, h = v.height; vx.fillStyle = C.ink; vx.fillRect(0, 0, w, h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var val = field(w, h, t + 2, x, y, 7); if (dith(val, x, y)) { vx.fillStyle = val > 0.8 ? C.g2 : (rand(x, y, 3) > 0.7 ? C.mint : C.mid); vx.fillRect(x, y, 1, 1); } }
  }); }


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

  var m = $('m-canvas');
  if (m) { var mx = m.getContext('2d'); loop(m, function (t) {
    var w = m.width, h = m.height; mx.fillStyle = C.ink; mx.fillRect(0, 0, w, h);
    for (var i = 0; i < 7; i++) { var a = t * (0.4 + i * 0.07) + i * 0.9, r = 4 + i * 1.7;
      var x = Math.round(w / 2 + Math.cos(a) * r), y = Math.round(h / 2 + Math.sin(a * 1.3) * r * 0.8);
      mx.fillStyle = i % 3 ? C.w : C.g2; mx.fillRect(x, y, 2, 2);
      mx.fillStyle = C.mid; mx.fillRect(Math.round((x + w / 2) / 2), Math.round((y + h / 2) / 2), 1, 1); }
    mx.fillStyle = C.g2; mx.fillRect(w / 2 - 1, h / 2 - 1, 3, 3);
  }); }

  var pl = $('plus');
  if (pl) { var pp = pl.getContext('2d'); loop(pl, function (t) {
    pp.clearRect(0, 0, pl.width, pl.height);
    [[20, 20, 6], [33, 9, 3], [8, 32, 3], [31, 31, 2], [7, 8, 2]].forEach(function (c, i) {
      if (!reduce && Math.sin(t * 1.8 + i * 1.3) < -0.5) return;
      pp.fillStyle = i ? C.mint : C.w; var s = c[2];
      pp.fillRect(c[0] - s, c[1], s * 2 + 1, 1); pp.fillRect(c[0], c[1] - s, 1, s * 2 + 1);
      if (s > 3) pp.fillRect(c[0] - 1, c[1] - 1, 3, 3);
    });
  }); }

  /* Sites map for role pages: three sites, problems blink red-ish (sand) until the fix travels from the site that solved it */
  var sm = $('sites');
  if (sm) { var sx = sm.getContext('2d'); loop(sm, function (t) {
    var w = sm.width, h = sm.height; sx.fillStyle = C.ink; sx.fillRect(0, 0, w, h);
    for (var gy = 0; gy < h; gy += 4) for (var gx = (gy / 4) % 2 * 2; gx < w; gx += 4) { sx.fillStyle = '#18221D'; sx.fillRect(gx, gy, 1, 1); }
    var sites = [[0.42, 0.62], [0.62, 0.3], [0.8, 0.66]].map(function (p) { return [Math.round(w * p[0]), Math.round(h * p[1])]; }), ph = (t % 9) / 9;
    var S = ['0001111000','0011111100','0111111110','1111111111','1100110011','1100110011','1111111111'];
    sites.forEach(function (s, i) {
      var solved = i === 1 || ph > 0.55 + i * 0.12;
      for (var yy = 0; yy < S.length; yy++) for (var xx = 0; xx < 10; xx++) if (S[yy][xx] === '1') { sx.fillStyle = C.mid; sx.fillRect(s[0] - 5 + xx, s[1] - 4 + yy, 1, 1); }
      sx.fillStyle = solved ? C.g2 : C.sand; sx.fillRect(s[0] - 1, s[1] - 7, 3, 2);
    });
    var from = sites[1];
    [0, 2].forEach(function (j, n) { var to = sites[j], k = Math.min(1, Math.max(0, (ph - 0.2 - n * 0.12) / 0.35));
      if (k > 0 && k < 1) for (var d = 0; d < 3; d++) { var kk = Math.max(0, k - d * 0.04); sx.fillStyle = d ? C.mid : C.w; sx.fillRect(Math.round(from[0] + (to[0] - from[0]) * kk), Math.round(from[1] - 6 + (to[1] - from[1]) * kk), 2, 2); } });
  }); }


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
    if (tcv) { var tx2 = tcv.getContext('2d'); var R = ['00110','01001','10000','10000','01001','00110']; R = ['01110','10001','10001','10001','01110'];
      loop(tcv, function (t) {
        var w = tcv.width, h = tcv.height; tx2.fillStyle = C.w; tx2.fillRect(0, 0, w, h);
        var cols = 10, rows = 3, gx = 6, gy = 10, ox = 1, oy = 3, tt = (performance.now() - start) / DUR;
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          var idx = r * cols + c, col = C.faint;
          if (cur2 === 0) col = idx < Math.floor(tt * 34) ? C.g2 : C.faint;
          if (cur2 === 1) col = [C.g, C.g2, C.sage][(rand(c, r, 5) * 3) | 0];
          if (cur2 === 1 && tt < 0.25) col = idx % 3 === 0 ? C.g2 : C.faint;
          if (cur2 === 2) col = r === 0 ? C.g : (r === 1 ? C.sage : C.faint);
          if (cur2 === 2 && r === 0 && c === Math.floor((t * 4) % cols)) col = C.ink;
          tx2.fillStyle = col; for (var yy = 0; yy < 5; yy++) for (var xx = 0; xx < 5; xx++) if (R[yy][xx] === '1') tx2.fillRect(ox + c * gx + xx, oy + r * gy + yy, 1, 1);
        }
      });
    }
  }

  var no = $('noise');
  if (no) { var nx = no.getContext('2d'), drawNoise;
    function size() { no.width = Math.max(60, Math.round(no.clientWidth / 9)); no.height = Math.max(14, Math.round(no.clientHeight / 9)); if (drawNoise) drawNoise(2.2); }
    size(); addEventListener('resize', size);
    loop(no, drawNoise = function (t) { var w = no.width, h = no.height, f = Math.floor(t * 6); nx.fillStyle = C.ink; nx.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var r = rand(x, y, f % 50); if (r > 0.62) { var r2 = rand(x + f, y, 9); nx.fillStyle = r2 > 0.82 ? C.sand : r2 > 0.55 ? C.g2 : r2 > 0.3 ? C.mid : C.mint; nx.fillRect(x, y, 1, 1); } } }); }
})();

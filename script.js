(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Imágenes que todavía no están: quedan como espacio vacío ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    function marcar() { img.classList.add('falta'); }
    img.addEventListener('error', marcar);
    if (img.complete && img.naturalWidth === 0) marcar();
  });

  /* ---------- Cronograma ---------- */
  // c(titulo, descripcion, iconos [v = YouTube, k = chicos], tipo ['' | 'live' = actividad destacada])
  function c(t, d, i, k) { return { t: t, d: d, i: i || '', k: k || '' }; }
  // F(...) = invitado especial (celda azul con foto, ocupa 2 horarios)
  function F(t, d, img) { return { t: t, d: d, i: '', k: 'feat', img: img, span: 2 }; }
  var V = 'v', K = 'k';
  var ESQ = ['Esquina 1', 'Esquina 2', 'Esquina 3'];
  // 0 = celda vacía, null = celda ocupada por la de arriba (span 2)

  var DIAS = [
    {
      fecha: 'sábado 14', sub: 'el barrio se convierte en galería',
      filas: [
        ['12hs', [c('Inicio de evento', 'Bienvenida Trazo Oculto', V), 0, 0]],
        ['14hs', [c('Inauguración Museo', 'Apertura de galería de bocetos y procesos'),
                  c('Primeros trazos', 'Los artistas empiezan los murales', V),
                  c('Primeros trazos', 'Los artistas empiezan los murales')]],
        ['16hs', [0, c('Arte en vivo x Martín Ron', 'Demostración de técnicas de pintura', K, 'live'), 0]],
        ['18hs', [c('Taller de stencil x Martin Ron', 'Para aprender la técnica desde cero', K),
                  c('Sorteos x Sinteplast', '¡Acercate a buscar tu número!'),
                  F('CÍCLOPE', 'Charla con Pilar Tolosa y Julián Razquin', 'img/ciclope.png')]],
        ['20hs', [c('Taller de TAG x JOACO', 'Creación de firma propia', V),
                  c('Arte en vivo x Mariela Arjas', 'Demostración de técnicas de pintura', V, 'live'), null]]
      ]
    },
    {
      fecha: 'domingo 15', sub: 'el próximo trazo puede ser el tuyo',
      filas: [
        ['12hs', [0, c('Avances murales', 'Cámara en vivo', V), c('Avances murales', 'Cámara en vivo', V)]],
        ['14hs', [c('Votación Mural', 'El público elige el dibujo que se va a pintar', V),
                  F('PILAR DIBUJITO', 'Charla de ilustración e historia argentina', 'img/pilar-dibujito.png'), 0]],
        ['16hs', [c('Museo', 'Galería de bocetos y procesos'), null, 0]],
        ['18hs', [c('Taller para chicos x Andrea Milillo', 'Collage con materiales reciclados', K),
                  c('Sorteos x Wacom', 'Si compraste Merch, ya estás participando'),
                  c('Arte en vivo x Cíclope', 'Mural por expertos en arte urbano', V, 'live')]],
        ['20hs', [c('Dj Set x JOTAJOTA', 'Música en vivo'),
                  c('Arte Colaborativo', 'Actividad interactiva', K, 'live'), 0]]
      ]
    },
    {
      fecha: 'lunes 16', sub: 'conocé la historia de cada trazo',
      filas: [
        ['12hs', [0, c('Avances murales', 'Cámara en vivo', V), c('Avances murales', 'Cámara en vivo', V)]],
        ['14hs', [c('Sorteos x Montana Colors', 'Participá en nuestro perfil de Instagram', V),
                  c('Arte en vivo x Martín Ron', 'Demostración de técnicas de pintura', K, 'live'), 0]],
        ['16hs', [c('Museo', 'Galería de bocetos y procesos'), 0,
                  F('MARTÍN RON', 'Charla de arte urbano', 'img/martin-ron.png')]],
        ['18hs', [c('Taller de Serigrafía', 'Cada uno se lleva su afiche', K),
                  c('Entrevista a Vero Gatti', 'Charla con ilustradora', V), null]],
        ['20hs', [c('Taller de TAG x JOACO', 'Creación de firma propia', V),
                  c('Charla historia x Causi051', 'Muralista de San Telmo'), 0]]
      ]
    },
    {
      fecha: 'martes 17', sub: 'huellas que quedan en el barrio',
      filas: [
        ['12hs', [0, c('Avances murales', 'Cámara en vivo', V), c('Avances murales', 'Cámara en vivo', V)]],
        ['14hs', [c('Entrevista Mariela Ajras', 'Charla con psicóloga y artista'),
                  c('Mural más votado', 'Últimos detalles del mural más votado', V, 'live'), 0]],
        ['16hs', [c('Museo', 'Galería de bocetos y procesos'),
                  F('MURALISTAS ARG', 'Charla Irene Lasivita y Dana Alessi', 'img/muralistas-arg.png'),
                  c('Arte colaborativo', 'Creación mural en conjunto', '', 'live')]],
        ['18hs', [c('Taller de stencil', 'Inspirado en el barrio de Colegiales'), null,
                  c('Feria abierta', 'Merch + obras de artistas')]],
        ['20hs', [c('Dj Set x LuciaGM', 'Música en vivo hasta el cierre'), 0, 0]]
      ]
    }
  ];

  var elCrono = document.getElementById('crono');
  var tabs = document.querySelectorAll('.dias [role="tab"]');
  var elPanel = document.getElementById('dia');

  function iconos(i) {
    var s = '';
    if (i.indexOf('k') > -1) s += '<svg class="ico" role="img" aria-label="Ideal para chicos"><use href="#ico-kids"/></svg>';
    if (i.indexOf('v') > -1) s += '<svg class="ico" role="img" aria-label="Se transmite por YouTube"><use href="#ico-video"/></svg>';
    return s ? '<span class="iconos">' + s + '</span>' : '';
  }

  function celda(x, col) {
    if (x === null) return '';
    if (x === 0) return '<div class="celda vacia"></div>';
    var estilo = x.span ? ' style="grid-row:span ' + x.span + '"' : '';
    var foto = x.img ? '<img class="foto" src="' + x.img + '" alt="" onerror="this.classList.add(\'falta\')">' : '';
    return '<article class="celda ' + x.k + '"' + estilo + '>' +
      '<span class="esq">' + ESQ[col] + '</span>' +
      '<h4>' + x.t + '</h4><p>' + x.d + '</p>' + iconos(x.i) + foto + '</article>';
  }

  function mostrar(n) {
    var d = DIAS[n];
    document.getElementById('dia-n').textContent = n + 1;
    document.getElementById('dia-fecha').textContent = d.fecha;
    document.getElementById('dia-sub').textContent = d.sub;

    var h = '<div class="corner"></div>' + ESQ.map(function (e) { return '<div class="esq-h">' + e + '</div>'; }).join('');
    d.filas.forEach(function (f) {
      h += '<div class="fila"><div class="hora">' + f[0] + '</div>';
      f[1].forEach(function (x, col) { h += celda(x, col); });
      h += '</div>';
    });
    elCrono.innerHTML = h;

    tabs.forEach(function (t, i) {
      t.setAttribute('aria-selected', i === n ? 'true' : 'false');
      t.tabIndex = i === n ? 0 : -1;
    });

    // reinicia la animación de entrada
    elPanel.style.animation = 'none';
    void elPanel.offsetWidth;
    elPanel.style.animation = '';
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { mostrar(i); });
    t.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { mostrar(j); tabs[j].focus(); }
    });
  });
  mostrar(0);

  /* ---------- Carrusel de merch ---------- */
  var pista = document.getElementById('pista');
  var timer = null;

  function paso() {
    var it = pista.querySelector('.item');
    var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
    return it.getBoundingClientRect().width + gap;
  }

  function mover(dir) {
    var max = pista.scrollWidth - pista.clientWidth;
    var x = pista.scrollLeft + dir * paso();
    if (x > max + 4) x = 0;
    else if (x < -4) x = max;
    pista.scrollTo({ left: x, behavior: reduce ? 'auto' : 'smooth' });
  }

  function iniciar() {
    if (reduce || timer) return;
    timer = setInterval(function () { mover(1); }, 3500);
  }
  function parar() { clearInterval(timer); timer = null; }

  document.getElementById('prev').addEventListener('click', function () { mover(-1); });
  document.getElementById('next').addEventListener('click', function () { mover(1); });
  ['pointerenter', 'focusin', 'touchstart'].forEach(function (ev) {
    pista.parentNode.addEventListener(ev, parar, { passive: true });
  });
  ['pointerleave', 'focusout'].forEach(function (ev) {
    pista.parentNode.addEventListener(ev, iniciar);
  });
  iniciar();
})();

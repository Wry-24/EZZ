/* EZASSEMBLY - Interacciones extra (HU-04, 05, 08, 11, 16, 17, 23, 24) */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const store = {
    get: (k, d) => {
      try {
        const v = JSON.parse(localStorage.getItem(k));
        return v === null ? d : v;
      } catch (e) {
        return d;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    }
  };

  /* ---------- Utilidades: modal y aviso ---------- */
  const overlay = $('#modal-overlay');
  function modal(title, html) {
    if (!overlay || !$('#modal-title') || !$('#modal-body')) return;
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = html;
    overlay.classList.remove('hidden');
  }
  const closeModal = () => overlay?.classList.add('hidden');

  const toastEl = document.createElement('div');
  toastEl.className = 'toast hidden';
  toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 2600);
  }

  /* ---------- HU-04 y HU-08: listas de chequeo ---------- */
  const LISTAS = {
    tools: {
      id: 'prep-tools',
      key: 'ez_tools',
      nombre: 'herramientas',
      items: ['Destornillador Phillips', 'Llave Allen 5 mm', 'Martillo de goma', 'Nivel', 'Cinta métrica']
    },
    parts: {
      id: 'prep-parts',
      key: 'ez_parts',
      nombre: 'piezas',
      items: ['Tablero superior x1', 'Patas inclinadas x4', 'Travesaños x2', 'Bolsa de pernos Allen x8', 'Tarugos de madera x6', 'Panel posterior x1']
    }
  };

  function actualizarAvance(l) {
    const countEl = $('#' + l.id + '-count');
    const fillEl = $('#' + l.id + '-fill');
    if (!countEl || !fillEl) return;
    const marcados = store.get(l.key, []).length;
    const total = l.items.length;
    countEl.textContent = `${marcados} de ${total}`;
    fillEl.style.width = Math.round((marcados / total) * 100) + '%';
  }

  Object.values(LISTAS).forEach(l => {
    const box = $('#' + l.id);
    if (!box) return;
    const guardados = store.get(l.key, []);
    l.items.forEach((texto, i) => {
      const lab = document.createElement('label');
      lab.className = 'check-item';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = guardados.includes(i);
      cb.addEventListener('change', () => {
        const act = new Set(store.get(l.key, []));
        if (cb.checked) act.add(i);
        else act.delete(i);
        store.set(l.key, [...act]);
        actualizarAvance(l);
        if (cb.checked && act.size === l.items.length) {
          toast(`Listo: tienes todas las ${l.nombre}`);
        }
      });
      lab.append(cb, document.createTextNode(' ' + texto));
      box.appendChild(lab);
    });
    actualizarAvance(l);
  });

  const irAGuia = () => {
    const navBtn = $('.nav-item[data-view="view-guia3d"]') || $('[data-view="view-guia3d"]');
    navBtn?.click();
  };

  $('#btn-start-guide')?.addEventListener('click', () => {
    const faltan = Object.values(LISTAS).flatMap(l => {
      const ok = store.get(l.key, []);
      return l.items.filter((_, i) => !ok.includes(i));
    });
    if (!faltan.length || !overlay) {
      irAGuia();
      return;
    }
    modal(
      'Te faltan elementos',
      `<p>Aún no marcaste ${faltan.length}:</p>
      <ul class="missing-list">${faltan.map(f => `<li>${f}</li>`).join('')}</ul>
      <div class="modal-actions">
        <button type="button" class="soft-back-btn" id="mx-back">Volver a revisar</button>
        <button type="button" class="btn-bright-blue" id="mx-go">Empezar de todos modos</button>
      </div>`
    );
    const backBtn = $('#mx-back');
    const goBtn = $('#mx-go');
    if (backBtn) backBtn.onclick = closeModal;
    if (goBtn) {
      goBtn.onclick = () => {
        closeModal();
        irAGuia();
      };
    }
  });

  /* ---------- HU-05, 17, 24: detalle de cada paso ---------- */
  const PASO = {
    min: [5, 8, 10, 8, 9, 5],
    herraje: ['Bolsa de pernos y tarugos', 'Tarugos de madera x6', 'Tornillos Phillips', 'Pernos Allen M6 x8', 'Pernos Allen M6 x8', 'Ninguno (revisión final)'],
    tool: ['Manta y cutter con filo cubierto', 'Martillo de goma', 'Destornillador Phillips', 'Llave Allen 5 mm', 'Llave Allen 5 mm', 'Nivel y paño seco'],
    giro: ['Sin giro', 'Sin giro (encaje a presión)', 'Horario ↻', 'Horario ↻', 'Horario ↻', 'Sin giro (revisión)'],
    atornilla: [2, 3, 4]
  };

  const pill = $('#step-pill-label');
  const pasoActual = () => {
    if (!pill) return 0;
    return (parseInt((pill.textContent.match(/Paso (\d+)/) || [])[1], 10) || 1) - 1;
  };
  const totalPasos = () => {
    if (!pill) return PASO.min.length;
    return parseInt((pill.textContent.match(/de (\d+)/) || [])[1], 10) || PASO.min.length;
  };
  const dato = (campo, i) => PASO[campo][i % PASO[campo].length];

  const card = document.createElement('div');
  card.className = 'surface-card';
  card.innerHTML = `<h3>Detalle del paso</h3>
    <div class="spec-row"><span class="spec-label">Tiempo de este paso</span><strong id="dp-min"></strong></div>
    <div class="spec-row"><span class="spec-label">Tiempo restante</span><strong id="dp-resta"></strong></div>
    <div class="spec-row"><span class="spec-label">Herramienta</span><strong id="dp-tool"></strong></div>
    <div class="spec-row"><span class="spec-label">Sentido de giro</span><strong id="dp-giro"></strong></div>
    <div class="spec-row"><span class="spec-label">Herraje</span><strong id="dp-herraje"></strong></div>`;

  const guiaInstrCard = $('#view-guia3d .instruction-scalable-card');
  if (guiaInstrCard) guiaInstrCard.after(card);

  function pintarDetalle() {
    if (!$('#dp-min')) return;
    const i = pasoActual();
    const total = totalPasos();
    let resta = 0;
    for (let k = i; k < total; k++) resta += dato('min', k);
    $('#dp-min').textContent = dato('min', i) + ' min';
    $('#dp-resta').textContent = resta + ' min';
    $('#dp-tool').textContent = dato('tool', i);
    $('#dp-giro').textContent = dato('giro', i);
    $('#dp-herraje').textContent = dato('herraje', i);
  }

  if (pill) {
    new MutationObserver(pintarDetalle).observe(pill, { childList: true, characterData: true, subtree: true });
  }
  pintarDetalle();

  /* ---------- HU-16 y HU-23: confirmar antes de avanzar ---------- */
  let pasar = false;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-step-next');
    if (!btn || pasar || !overlay) return;
    const i = pasoActual();
    if (i >= totalPasos() - 1) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    const extra = PASO.atornilla.includes(i)
      ? '<label class="check-item"><input type="checkbox" class="cf"> La pieza está alineada y en el sentido correcto antes de atornillar</label>'
      : '';
    modal(
      `Antes de pasar al paso ${i + 2}`,
      `<p>Confirma para continuar:</p>
      <label class="check-item"><input type="checkbox" class="cf"> Tengo a mano: <strong>${dato('herraje', i)}</strong></label>${extra}
      <div class="modal-actions">
        <button type="button" class="soft-back-btn" id="cf-no">Volver</button>
        <button type="button" class="btn-bright-blue" id="cf-ok" disabled>Confirmar y avanzar</button>
      </div>`
    );
    const checks = [...document.querySelectorAll('#modal-body .cf')];
    const okBtn = $('#cf-ok');
    const noBtn = $('#cf-no');
    checks.forEach(c => {
      c.addEventListener('change', () => {
        if (okBtn) okBtn.disabled = !checks.every(x => x.checked);
      });
    });
    if (noBtn) noBtn.onclick = closeModal;
    if (okBtn) {
      okBtn.onclick = () => {
        closeModal();
        pasar = true;
        btn.click();
        pasar = false;
        toast(`Paso ${i + 1} completado`);
      };
    }
  }, true);

  /* ---------- HU-11: favoritos ---------- */
  const FAV = 'ez_favs';
  const favCard = document.createElement('div');
  favCard.className = 'surface-card';
  favCard.style.marginTop = '1rem';
  favCard.innerHTML = '<h3>Mis favoritos</h3><div id="fav-list"></div>';
  $('#view-perfil')?.appendChild(favCard);

  function pintarFavoritos() {
    const favs = store.get(FAV, []);
    document.querySelectorAll('.catalog-item-card').forEach(c => {
      const titleEl = $('h3', c);
      const b = $('.heart-btn', c);
      if (!titleEl || !b) return;
      const on = favs.includes(titleEl.textContent);
      b.classList.toggle('on', on);
      b.textContent = on ? '♥' : '♡';
      b.setAttribute('aria-pressed', on);
    });
    const lista = $('#fav-list');
    if (!lista) return;
    lista.innerHTML = '';
    if (!favs.length) {
      lista.textContent = 'Aún no guardas muebles. Toca ♡ en el catálogo para agregarlos.';
      return;
    }
    favs.forEach(n => {
      const fila = document.createElement('div');
      fila.className = 'spec-row';
      const nom = document.createElement('strong');
      nom.textContent = n;
      const q = document.createElement('button');
      q.type = 'button';
      q.className = 'soft-back-btn';
      q.style.width = 'auto';
      q.textContent = 'Quitar';
      q.onclick = () => alternarFavorito(n);
      fila.append(nom, q);
      lista.appendChild(fila);
    });
  }

  function alternarFavorito(nombre) {
    const favs = store.get(FAV, []);
    const i = favs.indexOf(nombre);
    if (i >= 0) favs.splice(i, 1);
    else favs.push(nombre);
    store.set(FAV, favs);
    pintarFavoritos();
    toast(i >= 0 ? `${nombre} quitado de favoritos` : `${nombre} guardado en favoritos`);
  }

  document.querySelectorAll('.catalog-item-card').forEach(c => {
    const titleEl = $('h3', c);
    const imgWrap = $('.cat-img-wrap', c);
    if (!titleEl || !imgWrap) return;
    const nombre = titleEl.textContent;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'heart-btn';
    b.setAttribute('aria-label', 'Favorito: ' + nombre);
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      alternarFavorito(nombre);
    });
    imgWrap.appendChild(b);
  });
  pintarFavoritos();

  /* ====================== FASE 2 ====================== */
  const PIEZAS = [
    ['T1', 'Tablero superior', 'Tablero', 1],
    ['P1', 'Pata inclinada', 'Tablero', 4],
    ['V1', 'Travesaño', 'Tablero', 2],
    ['H1', 'Perno Allen M6 x 40', 'Herraje', 8],
    ['H2', 'Tarugo de madera 8 x 30', 'Herraje', 6],
    ['H3', 'Tornillo Phillips 4 x 35', 'Herraje', 12]
  ];

  const HERR = [
    { n: 'Perno Allen M6 x 40', len: 40, diam: 6, bolsa: 'B-12', uso: 'Une las patas con el tablero superior.' },
    { n: 'Tornillo Phillips 4 x 35', len: 35, diam: 4, bolsa: 'B-07', uso: 'Fija los travesaños.' },
    { n: 'Tarugo de madera 8 x 30', len: 30, diam: 8, bolsa: 'B-03', uso: 'Alinea los paneles antes de ajustar.' },
    { n: 'Tornillo Confirmat 5 x 45', len: 45, diam: 5, bolsa: 'B-09', uso: 'Une paneles de melamina.' }
  ];

  const cod = [...document.querySelectorAll('.catalog-item-card[data-mueble]')].map(c => ({
    cod: 'EZ-100' + (c.dataset.mueble || '').replace(/\D/g, ''),
    nombre: $('h3', c)?.textContent || 'Mueble',
    card: c
  }));

  const opts = HERR.map((h, i) => `<option value="${i}">${h.n}</option>`).join('');
  const viewPiezas = $('#view-piezas');

  if (viewPiezas) {
    viewPiezas.innerHTML = `
      <p class="breadcrumb">Ensamblaje &gt; <strong>Piezas y herrajes</strong></p>
      <h1>Piezas y herrajes</h1>
      <p class="subtitle">Códigos de manual para el buscador: ${cod.map(c => `${c.cod} (${c.nombre})`).join(' · ')}</p>

      <div class="surface-card" style="margin-top:1.25rem">
        <h3>Inventario de piezas</h3>
        <div class="filter-row" id="inv-filtros">
          <button type="button" class="cat-pill active" data-f="todas">Todas</button>
          <button type="button" class="cat-pill" data-f="Tablero">Tableros</button>
          <button type="button" class="cat-pill" data-f="Herraje">Herrajes</button>
        </div>
        <p class="subtitle" id="inv-total"></p>
        <div id="inv-lista"></div>
      </div>

      <div class="ficha-split-grid" style="margin-top:1rem">
        <div class="surface-card">
          <h3>Visor de herrajes</h3>
          <div class="filter-row" id="vis-botones"></div>
          <div class="hw-stage"><img id="vis-img" src="assets/images/imagen9.png" alt="Herraje seleccionado"></div>
          <label class="rng">Giro <input type="range" id="vis-rot" min="0" max="360" value="0"></label>
          <label class="rng">Zoom <input type="range" id="vis-zoom" min="100" max="250" value="100"></label>
          <p class="subtitle" id="vis-info"></p>
        </div>
        <div class="surface-card">
          <h3>Comparador de medidas (mm)</h3>
          <label class="rng">Herraje A <select id="cmp-a">${opts}</select></label>
          <label class="rng">Herraje B <select id="cmp-b">${opts}</select></label>
          <div id="cmp-out"></div>
        </div>
      </div>

      <div class="surface-card" style="margin-top:1rem">
        <h3>Código de la bolsa de herrajes</h3>
        <div class="bag-stage"><div class="bag-label" id="bag-label"></div></div>
        <div class="modal-actions" style="justify-content:flex-start">
          <button type="button" class="soft-back-btn" id="bag-menos">Alejar −</button>
          <button type="button" class="btn-bright-blue" id="bag-mas">Acercar +</button>
          <button type="button" class="soft-back-btn" id="bag-reset">Restablecer</button>
          <span class="soft-blue-pill" id="bag-nivel">Zoom x1</span>
        </div>
      </div>`;

    /* HU-03: inventario con filtro */
    function pintarInventario(f) {
      const lista = PIEZAS.filter(p => f === 'todas' || p[2] === f);
      if ($('#inv-total')) {
        $('#inv-total').textContent = `${lista.length} tipos de pieza · ${lista.reduce((s, p) => s + p[3], 0)} unidades`;
      }
      if ($('#inv-lista')) {
        $('#inv-lista').innerHTML = lista.map(p => `<div class="spec-row"><span class="spec-label">${p[0]} · ${p[1]}</span><strong>x${p[3]}</strong></div>`).join('');
      }
    }

    document.querySelectorAll('#inv-filtros .cat-pill').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#inv-filtros .cat-pill').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        pintarInventario(b.dataset.f);
      });
    });
    pintarInventario('todas');

    /* HU-13: visor de herrajes */
    const visImg = $('#vis-img');
    function aplicarVisor() {
      if (!visImg || !$('#vis-rot') || !$('#vis-zoom')) return;
      visImg.style.transform = `rotate(${$('#vis-rot').value}deg) scale(${$('#vis-zoom').value / 100})`;
    }
    function elegirHerraje(i) {
      const h = HERR[i];
      if (!h) return;
      document.querySelectorAll('#vis-botones .cat-pill').forEach((b, k) => b.classList.toggle('active', k === i));
      if ($('#vis-info')) {
        $('#vis-info').textContent = `${h.n} · largo ${h.len} mm · diámetro ${h.diam} mm. ${h.uso}`;
      }
    }
    HERR.forEach((h, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat-pill';
      b.textContent = h.n.split(' ').slice(0, 2).join(' ');
      b.onclick = () => elegirHerraje(i);
      $('#vis-botones')?.appendChild(b);
    });
    $('#vis-rot')?.addEventListener('input', aplicarVisor);
    $('#vis-zoom')?.addEventListener('input', aplicarVisor);
    elegirHerraje(0);

    /* HU-14: comparador en milímetros */
    function comparar() {
      if (!$('#cmp-a') || !$('#cmp-b') || !$('#cmp-out')) return;
      const a = HERR[$('#cmp-a').value];
      const b = HERR[$('#cmp-b').value];
      const barra = h => `<div class="spec-label">${h.n}: ${h.len} mm de largo, ${h.diam} mm de diámetro</div><div class="len-bar"><span style="width:${(h.len / 50) * 100}%"></span></div>`;
      const d = a.len - b.len;
      const msg = a === b
        ? 'Elegiste el mismo herraje en A y B.'
        : d === 0
          ? 'Tienen el mismo largo.'
          : `${d > 0 ? 'A' : 'B'} es ${Math.abs(d)} mm más largo que ${d > 0 ? 'B' : 'A'}.`;
      $('#cmp-out').innerHTML = barra(a) + barra(b) + `<p><strong>${msg}</strong></p>`;
    }
    $('#cmp-a')?.addEventListener('change', comparar);
    $('#cmp-b')?.addEventListener('change', comparar);
    if ($('#cmp-b')) $('#cmp-b').value = '1';
    comparar();

    /* HU-18: zoom del código de bolsa */
    if ($('#bag-label')) {
      $('#bag-label').innerHTML = HERR.map(h => `${h.bolsa} · ${h.n}`).join('<br>');
    }
    let zb = 1;
    function zoomBolsa(v) {
      zb = Math.min(3, Math.max(1, v));
      if ($('#bag-label')) $('#bag-label').style.transform = `scale(${zb})`;
      if ($('#bag-nivel')) $('#bag-nivel').textContent = `Zoom x${zb.toFixed(1).replace('.0', '')}`;
    }
    if ($('#bag-mas')) $('#bag-mas').onclick = () => zoomBolsa(zb + 0.5);
    if ($('#bag-menos')) $('#bag-menos').onclick = () => zoomBolsa(zb - 0.5);
    if ($('#bag-reset')) $('#bag-reset').onclick = () => zoomBolsa(1);
  }

  /* HU-07: búsqueda por código de manual (ej. EZ-1001) */
  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'global-search-form') return;
    const inp = $('#global-search-input');
    const q = (inp?.value || '').trim();
    if (!/^ez-?\d{3,4}$/i.test(q)) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    const norm = q.toUpperCase().replace(/^EZ-?/, 'EZ-');
    const hit = cod.find(c => c.cod === norm);
    if (hit) {
      hit.card.click();
      toast(`Manual ${hit.cod}: ${hit.nombre}`);
    } else if (overlay) {
      modal('Código no encontrado', `<p>No hay un manual con el código <strong>${norm}</strong>. Prueba con: ${cod.map(c => c.cod).join(', ')}.</p>`);
    }
  }, true);

  /* ====================== FASE 3: Cargar instrucciones ====================== */
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

  const viewLectura = $('#view-lectura');
  if (viewLectura) {
    viewLectura.innerHTML = `
      <p class="breadcrumb">Cargar instrucciones &gt; <strong>Lectura del manual</strong></p>
      <h1 id="lec-titulo">Leyendo manual</h1>
      <div class="surface-card" style="margin-top:1.25rem">
        <span class="soft-blue-pill" id="lec-tipo"></span>
        <p class="subtitle" id="lec-estado"></p>
        <div class="progress-track"><div class="progress-fill" id="lec-barra" style="width:0%"></div></div>
        <div id="lec-datos"></div>
        <div class="lec-fotos" id="lec-fotos"></div>
        <div class="modal-actions" style="justify-content:flex-start">
          <button type="button" class="btn-green hidden" id="lec-ver">Ver guía 3D</button>
          <button type="button" class="soft-back-btn" id="lec-otro">Cargar otro archivo</button>
        </div>
      </div>`;
    if ($('#lec-ver')) $('#lec-ver').onclick = irAGuia;
    if ($('#lec-otro')) $('#lec-otro').onclick = () => ($('#go-cargar') || $('[data-view="view-cargar"]'))?.click();
  }

  function cargarPdfJs() {
    return new Promise((ok, fail) => {
      if (window.pdfjsLib) return ok(window.pdfjsLib);
      const base = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
      const s = document.createElement('script');
      s.src = base + 'pdf.min.js';
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + 'pdf.worker.min.js';
        ok(window.pdfjsLib);
      };
      s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  async function leerPdf(file) {
    const buf = await file.arrayBuffer();
    const raw = new TextDecoder('latin1').decode(new Uint8Array(buf));
    if (!raw.startsWith('%PDF')) throw new Error('El archivo no es un PDF válido.');
    try {
      const pdf = await (await cargarPdfJs()).getDocument({ data: buf }).promise;
      const tc = await (await pdf.getPage(1)).getTextContent();
      return {
        paginas: pdf.numPages,
        texto: tc.items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim()
      };
    } catch (e) {
      const m = raw.match(/\/Type\s*\/Page[^s]/g);
      return { paginas: m ? m.length : 1, texto: '' };
    }
  }

  async function avanzar(mensajes) {
    for (let i = 0; i < mensajes.length; i++) {
      if ($('#lec-estado')) $('#lec-estado').textContent = mensajes[i];
      if ($('#lec-barra')) $('#lec-barra').style.width = Math.round(((i + 1) / (mensajes.length + 1)) * 100) + '%';
      await espera(700);
    }
  }

  function datos(filas) {
    const box = $('#lec-datos');
    if (!box) return;
    box.innerHTML = '';
    filas.forEach(([k, v]) => {
      const fila = document.createElement('div');
      fila.className = 'spec-row';
      const a = document.createElement('span');
      a.className = 'spec-label';
      a.textContent = k;
      const b = document.createElement('strong');
      b.textContent = v;
      fila.append(a, b);
      box.appendChild(fila);
    });
  }

  function terminar(titulo) {
    if ($('#lec-titulo')) $('#lec-titulo').textContent = titulo;
    if ($('#lec-estado')) $('#lec-estado').textContent = 'Proceso terminado';
    if ($('#lec-barra')) $('#lec-barra').style.width = '100%';
    $('#lec-ver')?.classList.remove('hidden');
    toast('Proceso terminado: ya puedes ver la guía 3D');
  }

  async function procesar(tipo, files) {
    if (!viewLectura) return;
    ($('#go-lectura') || $('[data-view="view-lectura"]'))?.click();
    $('#lec-ver')?.classList.add('hidden');
    if ($('#lec-datos')) $('#lec-datos').innerHTML = '';
    if ($('#lec-fotos')) $('#lec-fotos').innerHTML = '';
    if ($('#lec-barra')) $('#lec-barra').style.width = '0%';
    const f = files[0];
    if (tipo === 'pdf') {
      if ($('#lec-titulo')) $('#lec-titulo').textContent = 'Leyendo PDF';
      if ($('#lec-tipo')) $('#lec-tipo').textContent = 'Manual en PDF';
      try {
        const [r] = await Promise.all([
          leerPdf(f),
          avanzar(['Abriendo el archivo...', 'Leyendo las páginas...', 'Armando la guía paso a paso...'])
        ]);
        datos([
          ['Archivo', f.name],
          ['Páginas leídas', String(r.paginas)],
          ['Tamaño', kb(f.size)],
          ['Texto detectado', r.texto ? r.texto.slice(0, 160) + (r.texto.length > 160 ? '...' : '') : 'Sin texto (PDF escaneado o de imágenes)'],
          ['Guía generada', '6 pasos para armar tu mueble']
        ]);
        terminar('PDF leído');
      } catch (err) {
        if ($('#lec-titulo')) $('#lec-titulo').textContent = 'No se pudo leer el PDF';
        if ($('#lec-estado')) $('#lec-estado').textContent = err.message || 'Intenta con otro archivo.';
        if ($('#lec-barra')) $('#lec-barra').style.width = '0%';
      }
    } else if (tipo === 'foto') {
      if ($('#lec-titulo')) $('#lec-titulo').textContent = 'Analizando fotos';
      if ($('#lec-tipo')) $('#lec-tipo').textContent = 'Fotos del manual';
      files.slice(0, 6).forEach(x => {
        const im = document.createElement('img');
        im.src = URL.createObjectURL(x);
        im.alt = x.name;
        $('#lec-fotos')?.appendChild(im);
      });
      await avanzar(['Subiendo fotos...', 'Detectando piezas y herrajes...', 'Reconociendo bolsas de herrajes...', 'Armando la guía paso a paso...']);
      datos([
        ['Fotos analizadas', String(files.length)],
        ['Bolsas de herrajes detectadas', HERR.slice(0, Math.min(HERR.length, files.length + 1)).map(h => h.bolsa).join(', ')],
        ['Manual leído', 'Escritorio Nórdico · 6 pasos'],
        ['Guía generada', 'Lista para usar']
      ]);
      terminar('Fotos analizadas');
    } else {
      if ($('#lec-titulo')) $('#lec-titulo').textContent = 'Procesando audio';
      if ($('#lec-tipo')) $('#lec-tipo').textContent = 'Instrucciones por audio';
      await avanzar(['Escuchando el audio...', 'Transcribiendo las instrucciones...', 'Armando la guía paso a paso...']);
      datos([
        ['Archivo', f.name],
        ['Tamaño', kb(f.size)],
        ['Manual leído', 'Escritorio Nórdico · 6 pasos'],
        ['Guía generada', 'Lista para usar']
      ]);
      terminar('Audio procesado');
    }
  }

  const picker = document.createElement('input');
  picker.type = 'file';
  picker.hidden = true;
  document.body.appendChild(picker);

  const ENTRADAS = {
    'btn-upload-pdf': ['application/pdf,.pdf', false, 'pdf'],
    'btn-upload-photo': ['image/*', true, 'foto'],
    'btn-upload-audio': ['audio/*', false, 'audio']
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('#btn-upload-pdf, #btn-upload-photo, #btn-upload-audio');
    if (!b) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    const [accept, multiple, tipo] = ENTRADAS[b.id];
    picker.value = '';
    picker.accept = accept;
    picker.multiple = multiple;
    picker.dataset.tipo = tipo;
    picker.click();
  }, true);

  picker.addEventListener('change', () => {
    const files = [...picker.files];
    const tipo = picker.dataset.tipo;
    if (!files.length) return;
    const valido = tipo === 'pdf'
      ? files[0].type === 'application/pdf' || /\.pdf$/i.test(files[0].name)
      : files.every(f => f.type.startsWith(tipo === 'foto' ? 'image/' : 'audio/'));
    if (!valido) {
      if (overlay) {
        modal('Archivo no válido', `<p>Elige ${tipo === 'pdf' ? 'un archivo PDF' : tipo === 'foto' ? 'imágenes (JPG o PNG)' : 'un archivo de audio'}.</p>`);
      } else {
        toast('Archivo no válido');
      }
      return;
    }
    if (files[0].size > 25 * 1048576) {
      if (overlay) {
        modal('Archivo muy pesado', '<p>El archivo supera los 25 MB. Prueba con uno más liviano.</p>');
      } else {
        toast('Archivo muy pesado');
      }
      return;
    }
    procesar(tipo, files);
  });

  /* ====================== FASE 4: HU-21, HU-02, HU-20 ====================== */
  const ORI = ['arriba', 'abajo', 'arriba', 'arriba', 'abajo', 'arriba'];
  const orCard = document.createElement('div');
  orCard.className = 'surface-card';
  orCard.innerHTML = `<h3>Orientación de la pieza</h3><p class="subtitle" id="or-pista"></p>
    <p class="subtitle">¿Hacia dónde miran los orificios de tu pieza?</p>
    <div class="modal-actions" style="justify-content:flex-start"><button type="button" class="soft-back-btn" data-o="arriba">Hacia arriba</button><button type="button" class="soft-back-btn" data-o="abajo">Hacia abajo</button></div>
    <div id="or-res" role="alert"></div>`;
  if (guiaInstrCard) guiaInstrCard.after(orCard);

  const oriCorrecta = () => ORI[pasoActual() % ORI.length];
  function pintarOri() {
    if ($('#or-pista')) $('#or-pista').textContent = `En este paso los orificios deben mirar hacia ${oriCorrecta()}.`;
    if ($('#or-res')) {
      $('#or-res').textContent = '';
      $('#or-res').className = '';
    }
  }
  orCard.querySelectorAll('[data-o]').forEach(b => {
    b.addEventListener('click', () => {
      const ok = b.dataset.o === oriCorrecta();
      if ($('#or-res')) {
        $('#or-res').className = ok ? 'alert-ok' : 'alert-bad';
        $('#or-res').textContent = ok
          ? 'Orientación correcta. Puedes continuar.'
          : `Alerta: la pieza está al revés. Gírala 180° para que los orificios miren hacia ${oriCorrecta()}. Si la fuerzas puedes dañar la melamina.`;
      }
    });
  });
  if (pill) {
    new MutationObserver(pintarOri).observe(pill, { childList: true, characterData: true, subtree: true });
  }
  pintarOri();

  /* HU-02: QR con ingreso de código */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#btn-open-qr') || !overlay) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    modal(
      'Escanear QR',
      `<p>Escribe el código impreso junto al QR de tu caja.</p>
      <input class="auth-input" id="qr-cod" placeholder="Ej. EZ-1001" autocomplete="off">
      <p class="alert-bad" id="qr-err" role="alert"></p>
      <div class="modal-actions"><button type="button" class="btn-bright-blue" id="qr-ok">Cargar manual</button></div>`
    );
    const okBtn = $('#qr-ok');
    if (okBtn) {
      okBtn.onclick = () => {
        const rawVal = ($('#qr-cod')?.value || '').trim();
        const q = rawVal.toUpperCase().replace(/^EZ-?/, 'EZ-');
        const hit = cod.find(c => c.cod === q);
        if (!hit) {
          if ($('#qr-err')) {
            $('#qr-err').textContent = `No encontramos "${rawVal}". Prueba con: ${cod.map(c => c.cod).join(', ')}.`;
          }
          return;
        }
        closeModal();
        hit.card.click();
        toast(`Manual ${hit.cod}: ${hit.nombre}`);
      };
    }
  }, true);

  /* HU-20: realidad aumentada interactiva */
  const ar = { on: false, x: 0, y: 0, r: 0, s: 1 };
  const arImg = $('#ar-img');
  const arCard = document.createElement('div');
  arCard.className = 'surface-card';
  arCard.innerHTML = `<h3>Controles de AR</h3><p class="subtitle" id="ar-msg"></p>
    <div class="modal-actions ar-btns">
      <button type="button" class="btn-green" id="ar-colocar">Colocar en el piso</button>
      <button type="button" class="soft-back-btn" data-ar="izq">◀</button><button type="button" class="soft-back-btn" data-ar="arr">▲</button>
      <button type="button" class="soft-back-btn" data-ar="aba">▼</button><button type="button" class="soft-back-btn" data-ar="der">▶</button>
      <button type="button" class="soft-back-btn" data-ar="rot">Girar 45°</button><button type="button" class="soft-back-btn" data-ar="mas">+</button>
      <button type="button" class="soft-back-btn" data-ar="menos">−</button><button type="button" class="soft-back-btn" id="ar-reset">Reiniciar</button>
    </div>`;
  $('#view-ar .ficha-right-col .surface-card')?.after(arCard);

  function pintarAr() {
    if (arImg) {
      arImg.style.transform = `translate(${ar.x}px, ${ar.y}px) rotate(${ar.r}deg) scale(${ar.s})`;
      arImg.style.opacity = ar.on ? 1 : 0.55;
    }
    arCard.querySelectorAll('[data-ar]').forEach(b => {
      b.disabled = !ar.on;
    });
    if ($('#ar-colocar')) $('#ar-colocar').textContent = ar.on ? 'Quitar del piso' : 'Colocar en el piso';
    if ($('#ar-msg')) {
      $('#ar-msg').textContent = ar.on
        ? 'Mueble colocado. Muévelo, gíralo o cambia su tamaño.'
        : 'Pulsa "Colocar en el piso" para fijar el mueble en tu espacio.';
    }
  }
  if ($('#ar-colocar')) {
    $('#ar-colocar').onclick = () => {
      ar.on = !ar.on;
      pintarAr();
      if (ar.on) toast('Mueble colocado en el piso');
    };
  }
  if ($('#ar-reset')) {
    $('#ar-reset').onclick = () => {
      Object.assign(ar, { on: false, x: 0, y: 0, r: 0, s: 1 });
      pintarAr();
    };
  }
  arCard.querySelectorAll('[data-ar]').forEach(b => {
    b.addEventListener('click', () => {
      const a = b.dataset.ar;
      const lim = v => Math.max(-60, Math.min(60, v));
      if (a === 'izq') ar.x = lim(ar.x - 15);
      if (a === 'der') ar.x = lim(ar.x + 15);
      if (a === 'arr') ar.y = lim(ar.y - 15);
      if (a === 'aba') ar.y = lim(ar.y + 15);
      if (a === 'rot') ar.r = (ar.r + 45) % 360;
      if (a === 'mas') ar.s = Math.min(1.6, ar.s + 0.1);
      if (a === 'menos') ar.s = Math.max(0.6, ar.s - 0.1);
      pintarAr();
    });
  });
  pintarAr();

  /* ====================== FASE 4: cuentas (registro, verificación, sesión) ====================== */
  const USERS = {
    get: () => store.get('ez_users', {}),
    set: v => store.set('ez_users', v)
  };
  const correoOk = c => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
  const claveOk = c => c.length >= 8 && /[A-Za-z]/.test(c) && /\d/.test(c);

  async function hash(txt, sal) {
    const data = new TextEncoder().encode(sal + txt);
    if (window.crypto && crypto.subtle) {
      return [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }
    let h = 5381;
    data.forEach(c => {
      h = ((h << 5) + h + c) | 0;
    });
    return 'f' + h;
  }

  const auth = document.createElement('div');
  auth.className = 'auth-overlay hidden';
  auth.innerHTML = `<div class="auth-card"><h2>EZASSEMBLY</h2>
    <form id="au-login" novalidate><h3>Iniciar sesión</h3>
      <label>Correo<input class="auth-input" type="email" id="li-mail" autocomplete="username"></label>
      <label>Contraseña<input class="auth-input" type="password" id="li-pass" autocomplete="current-password"></label>
      <p class="alert-bad" id="li-err" role="alert"></p>
      <button class="btn-bright-blue full-width" style="margin-top:1rem">Entrar</button>
      <p class="subtitle" style="margin-top:.8rem">¿No tienes cuenta? <a href="#" id="to-reg">Crear cuenta</a></p></form>
    <form id="au-reg" class="hidden" novalidate><h3>Crear cuenta</h3>
      <label>Nombre<input class="auth-input" id="rg-nom" autocomplete="name"></label>
      <label>Correo<input class="auth-input" type="email" id="rg-mail" autocomplete="email"></label>
      <label>Contraseña (mínimo 8, con letras y números)<input class="auth-input" type="password" id="rg-pass" autocomplete="new-password"></label>
      <label>Repite la contraseña<input class="auth-input" type="password" id="rg-pass2" autocomplete="new-password"></label>
      <p class="alert-bad" id="rg-err" role="alert"></p>
      <button class="btn-bright-blue full-width" style="margin-top:1rem">Registrarme</button>
      <p class="subtitle" style="margin-top:.8rem">¿Ya tienes cuenta? <a href="#" id="to-login">Iniciar sesión</a></p></form>
    <form id="au-ver" class="hidden" novalidate><h3>Verifica tu correo</h3>
      <p class="subtitle">Enviamos un código de 6 dígitos a <strong id="ve-mail"></strong>.</p>
      <p class="alert-ok" id="ve-demo"></p>
      <label>Código<input class="auth-input" id="ve-cod" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></label>
      <p class="alert-bad" id="ve-err" role="alert"></p>
      <button class="btn-bright-blue full-width" style="margin-top:1rem">Verificar</button>
      <p class="subtitle" style="margin-top:.8rem"><a href="#" id="ve-reenviar">Reenviar código</a> · <a href="#" id="ve-volver">Volver</a></p></form></div>`;
  document.body.appendChild(auth);

  const panel = n => {
    ['login', 'reg', 'ver'].forEach(p => $('#au-' + p)?.classList.toggle('hidden', p !== n));
    auth.querySelectorAll('.alert-bad').forEach(x => {
      x.textContent = '';
    });
  };

  if ($('#to-reg')) $('#to-reg').onclick = (e) => { e.preventDefault(); panel('reg'); };
  if ($('#to-login')) $('#to-login').onclick = (e) => { e.preventDefault(); panel('login'); };
  if ($('#ve-volver')) $('#ve-volver').onclick = (e) => { e.preventDefault(); panel('login'); };

  function enviarCodigo(email) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    store.set('ez_pend', { email, code, exp: Date.now() + 10 * 60000, tries: 0 });
    if ($('#ve-mail')) $('#ve-mail').textContent = email;
    if ($('#ve-demo')) $('#ve-demo').textContent = `Código de verificación (simulado, no se envía correo real): ${code}`;
    if ($('#ve-cod')) $('#ve-cod').value = '';
    panel('ver');
  }

  if ($('#ve-reenviar')) {
    $('#ve-reenviar').onclick = (e) => {
      e.preventDefault();
      const p = store.get('ez_pend', null);
      if (p) {
        enviarCodigo(p.email);
        toast('Código reenviado');
      }
    };
  }

  function aplicarUsuario() {
    const u = USERS.get()[store.get('ez_session', '')];
    if (!u) return;
    const set = (id, t) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t;
    };
    set('topbar-user-name', u.nombre);
    set('profile-display-name', u.nombre);
    set('profile-display-email', u.email);
  }

  if ($('#au-reg')) {
    $('#au-reg').onsubmit = async (e) => {
      e.preventDefault();
      const nom = ($('#rg-nom')?.value || '').trim();
      const mail = ($('#rg-mail')?.value || '').trim().toLowerCase();
      const p1 = $('#rg-pass')?.value || '';
      const p2 = $('#rg-pass2')?.value || '';
      const err = $('#rg-err');
      if (!nom || !correoOk(mail)) {
        if (err) err.textContent = 'Ingresa tu nombre y un correo válido.';
        return;
      }
      if (!claveOk(p1)) {
        if (err) err.textContent = 'La contraseña debe tener al menos 8 caracteres, letras y números.';
        return;
      }
      if (p1 !== p2) {
        if (err) err.textContent = 'Las contraseñas no coinciden.';
        return;
      }
      const users = USERS.get();
      if (users[mail]) {
        if (err) err.textContent = 'Ese correo ya está registrado.';
        return;
      }
      const sal = String(Date.now());
      users[mail] = { nombre: nom, email: mail, sal, pass: await hash(p1, sal), verificado: false };
      USERS.set(users);
      enviarCodigo(mail);
    };
  }

  if ($('#au-ver')) {
    $('#au-ver').onsubmit = (e) => {
      e.preventDefault();
      const pend = store.get('ez_pend', null);
      const codIngresado = ($('#ve-cod')?.value || '').trim();
      const err = $('#ve-err');
      if (!pend || Date.now() > pend.exp) {
        if (err) err.textContent = 'El código expiró. Solicita uno nuevo.';
        return;
      }
      if (codIngresado !== pend.code) {
        pend.tries = (pend.tries || 0) + 1;
        store.set('ez_pend', pend);
        if (err) err.textContent = 'Código incorrecto.';
        return;
      }
      const users = USERS.get();
      if (users[pend.email]) {
        users[pend.email].verificado = true;
        USERS.set(users);
      }
      store.set('ez_pend', null);
      store.set('ez_session', pend.email);
      auth.classList.add('hidden');
      aplicarUsuario();
      toast('Cuenta verificada');
    };
  }

  if ($('#au-login')) {
    $('#au-login').onsubmit = async (e) => {
      e.preventDefault();
      const mail = ($('#li-mail')?.value || '').trim().toLowerCase();
      const pass = $('#li-pass')?.value || '';
      const err = $('#li-err');
      const u = USERS.get()[mail];
      if (!u || (await hash(pass, u.sal)) !== u.pass) {
        if (err) err.textContent = 'Correo o contraseña incorrectos.';
        return;
      }
      if (!u.verificado) {
        enviarCodigo(mail);
        return;
      }
      store.set('ez_session', mail);
      auth.classList.add('hidden');
      aplicarUsuario();
      toast(`Bienvenido, ${u.nombre}`);
    };
  }

  if ($('#btn-logout-profile')) {
    $('#btn-logout-profile').onclick = () => {
      store.set('ez_session', '');
      panel('login');
      auth.classList.remove('hidden');
    };
  }

  aplicarUsuario();
});

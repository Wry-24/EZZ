document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view-section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobBtns = document.querySelectorAll('.mob-nav-btn');
  const sidebar = document.getElementById('desktop-sidebar');

  // Base de datos de los 4 muebles con pasos, vistas 360, transcripciones y herrajes compatibles propios
  const MUEBLES_DB = {
    m1: {
      nombre: 'Escritorio Nordico',
      subtitulo: 'Estilo moderno - Madera melamina',
      tiempo: '45 minutos',
      dificultad: 'Media',
      herrajes: 'Tornillos, tarugos, pernos',
      alto: '75 cm',
      ancho: '120 cm',
      fondo: '60 cm',
      img: 'assets/images/imagen2.png',
      audioSrc: '',
      vistas360: {
        frontal: 'assets/images/imagen2.png',
        lateral: 'assets/images/imagen2.png',
        perspectiva: 'assets/images/imagen2.png'
      },
      herrajesCompatibles: {
        pernos: {
          etiqueta: 'Pernos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Alto (Carga estructural de escritorio)',
          seguridadTexto: 'Para el Escritorio Nordico se recomiendan pernos metricos M6 de acero. Evita alternativas menores al 85% en el soporte de patas.',
          opciones: [
            { nombre: 'Perno Allen M6 x 40 mm', medida: 'Acero zincado - 8 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Perno Hexagonal M6 x 40 mm', medida: 'Acero carbono - 8 uds', rol: 'Alternativa 1', compatibilidad: 92 },
            { nombre: 'Perno Cabeza Redonda M6 x 35 mm', medida: 'Acero galvanizado - 8 uds', rol: 'Alternativa 2', compatibilidad: 80 }
          ]
        },
        tornillos: {
          etiqueta: 'Tornillos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Optimo para tablero melamina 18 mm',
          seguridadTexto: 'Los tornillos autorroscantes para melamina mantienen la union firme entre el tablero superior y los soportes laterales.',
          opciones: [
            { nombre: 'Tornillo Melamina 4.0 x 35 mm', medida: 'Rosca gruesa - 12 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tornillo Spax 4.0 x 30 mm', medida: 'Acero bicromatado - 12 uds', rol: 'Alternativa 1', compatibilidad: 90 },
            { nombre: 'Tornillo Madera 3.5 x 30 mm', medida: 'Cabeza avellanada - 12 uds', rol: 'Alternativa 2', compatibilidad: 78 }
          ]
        },
        tarugos: {
          etiqueta: 'Tarugos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Guia de alineacion',
          seguridadTexto: 'Los tarugos absorben el corte lateral de los travesanos del escritorio; deben ir acompanados de pernos.',
          opciones: [
            { nombre: 'Tarugo Madera Haya 8 x 30 mm', medida: 'Estriado - 6 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tarugo Madera Pino 8 x 30 mm', medida: 'Estriado - 6 uds', rol: 'Alternativa 1', compatibilidad: 88 },
            { nombre: 'Tarugo Plastico Estriado 8 x 30 mm', medida: 'Nylon rigido - 6 uds', rol: 'Alternativa 2', compatibilidad: 75 }
          ]
        }
      },
      pasos: [
        {
          titulo: 'Revision de tableros y herrajes',
          desc: 'Identifica el tablero superior, patas y bolsa de pernos.',
          duracion: 45,
          transcripcion: [
            '1. Coloca el tablero principal boca abajo sobre una manta.',
            '2. Separa los 8 pernos allen y los 6 tarugos de madera.',
            '3. Verifica que las 4 patas inclinadas no tengan golpes.'
          ]
        },
        {
          titulo: 'Ensamble de estructura base',
          desc: 'Une los travesanos inferiores con tarugos de madera.',
          duracion: 60,
          transcripcion: [
            '1. Inserta los tarugos en los extremos de los travesanos.',
            '2. Une el travesano central con los soportes laterales.',
            '3. Presiona suavemente hasta que encajen a ras.'
          ]
        },
        {
          titulo: 'Fijacion de patas laterales',
          desc: 'Atornilla las cuatro patas inclinadas a la base.',
          duracion: 55,
          transcripcion: [
            '1. Alinea la platina metalica de cada pata con los orificios.',
            '2. Ajusta los tornillos en cruz sin apretar al maximo.',
            '3. Confirma que la inclinacion apunte hacia afuera.'
          ]
        },
        {
          titulo: 'Union de panel lateral',
          desc: 'Asegura el panel soporte usando pernos allen.',
          duracion: 68,
          transcripcion: [
            '1. Insertar perno en el orificio del panel lateral.',
            '2. Desliza el panel lateral en la direccion indicada.',
            '3. Verifica el encaje completo con la llave allen.'
          ]
        },
        {
          titulo: 'Instalacion de cajonera',
          desc: 'Desliza las guias laterales y encaja el cajon.',
          duracion: 50,
          transcripcion: [
            '1. Atornilla las correderas en ambos costados internos.',
            '2. Introduce el cajon manteniendo nivelados los rieles.',
            '3. Prueba abrir y cerrar el cajon dos veces.'
          ]
        },
        {
          titulo: 'Colocacion de cubierta superior',
          desc: 'Fija el tablero principal y verifica nivelacion.',
          duracion: 40,
          transcripcion: [
            '1. Voltea el escritorio con ayuda de otra persona.',
            '2. Realiza el ajuste final de todos los pernos.',
            '3. Comprueba la estabilidad sobre el piso.'
          ]
        }
      ]
    },
    m2: {
      nombre: 'Estante Vertical',
      subtitulo: 'Estilo minimalista - Roble claro',
      tiempo: '60 minutos',
      dificultad: 'Baja',
      herrajes: 'Tarugos, escuadras, tornillos',
      alto: '180 cm',
      ancho: '80 cm',
      fondo: '32 cm',
      img: 'assets/images/imagen3.png',
      audioSrc: '',
      vistas360: {
        frontal: 'assets/images/imagen3.png',
        lateral: 'assets/images/imagen3.png',
        perspectiva: 'assets/images/imagen3.png'
      },
      herrajesCompatibles: {
        tornillos: {
          etiqueta: 'Tornillos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Alto (Soporte vertical de repisas)',
          seguridadTexto: 'El Estante Vertical de 180 cm requiere tornillos largos de 45 mm en los extremos para evitar pandeo.',
          opciones: [
            { nombre: 'Tornillo Confirmat 5.0 x 45 mm', medida: 'Cabeza plana - 16 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tornillo Madera 4.5 x 45 mm', medida: 'Acero zincado - 16 uds', rol: 'Alternativa 1', compatibilidad: 89 },
            { nombre: 'Tornillo Autorroscante 4.0 x 40 mm', medida: 'Acero negro - 16 uds', rol: 'Alternativa 2', compatibilidad: 76 }
          ]
        },
        tarugos: {
          etiqueta: 'Tarugos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Soporte directo de repisas',
          seguridadTexto: 'Cada repisa intermedia descarga peso sobre 4 tarugos de roble; usa exclusivamente madera dura.',
          opciones: [
            { nombre: 'Tarugo Roble 8 x 35 mm', medida: 'Madera dura - 16 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tarugo Haya 8 x 35 mm', medida: 'Madera prensada - 16 uds', rol: 'Alternativa 1', compatibilidad: 94 },
            { nombre: 'Tarugo Pino 8 x 30 mm', medida: 'Madera blanda - 16 uds', rol: 'Alternativa 2', compatibilidad: 72 }
          ]
        },
        escuadras: {
          etiqueta: 'Escuadras',
          seguridadNivel: 'warn',
          seguridadTitulo: 'Nivel de seguridad: Critico (Anclaje antivuelco)',
          seguridadTexto: 'Por su altura de 180 cm, es obligatorio instalar escuadras metalicas fijadas al muro.',
          opciones: [
            { nombre: 'Escuadra Metalica L 40 x 40 mm', medida: 'Acero 2 mm - 2 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Escuadra Reforzada 50 x 50 mm', medida: 'Acero galvanizado - 2 uds', rol: 'Alternativa 1', compatibilidad: 95 },
            { nombre: 'Correa Antivuelco Nylon', medida: 'Anclaje pared - 2 uds', rol: 'Alternativa 2', compatibilidad: 82 }
          ]
        }
      },
      pasos: [
        {
          titulo: 'Preparacion de parantes verticales',
          desc: 'Ubica los dos paneles laterales largos sobre superficie plana.',
          duracion: 40,
          transcripcion: [
            '1. Extiende los dos parantes de 180 cm en paralelo.',
            '2. Orienta los bordes ranurados hacia el interior.',
            '3. Ten a mano los 16 tarugos de roble.'
          ]
        },
        {
          titulo: 'Insercion de tarugos guia',
          desc: 'Coloca los tarugos en los orificios de nivel.',
          duracion: 35,
          transcripcion: [
            '1. Introduce dos tarugos por cada nivel de repisa.',
            '2. Asegurate de que entren hasta la mitad de su longitud.',
            '3. Limpia cualquier residuo de aserrin.'
          ]
        },
        {
          titulo: 'Fijacion de repisas centrales',
          desc: 'Encaja las repisas intermedias en orden ascendente.',
          duracion: 65,
          transcripcion: [
            '1. Coloca la repisa inferior sobre el primer parante.',
            '2. Continua con las repisas del medio respetando la distancia.',
            '3. Une el segundo parante presionando de abajo hacia arriba.'
          ]
        },
        {
          titulo: 'Cierre de tablero superior e inferior',
          desc: 'Atornilla los extremos para dar rigidez.',
          duracion: 50,
          transcripcion: [
            '1. Fija la tapa superior con cuatro tornillos largos.',
            '2. Ajusta la base inferior con el mismo procedimiento.',
            '3. Verifica que el estante forme un angulo recto.'
          ]
        },
        {
          titulo: 'Anclaje de escuadras de pared',
          desc: 'Instala los soportes antivuelco superiores.',
          duracion: 45,
          transcripcion: [
            '1. Levanta el estante verticalmente en su ubicacion.',
            '2. Atornilla las dos escuadras en la parte posterior superior.',
            '3. Fija los tarugos a la pared para evitar vuelcos.'
          ]
        }
      ]
    },
    m3: {
      nombre: 'Mesa de Centro',
      subtitulo: 'Estilo contemporaneo - Madera natural',
      tiempo: '30 minutos',
      dificultad: 'Baja',
      herrajes: 'Pernos allen, tarugos',
      alto: '42 cm',
      ancho: '100 cm',
      fondo: '55 cm',
      img: 'assets/images/imagen4.png',
      audioSrc: '',
      vistas360: {
        frontal: 'assets/images/imagen4.png',
        lateral: 'assets/images/imagen4.png',
        perspectiva: 'assets/images/imagen4.png'
      },
      herrajesCompatibles: {
        pernos: {
          etiqueta: 'Pernos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Alto (Union oculta bajo cubierta)',
          seguridadTexto: 'La Mesa de Centro utiliza pernos cortos M6 x 25 mm para no perforar la superficie visible del tablero.',
          opciones: [
            { nombre: 'Perno Allen M6 x 25 mm', medida: 'Acero negro - 8 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Perno Hexagonal M6 x 25 mm', medida: 'Acero zincado - 8 uds', rol: 'Alternativa 1', compatibilidad: 91 },
            { nombre: 'Perno Allen M6 x 30 mm (con arandela)', medida: 'Requiere doble arandela', rol: 'Alternativa 2', compatibilidad: 80 }
          ]
        },
        tarugos: {
          etiqueta: 'Tarugos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Estabilidad de bandeja inferior',
          seguridadTexto: 'Los tarugos fijan la repisa revistero sin dejar tornillos a la vista.',
          opciones: [
            { nombre: 'Tarugo Madera 8 x 30 mm', medida: 'Haya natural - 8 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tarugo Madera 8 x 28 mm', medida: 'Pino estriado - 8 uds', rol: 'Alternativa 1', compatibilidad: 87 },
            { nombre: 'Tarugo Estriado 6 x 30 mm', medida: 'Menor diametro - No recomendado', rol: 'Alternativa 2', compatibilidad: 60 }
          ]
        }
      },
      pasos: [
        {
          titulo: 'Clasificacion de piezas',
          desc: 'Separa la cubierta principal, repisa inferior y soportes.',
          duracion: 30,
          transcripcion: [
            '1. Identifica el tablero ovalado superior de 100 cm.',
            '2. Ubica la bandeja revistero inferior y las 4 patas.',
            '3. Prepara la llave allen incluida en el empaque.'
          ]
        },
        {
          titulo: 'Ensamble de base inferior',
          desc: 'Une la bandeja inferior a las patas centrales.',
          duracion: 50,
          transcripcion: [
            '1. Conecta las cuatro patas a la bandeja inferior.',
            '2. Inserta los pernos allen desde el interior.',
            '3. Ajusta de forma pareja para mantener el nivel.'
          ]
        },
        {
          titulo: 'Fijacion de cubierta superior',
          desc: 'Ajusta los pernos allen desde la cara interna.',
          duracion: 45,
          transcripcion: [
            '1. Apoya la cubierta superior boca abajo.',
            '2. Centra la estructura de patas sobre los insertos.',
            '3. Aprieta firmemente los cuatro pernos superiores.'
          ]
        },
        {
          titulo: 'Colocacion de topes antideslizantes',
          desc: 'Adhiere las gomas protectoras en la base de cada pata.',
          duracion: 25,
          transcripcion: [
            '1. Pega un fieltro antideslizante en cada pata.',
            '2. Voltea la mesa de centro y apoyala en la sala.',
            '3. Comprueba que no cojee sobre el suelo.'
          ]
        }
      ]
    },
    m4: {
      nombre: 'Comoda 3 Cajones',
      subtitulo: 'Estilo nordico - Madera natural',
      tiempo: '50 minutos',
      dificultad: 'Media',
      herrajes: 'Rieles telescopicos, pernos, tiradores',
      alto: '85 cm',
      ancho: '95 cm',
      fondo: '45 cm',
      img: 'assets/images/imagen5.png',
      audioSrc: '',
      vistas360: {
        frontal: 'assets/images/imagen5.png',
        lateral: 'assets/images/imagen5.png',
        perspectiva: 'assets/images/imagen5.png'
      },
      herrajesCompatibles: {
        pernos: {
          etiqueta: 'Pernos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Sistema Minifix excentrico',
          seguridadTexto: 'La Comoda 3 Cajones usa pernos excentricos Minifix para mantener ocultas las uniones laterales.',
          opciones: [
            { nombre: 'Perno Minifix + Caja Excentrica 15 mm', medida: 'Zamac - 12 juegos', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Perno Conector Rapido 15 mm', medida: 'Acero niquelado - 12 juegos', rol: 'Alternativa 1', compatibilidad: 93 },
            { nombre: 'Escuadra Interna Plastica', medida: 'Fijacion auxiliar - 12 uds', rol: 'Alternativa 2', compatibilidad: 74 }
          ]
        },
        tornillos: {
          etiqueta: 'Tornillos',
          seguridadNivel: 'ok',
          seguridadTitulo: 'Nivel de seguridad: Fijacion de correderas',
          seguridadTexto: 'Usa tornillos de cabeza plana para que no rocen con el deslizamiento de los cajones.',
          opciones: [
            { nombre: 'Tornillo Cabeza Plana 3.5 x 16 mm', medida: 'Acero zincado - 24 uds', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Tornillo Euro 6.3 x 13 mm', medida: 'Para rieles - 24 uds', rol: 'Alternativa 1', compatibilidad: 95 },
            { nombre: 'Tornillo Cabeza Redonda 3.5 x 16 mm', medida: 'Puede rozar el riel', rol: 'Alternativa 2', compatibilidad: 70 }
          ]
        },
        rieles: {
          etiqueta: 'Rieles',
          seguridadNivel: 'warn',
          seguridadTitulo: 'Nivel de seguridad: Capacidad de carga por cajon (15 kg)',
          seguridadTexto: 'Respeta el largo de 400 mm para que los 3 cajones cierren al ras del marco de la comoda.',
          opciones: [
            { nombre: 'Riel Telescopico 400 mm (35 mm)', medida: 'Extraccion total - 3 pares', rol: 'Original', compatibilidad: 100 },
            { nombre: 'Corredera Metalica Simple 400 mm', medida: 'Extraccion parcial - 3 pares', rol: 'Alternativa 1', compatibilidad: 86 },
            { nombre: 'Riel Telescopico 350 mm', medida: 'Mas corto - Reduce apertura', rol: 'Alternativa 2', compatibilidad: 75 }
          ]
        }
      },
      pasos: [
        {
          titulo: 'Armado del marco exterior',
          desc: 'Conecta laterales con la base y el travesano superior.',
          duracion: 55,
          transcripcion: [
            '1. Une los paneles laterales con la base de la comoda.',
            '2. Coloca el travesano frontal superior con tarugos.',
            '3. Ajusta los pernos excentricos con un cuarto de vuelta.'
          ]
        },
        {
          titulo: 'Instalacion de rieles laterales',
          desc: 'Atornilla los tres pares de rieles telescopicos.',
          duracion: 60,
          transcripcion: [
            '1. Separa la guia interna de cada riel telescopico.',
            '2. Atornilla los tres rieles en el lateral izquierdo y derecho.',
            '3. Verifica que la rueda quede mirando hacia el frente.'
          ]
        },
        {
          titulo: 'Fijacion de panel trasero',
          desc: 'Clava o atornilla el fondo para escuadrar el mueble.',
          duracion: 40,
          transcripcion: [
            '1. Alinea el tablero trasero sobre el marco.',
            '2. Fija primero las cuatro esquinas para escuadrar.',
            '3. Completa los puntos intermedios cada 15 cm.'
          ]
        },
        {
          titulo: 'Ensamble de los 3 cajones',
          desc: 'Arma los frentes, laterales y fondos de cada cajon.',
          duracion: 75,
          transcripcion: [
            '1. Une los costados de cada cajon al frente decorativo.',
            '2. Desliza el fondo del cajon por la ranura inferior.',
            '3. Atornilla las guias restantes en los costados del cajon.'
          ]
        },
        {
          titulo: 'Colocacion de tiradores y montaje',
          desc: 'Instala los tiradores e inserta los cajones en sus rieles.',
          duracion: 50,
          transcripcion: [
            '1. Fija los tiradores en el centro de cada frente.',
            '2. Encaja los cajones de abajo hacia arriba en sus rieles.',
            '3. Verifica el deslizamiento suave de los tres niveles.'
          ]
        }
      ]
    }
  };

  let muebleActualId = 'm1';
  let imagenMuebleActual = MUEBLES_DB.m1.img;
  let pasoIndiceActual = 0;

  // Estado del reproductor de audio del paso
  let audioTimer = null;
  let audioElapsed = 0;
  let audioDuration = 45;
  let isPlayingAudio = false;
  let speechRate = 1;

  // Estado de transformacion de la imagen 3D
  let rot = 0;
  let zoomed = false;

  // Estado de Entorno Virtual 360
  const viewCards = document.querySelectorAll('.view-option-card');
  let viewIdx = 0;

  // Estado de Accesibilidad Visual
  let accFontSizeClass = 'font-normal';
  let accThemeMode = 'light';
  let accContrastMode = 'standard';

  function applyAccessibilitySettings() {
    const masterOn = document.getElementById('chk-acc-master')?.checked ?? true;

    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(masterOn ? accFontSizeClass : 'font-normal');

    document.body.classList.toggle('theme-dark', masterOn && accThemeMode === 'dark');
    document.body.classList.toggle('high-contrast', masterOn && accContrastMode === 'high');

    const pctLabel = document.getElementById('acc-size-pct-label');
    if (pctLabel) {
      if (!masterOn) {
        pctLabel.textContent = 'Modo accesibilidad desactivado (+0%)';
      } else if (accFontSizeClass === 'font-large') {
        pctLabel.textContent = '+25% (Texto e instrucciones ampliadas)';
      } else if (accFontSizeClass === 'font-xlarge') {
        pctLabel.textContent = '+45% (Lectura maxima en instrucciones)';
      } else {
        pctLabel.textContent = '+0% (Tamano estandar)';
      }
    }
  }

  function formatSeconds(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function stopSpeechIfActive() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function updateTranscriptHighlight() {
    const items = document.querySelectorAll('#audio-steps-list .audio-step-item');
    if (!items.length) return;
    const ratio = audioDuration > 0 ? audioElapsed / audioDuration : 0;
    const activeLine = Math.min(items.length - 1, Math.floor(ratio * items.length));
    items.forEach((el, idx) => {
      el.classList.toggle('active-yellow', idx === activeLine);
    });
  }

  function updateAudioUI() {
    const timeText = `${formatSeconds(audioElapsed)} / ${formatSeconds(audioDuration)}`;
    const pct = audioDuration > 0 ? Math.min(100, (audioElapsed / audioDuration) * 100) : 0;

    const timeDisplay = document.getElementById('audio-time-display');
    const progressFill = document.getElementById('audio-progress-fill');
    if (timeDisplay) timeDisplay.textContent = timeText;
    if (progressFill) progressFill.style.width = `${pct}%`;

    const agTimeDisplay = document.getElementById('audioguia-time-display');
    const agProgressFill = document.getElementById('audioguia-progress-fill');
    if (agTimeDisplay) agTimeDisplay.textContent = timeText;
    if (agProgressFill) agProgressFill.style.width = `${pct}%`;

    updateTranscriptHighlight();
  }

  function setPlayButtonsLabel(label) {
    const btn1 = document.getElementById('btn-play-step');
    const btn2 = document.getElementById('btn-speak-step');
    if (btn1) btn1.textContent = label;
    if (btn2) btn2.textContent = label;
  }

  function resetAudioPlayer(durationSec) {
    if (audioTimer) clearInterval(audioTimer);
    stopSpeechIfActive();
    isPlayingAudio = false;
    audioElapsed = 0;
    audioDuration = durationSec || 45;
    setPlayButtonsLabel('PLAY');
    updateAudioUI();
  }

  function renderAudioGuiaTranscript() {
    const mueble = MUEBLES_DB[muebleActualId];
    if (!mueble) return;
    const paso = mueble.pasos[pasoIndiceActual] || mueble.pasos[0];
    const total = mueble.pasos.length;

    const heading = document.getElementById('audioguia-main-heading');
    if (heading) heading.textContent = `Audio-guia - ${mueble.nombre}`;

    const sub = document.getElementById('audioguia-subtitle');
    if (sub) sub.textContent = `Escucha las instrucciones del Paso ${pasoIndiceActual + 1} de ${total} (${paso.titulo})`;

    const tHeading = document.getElementById('audioguia-transcript-heading');
    if (tHeading) tHeading.textContent = `Instrucciones: ${paso.titulo}`;

    const listEl = document.getElementById('audio-steps-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const lineas = paso.transcripcion || [paso.desc];
    lineas.forEach((linea, idx) => {
      const div = document.createElement('div');
      div.className = 'audio-step-item' + (idx === 0 ? ' active-yellow' : '');
      div.textContent = linea;
      div.addEventListener('click', () => {
        document.querySelectorAll('#audio-steps-list .audio-step-item').forEach(i => i.classList.remove('active-yellow'));
        div.classList.add('active-yellow');
        speakCustomText(linea);
      });
      listEl.appendChild(div);
    });
  }

  function speakCustomText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = speechRate;
    window.speechSynthesis.speak(u);
  }

  function startAudioPlayback(withVoice) {
    if (isPlayingAudio) return;
    isPlayingAudio = true;
    setPlayButtonsLabel('ON');

    if (withVoice) {
      const listEl = document.getElementById('audio-steps-list');
      if (listEl) speakCustomText(listEl.innerText);
    }

    audioTimer = setInterval(() => {
      if (audioElapsed < audioDuration) {
        audioElapsed += 1;
        updateAudioUI();
      } else {
        clearInterval(audioTimer);
        isPlayingAudio = false;
        setPlayButtonsLabel('PLAY');
      }
    }, 1000);
  }

  function pauseAudioPlayback() {
    if (audioTimer) clearInterval(audioTimer);
    stopSpeechIfActive();
    isPlayingAudio = false;
    setPlayButtonsLabel('PLAY');
  }

  function seleccionarPasoGuia(index) {
    const mueble = MUEBLES_DB[muebleActualId];
    if (!mueble || !mueble.pasos[index]) return;

    pasoIndiceActual = index;
    const total = mueble.pasos.length;
    const paso = mueble.pasos[index];

    document.getElementById('step-pill-label').textContent = `Paso ${index + 1} de ${total}`;
    document.getElementById('step-title-label').textContent = paso.titulo;
    document.getElementById('guia3d-step-desc').textContent = paso.desc;

    // Actualizar vista previa de accesibilidad con el paso actual
    const prevTag = document.getElementById('acc-preview-step-tag');
    const prevText = document.getElementById('acc-preview-step-text');
    if (prevTag) prevTag.textContent = `Paso ${index + 1} (${mueble.nombre})`;
    if (prevText) prevText.textContent = (paso.transcripcion && paso.transcripcion[0]) ? paso.transcripcion[0] : paso.desc;

    const pct = Math.round(((index + 1) / total) * 100);
    document.getElementById('step-progress-fill').style.width = `${pct}%`;

    document.querySelectorAll('#guia3d-steps-buttons .v-thumb').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    renderAudioGuiaTranscript();
    resetAudioPlayer(paso.duracion);
  }

  function renderBotonesPasosGuia() {
    const container = document.getElementById('guia3d-steps-buttons');
    const mueble = MUEBLES_DB[muebleActualId];
    if (!container || !mueble) return;

    container.innerHTML = '';
    mueble.pasos.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'v-thumb' + (idx === 0 ? ' active' : '');
      btn.textContent = `P${idx + 1}`;
      btn.addEventListener('click', () => seleccionarPasoGuia(idx));
      container.appendChild(btn);
    });
  }

  function select360View(idx) {
    const mueble = MUEBLES_DB[muebleActualId];
    if (!mueble || !viewCards.length) return;

    viewIdx = idx % viewCards.length;
    viewCards.forEach((c, i) => c.classList.toggle('active', i === viewIdx));

    const activeCard = viewCards[viewIdx];
    const angleName = activeCard.dataset.angle;
    const viewKey = activeCard.dataset.viewKey;
    const baseInfo = activeCard.dataset.info;

    document.getElementById('badge-vista-actual').textContent = `Vista ${angleName.toLowerCase()}`;
    document.getElementById('view-360-title').textContent = `ENTORNO VIRTUAL 360 - ${mueble.nombre.toUpperCase()} (${angleName.toUpperCase()})`;
    document.getElementById('view-360-desc').textContent = `${baseInfo} de ${mueble.nombre} en ambiente simulado`;

    const img360 = document.getElementById('img-360-main');
    const targetSrc = (mueble.vistas360 && mueble.vistas360[viewKey]) ? mueble.vistas360[viewKey] : imagenMuebleActual;
    if (img360 && targetSrc) {
      img360.style.display = 'block';
      img360.src = targetSrc;
    }
  }

  function renderHerrajesTabContent(hwKey) {
    const mueble = MUEBLES_DB[muebleActualId];
    if (!mueble || !mueble.herrajesCompatibles) return;

    const grupo = mueble.herrajesCompatibles[hwKey];
    if (!grupo) return;

    document.querySelectorAll('#herrajes-tabs-row .cat-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.hwKey === hwKey);
    });

    const grid = document.getElementById('herrajes-cards-grid');
    if (grid) {
      grid.innerHTML = '';
      grupo.opciones.forEach((op, idx) => {
        const badgeCode = idx === 0 ? 'ORIGINAL' : `ALTERNATIVA ${idx}`;
        let compatClass = 'compat-green';
        if (op.compatibilidad < 75) compatClass = 'compat-red';
        else if (op.compatibilidad < 85) compatClass = 'compat-amber';

        const card = document.createElement('div');
        card.className = 'surface-card';
        card.innerHTML = `
          <div class="hw-badge-stage">
            <span class="hw-code-chip">${badgeCode}</span>
            <span class="hw-measure-text">${op.medida}</span>
          </div>
          <h3>${op.nombre}</h3>
          <span class="soft-blue-pill" style="margin: 0.4rem 0;">${op.rol}</span>
          <div><span class="${compatClass}">${op.compatibilidad}% compatible</span></div>
        `;
        grid.appendChild(card);
      });
    }

    const banner = document.getElementById('herrajes-security-banner');
    const secTitle = document.getElementById('herrajes-security-title');
    const secDesc = document.getElementById('herrajes-security-desc');
    if (banner && secTitle && secDesc) {
      banner.classList.toggle('warn', grupo.seguridadNivel === 'warn');
      secTitle.textContent = grupo.seguridadTitulo;
      secDesc.textContent = grupo.seguridadTexto;
    }
  }

  function renderHerrajesMueble() {
    const mueble = MUEBLES_DB[muebleActualId];
    if (!mueble || !mueble.herrajesCompatibles) return;

    const heading = document.getElementById('herrajes-main-heading');
    if (heading) heading.textContent = `Herrajes alternativos - ${mueble.nombre}`;

    const sub = document.getElementById('herrajes-subtitle');
    if (sub) sub.textContent = `Herrajes requeridos para ${mueble.nombre}: ${mueble.herrajes}`;

    const tabsRow = document.getElementById('herrajes-tabs-row');
    if (!tabsRow) return;

    const keys = Object.keys(mueble.herrajesCompatibles);
    tabsRow.innerHTML = '';

    keys.forEach((key, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-pill' + (idx === 0 ? ' active' : '');
      btn.dataset.hwKey = key;
      btn.textContent = mueble.herrajesCompatibles[key].etiqueta;
      btn.addEventListener('click', () => renderHerrajesTabContent(key));
      tabsRow.appendChild(btn);
    });

    if (keys.length > 0) {
      renderHerrajesTabContent(keys[0]);
    }
  }

  function cargarMueble(id, customImgSrc) {
    const m = MUEBLES_DB[id];
    if (!m) return;

    muebleActualId = id;
    imagenMuebleActual = customImgSrc || m.img;

    document.getElementById('ficha-title').textContent = m.nombre;
    document.getElementById('ficha-subtitle').textContent = m.subtitulo;
    document.getElementById('ficha-time').textContent = m.tiempo;
    document.getElementById('ficha-diff').textContent = m.dificultad;
    document.getElementById('ficha-hw').textContent = m.herrajes;
    document.getElementById('ficha-alto').textContent = m.alto;
    document.getElementById('ficha-ancho').textContent = m.ancho;
    document.getElementById('ficha-fondo').textContent = m.fondo;

    const fichaImg = document.getElementById('ficha-img');
    if (fichaImg) {
      fichaImg.style.display = 'block';
      fichaImg.src = imagenMuebleActual;
    }

    document.getElementById('guia3d-main-heading').textContent = `Guia 3D - Paso a paso (${m.nombre})`;
    const guiaImg = document.getElementById('guia3d-img');
    if (guiaImg) {
      guiaImg.style.display = 'block';
      guiaImg.src = imagenMuebleActual;
      guiaImg.style.transform = 'rotate(0deg) scale(1)';
    }
    rot = 0;
    zoomed = false;
    renderBotonesPasosGuia();
    seleccionarPasoGuia(0);

    const arHeading = document.getElementById('ar-main-heading');
    if (arHeading) arHeading.textContent = `Realidad Aumentada - ${m.nombre}`;
    const arHint = document.getElementById('ar-hint-text');
    if (arHint) arHint.textContent = `Apunta al piso para colocar: ${m.nombre}`;
    const arImg = document.getElementById('ar-img');
    if (arImg) {
      arImg.style.display = 'block';
      arImg.src = imagenMuebleActual;
    }

    const e360Heading = document.getElementById('entorno360-main-heading');
    if (e360Heading) e360Heading.textContent = `Entorno Virtual 360 - ${m.nombre}`;
    const e360Sub = document.getElementById('entorno360-subtitle');
    if (e360Sub) e360Sub.textContent = `Visualiza como quedaria tu ${m.nombre} en un ambiente simulado`;
    select360View(0);

    renderHerrajesMueble();
  }
});

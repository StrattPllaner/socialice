/* =====================================================================
   SOCIALICE · Lógica de la app
   ---------------------------------------------------------------------
   Cambiar de pantalla, pintar eventos, amigos, perfil y nav inferior.
   La interfaz se adapta al rol: 'organizador' o 'asistente'.
   ===================================================================== */

/* ===================================================================
   0. ICONOS (SVG hechos a mano, no emojis: se ven diseñados)
   ------------------------------------------------------------------
   Cada icono es un trazo limpio que toma el color del texto
   (currentColor), así combina con cualquier fondo o gradiente.
   =================================================================== */

const ICON_PATHS = {
  home:   '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/>',
  user:   '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.5-5.3 7-5.3s6.2 1.7 7 5.3"/>',
  users:  '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.2 2.9-4.8 5.5-4.8s4.9 1.6 5.5 4.8"/><path d="M15.5 5.3a3.2 3.2 0 0 1 0 5.4"/><path d="M17 14.9c2 .7 3.3 2.1 3.7 4.6"/>',
  plus:   '<path d="M12 5.5v13M5.5 12h13"/>',
  ticket: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a1.5 1.5 0 0 0 0 5v2A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-2a1.5 1.5 0 0 0 0-5Z"/><path d="M14 6.5v11" stroke-dasharray="1.5 2.6"/>',
  mic:    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.4-3.4"/>',
  gear:   '<circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/>',
  share:  '<path d="M12 3.5v11"/><path d="m8 7 4-4 4 4"/><path d="M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12"/>',
  chev:   '<path d="m9 5 7 7-7 7"/>',
  mail:   '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 8 8 5.5L20 8"/>',
  lock:   '<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  tag:    '<path d="M3.5 11.7 11.7 3.5H20a.5.5 0 0 1 .5.5v8.3l-8.2 8.2a1.4 1.4 0 0 1-2 0L3.5 13.7a1.4 1.4 0 0 1 0-2Z"/><circle cx="16.3" cy="7.7" r="1.3"/>',
  spark:  '<path d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18l-1.8-5.4L5 10.8 10.2 9Z"/>',
  eye:    '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18"/><path d="M10.5 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a16.8 16.8 0 0 1-3 3.6"/><path d="M6.4 7.8A16.5 16.5 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  pin:    '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'
};

// Devuelve el SVG de un icono. cls = clases CSS extra (opcional).
function icon(nombre, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[nombre] || ''}</svg>`;
}

/* ===================================================================
   1. NAVEGACIÓN
   =================================================================== */

// Vuelve a dibujar la pantalla que toca (para que siempre esté al día
// con el rol y los datos actuales).
function render(nombre) {
  if (nombre === 'home')    pintarInicio();
  if (nombre === 'search')  pintarBuscar();
  if (nombre === 'create')  pintarCrear();
  if (nombre === 'friends') pintarAmigos();
  if (nombre === 'profile') pintarPerfil();
}

// Muestra una pantalla por su nombre y oculta las demás.
function irA(nombre) {
  render(nombre);
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('is-active', s.dataset.name === nombre);
  });
  document.body.dataset.screen = nombre;
  pintarNav();
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.go === nombre);
  });
  window.scrollTo({ top: 0 });
}

// Se llama al terminar login/registro: arma la app y entra al Inicio.
function entrarApp() {
  pintarNav();
  irA('home');
}

// Moverse dentro del splash (bienvenida / rol / login / registro).
function splashIr(pagina) {
  document.querySelectorAll('#screen-splash .splash-page').forEach((p) => {
    p.classList.toggle('is-shown', p.dataset.page === pagina);
  });
  window.scrollTo({ top: 0 });
}

// Mostrar/ocultar una contraseña.
function verPass(id, btn) {
  const inp = document.getElementById(id);
  const oculto = inp.type === 'password';
  inp.type = oculto ? 'text' : 'password';
  btn.innerHTML = icon(oculto ? 'eyeOff' : 'eye');
}

// Guarda el rol elegido y adapta los textos del registro.
function elegirRol(rol) {
  DATA.usuario.rol = rol;
  const esOrg = rol === 'organizador';
  document.getElementById('reg2Title').textContent = esOrg ? '¿Quién organiza?' : 'Cuéntanos de ti';
  document.getElementById('reg2NameLabel').textContent = esOrg ? 'Nombre del organizador' : 'Tu nombre';
  document.getElementById('reg2Name').placeholder = esOrg ? 'Ej: Andrea Eventos' : 'Ej: Andrea Ríos';
  splashIr('reg1');
}

/* ===================================================================
   2. INICIO (feed de eventos)
   =================================================================== */

let categoriaActiva = 'todos';

function pintarInicio() {
  const cont = document.getElementById('screen-home');
  const u = DATA.usuario;

  // ¿Vas a ir? (las que confirmaste)
  const vas = DATA.eventos.filter((e) => (e.voy || e._voy) && !e.proximamente);
  // Próximamente (para crear expectativa)
  const pronto = DATA.eventos.filter((e) => e.proximamente);

  cont.innerHTML = `
    <header class="home-top">
      <div class="home-brand">Socialice</div>
      <button class="top-avatar" style="${avatarFondo(u)}" onclick="irA('profile')">${avatarContenido(u)}</button>
    </header>

    ${vas.length ? `
      <div class="row-between"><h3>Vas a ir</h3><span class="see-all" onclick="irA('search')">${vas.length}</span></div>
      <div class="voy-row">
        ${vas.map(tarjetaVoy).join('')}
      </div>` : ''}

    <div class="row-between" style="margin-top:${vas.length ? '22px' : '4px'}">
      <h3>Recomendadas para ti</h3>
    </div>
    <div class="chips-row" id="chipsRow"></div>
    <div class="event-list" id="eventList"></div>

    ${pronto.length ? `
      <div class="row-between" style="margin-top:24px"><h3>✦ Próximamente</h3></div>
      <p class="hint">Fiestas en preparación. Activa el aviso para no perdértelas.</p>
      <div class="event-list">
        ${pronto.map(tarjetaProximamente).join('')}
      </div>` : ''}
  `;

  pintarChips();
  pintarEventos();
}

function pintarChips() {
  const fila = document.getElementById('chipsRow');
  if (!fila) return;
  fila.innerHTML = DATA.categorias.map((c) => `
    <button class="chip ${c.id === categoriaActiva ? 'is-active' : ''}"
            onclick="filtrar('${c.id}')">${c.texto}</button>
  `).join('');
}

function filtrar(catId) {
  categoriaActiva = catId;
  pintarChips();
  pintarEventos();
}

function pintarEventos() {
  const lista = document.getElementById('eventList');
  if (!lista) return;
  // Recomendaciones: ni "próximamente" ni las que ya vas
  const eventos = DATA.eventos.filter((e) =>
    !e.proximamente && (categoriaActiva === 'todos' || e.cat.includes(categoriaActiva))
  );

  lista.innerHTML = eventos.length
    ? eventos.map(tarjetaEvento).join('')
    : `<p class="empty">No hay fiestas en esta categoría 🙈</p>`;
}

// ¿El evento está casi lleno? (85% o más del cupo)
function casiLleno(e) {
  return e.capacidad && !e.proximamente && (e.asistentes / e.capacidad) >= 0.85;
}

// Tarjeta de evento (estilo editorial: título sobre la portada). Clicable.
function tarjetaEvento(e) {
  return `
    <article class="ev2" onclick="abrirEvento('${e.id}')">
      <div class="ev2-cover" style="${coverStyle(e)}">
        <span class="ev2-price">${e.precio}</span>
        ${casiLleno(e) ? `<span class="ev2-warn">🔥 ¡Últimos lugares!</span>` : ''}
        <div class="ev2-overlay">
          <h3 ${nombreAttrs(e)}>${e.nombre}</h3>
          <p class="ev2-when">${e.fecha}</p>
        </div>
      </div>
      <div class="ev2-foot">
        <span class="ev2-place">📍 ${e.lugar} · ${e.ciudad}</span>
        <span class="ev2-people ${casiLleno(e) ? 'full' : ''}">👥 ${e.asistentes}${e.capacidad ? '/' + e.capacidad : ''}</span>
      </div>
    </article>`;
}

// Tarjeta compacta horizontal "Vas a ir"
function tarjetaVoy(e) {
  return `
    <button class="voy-card" onclick="abrirEvento('${e.id}')" style="${coverStyle(e)}">
      <span class="voy-shade"></span>
      <span class="voy-tag">Confirmado</span>
      <span class="voy-info">
        <strong ${nombreAttrs(e)}>${e.nombre}</strong>
        <small>${e.fecha}</small>
      </span>
    </button>`;
}

// Cuántos interesados tiene un evento (con tu interés incluido)
function totalInteresados(e) {
  return (e.interesados || 0) + (e._interesado ? 1 : 0);
}

// Tarjeta "Próximamente"
function tarjetaProximamente(e) {
  return `
    <article class="ev2 soon" onclick="abrirEvento('${e.id}')">
      <div class="ev2-cover" style="${coverStyle(e)}">
        <span class="ev2-soon-badge">✦ Próximamente</span>
        <div class="ev2-overlay">
          <h3 ${nombreAttrs(e)}>${e.nombre}</h3>
          <p class="ev2-when">${e.lugar} · ${e.ciudad}</p>
        </div>
      </div>
      <div class="ev2-foot">
        <span class="ev2-place" id="int-${e.id}">👀 ${totalInteresados(e)} interesados</span>
        <button class="ev2-bell ${e._interesado ? 'on' : ''}" onclick="event.stopPropagation(); interesado('${e.id}', this)">${e._interesado ? '⭐ Interesado ✓' : '⭐ Interesado'}</button>
      </div>
    </article>`;
}

// Marca/quita interés en un evento (para recibir avisos)
function interesado(id, btn) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  e._interesado = !e._interesado;
  btn.classList.toggle('on', e._interesado);
  btn.textContent = e._interesado ? '⭐ Interesado ✓' : '⭐ Interesado';
  // Actualiza el contador de interesados si está visible
  const c = document.getElementById('int-' + id);
  if (c) c.textContent = `👀 ${totalInteresados(e)} interesados`;
  toast(e._interesado ? `¡Listo! Te avisaremos de ${e.nombre} 🔔` : 'Ya no recibirás avisos');
}

/* ===================================================================
   2.5 BUSCAR FIESTAS
   =================================================================== */

// Estado de los filtros del buscador (ciudad = texto libre)
const filtros = { texto: '', ciudad: '', cuando: 'todos', edad: 'Todas' };

function pintarBuscar() {
  const cont = document.getElementById('screen-search');
  cont.innerHTML = `
    <header class="page-head">
      <h1>Buscar fiestas</h1>
      <p class="page-sub">Encuentra tu próxima noche.</p>
    </header>

    <!-- Al tocar/enfocar la barra, se despliegan los filtros -->
    <div class="search-bar" onclick="abrirFiltrosInline()">
      ${icon('search', 'mute')}
      <input id="searchInput" placeholder="Fiesta, lugar u organizador…"
             onfocus="abrirFiltrosInline()" oninput="buscarFiestas(this.value)" value="${filtros.texto}">
      <button class="search-clear" onclick="limpiarBusqueda()" aria-label="Limpiar">✕</button>
    </div>

    <!-- Filtros desplegables (ocultos hasta tocar la barra) -->
    <div class="filtros-panel" id="filtrosPanel">
      <div class="fp-group">
        <span class="filtro-label">📍 Ciudad</span>
        <input class="fp-input" id="ciudadInput" value="${filtros.ciudad}"
               placeholder="Cualquier ciudad (ej: Cuernavaca)" oninput="setCiudad(this.value)">
        <div class="chips-row mini wrap" id="fCiudad"></div>
      </div>
      <div class="fp-group">
        <span class="filtro-label">📅 Cuándo</span>
        <div class="chips-row mini wrap" id="fCuando"></div>
      </div>
      <div class="fp-group">
        <span class="filtro-label">🔞 Edad</span>
        <div class="chips-row mini wrap" id="fEdad"></div>
      </div>
    </div>

    <div class="row-between">
      <h3 id="searchTitle">Todas las fiestas</h3>
      <span class="see-all" id="limpiarFiltros" onclick="resetFiltros()" style="display:none">Limpiar</span>
    </div>
    <div class="event-list" id="searchResults"></div>
  `;
  pintarFiltros();
  pintarResultados();
}

// Despliega el panel de filtros (al tocar la barra de búsqueda)
function abrirFiltrosInline() {
  const p = document.getElementById('filtrosPanel');
  if (p) p.classList.add('open');
}

// Dibuja los chips de cada filtro dentro del panel desplegable
function pintarFiltros() {
  const fc = document.getElementById('fCiudad');
  if (fc) fc.innerHTML = DATA.ciudades.map((c) => `
    <button class="chip ${c.toLowerCase() === filtros.ciudad.toLowerCase() ? 'is-active' : ''}"
            onclick="setCiudad('${c}')">${c}</button>`).join('');
  const fcu = document.getElementById('fCuando');
  if (fcu) fcu.innerHTML = DATA.cuandos.map((c) => `
    <button class="chip ${c.id === filtros.cuando ? 'is-active' : ''}"
            onclick="setFiltro('cuando','${c.id}')">${c.texto}</button>`).join('');
  const fe = document.getElementById('fEdad');
  if (fe) fe.innerHTML = DATA.edades.map((e) => `
    <button class="chip ${e === filtros.edad ? 'is-active' : ''}"
            onclick="setFiltro('edad','${e}')">${e}</button>`).join('');
}

function setFiltro(tipo, valor) {
  filtros[tipo] = valor;
  pintarFiltros();
  pintarResultados();
}

// Ciudad por texto libre (desde el input o un chip)
function setCiudad(valor) {
  filtros.ciudad = valor;
  const inp = document.getElementById('ciudadInput');
  if (inp && inp.value !== valor) inp.value = valor;
  pintarFiltros();
  pintarResultados();
}

function buscarFiestas(texto) {
  filtros.texto = texto;
  pintarResultados();
}

function limpiarBusqueda() {
  filtros.texto = '';
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  pintarResultados();
}

function resetFiltros() {
  filtros.ciudad = ''; filtros.cuando = 'todos'; filtros.edad = 'Todas';
  const inp = document.getElementById('ciudadInput');
  if (inp) inp.value = '';
  pintarFiltros();
  pintarResultados();
}

function pintarResultados() {
  const cont = document.getElementById('searchResults');
  if (!cont) return;
  const t = filtros.texto.trim().toLowerCase();
  const ciudad = filtros.ciudad.trim().toLowerCase();

  const res = DATA.eventos.filter((e) => {
    const okTexto  = !t || [e.nombre, e.lugar, e.ciudad, e.organizador].some((c) => c.toLowerCase().includes(t));
    const okCiudad = !ciudad || e.ciudad.toLowerCase().includes(ciudad);
    const okCuando = filtros.cuando === 'todos' || e.cuando === filtros.cuando;
    const okEdad   = filtros.edad === 'Todas'  || e.edad === filtros.edad;
    return okTexto && okCiudad && okCuando && okEdad;
  });

  const hayFiltro = !!ciudad || filtros.cuando !== 'todos' || filtros.edad !== 'Todas';
  const limpiar = document.getElementById('limpiarFiltros');
  if (limpiar) limpiar.style.display = hayFiltro ? 'inline' : 'none';
  const titulo = document.getElementById('searchTitle');
  if (titulo) titulo.textContent = (t || hayFiltro) ? `Resultados (${res.length})` : 'Todas las fiestas';

  cont.innerHTML = res.length
    ? res.map(tarjetaEvento).join('')
    : `<div class="empty-box">
         <div class="empty-emoji">🔍</div>
         <p>No encontramos fiestas con esos filtros.</p>
         <small>Prueba con otra ciudad o quítalos.</small>
       </div>`;
}

/* ===================================================================
   3. CREAR EVENTO (placeholder · solo organizador)
   =================================================================== */

// --- Borrador de la fiesta (lo que se está creando o editando) ---
// Si draft.id existe, estamos EDITANDO un evento ya creado.
const GRADS = [
  'linear-gradient(135deg,#2f7bff,#38bdf8)',
  'linear-gradient(135deg,#1e3a8a,#38bdf8)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#7dd3fc,#2563eb)',
  'linear-gradient(135deg,#22d3ee,#818cf8)',
  'linear-gradient(135deg,#0ea5e9,#1d4ed8)'
];
const COVER_EMOJIS = ['🎉','🌃','✨','🔊','🪩','🌇','🍸','🎶','👑','🔥'];

// Paleta simple de colores para el nombre
const NAME_COLORS = ['#ffffff', '#2f7bff', '#38bdf8', '#7dd3fc', '#22d3ee', '#818cf8', '#0ea5e9'];
// Emojis sugeridos para poner en la portada
const COVER_EMOJI_SET = ['🎉','🪩','🔥','✨','🌙','🌃','💜','🍸','🎶','👑','🌌','⚡','🦋','🌴','💎','🎈'];

function nuevoDraft() {
  return {
    id: null,
    paso: 0,                      // paso actual del asistente
    nombre: '', fecha: '', lugar: '', ciudad: '',
    cover: {
      grad: GRADS[0], img: null,  // fondo (color o imagen)
      titleColor: '#ffffff',      // color sólido del nombre
      anim: [],                   // si tiene 2+ colores, el nombre se anima entre ellos
      titleSize: 26,              // tamaño del título (px)
      titlePos: { x: 50, y: 50 }, // posición del título en la portada (%)
      textos: []                  // elementos libres: {texto, x, y, color, size, emoji?}
    },
    proximamente: false,          // marca la fiesta como "próximamente"
    // rango de edad (si se restringe, el mínimo SIEMPRE es 18)
    edad: { activo: false, max: null },
    // tipos de boleto (zonas/precios)
    boletos: [{ nombre: 'General', precio: 0, cantidad: 200 }],
    // co-organizadores del evento
    organizadores: [],
    // publicaciones del evento (texto + foto/video opcional)
    noticias: [],
    // mapa del antro
    tool: 'mesa',
    zoom: 1,
    pisos: [{ nombre: 'Planta baja', items: [], bg: null }],
    pisoActivo: 0,
    sel: null,
    seq: 0,
    coverSel: null,               // texto seleccionado en la portada
    // lista de ingreso
    guests: [
      { nombre: 'Mateo Lara',  dentro: true },
      { nombre: 'Sofía Mendez', dentro: false }
    ]
  };
}
const PASOS = ['Portada', 'Detalles', 'Boletos', 'Equipo', 'Plano', 'Avisos'];
let draft = nuevoDraft();

// Empezar una fiesta nueva
function nuevaFiesta() { draft = nuevoDraft(); irA('create'); }

// Editar un evento ya creado (carga sus datos al borrador)
function editarFiesta(id) {
  const e = DATA.eventos.find((x) => x.id === id);
  if (!e) return;
  draft = nuevoDraft();
  draft.id = e.id;
  draft.nombre = e.nombre; draft.fecha = e.fecha; draft.lugar = e.lugar; draft.ciudad = e.ciudad || '';
  draft.cover = {
    grad: e.grad, img: e.coverImg || null,
    titleColor: e.nombreColor || '#ffffff',
    anim: e.animColors ? e.animColors.slice() : [],
    titleSize: e.titleSize || 26,
    titlePos: e.titlePos ? { ...e.titlePos } : { x: 50, y: 50 },
    textos: (e.coverTextos || []).map((t) => ({ ...t }))
  };
  draft.proximamente = !!e.proximamente;
  draft.edad = e.edadRango ? { activo: true, max: e.edadRango.max || null } : { activo: false, max: null };
  draft.boletos = e.boletos ? e.boletos.map((b) => ({ ...b })) : [{ nombre: 'General', precio: 0, cantidad: e.capacidad || 200 }];
  draft.organizadores = (e.organizadores || []).map((o) => ({ ...o }));
  draft.noticias = (e.noticias || []).map((n) => ({ ...n }));
  irA('create');
}

// Estilo de la portada del borrador (imagen o gradiente)
function coverStyleDraft() {
  return draft.cover.img
    ? `background-image:url(${draft.cover.img});background-size:cover;background-position:center`
    : `background:${draft.cover.grad}`;
}
// Construye un gradiente animado a partir de una lista de colores
function animGrad(cols) { return `linear-gradient(90deg, ${cols.concat(cols[0]).join(',')})`; }

// Atributos para el nombre del evento según su color/animación
function nombreAttrs(e) {
  if (e.animColors && e.animColors.length >= 2)
    return `class="name-anim" style="background-image:${animGrad(e.animColors)}"`;
  if (e.nombreColor && e.nombreColor !== '#ffffff') return `style="color:${e.nombreColor}"`;
  return '';
}

// Estilo de portada de un evento cualquiera (para tarjetas)
function coverStyle(e) {
  return e.coverImg
    ? `background-image:url(${e.coverImg});background-size:cover;background-position:center`
    : `background:${e.grad}`;
}

// Tipos de elementos (pensados para antros). w/h = tamaño inicial en px.
const VENUE_TOOLS = {
  mesa:    { emoji: '🪑', label: 'Mesa',      w: 44,  h: 44,  forma: 'redonda' },
  barra:   { emoji: '🍸', label: 'Barra',     w: 130, h: 36 },
  dj:      { emoji: '🎧', label: 'Cabina DJ', w: 76,  h: 52 },
  pista:   { emoji: '🕺', label: 'Pista',     w: 140, h: 120 },
  vip:     { emoji: '👑', label: 'Zona VIP',  w: 96,  h: 72 },
  lounge:  { emoji: '🛋️', label: 'Lounge',    w: 84,  h: 52 },
  bano:    { emoji: '🚻', label: 'Baños',     w: 56,  h: 56 },
  entrada: { emoji: '🚪', label: 'Entrada',   w: 52,  h: 42 },
  salida:  { emoji: '🚨', label: 'Salida',    w: 52,  h: 42 }
};

// Atajos
function pisoActual() { return draft.pisos[draft.pisoActivo]; }
function itemsActuales() { return pisoActual().items; }
function itemSel() { return itemsActuales().find((i) => i.id === draft.sel); }

function pintarCrear() {
  const editando = !!draft.id;
  const paso = draft.paso;
  const ultimo = paso === PASOS.length - 1;

  document.getElementById('screen-create').innerHTML = `
    <header class="page-head">
      <h1>${editando ? 'Editar fiesta' : 'Crear fiesta'}</h1>
      <p class="page-sub">Paso ${paso + 1} de ${PASOS.length} · ${PASOS[paso]}</p>
    </header>

    <div class="wizard-dots">
      ${PASOS.map((_, i) => `<i class="${i <= paso ? 'on' : ''}" onclick="irPaso(${i})"></i>`).join('')}
    </div>

    <div class="wizard-step">${pasoHTML(paso)}</div>

    <div class="wizard-nav">
      ${paso > 0 ? `<button class="btn-ghost wnav-back" onclick="irPaso(${paso - 1})">‹ Atrás</button>` : ''}
      ${ultimo
        ? `<button class="btn full" onclick="guardarFiesta()">${editando ? 'Guardar cambios ✓' : 'Publicar fiesta 🎉'}</button>`
        : `<button class="btn full" onclick="irPaso(${paso + 1})">Siguiente ›</button>`}
    </div>
  `;

  // Inicializa lo que necesita cada paso
  if (paso === 2) pintarBoletos();
  if (paso === 3) pintarOrganizadores();
  if (paso === 4) { pintarFloors(); pintarTools(); pintarVenue(); pintarControls(); }
  if (paso === 5) { pintarGuests(); pintarNoticias(); }
}

function irPaso(n) {
  draft.paso = Math.max(0, Math.min(PASOS.length - 1, n));
  pintarCrear();
  window.scrollTo({ top: 0 });
}

// HTML de cada paso del asistente
function pasoHTML(paso) {
  if (paso === 0) return pasoPortada();
  if (paso === 1) return pasoDetalles();
  if (paso === 2) return `
    <div class="row-between"><h3>🎟️ Boletos y zonas</h3><span class="see-all" id="capTotal"></span></div>
    <p class="hint">Crea distintos boletos: general, VIP, zonas exclusivas…</p>
    <div id="boletosList"></div>
    <button class="add-zone" onclick="addBoleto()">＋ Agregar tipo de boleto</button>`;
  if (paso === 3) return `
    <div class="row-between"><h3>👥 Organizadores</h3></div>
    <p class="hint">Agrega a tu equipo para que la gente vea qué perfiles organizan.</p>
    <div class="guest-add">
      <input id="orgInput" placeholder="Nombre del organizador" onkeydown="if(event.key==='Enter') addOrganizador()">
      <button class="add-btn" onclick="addOrganizador()">Añadir</button>
    </div>
    <p class="filtro-label" style="margin-top:6px">Sugerencias</p>
    <div class="chips-row mini wrap">
      ${DATA.amigos.map((a) => `<button class="chip" onclick="addOrgObj('${a.nombre}','${a.avatar}')">${a.avatar} ${a.nombre.split(' ')[0]}</button>`).join('')}
    </div>
    <div id="orgList" style="margin-top:14px"></div>`;
  if (paso === 4) return pasoPlano();
  if (paso === 5) return pasoAvisos();
  return '';
}

// --- Paso 1: Portada editable ---
function pasoPortada() {
  const sel = draft.coverSel !== null ? draft.cover.textos[draft.coverSel] : null;
  const anim = draft.cover.anim && draft.cover.anim.length >= 2;
  const tituloEstilo = anim
    ? `background-image:${animGrad(draft.cover.anim)}`
    : `color:${draft.cover.titleColor}`;
  return `
    <div class="cover-preview" id="coverPreview" style="${coverStyleDraft()}"
         onpointermove="coverMove(event)" onpointerup="coverDrop()" onpointerleave="coverDrop()">
      <div class="cover-title ${anim ? 'name-anim' : ''}" id="coverTitle"
           style="left:${draft.cover.titlePos.x}%; top:${draft.cover.titlePos.y}%; font-size:${draft.cover.titleSize}px; ${tituloEstilo}"
           onpointerdown="coverGrab(event,'title')">${draft.nombre || 'Tu fiesta'}</div>
      ${draft.cover.textos.map((t, i) => `
        <div class="cover-text ${t.emoji ? 'is-emoji' : ''} ${draft.coverSel === i ? 'sel' : ''}"
             style="left:${t.x}%; top:${t.y}%; font-size:${t.size}px; ${t.emoji ? '' : `color:${t.color}`}"
             onpointerdown="coverGrab(event,${i})" onclick="selCoverText(event,${i})">${t.texto}</div>`).join('')}
    </div>
    <p class="hint">Arrastra el título, textos y emojis. Tócalos para cambiar color/tamaño.</p>

    <input type="file" accept="image/*" id="coverFile" hidden onchange="subirPortada(event)">
    <div class="cover-actions">
      <button class="chip" onclick="document.getElementById('coverFile').click()">⬆ Imagen</button>
      ${draft.cover.img ? `<button class="chip" onclick="quitarPortada()">Quitar</button>` : ''}
      <button class="chip" onclick="addCoverText()">＋ Texto</button>
      <button class="chip" onclick="toggleEmojiPalette()">😀 Emoji</button>
    </div>
    <div class="emoji-palette" id="emojiPalette" style="display:none">
      ${COVER_EMOJI_SET.map((e) => `<button onclick="addCoverEmoji('${e}')">${e}</button>`).join('')}
    </div>

    ${sel ? `
      <div class="el-ctrl">
        <div class="el-ctrl-head"><span>${sel.emoji ? 'Emoji' : 'Texto'} seleccionado</span></div>
        <div class="el-ctrl-row">
          ${sel.emoji ? '' : `<label class="color-pick"><input type="color" value="${sel.color}" oninput="setCoverElColor(this.value)"></label>`}
          <span class="el-size">Tamaño</span>
          <button class="el-btn" onclick="resizeCoverEl(-4)">−</button>
          <button class="el-btn" onclick="resizeCoverEl(4)">+</button>
          ${sel.emoji ? '' : `<button class="el-btn" onclick="editCoverText()">✎</button>`}
          <button class="el-btn del" onclick="delCoverText()">🗑</button>
        </div>
      </div>` : ''}

    <div class="field" style="margin-top:14px"><div class="field-main">
      <label class="field-label">Nombre de la fiesta</label>
      <input class="field-input" value="${draft.nombre}" placeholder="Ej: Summer Rooftop"
             oninput="draft.nombre=this.value; const t=document.getElementById('coverTitle'); if(t)t.textContent=this.value||'Tu fiesta'">
    </div></div>

    <!-- Tamaño del título, justo debajo del nombre -->
    <div class="row-mini">
      <span class="filtro-label" style="margin:0">Tamaño del título</span>
      <div class="size-ctrl">
        <button class="el-btn" onclick="resizeTitulo(-3)">−</button>
        <span>${draft.cover.titleSize}px</span>
        <button class="el-btn" onclick="resizeTitulo(3)">+</button>
      </div>
    </div>

    <p class="filtro-label" style="margin-top:14px">Color de fondo</p>
    <div class="grad-row">
      ${GRADS.map((g) => `<button class="grad-swatch ${(g === draft.cover.grad && !draft.cover.img) ? 'sel' : ''}" style="background:${g}" onclick="setGrad('${g}')"></button>`).join('')}
    </div>

    <p class="filtro-label" style="margin-top:14px">Color del nombre</p>
    <div class="name-colors">
      ${NAME_COLORS.map((c) => `<button class="name-dot ${(!anim && draft.cover.titleColor === c) ? 'sel' : ''}"
          style="background:${c}" onclick="setNombreColor('${c}')"></button>`).join('')}
      <label class="name-dot custom ${(!anim && !NAME_COLORS.includes(draft.cover.titleColor)) ? 'sel' : ''}" title="Otro color">
        <span>+</span>
        <input type="color" value="${anim ? '#8b5cf6' : draft.cover.titleColor}" oninput="setNombreColorLive(this.value)" onchange="setNombreColor(this.value)">
      </label>
    </div>

    <!-- Color animado: el organizador AGREGA los colores que quiere -->
    <div class="row-mini" style="margin-top:14px">
      <span class="filtro-label" style="margin:0">✨ Color animado</span>
      <span class="anim-hint">${anim ? 'activo' : 'agrega 2 o más'}</span>
    </div>
    <div class="name-colors">
      ${draft.cover.anim.map((c) => `<button class="name-dot on" style="background:${c}" onclick="removeAnimColor('${c}')" title="Quitar">×</button>`).join('')}
      <button class="name-dot add-anim" onclick="toggleAnimPalette()" title="Agregar color"><span>+</span></button>
      ${draft.cover.anim.length ? `<button class="anim-clear" onclick="limpiarAnim()">Vaciar</button>` : ''}
    </div>
    <div class="anim-palette ${_animOpen ? 'open' : ''}" id="animPalette">
      ${NAME_COLORS.filter((c) => !draft.cover.anim.includes(c)).map((c) => `<button class="name-dot" style="background:${c}" onclick="addAnimColor('${c}')"></button>`).join('')}
      <label class="name-dot custom" title="Otro color"><span>+</span><input type="color" value="#22d3ee" onchange="addAnimColor(this.value)"></label>
    </div>`;
}

// --- Paso 2: Detalles ---
function pasoDetalles() {
  return `
    <div class="field"><div class="field-main">
      <label class="field-label">Fecha y hora</label>
      <input class="field-input" value="${draft.fecha}" placeholder="Ej: Vie 11 jul · 10:00 pm" oninput="draft.fecha=this.value">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Lugar / dirección</label>
      <input class="field-input" value="${draft.lugar}" placeholder="Ej: Terraza Skyline" oninput="draft.lugar=this.value">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Ciudad</label>
      <input class="field-input" value="${draft.ciudad}" placeholder="Ej: Polanco" oninput="draft.ciudad=this.value">
    </div></div>
    <button class="maps-btn" onclick="toast('Vista en Google Maps · próximamente 🗺️')">📍 Ver el lugar en Google Maps</button>

    <div class="mini-toggle-row">
      <span>✦ Marcar como “Próximamente”</span>
      <button class="toggle ${draft.proximamente ? 'is-on' : ''}" onclick="draft.proximamente=!draft.proximamente; this.classList.toggle('is-on')"><span class="toggle-knob"></span></button>
    </div>

    <div class="mini-toggle-row">
      <span>🔞 Solo mayores (18+)</span>
      <button class="toggle ${draft.edad.activo ? 'is-on' : ''}" onclick="toggleEdad(this)"><span class="toggle-knob"></span></button>
    </div>
    <div id="edadRango" style="${draft.edad.activo ? '' : 'display:none'}">
      <p class="hint">El mínimo siempre es 18. Si quieres, pon una edad máxima.</p>
      <div class="edad-field">
        <label class="field-label">Edad máxima (opcional)</label>
        <input type="number" min="18" value="${draft.edad.max || ''}" placeholder="Sin límite" oninput="draft.edad.max=this.value?+this.value:null">
      </div>
    </div>`;
}

// --- Paso 5: Plano ---
function pasoPlano() {
  return `
    <div class="row-between"><h3>🗺️ Plano del antro</h3><span class="see-all" onclick="limpiarVenue()">Vaciar piso</span></div>
    <div class="floor-tabs" id="floorTabs"></div>

    <input type="file" accept="image/*" id="planoBgFile" hidden onchange="subirPlanoBg(event)">
    <div class="cover-actions">
      <button class="chip" onclick="document.getElementById('planoBgFile').click()">🖼️ Imagen de fondo</button>
      ${pisoActual().bg ? `<button class="chip" onclick="quitarPlanoBg()">Quitar fondo</button>` : ''}
    </div>
    <p class="hint">Sube una foto del lugar como fondo y coloca cosas encima. Zoom: rueda del mouse o pellizca en el móvil; o usa − / +.</p>

    <div class="tool-row" id="toolRow"></div>

    <div class="venue" id="venue"
         onclick="venueTap(event)"
         onpointerdown="venuePinchDown(event)"
         onpointermove="venueMove(event)"
         onpointerup="venuePinchUp(event)" onpointerleave="venuePinchUp(event)"
         onwheel="venueWheel(event)">
      <div class="venue-inner" id="venueInner"><div class="venue-grid"></div></div>
      <span class="venue-hint" id="venueHint"></span>
      <div class="venue-zoom">
        <button onclick="zoomVenue(-1)" aria-label="Alejar">−</button>
        <span id="zoomLabel">100%</span>
        <button onclick="zoomVenue(1)" aria-label="Acercar">+</button>
      </div>
    </div>
    <div class="venue-controls" id="venueControls"></div>`;
}

// --- Paso 6: Avisos (ingreso + publicaciones) ---
function pasoAvisos() {
  return `
    <div class="row-between"><h3>📋 Lista de ingreso</h3><span class="see-all" id="guestCount"></span></div>
    <div class="guest-add">
      <input id="guestInput" placeholder="Nombre del invitado" onkeydown="if(event.key==='Enter') addGuest()">
      <button class="add-btn" onclick="addGuest()">Añadir</button>
    </div>
    <div class="guest-list" id="guestList"></div>

    <div class="row-between" style="margin-top:24px"><h3>📰 Publicaciones del evento</h3></div>
    <p class="hint">Comparte novedades como en Instagram: texto, fotos o videos.</p>
    <div class="post-compose">
      <textarea id="newsInput" placeholder="Escribe una publicación…" rows="2"></textarea>
      <div class="post-compose-bar">
        <input type="file" accept="image/*,video/*" id="newsFile" hidden onchange="adjuntarNoticia(event)">
        <button class="post-attach" onclick="document.getElementById('newsFile').click()">📎 Foto / video</button>
        <span id="newsAttachInfo" class="post-attach-info"></span>
        <button class="add-btn" onclick="addNoticia()">Publicar</button>
      </div>
    </div>
    <div class="news-list" id="newsList"></div>`;
}

// --- Nombre animado + rango de edad ---
function toggleEdad(btn) {
  draft.edad.activo = !draft.edad.activo;
  document.getElementById('edadRango').style.display = draft.edad.activo ? '' : 'none';
  if (btn) btn.classList.toggle('is-on', draft.edad.activo);
}

/* --- Portada editable: color del nombre, arrastrar título y textos --- */
function setNombreColor(c) { draft.cover.titleColor = c; draft.cover.anim = []; pintarCrear(); }
// Actualiza el color del título en vivo (sin re-render, mientras mueves el selector)
function setNombreColorLive(c) {
  draft.cover.titleColor = c; draft.cover.anim = [];
  const t = document.getElementById('coverTitle');
  if (t) { t.classList.remove('name-anim'); t.style.backgroundImage = ''; t.style.color = c; }
}
// Abre/cierra la paleta para agregar colores a la animación
let _animOpen = false;
function toggleAnimPalette() { _animOpen = !_animOpen; pintarCrear(); }
// Agrega un color a la animación (y deja la paleta abierta)
function addAnimColor(c) {
  if (!draft.cover.anim.includes(c)) draft.cover.anim.push(c);
  _animOpen = true;
  pintarCrear();
}
// Quita un color de la animación
function removeAnimColor(c) {
  const i = draft.cover.anim.indexOf(c);
  if (i >= 0) draft.cover.anim.splice(i, 1);
  pintarCrear();
}
function limpiarAnim() { draft.cover.anim = []; _animOpen = false; pintarCrear(); }

let _coverDrag = null;  // 'title' o índice de texto
function coverGrab(ev, target) {
  ev.stopPropagation();
  _coverDrag = target;
}
function coverMove(ev) {
  if (_coverDrag === null) return;
  const r = document.getElementById('coverPreview').getBoundingClientRect();
  const x = Math.max(6, Math.min(94, ((ev.clientX - r.left) / r.width) * 100));
  const y = Math.max(10, Math.min(90, ((ev.clientY - r.top) / r.height) * 100));
  let el;
  if (_coverDrag === 'title') { draft.cover.titlePos = { x, y }; el = document.getElementById('coverTitle'); }
  else { draft.cover.textos[_coverDrag].x = x; draft.cover.textos[_coverDrag].y = y; el = document.querySelectorAll('.cover-text')[_coverDrag]; }
  if (el) { el.style.left = x + '%'; el.style.top = y + '%'; }
}
function coverDrop() { _coverDrag = null; }

function addCoverText() {
  const texto = prompt('Texto a mostrar en la portada:');
  if (!texto) return;
  draft.cover.textos.push({ texto, x: 50, y: 72, color: '#ffffff', size: 16 });
  draft.coverSel = draft.cover.textos.length - 1;
  pintarCrear();
}
function toggleEmojiPalette() {
  const p = document.getElementById('emojiPalette');
  if (p) p.style.display = p.style.display === 'none' ? 'flex' : 'none';
}
function addCoverEmoji(e) {
  draft.cover.textos.push({ texto: e, x: 50, y: 50, color: '#fff', size: 40, emoji: true });
  draft.coverSel = draft.cover.textos.length - 1;
  pintarCrear();
}
function selCoverText(ev, i) { ev.stopPropagation(); draft.coverSel = i; pintarCrear(); }
function editCoverText() {
  const t = draft.cover.textos[draft.coverSel];
  const nuevo = prompt('Editar texto:', t.texto);
  if (nuevo !== null) { t.texto = nuevo; pintarCrear(); }
}
function delCoverText() {
  draft.cover.textos.splice(draft.coverSel, 1);
  draft.coverSel = null;
  pintarCrear();
}
function setCoverElColor(c) {
  const t = draft.cover.textos[draft.coverSel];
  if (t) { t.color = c; const el = document.querySelectorAll('.cover-text')[draft.coverSel]; if (el) el.style.color = c; }
}
function resizeCoverEl(d) {
  const t = draft.cover.textos[draft.coverSel];
  if (!t) return;
  t.size = Math.max(10, Math.min(90, (t.size || 16) + d));
  const el = document.querySelectorAll('.cover-text')[draft.coverSel];
  if (el) el.style.fontSize = t.size + 'px';
}
function resizeTitulo(d) {
  draft.cover.titleSize = Math.max(14, Math.min(48, draft.cover.titleSize + d));
  pintarCrear();
}

/* --- Organizadores (equipo) --- */
function pintarOrganizadores() {
  const cont = document.getElementById('orgList');
  if (!cont) return;
  cont.innerHTML = draft.organizadores.length
    ? draft.organizadores.map((o, i) => `
        <div class="org-row">
          <div class="org-ava">${o.avatar}</div>
          <span class="org-name">${o.nombre}</span>
          <button class="guest-del" onclick="delOrganizador(${i})">✕</button>
        </div>`).join('')
    : `<p class="empty">Solo tú por ahora. Agrega a tu equipo 👥</p>`;
}
function addOrganizador() {
  const inp = document.getElementById('orgInput');
  const nombre = inp.value.trim();
  if (!nombre) return;
  draft.organizadores.push({ nombre, avatar: '🎤' });
  inp.value = '';
  pintarOrganizadores();
}
function addOrgObj(nombre, avatar) {
  if (draft.organizadores.some((o) => o.nombre === nombre)) return;
  draft.organizadores.push({ nombre, avatar });
  pintarOrganizadores();
  toast(`${nombre.split(' ')[0]} agregado al equipo`);
}
function delOrganizador(i) { draft.organizadores.splice(i, 1); pintarOrganizadores(); }

/* --- Imagen de fondo del plano --- */
function subirPlanoBg(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { pisoActual().bg = reader.result; pintarCrear(); };
  reader.readAsDataURL(file);
}
function quitarPlanoBg() { pisoActual().bg = null; pintarCrear(); }

// --- Boletos / zonas ---
function pintarBoletos() {
  const cont = document.getElementById('boletosList');
  if (!cont) return;
  cont.innerHTML = draft.boletos.map((b, i) => `
    <div class="zona-card">
      <div class="zona-top">
        <input class="zona-name" value="${b.nombre}" placeholder="Nombre (ej: VIP)" oninput="draft.boletos[${i}].nombre=this.value">
        ${draft.boletos.length > 1 ? `<button class="guest-del" onclick="delBoleto(${i})">✕</button>` : ''}
      </div>
      <div class="zona-fields">
        <div class="zona-f"><label>Precio $</label>
          <input type="number" value="${b.precio}" oninput="draft.boletos[${i}].precio=+this.value||0"></div>
        <div class="zona-f"><label>Cantidad</label>
          <input type="number" value="${b.cantidad}" oninput="draft.boletos[${i}].cantidad=+this.value||0; actualizarCapTotal()"></div>
      </div>
    </div>
  `).join('');
  actualizarCapTotal();
}
function actualizarCapTotal() {
  const total = draft.boletos.reduce((s, b) => s + (+b.cantidad || 0), 0);
  const el = document.getElementById('capTotal');
  if (el) el.textContent = `Cap. total: ${total}`;
}
function addBoleto() {
  draft.boletos.push({ nombre: '', precio: 0, cantidad: 50 });
  pintarBoletos();
}
function delBoleto(i) { draft.boletos.splice(i, 1); pintarBoletos(); }

// --- Portada / fondo ---
function setGrad(g) { draft.cover.grad = g; draft.cover.img = null; pintarCrear(); }
function subirPortada(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { draft.cover.img = reader.result; pintarCrear(); };
  reader.readAsDataURL(file);
}
function quitarPortada() { draft.cover.img = null; pintarCrear(); }

// --- Publicaciones (tipo Instagram: texto + foto/video) ---
let _newsMedia = null;  // adjunto temporal del compositor
function adjuntarNoticia(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const tipo = file.type.startsWith('video') ? 'video' : 'img';
  const reader = new FileReader();
  reader.onload = () => {
    _newsMedia = { tipo, url: reader.result };
    const info = document.getElementById('newsAttachInfo');
    if (info) info.textContent = tipo === 'video' ? '🎬 Video listo' : '🖼️ Foto lista';
  };
  reader.readAsDataURL(file);
}
function mediaHTML(n) {
  if (!n.media) return '';
  return n.media.tipo === 'video'
    ? `<video class="post-media" src="${n.media.url}" controls playsinline></video>`
    : `<img class="post-media" src="${n.media.url}" alt="">`;
}
function pintarNoticias() {
  const cont = document.getElementById('newsList');
  if (!cont) return;
  cont.innerHTML = draft.noticias.length
    ? draft.noticias.map((n, i) => `
        <div class="post-card">
          <div class="post-head">
            <div class="post-ava" style="background:${DATA.usuario.color}">${DATA.usuario.avatar}</div>
            <div><strong>${DATA.usuario.nombre}</strong><small>${n.fecha}</small></div>
            <button class="guest-del" onclick="delNoticia(${i})">✕</button>
          </div>
          ${n.texto ? `<p class="post-text">${n.texto}</p>` : ''}
          ${mediaHTML(n)}
        </div>`).join('')
    : `<p class="empty">Aún no hay publicaciones. Comparte la primera 📣</p>`;
}
function addNoticia() {
  const inp = document.getElementById('newsInput');
  const texto = inp.value.trim();
  if (!texto && !_newsMedia) return;
  draft.noticias.unshift({ texto, media: _newsMedia, fecha: 'ahora' });
  inp.value = '';
  _newsMedia = null;
  const info = document.getElementById('newsAttachInfo');
  if (info) info.textContent = '';
  pintarNoticias();
  toast('Publicación añadida 📣');
}
function delNoticia(i) { draft.noticias.splice(i, 1); pintarNoticias(); }

// --- Guardar / publicar (crea o actualiza el evento) ---
function guardarFiesta() {
  if (!draft.nombre.trim()) { toast('Ponle un nombre a tu fiesta'); return; }
  const capacidad = draft.boletos.reduce((s, b) => s + (+b.cantidad || 0), 0);
  // Precio: el más barato de los boletos
  const precios = draft.boletos.map((b) => +b.precio || 0);
  const minPrecio = precios.length ? Math.min(...precios) : 0;
  const campos = {
    nombre: draft.nombre.trim(),
    lugar: draft.lugar.trim() || 'Lugar por confirmar',
    ciudad: draft.ciudad.trim() || 'Ciudad',
    organizador: DATA.usuario.nombre,
    organizadores: draft.organizadores.map((o) => ({ ...o })),
    emoji: '',
    grad: draft.cover.grad,
    coverImg: draft.cover.img,
    nombreColor: draft.cover.titleColor,
    animColors: draft.cover.anim.slice(),
    titlePos: { ...draft.cover.titlePos },
    titleSize: draft.cover.titleSize,
    coverTextos: draft.cover.textos.map((t) => ({ ...t })),
    proximamente: draft.proximamente,
    fecha: draft.proximamente ? 'Próximamente' : (draft.fecha.trim() || 'Fecha por confirmar'),
    capacidad,
    boletos: draft.boletos.map((b) => ({ ...b })),
    edadRango: draft.edad.activo ? { min: 18, max: draft.edad.max || null } : null,
    edad: '18+',
    noticias: draft.noticias.map((n) => ({ ...n })),
    precio: minPrecio > 0 ? `$${minPrecio}` : 'Gratis',
    cuando: 'semana'
  };

  if (draft.id) {
    // Editando: actualizamos el evento existente
    const e = DATA.eventos.find((x) => x.id === draft.id);
    if (e) Object.assign(e, campos);
    toast('Cambios guardados ✓');
  } else {
    // Nuevo: lo creamos y lo agregamos al inicio del feed
    DATA.eventos.unshift({
      id: 'ev' + Date.now(),
      asistentes: 0,
      cat: ['semana', 'cerca'],
      ...campos
    });
    toast('¡Fiesta publicada! 🎉');
  }
  draft = nuevoDraft();
  irA('profile');
}

// --- Pisos / niveles ---
function pintarFloors() {
  const cont = document.getElementById('floorTabs');
  if (!cont) return;
  cont.innerHTML = draft.pisos.map((p, i) => `
    <button class="floor-tab ${i === draft.pisoActivo ? 'is-active' : ''}" onclick="cambiarPiso(${i})">${p.nombre}</button>
  `).join('') + `<button class="floor-add" onclick="agregarPiso()">＋ Piso</button>`;
}
function cambiarPiso(i) {
  draft.pisoActivo = i;
  draft.sel = null;
  pintarFloors(); pintarVenue(); pintarControls();
}
function agregarPiso() {
  const n = draft.pisos.length;
  draft.pisos.push({ nombre: n === 0 ? 'Planta baja' : `Piso ${n}`, items: [] });
  draft.pisoActivo = draft.pisos.length - 1;
  draft.sel = null;
  pintarFloors(); pintarVenue(); pintarControls();
  toast('Piso agregado');
}

// --- Paleta ---
function pintarTools() {
  document.getElementById('toolRow').innerHTML = Object.entries(VENUE_TOOLS).map(([id, t]) => `
    <button class="tool ${id === draft.tool ? 'is-active' : ''}" onclick="elegirTool('${id}')">
      <span class="tool-emoji">${t.emoji}</span>
      <span>${t.label}</span>
    </button>
  `).join('');
}
function elegirTool(id) {
  draft.tool = id;
  pintarTools();
  actualizarHint();
}
function actualizarHint() {
  const h = document.getElementById('venueHint');
  if (h) h.style.display = itemsActuales().length ? 'none' : 'block';
  if (h) h.textContent = `Toca para colocar “${VENUE_TOOLS[draft.tool].label}”`;
}

// El rectángulo de la zona del plano (ya con el zoom aplicado)
function venueRect() { return document.getElementById('venueInner').getBoundingClientRect(); }

// --- Dibujar el plano ---
function pintarVenue() {
  const inner = document.getElementById('venueInner');
  if (!inner) return;
  inner.style.transform = `scale(${draft.zoom})`;
  // Imagen de fondo del piso (si la subieron)
  const bg = pisoActual().bg;
  inner.style.backgroundImage = bg ? `url(${bg})` : '';
  inner.style.backgroundSize = 'cover';
  inner.style.backgroundPosition = 'center';
  inner.classList.toggle('has-bg', !!bg);
  const zl = document.getElementById('zoomLabel');
  if (zl) zl.textContent = Math.round(draft.zoom * 100) + '%';

  inner.querySelectorAll('.v-item').forEach((el) => el.remove());
  actualizarHint();

  itemsActuales().forEach((it) => {
    const t = VENUE_TOOLS[it.tipo];
    const grande = it.w >= 78 || it.h >= 70;
    const el = document.createElement('div');
    el.className = `v-item v-${it.tipo} ${t.forma === 'redonda' ? 'redonda' : ''} ${grande ? 'lg' : ''} ${it.id === draft.sel ? 'sel' : ''}`;
    el.style.left = it.x + '%';
    el.style.top = it.y + '%';
    el.style.width = it.w + 'px';
    el.style.height = it.h + 'px';
    el.style.transform = `translate(-50%,-50%) rotate(${it.rot || 0}deg)`;
    // El emoji escala con el tamaño del elemento (no estorba en los chicos)
    const fs = Math.max(11, Math.min(26, Math.min(it.w, it.h) * 0.42));
    el.innerHTML = `<span style="font-size:${fs}px">${t.emoji}</span><b>${t.label}</b>`;
    el.setAttribute('onpointerdown', `venueGrab(event, ${it.id})`);
    el.setAttribute('onclick', `venueItemTap(event, ${it.id})`);
    inner.appendChild(el);
  });
}

// Zoom del plano (límites y aplicación)
function setZoom(z) {
  draft.zoom = Math.max(0.4, Math.min(2.5, Math.round(z * 100) / 100));
  const inner = document.getElementById('venueInner');
  if (inner) inner.style.transform = `scale(${draft.zoom})`;
  const zl = document.getElementById('zoomLabel');
  if (zl) zl.textContent = Math.round(draft.zoom * 100) + '%';
}
function zoomVenue(dir) { setZoom(draft.zoom + dir * 0.15); }

// Zoom con la rueda del mouse
function venueWheel(ev) {
  ev.preventDefault();
  setZoom(draft.zoom - ev.deltaY * 0.0015);
}

// --- Zoom con pellizco (dos dedos) ---
const _pointers = new Map();
let _pinchDist = 0, _pinchZoom = 1;
function venuePinchDown(ev) {
  _pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (_pointers.size === 2) {
    const p = [..._pointers.values()];
    _pinchDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    _pinchZoom = draft.zoom;
  }
}
function venuePinchUp(ev) {
  _pointers.delete(ev.pointerId);
  if (_pointers.size < 2) _pinchDist = 0;
  venueDrop();
}

// Tocar el plano vacío: coloca un elemento nuevo (y lo selecciona)
function venueTap(ev) {
  if (ev.target.id !== 'venue' && ev.target.id !== 'venueInner' &&
      !ev.target.classList.contains('venue-grid') && ev.target.id !== 'venueHint') return;
  if (_dragMoved) { _dragMoved = false; return; }
  const t = VENUE_TOOLS[draft.tool];
  const r = venueRect();
  const x = clamp(((ev.clientX - r.left) / r.width) * 100);
  const y = clamp(((ev.clientY - r.top) / r.height) * 100);
  const item = { id: ++draft.seq, tipo: draft.tool, x, y, w: t.w, h: t.h, rot: 0 };
  itemsActuales().push(item);
  draft.sel = item.id;
  pintarVenue();
  pintarControls();
}

// Tocar un elemento: lo selecciona (los controles aparecen abajo)
function venueItemTap(ev, id) {
  ev.stopPropagation();
  if (_dragMoved) { _dragMoved = false; return; }
  draft.sel = id;
  pintarVenue();
  pintarControls();
}

// --- Arrastrar ---
let _dragId = null, _dragMoved = false;
function venueGrab(ev, id) {
  ev.stopPropagation();
  _dragId = id; _dragMoved = false;
  draft.sel = id;
}
function venueMove(ev) {
  // Si hay dos dedos, es pellizco para zoom (no arrastrar)
  if (_pointers.has(ev.pointerId)) _pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (_pointers.size === 2 && _pinchDist) {
    const p = [..._pointers.values()];
    const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    setZoom(_pinchZoom * (d / _pinchDist));
    return;
  }
  if (_dragId == null) return;
  _dragMoved = true;
  const r = venueRect();
  const it = itemsActuales().find((i) => i.id === _dragId);
  if (!it) return;
  it.x = clamp(((ev.clientX - r.left) / r.width) * 100);
  it.y = clamp(((ev.clientY - r.top) / r.height) * 100);
  const el = [...document.querySelectorAll('.v-item')][itemsActuales().indexOf(it)];
  if (el) { el.style.left = it.x + '%'; el.style.top = it.y + '%'; }
}
function venueDrop() { if (_dragId != null) { _dragId = null; pintarVenue(); pintarControls(); } }
function clamp(n) { return Math.max(3, Math.min(97, n)); }

// --- Controles del elemento seleccionado ---
function pintarControls() {
  const c = document.getElementById('venueControls');
  if (!c) return;
  const it = itemSel();
  if (!it) { c.className = 'venue-controls'; c.innerHTML = ''; return; }
  const t = VENUE_TOOLS[it.tipo];
  c.className = 'venue-controls on';
  c.innerHTML = `
    <div class="vc-head">
      <span>${t.emoji} ${t.label}</span>
      <button class="vc-done" onclick="deseleccionar()">Listo</button>
    </div>
    <div class="vc-grid">
      <div class="vc-ctrl"><span>Ancho</span>
        <button onclick="resize('w',-1)">−</button><b>${it.w}</b><button onclick="resize('w',1)">+</button></div>
      <div class="vc-ctrl"><span>Alto</span>
        <button onclick="resize('h',-1)">−</button><b>${it.h}</b><button onclick="resize('h',1)">+</button></div>
      <div class="vc-ctrl"><span>Girar</span>
        <button onclick="rotar(-15)">⟲</button><b>${it.rot || 0}°</b><button onclick="rotar(15)">⟳</button></div>
    </div>
    <div class="vc-actions">
      <button class="vc-dup" onclick="duplicarItem()">⧉ Duplicar</button>
      <button class="vc-del" onclick="eliminarItem()">🗑 Eliminar</button>
    </div>
  `;
}
function resize(dim, dir) {
  const it = itemSel(); if (!it) return;
  it[dim] = Math.max(22, Math.min(240, it[dim] + dir * 10));
  pintarVenue(); pintarControls();
}
function rotar(deg) {
  const it = itemSel(); if (!it) return;
  it.rot = ((it.rot || 0) + deg + 360) % 360;
  pintarVenue(); pintarControls();
}
function duplicarItem() {
  const it = itemSel(); if (!it) return;
  const copia = { ...it, id: ++draft.seq, x: clamp(it.x + 6), y: clamp(it.y + 6) };
  itemsActuales().push(copia);
  draft.sel = copia.id;
  pintarVenue(); pintarControls();
}
function eliminarItem() {
  pisoActual().items = itemsActuales().filter((i) => i.id !== draft.sel);
  draft.sel = null;
  pintarVenue(); pintarControls();
}
function deseleccionar() {
  draft.sel = null;
  pintarVenue(); pintarControls();
}

function limpiarVenue() {
  pisoActual().items = [];
  draft.sel = null;
  pintarVenue(); pintarControls();
  toast('Piso vaciado');
}

// --- Lista de ingreso ---
function pintarGuests() {
  const cont = document.getElementById('guestList');
  if (!cont) return;
  const dentro = draft.guests.filter((g) => g.dentro).length;
  document.getElementById('guestCount').textContent = `${dentro}/${draft.guests.length} dentro`;
  cont.innerHTML = draft.guests.length ? draft.guests.map((g, i) => `
    <div class="guest-row ${g.dentro ? 'is-in' : ''}">
      <button class="guest-check" onclick="checkGuest(${i})">${g.dentro ? '✓' : ''}</button>
      <span class="guest-name">${g.nombre}</span>
      <span class="guest-state">${g.dentro ? 'Dentro' : 'Pendiente'}</span>
      <button class="guest-del" onclick="delGuest(${i})">✕</button>
    </div>
  `).join('') : `<p class="empty">Aún no hay invitados. Añade el primero ✨</p>`;
}
function addGuest() {
  const inp = document.getElementById('guestInput');
  const nombre = inp.value.trim();
  if (!nombre) return;
  draft.guests.push({ nombre, dentro: false });
  inp.value = '';
  pintarGuests();
  inp.focus();
}
function checkGuest(i) { draft.guests[i].dentro = !draft.guests[i].dentro; pintarGuests();
  toast(draft.guests[i].dentro ? `${draft.guests[i].nombre} ingresó ✓` : `${draft.guests[i].nombre} marcado pendiente`); }
function delGuest(i) { draft.guests.splice(i, 1); pintarGuests(); }

/* ===================================================================
   4. AMIGOS (solo asistente)
   =================================================================== */

function pintarAmigos() {
  const cont = document.getElementById('screen-friends');
  // Solo "en vivo" los que puedo ver (los privados no-mejores-amigos se ocultan)
  const enVivo = DATA.amigos.filter((a) => a.ahora && puedeVer(a));

  cont.innerHTML = `
    <header class="page-head">
      <h1>Amigos</h1>
      <p class="page-sub">Mira a dónde va tu gente.</p>
    </header>

    <div class="search-bar">
      ${icon('search', 'mute')}
      <input id="friendSearch" placeholder="Busca por nombre o @usuario" oninput="filtrarAmigos(this.value)">
    </div>

    ${enVivo.length ? `
      <div class="row-between">
        <h3><span class="live-dot"></span> En la fiesta ahora</h3>
      </div>
      <div class="live-row">
        ${enVivo.map((a) => `
          <div class="live-card">
            <div class="live-ava" style="background:${a.color}">${a.avatar}
              <span class="live-ping"></span>
            </div>
            <strong>${a.nombre.split(' ')[0]}</strong>
            <small>${a.ahora}</small>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="row-between"><h3>Tus amigos</h3><span class="see-all">${DATA.amigos.length}</span></div>
    <div class="friend-list" id="friendList">
      ${amigosOrdenados().map(tarjetaAmigo).join('')}
    </div>

    <div class="row-between"><h3>Quizá los conozcas</h3></div>
    <div class="friend-list">
      ${DATA.sugerencias.map(tarjetaSugerencia).join('')}
    </div>
  `;
}

// ¿Puedo ver la actividad de este amigo?
// Los perfiles privados SOLO los ven sus mejores amigos.
function puedeVer(a) { return !a.privado || a.mejorAmigo; }

// Tarjeta de un amigo. Los mejores amigos se ven en AZUL. Clicable.
function tarjetaAmigo(a) {
  const best = a.mejorAmigo ? 'best' : '';
  const estrella = a.mejorAmigo ? '<span class="best-star">★</span>' : '';

  // Privado y NO es mejor amigo → bloqueado
  if (!puedeVer(a)) {
    return `
      <article class="friend-card ${best}" onclick="abrirAmigo('${a.usuario}')">
        <div class="friend-ava ${best}" style="background:${a.color}">${a.avatar}${estrella}</div>
        <div class="friend-main">
          <strong>${a.nombre}</strong>
          <small>${a.usuario}</small>
          <p class="friend-locked">🔒 Privado · solo sus mejores amigos ven su actividad</p>
        </div>
      </article>`;
  }
  const estado = a.ahora
    ? `<span class="friend-now">🔴 En ${a.ahora} ahora</span>`
    : (a.fue[0] ? `<span class="friend-was">Última: ${a.fue[0]}</span>` : `<span class="friend-was">Sin fiestas aún</span>`);
  return `
    <article class="friend-card ${best}" onclick="abrirAmigo('${a.usuario}')">
      <div class="friend-ava ${best}" style="background:${a.color}">${a.avatar}${estrella}</div>
      <div class="friend-main">
        <strong>${a.nombre} ${a.mejorAmigo ? '<span class="best-tag">Mejor amigo</span>' : ''}</strong>
        <small>${a.usuario}</small>
        ${estado}
        ${a.fotos.length ? `<div class="photo-strip">
          ${a.fotos.map((f) => `<span class="photo-thumb">${f}</span>`).join('')}
          <span class="photo-count">${a.fotos.length} fotos</span>
        </div>` : ''}
      </div>
    </article>`;
}

// Abre el detalle de un amigo en el panel deslizable.
function abrirAmigo(usuario) {
  const a = DATA.amigos.find((x) => x.usuario === usuario);
  if (!a) return;

  // Botón para marcar / quitar mejor amigo (azul)
  const btnBest = `
    <button class="best-btn ${a.mejorAmigo ? 'is-on' : ''}" onclick="toggleMejorAmigo('${a.usuario}')">
      ${a.mejorAmigo ? '★ Mejor amigo' : '☆ Hacer mejor amigo'}
    </button>`;

  if (!puedeVer(a)) {
    abrirSheet(a.nombre, `
      <div class="amigo-top">
        <div class="amigo-ava" style="background:${a.color}">${a.avatar}</div>
        <strong>${a.nombre}</strong><small>${a.usuario}</small>
      </div>
      <div class="locked-box">🔒 Este perfil es privado.<br>Solo sus mejores amigos ven su actividad.</div>
      <div class="sheet-actions">${btnBest}</div>
    `);
    return;
  }
  abrirSheet(a.nombre, `
    <div class="amigo-top">
      <div class="amigo-ava ${a.mejorAmigo ? 'best' : ''}" style="background:${a.color}">${a.avatar}</div>
      <strong>${a.nombre}</strong><small>${a.usuario}</small>
      ${a.mejorAmigo ? '<span class="best-tag">★ Mejor amigo</span>' : ''}
      ${a.ahora ? `<span class="friend-now">🔴 En ${a.ahora} ahora</span>` : ''}
    </div>
    <div class="row-between"><h3>Fiestas a las que fue</h3></div>
    ${a.fue.length ? `<div class="chips-row wrap">${a.fue.map((f) => `<span class="chip">${f}</span>`).join('')}</div>`
                   : `<p class="empty">Aún no ha ido a ninguna 🙈</p>`}
    <div class="row-between"><h3>Sus fotos</h3></div>
    ${a.fotos.length ? `<div class="photo-grid">${a.fotos.map((f) => `<div class="photo-cell">${f}</div>`).join('')}</div>`
                     : `<p class="empty">Sin fotos todavía 📸</p>`}
    <div class="sheet-actions">${btnBest}</div>
  `);
}

// Marca / quita a un amigo como mejor amigo y refresca todo.
function toggleMejorAmigo(usuario) {
  const a = DATA.amigos.find((x) => x.usuario === usuario);
  a.mejorAmigo = !a.mejorAmigo;
  toast(a.mejorAmigo ? `${a.nombre} ahora es tu mejor amigo 💙` : `${a.nombre} ya no es mejor amigo`);
  abrirAmigo(usuario);  // re-pinta el panel
  pintarAmigos();       // re-pinta la lista de fondo
}

// Tarjeta de sugerencia con botón "Agregar".
function tarjetaSugerencia(s) {
  return `
    <article class="friend-card">
      <div class="friend-ava" style="background:${s.color}">${s.avatar}</div>
      <div class="friend-main">
        <strong>${s.nombre}</strong>
        <small>${s.usuario} · ${s.enComun} amigos en común</small>
      </div>
      <button class="add-btn" onclick="agregarAmigo(this)">Agregar</button>
    </article>`;
}

// Alterna el botón Agregar → Solicitado (visual por ahora).
function agregarAmigo(btn) {
  // Evita que el clic abra la tarjeta del amigo
  if (event) event.stopPropagation();
  const ok = btn.classList.toggle('is-added');
  btn.textContent = ok ? 'Solicitado ✓' : 'Agregar';
  if (ok) toast('Solicitud de amistad enviada 👋');
}

// Amigos ordenados: los mejores amigos primero.
function amigosOrdenados() {
  return [...DATA.amigos].sort((a, b) => (b.mejorAmigo ? 1 : 0) - (a.mejorAmigo ? 1 : 0));
}

// Filtra "Tus amigos" en vivo según el texto del buscador.
function filtrarAmigos(texto) {
  const t = texto.trim().toLowerCase();
  const lista = document.getElementById('friendList');
  if (!lista) return;
  const res = amigosOrdenados().filter((a) =>
    a.nombre.toLowerCase().includes(t) || a.usuario.toLowerCase().includes(t));
  lista.innerHTML = res.length
    ? res.map(tarjetaAmigo).join('')
    : `<p class="empty">Ningún amigo coincide con “${texto}” 🙈</p>`;
}

/* ===================================================================
   5. PERFIL (distinto para organizador y asistente)
   =================================================================== */

function pintarPerfil() {
  const cont = document.getElementById('screen-profile');
  const u = DATA.usuario;
  const esOrg = u.rol === 'organizador';

  cont.innerHTML = esOrg ? perfilOrganizador(u) : perfilAsistente(u);
}

// --- Perfil de ORGANIZADOR ---
function perfilOrganizador(u) {
  const mios = DATA.eventos.filter((e) => e.organizador === u.nombre);
  const popular = u.stats.seguidores >= 1000;
  const insignia =
    `${u.verificado ? `<span class="verif" title="Verificado">❄</span>` : ''}` +
    `${popular ? `<span class="popular" title="Popular · +1000 seguidores">★</span>` : ''}`;
  return `
    <header class="page-head row-between">
      <h1>Perfil</h1>
      <button class="icon-btn sm" onclick="abrirAjustes()">${icon('gear')}</button>
    </header>

    <section class="profile-hero ${popular ? 'is-popular' : ''}">
      ${popular ? '<div class="hero-spark"><i>✦</i><i>✶</i><i>✦</i><i>✶</i><i>✦</i></div>' : ''}
      <div class="hero-cover" style="${u.logo ? `background-image:url(${u.logo});background-size:cover;background-position:center` : `background:${u.color}`}"></div>
      <div class="hero-body">
        <div class="profile-avatar ${popular ? 'ring' : ''}" style="${avatarFondo(u)}">${avatarContenido(u)}</div>
        <h2 class="hero-name">${u.nombre} ${insignia}</h2>
        <p class="profile-user">${u.usuario} <span class="role-chip host">🎪 Organizador</span></p>
        <p class="profile-bio">${u.bio}</p>

        <div class="profile-stats">
          <div class="stat"><strong>${u.stats.eventos}</strong><small>eventos</small></div>
          <span class="stat-sep"></span>
          <div class="stat"><strong>${kilo(u.stats.asistentes)} 🔥</strong><small>asistentes</small></div>
          <span class="stat-sep"></span>
          <button class="stat as-btn" onclick="verSeguidores()"><strong class="name-anim" style="background-image:${animGrad(['#2f7bff','#38bdf8','#7dd3fc','#22d3ee'])}">${u.stats.seguidores}</strong><small>seguidores</small></button>
        </div>

        ${redesHTML(u)}

        <div class="profile-actions">
          <button class="btn full" onclick="editarPerfil()">Editar perfil</button>
          <button class="icon-btn" onclick="compartir('mi perfil')">${icon('share')}</button>
        </div>
      </div>
    </section>

    ${(u.colaboradores && u.colaboradores.length) ? `
      <div class="row-between"><h3>👥 Organizadores</h3></div>
      <div class="colab-row">
        ${u.colaboradores.map((c) => `
          <button class="colab" onclick="verPerfilDe('${c.nombre}','${c.usuario}','${c.avatar}')">
            <span class="colab-ava" style="background:${c.color}">${c.avatar}</span>
            <span class="colab-name">${c.nombre.split(' ')[0]}</span>
            <span class="colab-user">${c.usuario}</span>
          </button>`).join('')}
      </div>` : ''}

    <div class="row-between"><h3>Mis eventos</h3><button class="cal-link" onclick="verCalendario()">📅 Calendario</button></div>
    <div class="event-list">
      ${mios.length ? mios.map((e) => `
        <div class="mio-wrap">
          ${tarjetaEvento(e)}
          <button class="mio-edit" onclick="event.stopPropagation(); editarFiesta('${e.id}')">✎ Editar</button>
        </div>`).join('') : `<p class="empty">Aún no creas eventos 🎉</p>`}
    </div>

    ${(u.eventosPasados && u.eventosPasados.length) ? `
      <div class="row-between"><h3>Eventos anteriores</h3></div>
      <p class="hint">Revive lo que pasó en fiestas pasadas.</p>
      <div class="past-list">
        ${u.eventosPasados.map((p) => `
          <article class="past2">
            <div class="past2-cover" style="background:${p.grad}">
              <div class="past2-overlay">
                <strong>${p.nombre}</strong>
                <small>${p.fecha} · ${p.asistentes} asistentes</small>
              </div>
            </div>
            <div class="past2-photos">
              ${p.fotos.map((f) => `<button class="past2-photo" onclick="toast('Foto de ${p.nombre} 📸')"><span>${f}</span></button>`).join('')}
            </div>
          </article>`).join('')}
      </div>` : ''}
  `;
}

// Fila de redes sociales / contacto
function redesHTML(u) {
  const r = u.redes || {};
  const items = [];
  if (r.whatsapp)  items.push(`<a class="red red-wa" href="https://wa.me/${r.whatsapp}" target="_blank" rel="noopener">💬 WhatsApp</a>`);
  if (r.instagram) items.push(`<a class="red red-ig" href="https://instagram.com/${r.instagram}" target="_blank" rel="noopener">📸 Instagram</a>`);
  if (r.tiktok)    items.push(`<a class="red red-tk" href="https://tiktok.com/@${r.tiktok}" target="_blank" rel="noopener">🎵 TikTok</a>`);
  if (r.web)       items.push(`<a class="red red-web" href="${r.web}" target="_blank" rel="noopener">🌐 Sitio</a>`);
  return items.length ? `<div class="redes-row">${items.join('')}</div>` : '';
}

// Iniciales para usar como "logo" cuando no hay imagen
function inicialesDe(nombre) {
  return nombre.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}
// Fondo del avatar/logo (imagen si hay logo, si no el color)
function avatarFondo(u) {
  return u.logo ? `background-image:url(${u.logo});background-size:cover;background-position:center` : `background:${u.color}`;
}
// Contenido del avatar (nada si hay logo; iniciales para organizador; emoji para asistente)
function avatarContenido(u) {
  if (u.logo) return '';
  return u.rol === 'organizador' ? `<span class="ava-ini">${inicialesDe(u.nombre)}</span>` : u.avatar;
}

// Calendario del mes con los eventos del organizador
function calendarioHTML(u) {
  const anio = 2026, mes = 5; // junio (0 = enero)
  const primerDia = new Date(anio, mes, 1).getDay();   // 0 = domingo
  const dias = new Date(anio, mes + 1, 0).getDate();   // 30
  const conEvento = new Set(DATA.eventos.filter((e) => e.organizador === u.nombre && e.dia).map((e) => e.dia));

  let celdas = '';
  for (let i = 0; i < primerDia; i++) celdas += '<span class="cal-cell empty"></span>';
  for (let d = 1; d <= dias; d++) {
    const has = conEvento.has(d);
    celdas += `<button class="cal-cell ${has ? 'has' : ''}" ${has ? `onclick="verDiaEventos(${d})"` : ''}>${d}${has ? '<i class="cal-dot"></i>' : ''}</button>`;
  }
  return `
    <div class="cal">
      <div class="cal-week"><span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span></div>
      <div class="cal-grid">${celdas}</div>
    </div>`;
}
// Abre el calendario del mes en un panel
function verCalendario() {
  abrirSheet('Calendario · Junio', `
    <p class="hint">Los días con punto tienen evento. Tócalos para ver.</p>
    ${calendarioHTML(DATA.usuario)}
  `);
}
function verDiaEventos(d) {
  const evs = DATA.eventos.filter((e) => e.dia === d);
  abrirSheet(`${d} de junio`, `<div class="event-list">${evs.map(tarjetaEvento).join('')}</div>`);
}

// Ver la lista de seguidores
function verSeguidores() {
  const lista = DATA.usuario.seguidoresList || [];
  abrirSheet(`Seguidores · ${DATA.usuario.stats.seguidores}`, `
    <div class="friend-list">
      ${lista.map((s) => `
        <article class="friend-card" onclick="verPerfilDe('${s.nombre}','${s.usuario}','${s.avatar}')">
          <div class="friend-ava" style="background:${s.color}">${s.avatar}</div>
          <div class="friend-main"><strong>${s.nombre}</strong><small>${s.usuario}</small></div>
          <button class="add-btn" onclick="event.stopPropagation(); this.classList.toggle('is-added'); this.textContent=this.classList.contains('is-added')?'Siguiendo ✓':'Seguir'">Seguir</button>
        </article>`).join('')}
    </div>
  `);
}

// Mini-perfil de otra persona (colaborador / seguidor)
function verPerfilDe(nombre, usuario, avatar) {
  abrirSheet(nombre, `
    <div class="amigo-top">
      <div class="amigo-ava" style="background:var(--grad-cool)">${avatar}</div>
      <strong>${nombre}</strong><small>${usuario}</small>
    </div>
    <p class="ev-desc" style="text-align:center">Perfil de organizador/colaborador en Socialice.</p>
    <div class="sheet-actions">
      <button class="btn full" onclick="toast('Ahora sigues a ${nombre} ✓'); cerrarSheet()">Seguir</button>
      <button class="icon-btn" onclick="compartir('${nombre}')">${icon('share')}</button>
    </div>
  `);
}

// --- Perfil de ASISTENTE ---
function perfilAsistente(u) {
  // Sus próximas fiestas y su historial (mock a partir de los eventos)
  const proximas = DATA.eventos.slice(0, 2);
  const historial = DATA.eventos.slice(2);

  return `
    <header class="page-head row-between">
      <h1>Mi perfil</h1>
      <button class="icon-btn sm" onclick="abrirAjustes()">${icon('gear')}</button>
    </header>

    <section class="profile-hero">
      <div class="hero-cover" style="background:${u.color}"></div>
      <div class="hero-body">
        <div class="profile-avatar" style="background:${u.color}">${u.avatar}</div>
        <h2 class="hero-name">${u.nombre}</h2>
        <p class="profile-user">${u.usuario} <span class="role-chip guest">🎟️ Asistente</span></p>
        <p class="profile-bio">${u.bio}</p>
        <div class="profile-stats">
          <div class="stat"><strong>${u.stats.fueA}</strong><small>fiestas</small></div>
          <span class="stat-sep"></span>
          <div class="stat"><strong>${u.stats.amigos}</strong><small>amigos</small></div>
          <span class="stat-sep"></span>
          <div class="stat"><strong>${u.stats.seguidores}</strong><small>seguidores</small></div>
        </div>
        <div class="profile-actions">
          <button class="btn full" onclick="editarPerfil()">Editar perfil</button>
          <button class="icon-btn" onclick="irA('friends')">${icon('users')}</button>
        </div>
      </div>
    </section>

    <!-- Privacidad: público o privado -->
    <div class="privacy-card">
      <div class="privacy-text">
        <strong>${u.privado ? '🔒 Perfil privado' : '🌍 Perfil público'}</strong>
        <small>${u.privado
          ? 'Solo tus amigos ven a qué fiestas vas.'
          : 'Cualquiera puede ver a qué fiestas vas.'}</small>
      </div>
      <button class="toggle ${u.privado ? '' : 'is-on'}" onclick="alternarPrivacidad()">
        <span class="toggle-knob"></span>
      </button>
    </div>

    <div class="row-between"><h3>Voy a ir</h3><span class="see-all">${proximas.length}</span></div>
    <div class="mini-list">
      ${proximas.map((e) => filaFiesta(e, 'voy')).join('')}
    </div>

    <div class="row-between"><h3>Historial</h3><span class="see-all" onclick="irA('search')">Ver todo</span></div>
    <div class="mini-list">
      ${historial.map((e) => filaFiesta(e, 'fui')).join('')}
    </div>

    <div class="row-between"><h3>Mis fotos</h3><span class="see-all" onclick="toast('Subir foto · próximamente')">Subir</span></div>
    <div class="photo-grid">
      ${['🌃','🪩','🥂','💃','✨','🎉'].map((f) => `<button class="photo-cell" onclick="toast('Foto de fiesta 📸')">${f}</button>`).join('')}
    </div>
  `;
}

// Fila compacta de una fiesta (en el perfil del asistente). Clicable.
function filaFiesta(e, modo) {
  const etq = modo === 'voy'
    ? `<span class="tag-go">Confirmado</span>`
    : `<span class="tag-was">Asististe</span>`;
  return `
    <div class="mini-card" onclick="abrirEvento('${e.id}')">
      <div class="mini-cover" style="background:${e.grad}">${e.emoji}</div>
      <div class="mini-main">
        <strong>${e.nombre}</strong>
        <small>${e.fecha} · ${e.ciudad}</small>
      </div>
      ${etq}
    </div>`;
}

// Cambia público <-> privado y vuelve a pintar el perfil.
function alternarPrivacidad() {
  DATA.usuario.privado = !DATA.usuario.privado;
  pintarPerfil();
}

/* ===================================================================
   6. NAVEGACIÓN INFERIOR (cambia según el rol)
   =================================================================== */

function pintarNav() {
  const nav = document.getElementById('bottomNav');
  const esOrg = DATA.usuario.rol === 'organizador';

  // El organizador tiene "Crear"; el asistente tiene "Amigos".
  const items = esOrg
    ? [
        { go: 'home',    ic: 'home',   texto: 'Inicio' },
        { go: 'search',  ic: 'search', texto: 'Buscar' },
        { go: 'create',  ic: 'plus',   texto: 'Crear'  },
        { go: 'profile', ic: 'user',   texto: 'Perfil' }
      ]
    : [
        { go: 'home',    ic: 'home',   texto: 'Explorar' },
        { go: 'search',  ic: 'search', texto: 'Buscar'   },
        { go: 'friends', ic: 'users',  texto: 'Amigos'   },
        { go: 'profile', ic: 'user',   texto: 'Perfil'   }
      ];

  const actual = document.body.dataset.screen;
  nav.innerHTML = items.map((it) => `
    <button class="nav-btn ${it.go === actual ? 'is-active' : ''}"
            data-go="${it.go}" onclick="irA('${it.go}')">
      <span class="nav-icon">${icon(it.ic)}</span>
      <span class="nav-text">${it.texto}</span>
    </button>
  `).join('');
}

/* ===================================================================
   6.5 INTERACCIONES: avisos, panel deslizable y acciones de botones
   =================================================================== */

// --- Toast: aviso breve abajo ---
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
}

// --- Panel deslizable (sheet) ---
function abrirSheet(titulo, html) {
  document.getElementById('sheetTitle').textContent = titulo;
  document.getElementById('sheetBody').innerHTML = html;
  document.getElementById('sheetOverlay').classList.add('is-on');
  document.body.classList.add('no-scroll');
}
function cerrarSheet(ev) {
  // Si se hizo clic dentro del panel (no en el fondo), no cerrar
  if (ev && ev.target.closest('.sheet') && ev.type === 'click' &&
      ev.currentTarget.id === 'sheetOverlay' && ev.target !== ev.currentTarget) return;
  const s = document.getElementById('sheet');
  s.style.transition = ''; s.style.transform = '';
  document.getElementById('sheetOverlay').classList.remove('is-on');
  document.body.classList.remove('no-scroll');
}

// --- Arrastrar el panel hacia abajo para cerrarlo ---
let _sheetY = null;
function sheetDragStart(ev) {
  _sheetY = ev.clientY;
  const s = document.getElementById('sheet');
  s.style.transition = 'none';
  window.addEventListener('pointermove', sheetDragMove);
  window.addEventListener('pointerup', sheetDragEnd);
}
function sheetDragMove(ev) {
  if (_sheetY == null) return;
  const dy = Math.max(0, ev.clientY - _sheetY);
  const s = document.getElementById('sheet');
  s.style.transform = `translateY(${dy}px)`;
  // El fondo se aclara conforme arrastras
  document.getElementById('sheetOverlay').style.opacity = Math.max(.3, 1 - dy / 500);
}
function sheetDragEnd(ev) {
  const dy = Math.max(0, ev.clientY - (_sheetY ?? ev.clientY));
  window.removeEventListener('pointermove', sheetDragMove);
  window.removeEventListener('pointerup', sheetDragEnd);
  _sheetY = null;
  const s = document.getElementById('sheet');
  const ov = document.getElementById('sheetOverlay');
  s.style.transition = ''; ov.style.opacity = '';
  if (dy > 110) cerrarSheet();          // si arrastraste suficiente, cierra
  else s.style.transform = '';          // si no, regresa a su lugar
}

// --- Ver detalle de un evento ---
/* ============ Página de evento (estilo Partiful) ============ */

// Cuenta regresiva legible
function cuentaRegresiva(e) {
  if (!e.fechaISO) return e.proximamente ? 'Próximamente' : '';
  const ev = new Date(e.fechaISO); const hoy = new Date();
  const a = new Date(ev.getFullYear(), ev.getMonth(), ev.getDate());
  const b = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const d = Math.round((a - b) / 86400000);
  if (d < 0) return 'Ya pasó';
  if (d === 0) return '¡Es hoy!';
  if (d === 1) return 'Mañana';
  if (d <= 7) return `Faltan ${d} días`;
  return `En ${Math.ceil(d / 7)} semanas`;
}

// Conteo de respuestas (van / tal vez / no), con tu respuesta incluida
function rsvpCounts(e) {
  const base = e.asistentes || 0;
  let van = base, tal = Math.round(base * 0.18), no = Math.round(base * 0.06);
  if (e._rsvp === 'voy') van += 1;
  else if (e._rsvp === 'tal') tal += 1;
  else if (e._rsvp === 'no') no += 1;
  return { van, tal, no };
}

// Muestra deterministe de invitados desde el pool
function invitadosMuestra(e, n) {
  const pool = DATA.gente || [];
  if (!pool.length) return [];
  const seed = e.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const start = seed % pool.length;
  const rot = pool.slice(start).concat(pool.slice(0, start));
  const lista = [];
  if (e._rsvp === 'voy') lista.push({ nombre: DATA.usuario.nombre + ' (tú)', avatar: DATA.usuario.avatar, color: DATA.usuario.color, yo: true });
  return lista.concat(rot.slice(0, n));
}

function abrirEvento(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  if (!e._comentarios) e._comentarios = (COMENTARIOS_SEED[e.id] || []).map((c) => ({ ...c }));
  const esMio = e.organizador === DATA.usuario.nombre && DATA.usuario.rol === 'organizador';
  const edadTxt = (e.edadRango && e.edadRango.max) ? `18–${e.edadRango.max} años` : '18+';
  const orgs = [{ nombre: e.organizador, avatar: DATA.usuario.avatar, color: DATA.usuario.color }].concat(e.organizadores || []);
  const c = rsvpCounts(e);
  const cuenta = cuentaRegresiva(e);
  const muestra = invitadosMuestra(e, 7);

  abrirSheet(e.nombre, `
    <!-- Portada (no se toca) -->
    <div class="ev-cover" style="${coverStyle(e)}">
      <span class="ev-cover-emoji">${e.coverImg ? '' : (e.emoji || '')}</span>
      <span class="event-price">${e.precio}</span>
    </div>
    ${((e.animColors && e.animColors.length >= 2) || (e.nombreColor && e.nombreColor !== '#ffffff')) ? `<div class="ev-title-wrap"><h2 ${nombreAttrs(e)}>${e.nombre}</h2></div>` : ''}

    ${cuenta ? `<div class="ev-count ${cuenta === '¡Es hoy!' ? 'today' : ''}">⏳ ${cuenta}</div>` : ''}

    <!-- Anfitrión -->
    <div class="ev-host">
      <div class="ev-host-avas">${orgs.slice(0, 3).map((o) => `<span class="ev-host-ava" style="background:${o.color || 'var(--grad-cool)'}">${o.avatar || '🎤'}</span>`).join('')}</div>
      <div><small>Organiza</small><strong>${orgs.map((o) => o.nombre.split(' ')[0]).join(', ')}</strong></div>
    </div>

    <!-- Fecha y lugar con acciones -->
    <div class="ev-line">
      <div class="ev-line-main">${icon('ticket','mute')}<div><strong>${e.fecha}</strong><small>Edad: ${edadTxt}</small></div></div>
      ${e.fechaISO ? `<button class="ev-line-act" onclick="addCalendario('${e.id}')">＋ Calendario</button>` : ''}
    </div>
    <div class="ev-line">
      <div class="ev-line-main">${icon('pin','mute')}<div><strong>${e.lugar}</strong><small>${e.ciudad}</small></div></div>
      <button class="ev-line-act" onclick="toast('Mapa · próximamente 🗺️')">Ver mapa</button>
    </div>

    ${casiLleno(e) ? `<div class="warn-full">🔥 ¡Casi se agotan los lugares! Quedan pocos.</div>` : ''}

    ${esMio ? '' : `
      <!-- RSVP: ¿vas a ir? -->
      <div class="rsvp">
        <p class="rsvp-q">${e.proximamente ? '¿Te interesa?' : '¿Vas a ir?'}</p>
        ${e.proximamente
          ? `<button class="rsvp-btn solo ${e._interesado ? 'on' : ''}" onclick="interesadoPage('${e.id}')">${e._interesado ? '⭐ Interesado ✓' : '⭐ Me interesa'}</button>`
          : `<div class="rsvp-row">
              <button class="rsvp-btn voy ${e._rsvp === 'voy' ? 'on' : ''}" onclick="setRsvp('${e.id}','voy')">✅<span>Voy</span></button>
              <button class="rsvp-btn tal ${e._rsvp === 'tal' ? 'on' : ''}" onclick="setRsvp('${e.id}','tal')">🤔<span>Tal vez</span></button>
              <button class="rsvp-btn no ${e._rsvp === 'no' ? 'on' : ''}" onclick="setRsvp('${e.id}','no')">🙅<span>No puedo</span></button>
            </div>`}
      </div>`}

    <!-- Quién va -->
    <div class="row-between"><h3>Quién va</h3><span class="see-all" onclick="verListaInvitados('${e.id}')">Ver lista</span></div>
    <div class="rsvp-counts">
      <span class="rc voy">✅ ${c.van}</span>
      <span class="rc tal">🤔 ${c.tal}</span>
      <span class="rc no">🙅 ${c.no}</span>
    </div>
    <div class="ava-stack" onclick="verListaInvitados('${e.id}')">
      ${muestra.map((g) => `<span class="ava-mini" style="background:${g.color}">${g.avatar}</span>`).join('')}
      ${c.van > muestra.length ? `<span class="ava-more">+${c.van - muestra.length}</span>` : ''}
    </div>

    ${(e.boletos && e.boletos.length) ? `
      <div class="row-between"><h3>🎟️ Boletos</h3></div>
      <div class="zona-list">
        ${e.boletos.map((b) => `
          <div class="zona-row">
            <div><strong>${b.nombre || 'Boleto'}</strong><small>${b.cantidad} disponibles</small></div>
            <span class="zona-precio">${(+b.precio) > 0 ? '$' + b.precio : 'Gratis'}</span>
          </div>`).join('')}
      </div>` : ''}

    <p class="ev-desc">Una noche para recordar en ${e.lugar}. Música, luces y la mejor energía 🎶</p>

    <!-- Invitar -->
    <div class="invite-row">
      <button class="btn full" onclick="copiarInvitacion('${e.id}')">🔗 Copiar invitación</button>
      <button class="icon-btn" onclick="compartir('${e.nombre}')" aria-label="Compartir">${icon('share')}</button>
    </div>

    ${(e.noticias && e.noticias.length) ? `
      <div class="row-between"><h3>📰 Publicaciones</h3></div>
      <div class="news-list">
        ${e.noticias.map((n) => `
          <div class="post-card">
            <div class="post-head">
              <div class="post-ava" style="background:${DATA.usuario.color}">${DATA.usuario.avatar}</div>
              <div><strong>${e.organizador}</strong><small>${n.fecha || ''}</small></div>
            </div>
            ${n.texto ? `<p class="post-text">${n.texto}</p>` : ''}
            ${mediaHTML(n)}
          </div>`).join('')}
      </div>` : ''}

    <!-- Muro de comentarios -->
    <div class="row-between"><h3>💬 Comentarios</h3></div>
    <div class="post-compose">
      <textarea id="evComInput" placeholder="Escribe un comentario…" rows="1"></textarea>
      <div class="post-compose-bar">
        <span class="post-attach-info"></span>
        <button class="add-btn" onclick="addComentario('${e.id}')">Enviar</button>
      </div>
    </div>
    <div class="com-list" id="evComList">${comentariosHTML(e)}</div>

    ${esMio ? `<div class="sheet-actions"><button class="btn full" onclick="cerrarSheet(); editarFiesta('${e.id}')">✎ Editar evento</button></div>` : ''}
  `);
}

// Comentarios → HTML
function comentariosHTML(e) {
  if (!e._comentarios || !e._comentarios.length) return `<p class="empty">Sé el primero en comentar 💬</p>`;
  return e._comentarios.map((c) => `
    <div class="com-item">
      <span class="com-ava" style="background:${c.color}">${c.avatar}</span>
      <div class="com-body"><strong>${c.nombre} <small>${c.fecha || ''}</small></strong><p>${c.texto}</p></div>
    </div>`).join('');
}
function addComentario(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  const inp = document.getElementById('evComInput');
  const texto = inp.value.trim();
  if (!texto) return;
  const u = DATA.usuario;
  e._comentarios.unshift({ nombre: u.nombre.split(' ')[0], avatar: u.avatar, color: u.color, texto, fecha: 'ahora' });
  inp.value = '';
  document.getElementById('evComList').innerHTML = comentariosHTML(e);
}

// RSVP (Voy / Tal vez / No puedo)
function setRsvp(id, estado) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  e._rsvp = (e._rsvp === estado) ? null : estado;
  e._voy = e._rsvp === 'voy';
  const msg = { voy: `¡Confirmado! Vas a ${e.nombre} 🎉`, tal: 'Quedaste como "tal vez" 🤔', no: 'Marcaste que no puedes 🙅' };
  toast(e._rsvp ? msg[e._rsvp] : 'Quitaste tu respuesta');
  abrirEvento(id);
}
// Interés desde la página
function interesadoPage(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  e._interesado = !e._interesado;
  toast(e._interesado ? `¡Listo! Te avisaremos de ${e.nombre} 🔔` : 'Ya no recibirás avisos');
  abrirEvento(id);
}

// Lista completa de invitados (agrupada por respuesta)
function verListaInvitados(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  const c = rsvpCounts(e);
  const van = invitadosMuestra(e, Math.min(c.van, 12));
  const tal = (DATA.gente || []).slice(2, 2 + Math.min(c.tal, 6));
  abrirSheet(`Invitados · ${e.nombre}`, `
    <div class="rsvp-counts big">
      <span class="rc voy">✅ ${c.van} van</span>
      <span class="rc tal">🤔 ${c.tal}</span>
      <span class="rc no">🙅 ${c.no}</span>
    </div>
    <div class="row-between"><h3>✅ Van (${c.van})</h3></div>
    <div class="friend-list">
      ${van.map((g) => `<article class="friend-card"><div class="friend-ava" style="background:${g.color}">${g.avatar}</div><div class="friend-main"><strong>${g.nombre}</strong></div></article>`).join('')}
      ${c.van > van.length ? `<p class="empty">y ${c.van - van.length} más…</p>` : ''}
    </div>
    ${tal.length ? `<div class="row-between"><h3>🤔 Tal vez (${c.tal})</h3></div>
      <div class="friend-list">${tal.map((g) => `<article class="friend-card"><div class="friend-ava" style="background:${g.color}">${g.avatar}</div><div class="friend-main"><strong>${g.nombre}</strong></div></article>`).join('')}</div>` : ''}
    <div class="sheet-actions"><button class="btn full" onclick="abrirEvento('${e.id}')">‹ Volver al evento</button></div>
  `);
}

// Copiar link de invitación (abre el evento al entrar)
function copiarInvitacion(id) {
  const url = location.href.split('?')[0] + '?evento=' + id;
  if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
  toast('🔗 Link de invitación copiado');
}

// Agregar al calendario (descarga un .ics real)
function addCalendario(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e.fechaISO) { toast('Aún sin fecha'); return; }
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (x) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const ini = new Date(e.fechaISO); const fin = new Date(ini.getTime() + 4 * 3600000);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Socialice//ES', 'BEGIN:VEVENT',
    `UID:${e.id}@socialice`, `SUMMARY:${e.nombre}`, `LOCATION:${e.lugar}\\, ${e.ciudad}`,
    `DTSTART:${fmt(ini)}`, `DTEND:${fmt(fin)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `${e.nombre}.ics`;
  a.click();
  toast('📅 Agregado al calendario');
}

// Comentarios de ejemplo por evento
const COMENTARIOS_SEED = {
  e1: [
    { nombre: 'Mateo', avatar: '🐺', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)', texto: '¡Ya tengo mis boletos! 🔥', fecha: 'hace 2 h' },
    { nombre: 'Sofía', avatar: '🌸', color: 'linear-gradient(135deg,#ec4899,#f43f5e)', texto: '¿Hay lista para entrar antes de las 10?', fecha: 'ayer' }
  ],
  e3: [
    { nombre: 'Valeria', avatar: '🦋', color: 'linear-gradient(135deg,#f59e0b,#ec4899)', texto: 'El atardecer desde esa terraza es brutal 🌇', fecha: 'hace 5 h' }
  ]
};

// --- Editar perfil ---
const AVATARES = ['🦄','🐺','🌸','🎧','🦋','🐱','🌙','🔥','😎','👑','🎈','🪩'];
function editarPerfil() {
  const u = DATA.usuario;
  const esOrg = u.rol === 'organizador';
  abrirSheet('Editar perfil', `
    ${esOrg ? `
      <p class="form-label">Logo de la organizadora</p>
      <div class="logo-edit">
        <div class="logo-prev" style="${avatarFondo(u)}">${u.logo ? '' : inicialesDe(u.nombre)}</div>
        <input type="file" accept="image/*" id="logoFile" hidden onchange="subirLogo(event)">
        <button class="chip" onclick="document.getElementById('logoFile').click()">⬆ Subir logo</button>
        ${u.logo ? `<button class="chip" onclick="quitarLogo()">Quitar</button>` : ''}
      </div>
    ` : `
      <p class="form-label">Foto (elige un emoji)</p>
      <div class="avatar-grid" id="avatarGrid">
        ${AVATARES.map((a) => `
          <button class="avatar-opt ${a === u.avatar ? 'is-sel' : ''}" onclick="elegirAvatar('${a}', this)">${a}</button>
        `).join('')}
      </div>
    `}

    <div class="field"><div class="field-main">
      <label class="field-label">Nombre</label>
      <input class="field-input" id="edNombre" value="${u.nombre}">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Usuario</label>
      <input class="field-input" id="edUsuario" value="${u.usuario}">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Bio</label>
      <input class="field-input" id="edBio" value="${u.bio}">
    </div></div>

    <p class="form-label" style="margin-top:18px">Redes y contacto</p>
    <div class="field"><span class="field-icon">💬</span><div class="field-main">
      <label class="field-label">WhatsApp (con lada, ej: 52155…)</label>
      <input class="field-input" id="edWa" value="${(u.redes||{}).whatsapp||''}" placeholder="5215512345678">
    </div></div>
    <div class="field"><span class="field-icon">📸</span><div class="field-main">
      <label class="field-label">Instagram (usuario)</label>
      <input class="field-input" id="edIg" value="${(u.redes||{}).instagram||''}" placeholder="tuusuario">
    </div></div>
    <div class="field"><span class="field-icon">🎵</span><div class="field-main">
      <label class="field-label">TikTok (usuario)</label>
      <input class="field-input" id="edTk" value="${(u.redes||{}).tiktok||''}" placeholder="tuusuario">
    </div></div>
    <div class="field"><span class="field-icon">🌐</span><div class="field-main">
      <label class="field-label">Sitio web</label>
      <input class="field-input" id="edWeb" value="${(u.redes||{}).web||''}" placeholder="https://…">
    </div></div>

    <div class="sheet-actions">
      <button class="btn full" onclick="guardarPerfil()">Guardar cambios</button>
    </div>
  `);
}
function subirLogo(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => { DATA.usuario.logo = r.result; editarPerfil(); };
  r.readAsDataURL(f);
}
function quitarLogo() { DATA.usuario.logo = null; editarPerfil(); }

let _avatarTmp = null;
function elegirAvatar(a, btn) {
  _avatarTmp = a;
  document.querySelectorAll('#avatarGrid .avatar-opt').forEach((b) => b.classList.remove('is-sel'));
  btn.classList.add('is-sel');
}
function guardarPerfil() {
  const u = DATA.usuario;
  u.nombre = document.getElementById('edNombre').value.trim() || u.nombre;
  u.usuario = document.getElementById('edUsuario').value.trim() || u.usuario;
  u.bio = document.getElementById('edBio').value.trim();
  if (_avatarTmp) u.avatar = _avatarTmp;
  _avatarTmp = null;
  // Redes sociales
  u.redes = u.redes || {};
  u.redes.whatsapp  = document.getElementById('edWa').value.trim().replace(/[^\d]/g, '');
  u.redes.instagram = document.getElementById('edIg').value.trim().replace(/^@/, '');
  u.redes.tiktok    = document.getElementById('edTk').value.trim().replace(/^@/, '');
  u.redes.web       = document.getElementById('edWeb').value.trim();
  cerrarSheet();
  pintarPerfil();
  toast('Perfil actualizado ✓');
}

// --- Ajustes ---
function abrirAjustes() {
  const u = DATA.usuario;
  abrirSheet('Ajustes', `
    <div class="set-list">
      <label class="set-row">
        <div><strong>Notificaciones</strong><small>Avisos de nuevas fiestas</small></div>
        <span class="toggle is-on" onclick="toggleSet(this,'Notificaciones')"><span class="toggle-knob"></span></span>
      </label>
      <label class="set-row">
        <div><strong>Perfil privado</strong><small>Solo amigos ven tu actividad</small></div>
        <span class="toggle ${u.privado ? 'is-on' : ''}" onclick="toggleSet(this,'Privacidad'); DATA.usuario.privado = this.classList.contains('is-on')"><span class="toggle-knob"></span></span>
      </label>
      <label class="set-row">
        <div><strong>Ubicación</strong><small>Para mostrarte fiestas cercanas</small></div>
        <span class="toggle is-on" onclick="toggleSet(this,'Ubicación')"><span class="toggle-knob"></span></span>
      </label>
    </div>

    <div class="set-list">
      <button class="set-link" onclick="toast('Cuenta · próximamente')">Cuenta y seguridad ${icon('chev','mute')}</button>
      <button class="set-link" onclick="toast('Ayuda · próximamente')">Ayuda y soporte ${icon('chev','mute')}</button>
      <button class="set-link" onclick="toast('Términos · próximamente')">Términos y privacidad ${icon('chev','mute')}</button>
    </div>

    <button class="btn-logout" onclick="cerrarSesion()">Cerrar sesión</button>
    <p class="set-version">Socialice · versión 0.1</p>
  `);
}
function toggleSet(el, nombre) {
  const on = el.classList.toggle('is-on');
  toast(`${nombre}: ${on ? 'activado' : 'desactivado'}`);
}

// --- Compartir (usa el menú nativo si existe) ---
function compartir(que) {
  const url = location.href.split('?')[0];
  if (navigator.share) {
    navigator.share({ title: 'Socialice', text: `Mira "${que}" en Socialice`, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    toast('Enlace copiado al portapapeles 📋');
  }
}

// --- Cerrar sesión: vuelve a la bienvenida ---
function cerrarSesion() {
  cerrarSheet();
  document.querySelectorAll('.screen').forEach((s) =>
    s.classList.toggle('is-active', s.id === 'screen-splash'));
  document.body.dataset.screen = 'splash';
  splashIr('welcome');
  toast('Sesión cerrada');
}

/* ===================================================================
   7. UTILIDADES Y ARRANQUE
   =================================================================== */

// 1240 -> "1.2k"
function kilo(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : '' + n;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Socialice listo ✨');

  // --- Atajo de desarrollo (solo para pruebas) ---
  // Permite abrir una pantalla directa, ej: ?screen=home&rol=asistente
  const p = new URLSearchParams(location.search);
  if (p.get('rol')) DATA.usuario.rol = p.get('rol');
  if (p.get('splash')) splashIr(p.get('splash'));
  if (p.get('screen')) {
    document.getElementById('screen-splash').classList.remove('is-active');
    entrarApp();
    irA(p.get('screen'));
  }
  if (p.get('sheet') === 'evento')  abrirEvento('e1');
  if (p.get('evento')) { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); abrirEvento(p.get('evento')); }
  if (p.get('sheet') === 'ajustes') abrirAjustes();
  if (p.get('sheet') === 'editar')  editarPerfil();
  if (p.get('openf')) abrirFiltrosInline();
  if (p.get('paso')) { draft.paso = +p.get('paso'); pintarCrear(); }
  if (p.get('cal')) verCalendario();
  if (p.get('seedvenue')) {
    draft.paso = 4; pintarCrear();
    const add = (tipo, x, y, w, h) => { const t = VENUE_TOOLS[tipo]; pisoActual().items.push({ id: ++draft.seq, tipo, x, y, w: w || t.w, h: h || t.h, rot: 0 }); };
    add('pista', 38, 30, 150, 120); add('dj', 38, 12); add('barra', 75, 20, 120, 36);
    add('vip', 80, 55); add('mesa', 20, 65); add('mesa', 32, 72); add('lounge', 60, 80);
    add('entrada', 15, 92); add('bano', 88, 88);
    draft.sel = pisoActual().items.find((i) => i.tipo === 'pista').id;
    pintarVenue(); pintarControls();
  }
});

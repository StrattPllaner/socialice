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
  gear:   '<circle cx="12" cy="12" r="3"/><path d="M19.1 13.4a7.7 7.7 0 0 0 0-2.8l1.8-1.4-2-3.4-2.1.9a7.5 7.5 0 0 0-2.4-1.4L12 3h-4 .1L7.6 5.3a7.5 7.5 0 0 0-2.4 1.4l-2.1-.9-2 3.4 1.8 1.4a7.7 7.7 0 0 0 0 2.8l-1.8 1.4 2 3.4 2.1-.9a7.5 7.5 0 0 0 2.4 1.4L8 21h4l.4-2.3a7.5 7.5 0 0 0 2.4-1.4l2.1.9 2-3.4Z"/>',
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
  const destacado = DATA.eventos.find((e) => e.id === DATA.destacadoId);

  cont.innerHTML = `
    <header class="top-bar">
      <div>
        <small>Hola de nuevo</small>
        <h2>${u.nombre.split(' ')[0]} 👋</h2>
      </div>
      <button class="top-avatar" onclick="irA('profile')">${u.avatar}</button>
    </header>

    <!-- Barra de búsqueda que lleva al buscador -->
    <button class="search-bar fake" onclick="irA('search')">
      ${icon('search', 'mute')}
      <span class="search-fake-text">Busca fiestas, lugares, organizadores…</span>
    </button>

    <section class="featured" style="background:${destacado.grad}" onclick="abrirEvento('${destacado.id}')">
      <span class="featured-tag">✦ Próxima fiesta</span>
      <div class="featured-emoji">${destacado.emoji}</div>
      <h2>${destacado.nombre}</h2>
      <p class="featured-meta">${destacado.fecha}</p>
      <p class="featured-meta">📍 ${destacado.lugar} · ${destacado.ciudad}</p>
      <div class="featured-foot">
        <span class="featured-btn">Ver evento</span>
        <span class="featured-going">👥 ${destacado.asistentes} van</span>
      </div>
    </section>

    <div class="chips-row" id="chipsRow"></div>

    <div class="row-between">
      <h3>Próximas fiestas</h3>
      <span class="see-all" onclick="irA('search')">Ver todas</span>
    </div>
    <div class="event-list" id="eventList"></div>
  `;

  pintarChips();
  pintarEventos();
}

function pintarChips() {
  const fila = document.getElementById('chipsRow');
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
  const eventos = DATA.eventos.filter((e) =>
    categoriaActiva === 'todos' || e.cat.includes(categoriaActiva)
  );

  if (!eventos.length) {
    lista.innerHTML = `<p class="empty">No hay fiestas en esta categoría 🙈</p>`;
    return;
  }

  lista.innerHTML = eventos.map(tarjetaEvento).join('');
}

// Tarjeta de evento reutilizable (feed y buscador). Es clicable.
function tarjetaEvento(e) {
  return `
    <article class="event-card" onclick="abrirEvento('${e.id}')">
      <div class="event-cover" style="background:${e.grad}">
        <span class="event-emoji">${e.emoji}</span>
        <span class="event-price">${e.precio}</span>
      </div>
      <div class="event-body">
        <h3>${e.nombre}</h3>
        <p class="event-meta">${e.fecha}</p>
        <p class="event-meta">📍 ${e.lugar} · ${e.ciudad}</p>
        <div class="event-foot">
          <span class="event-org">por ${e.organizador}</span>
          <span class="pill-soft">👥 ${e.asistentes}</span>
        </div>
      </div>
    </article>`;
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

// --- Estado del editor de la fiesta ---
const venue = { tool: 'mesa', items: [], seq: 0 };
const guests = [
  { nombre: 'Mateo Lara',  dentro: true },
  { nombre: 'Sofía Mendez', dentro: false }
];

// Tipos de elementos que se pueden poner en el mapa
const VENUE_TOOLS = {
  mesa:      { emoji: '🪑', label: 'Mesa',      cls: 'v-mesa' },
  asiento:   { emoji: '💺', label: 'Asiento',   cls: 'v-asiento' },
  barra:     { emoji: '🍸', label: 'Barra',     cls: 'v-barra' },
  escenario: { emoji: '🎤', label: 'Escenario', cls: 'v-escenario' },
  venta:     { emoji: '🎫', label: 'Venta',     cls: 'v-venta' }
};

function pintarCrear() {
  document.getElementById('screen-create').innerHTML = `
    <header class="page-head">
      <h1>Crear fiesta</h1>
      <p class="page-sub">Arma tu evento y el mapa del lugar.</p>
    </header>

    <!-- Datos básicos -->
    <div class="field"><div class="field-main">
      <label class="field-label">Nombre de la fiesta</label>
      <input class="field-input" id="cvNombre" placeholder="Ej: Summer Rooftop">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Fecha y hora</label>
      <input class="field-input" id="cvFecha" placeholder="Ej: Vie 11 jul · 10:00 pm">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Lugar / dirección</label>
      <input class="field-input" id="cvLugar" placeholder="Ej: Terraza Skyline, Polanco">
    </div></div>

    <!-- Mapa del lugar -->
    <div class="row-between">
      <h3>🗺️ Mapa del lugar</h3>
      <span class="see-all" onclick="limpiarVenue()">Vaciar</span>
    </div>
    <p class="hint">Elige un elemento y toca el mapa para colocarlo. Arrástralo para moverlo; tócalo para quitarlo.</p>

    <div class="tool-row" id="toolRow"></div>

    <div class="venue" id="venue"
         onclick="venueTap(event)"
         onpointermove="venueMove(event)"
         onpointerup="venueDrop()" onpointerleave="venueDrop()">
      <div class="venue-grid"></div>
      <span class="venue-hint" id="venueHint">Toca aquí para colocar “${VENUE_TOOLS[venue.tool].label}”</span>
    </div>

    <!-- Lista de ingreso -->
    <div class="row-between">
      <h3>📋 Lista de ingreso</h3>
      <span class="see-all" id="guestCount"></span>
    </div>
    <div class="guest-add">
      <input id="guestInput" placeholder="Nombre del invitado"
             onkeydown="if(event.key==='Enter') addGuest()">
      <button class="add-btn" onclick="addGuest()">Añadir</button>
    </div>
    <div class="guest-list" id="guestList"></div>

    <button class="btn full" style="margin-top:24px" onclick="publicarFiesta()">Publicar fiesta 🎉</button>
  `;
  pintarTools();
  pintarVenue();
  pintarGuests();
}

// Paleta de herramientas
function pintarTools() {
  document.getElementById('toolRow').innerHTML = Object.entries(VENUE_TOOLS).map(([id, t]) => `
    <button class="tool ${id === venue.tool ? 'is-active' : ''}" onclick="elegirTool('${id}')">
      <span class="tool-emoji">${t.emoji}</span>
      <span>${t.label}</span>
    </button>
  `).join('');
}
function elegirTool(id) {
  venue.tool = id;
  pintarTools();
  const h = document.getElementById('venueHint');
  if (h) h.textContent = `Toca aquí para colocar “${VENUE_TOOLS[id].label}”`;
}

// Dibuja los elementos colocados en el mapa
function pintarVenue() {
  const v = document.getElementById('venue');
  if (!v) return;
  // Quitamos los items viejos (dejamos grid y hint)
  v.querySelectorAll('.v-item').forEach((el) => el.remove());
  const hint = document.getElementById('venueHint');
  if (hint) hint.style.display = venue.items.length ? 'none' : 'block';

  venue.items.forEach((it) => {
    const t = VENUE_TOOLS[it.tipo];
    const el = document.createElement('div');
    el.className = `v-item ${t.cls}`;
    el.style.left = it.x + '%';
    el.style.top = it.y + '%';
    el.innerHTML = `<span>${t.emoji}</span>`;
    el.setAttribute('onpointerdown', `venueGrab(event, ${it.id})`);
    el.setAttribute('onclick', `venueItemTap(event, ${it.id})`);
    v.appendChild(el);
  });
}

// Tocar el mapa: coloca un elemento nuevo (si no se tocó otro)
function venueTap(ev) {
  if (ev.target.id !== 'venue' && !ev.target.classList.contains('venue-grid') &&
      ev.target.id !== 'venueHint') return;
  if (_dragMoved) { _dragMoved = false; return; }
  const r = document.getElementById('venue').getBoundingClientRect();
  const x = ((ev.clientX - r.left) / r.width) * 100;
  const y = ((ev.clientY - r.top) / r.height) * 100;
  venue.items.push({ id: ++venue.seq, tipo: venue.tool, x: clamp(x), y: clamp(y) });
  pintarVenue();
}

// Tocar un elemento existente: lo quita (si no se arrastró)
function venueItemTap(ev, id) {
  ev.stopPropagation();
  if (_dragMoved) { _dragMoved = false; return; }
  venue.items = venue.items.filter((i) => i.id !== id);
  pintarVenue();
}

// --- Arrastrar elementos ---
let _dragId = null, _dragMoved = false;
function venueGrab(ev, id) {
  ev.stopPropagation();
  _dragId = id; _dragMoved = false;
}
function venueMove(ev) {
  if (_dragId == null) return;
  _dragMoved = true;
  const r = document.getElementById('venue').getBoundingClientRect();
  const it = venue.items.find((i) => i.id === _dragId);
  if (!it) return;
  it.x = clamp(((ev.clientX - r.left) / r.width) * 100);
  it.y = clamp(((ev.clientY - r.top) / r.height) * 100);
  const el = [...document.querySelectorAll('.v-item')][venue.items.indexOf(it)];
  if (el) { el.style.left = it.x + '%'; el.style.top = it.y + '%'; }
}
function venueDrop() { _dragId = null; }
function clamp(n) { return Math.max(3, Math.min(97, n)); }

function limpiarVenue() {
  venue.items = [];
  pintarVenue();
  toast('Mapa vaciado');
}

// --- Lista de ingreso ---
function pintarGuests() {
  const cont = document.getElementById('guestList');
  if (!cont) return;
  const dentro = guests.filter((g) => g.dentro).length;
  document.getElementById('guestCount').textContent = `${dentro}/${guests.length} dentro`;
  cont.innerHTML = guests.length ? guests.map((g, i) => `
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
  guests.push({ nombre, dentro: false });
  inp.value = '';
  pintarGuests();
  inp.focus();
}
function checkGuest(i) { guests[i].dentro = !guests[i].dentro; pintarGuests();
  toast(guests[i].dentro ? `${guests[i].nombre} ingresó ✓` : `${guests[i].nombre} marcado pendiente`); }
function delGuest(i) { guests.splice(i, 1); pintarGuests(); }

function publicarFiesta() {
  const nombre = document.getElementById('cvNombre').value.trim() || 'Tu fiesta';
  toast(`“${nombre}” lista para publicar 🎉 (conectaremos el guardado con Firebase)`);
}

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
  return `
    <header class="page-head row-between">
      <h1>Perfil</h1>
      <button class="icon-btn sm" onclick="abrirAjustes()">${icon('gear')}</button>
    </header>

    <section class="profile-hero">
      <div class="hero-cover" style="background:${u.color}"></div>
      <div class="hero-body">
        <div class="profile-avatar" style="background:${u.color}">${u.avatar}</div>
        <h2 class="hero-name">${u.nombre}</h2>
        <p class="profile-user">${u.usuario} <span class="role-chip host">🎪 Organizador</span></p>
        <p class="profile-bio">${u.bio}</p>
        <div class="profile-stats">
          <div class="stat"><strong>${u.stats.eventos}</strong><small>eventos</small></div>
          <span class="stat-sep"></span>
          <div class="stat"><strong>${kilo(u.stats.asistentes)}</strong><small>asistentes</small></div>
          <span class="stat-sep"></span>
          <div class="stat"><strong>${u.stats.seguidores}</strong><small>seguidores</small></div>
        </div>
        <div class="profile-actions">
          <button class="btn full" onclick="editarPerfil()">Editar perfil</button>
          <button class="icon-btn" onclick="compartir('mi perfil')">${icon('share')}</button>
        </div>
      </div>
    </section>

    <div class="row-between"><h3>Mis eventos</h3><span class="see-all">${mios.length}</span></div>
    <div class="event-list">
      ${mios.map((e) => `
        <article class="event-card">
          <div class="event-cover" style="background:${e.grad}">
            <span class="event-emoji">${e.emoji}</span>
            <span class="event-price">${e.precio}</span>
          </div>
          <div class="event-body">
            <h3>${e.nombre}</h3>
            <p class="event-meta">${e.fecha}</p>
            <p class="event-meta">📍 ${e.lugar} · ${e.ciudad}</p>
            <div class="event-foot">
              <span class="pill-soft">👥 ${e.asistentes} van</span>
              <span class="see-all" onclick="toast('Gestión del evento · próximamente')">Gestionar</span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
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
  document.getElementById('sheetOverlay').classList.remove('is-on');
  document.body.classList.remove('no-scroll');
}

// --- Ver detalle de un evento ---
function abrirEvento(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  const voy = !!e._voy;
  abrirSheet(e.nombre, `
    <div class="ev-cover" style="background:${e.grad}">
      <span class="ev-cover-emoji">${e.emoji}</span>
      <span class="event-price">${e.precio}</span>
    </div>
    <div class="ev-rows">
      <div class="ev-row">${icon('home','mute')}<div><strong>${e.lugar}</strong><small>${e.ciudad}</small></div></div>
      <div class="ev-row">${icon('ticket','mute')}<div><strong>${e.fecha}</strong><small>Entrada: ${e.precio}</small></div></div>
      <div class="ev-row">${icon('users','mute')}<div><strong>${e.asistentes} asistentes</strong><small>Organiza ${e.organizador}</small></div></div>
    </div>
    <p class="ev-desc">Una noche para recordar en ${e.lugar}. Música, luces y la mejor energía.
       Llega temprano para no quedarte fuera. 🎶</p>

    <!-- Mini-mapa de ejemplo (el mapa real va en la siguiente etapa) -->
    <div class="ev-map">${icon('pin')}<span>Ubicación en el mapa · próximamente</span></div>

    <div class="sheet-actions">
      <button class="btn full" id="goBtn" onclick="asistir('${e.id}', this)">
        ${voy ? '✓ Voy a ir' : 'Asistir a esta fiesta'}
      </button>
      <button class="icon-btn" onclick="compartir('${e.nombre}')" aria-label="Compartir">${icon('share')}</button>
    </div>
  `);
}

// Confirmar/cancelar asistencia
function asistir(id, btn) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  e._voy = !e._voy;
  btn.classList.toggle('is-going', e._voy);
  btn.textContent = e._voy ? '✓ Voy a ir' : 'Asistir a esta fiesta';
  toast(e._voy ? `¡Confirmado! Vas a ${e.nombre} 🎉` : 'Cancelaste tu asistencia');
}

// --- Editar perfil ---
const AVATARES = ['🦄','🐺','🌸','🎧','🦋','🐱','🌙','🔥','😎','👑','🎈','🪩'];
function editarPerfil() {
  const u = DATA.usuario;
  abrirSheet('Editar perfil', `
    <p class="form-label">Foto (elige un emoji)</p>
    <div class="avatar-grid" id="avatarGrid">
      ${AVATARES.map((a) => `
        <button class="avatar-opt ${a === u.avatar ? 'is-sel' : ''}" onclick="elegirAvatar('${a}', this)">${a}</button>
      `).join('')}
    </div>

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

    <div class="sheet-actions">
      <button class="btn full" onclick="guardarPerfil()">Guardar cambios</button>
    </div>
  `);
}
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
  if (p.get('sheet') === 'ajustes') abrirAjustes();
  if (p.get('sheet') === 'editar')  editarPerfil();
  if (p.get('openf')) abrirFiltrosInline();
});

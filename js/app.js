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
      <div class="top-avatar" onclick="irA('profile')">${u.avatar}</div>
    </header>

    <section class="featured" style="background:${destacado.grad}">
      <span class="featured-tag">✦ Próxima fiesta</span>
      <div class="featured-emoji">${destacado.emoji}</div>
      <h2>${destacado.nombre}</h2>
      <p class="featured-meta">${destacado.fecha}</p>
      <p class="featured-meta">📍 ${destacado.lugar} · ${destacado.ciudad}</p>
      <div class="featured-foot">
        <button class="featured-btn">Ver evento</button>
        <span class="featured-going">👥 ${destacado.asistentes} van</span>
      </div>
    </section>

    <div class="chips-row" id="chipsRow"></div>

    <div class="row-between">
      <h3>Próximas fiestas</h3>
      <span class="see-all">Ver todas</span>
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

  lista.innerHTML = eventos.map((e) => `
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
          <span class="event-org">por ${e.organizador}</span>
          <span class="pill-soft">👥 ${e.asistentes}</span>
        </div>
      </div>
    </article>
  `).join('');
}

/* ===================================================================
   3. CREAR EVENTO (placeholder · solo organizador)
   =================================================================== */

function pintarCrear() {
  document.getElementById('screen-create').innerHTML = `
    <div class="placeholder">
      <div class="placeholder-emoji anim-float">🎪</div>
      <h2>Crear evento</h2>
      <p>Aquí armarás tu fiesta de principio a fin: mapa del lugar, zonas y
         asientos, flyer de promoción y un muro de publicaciones.</p>
      <span class="soon-badge">Próximamente</span>
    </div>
  `;
}

/* ===================================================================
   4. AMIGOS (solo asistente)
   =================================================================== */

function pintarAmigos() {
  const cont = document.getElementById('screen-friends');
  const enVivo = DATA.amigos.filter((a) => a.ahora);

  cont.innerHTML = `
    <header class="page-head">
      <h1>Amigos</h1>
      <p class="page-sub">Mira a dónde va tu gente.</p>
    </header>

    <div class="search-bar">
      ${icon('search', 'mute')}
      <input placeholder="Busca por nombre o @usuario">
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
    <div class="friend-list">
      ${DATA.amigos.map(tarjetaAmigo).join('')}
    </div>

    <div class="row-between"><h3>Quizá los conozcas</h3></div>
    <div class="friend-list">
      ${DATA.sugerencias.map(tarjetaSugerencia).join('')}
    </div>
  `;
}

// Tarjeta de un amigo: respeta si su perfil es privado.
function tarjetaAmigo(a) {
  if (a.privado) {
    return `
      <article class="friend-card">
        <div class="friend-ava" style="background:${a.color}">${a.avatar}</div>
        <div class="friend-main">
          <strong>${a.nombre}</strong>
          <small>${a.usuario}</small>
          <p class="friend-locked">🔒 Perfil privado · solo amigos ven su actividad</p>
        </div>
      </article>`;
  }
  const estado = a.ahora
    ? `<span class="friend-now">🔴 En ${a.ahora} ahora</span>`
    : (a.fue[0] ? `<span class="friend-was">Última: ${a.fue[0]}</span>` : `<span class="friend-was">Sin fiestas aún</span>`);
  return `
    <article class="friend-card">
      <div class="friend-ava" style="background:${a.color}">${a.avatar}</div>
      <div class="friend-main">
        <strong>${a.nombre}</strong>
        <small>${a.usuario}</small>
        ${estado}
        ${a.fotos.length ? `<div class="photo-strip">
          ${a.fotos.map((f) => `<span class="photo-thumb">${f}</span>`).join('')}
          <span class="photo-count">${a.fotos.length} fotos</span>
        </div>` : ''}
      </div>
    </article>`;
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
  const ok = btn.classList.toggle('is-added');
  btn.textContent = ok ? 'Solicitado ✓' : 'Agregar';
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
      <button class="icon-btn sm" onclick="alert('Ajustes (pendiente)')">${icon('gear')}</button>
    </header>

    <section class="profile-hero">
      <div class="profile-avatar" style="background:${u.color}">${u.avatar}</div>
      <h2>${u.nombre}</h2>
      <p class="profile-user">${u.usuario} · 🎪 Organizador</p>
      <p class="profile-bio">${u.bio}</p>
      <div class="profile-stats">
        <div class="stat"><strong>${u.stats.eventos}</strong><small>eventos</small></div>
        <div class="stat"><strong>${kilo(u.stats.asistentes)}</strong><small>asistentes</small></div>
        <div class="stat"><strong>${u.stats.seguidores}</strong><small>seguidores</small></div>
      </div>
      <div class="profile-actions">
        <button class="btn full">Editar perfil</button>
        <button class="icon-btn" onclick="alert('Compartir perfil')">${icon('share')}</button>
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
              <span class="see-all">Gestionar</span>
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
      <button class="icon-btn sm" onclick="alert('Ajustes (pendiente)')">${icon('gear')}</button>
    </header>

    <section class="profile-hero">
      <div class="profile-avatar" style="background:${u.color}">${u.avatar}</div>
      <h2>${u.nombre}</h2>
      <p class="profile-user">${u.usuario} · 🎟️ Asistente</p>
      <p class="profile-bio">${u.bio}</p>
      <div class="profile-stats">
        <div class="stat"><strong>${u.stats.fueA}</strong><small>fiestas</small></div>
        <div class="stat"><strong>${u.stats.amigos}</strong><small>amigos</small></div>
        <div class="stat"><strong>${u.stats.seguidores}</strong><small>seguidores</small></div>
      </div>
      <div class="profile-actions">
        <button class="btn full">Editar perfil</button>
        <button class="icon-btn" onclick="irA('friends')">${icon('users')}</button>
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

    <div class="row-between"><h3>Historial</h3><span class="see-all">Ver todo</span></div>
    <div class="mini-list">
      ${historial.map((e) => filaFiesta(e, 'fui')).join('')}
    </div>

    <div class="row-between"><h3>Mis fotos</h3></div>
    <div class="photo-grid">
      ${['🌃','🪩','🥂','💃','✨','🎉'].map((f) => `<div class="photo-cell">${f}</div>`).join('')}
    </div>
  `;
}

// Fila compacta de una fiesta (en el perfil del asistente).
function filaFiesta(e, modo) {
  const etq = modo === 'voy'
    ? `<span class="tag-go">Confirmado</span>`
    : `<span class="tag-was">Asististe</span>`;
  return `
    <div class="mini-card">
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
        { go: 'home',    ic: 'home', texto: 'Inicio' },
        { go: 'create',  ic: 'plus', texto: 'Crear'  },
        { go: 'profile', ic: 'user', texto: 'Perfil' }
      ]
    : [
        { go: 'home',    ic: 'home',  texto: 'Explorar' },
        { go: 'friends', ic: 'users', texto: 'Amigos'   },
        { go: 'profile', ic: 'user',  texto: 'Perfil'   }
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
});

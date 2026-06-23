/* =====================================================================
   SOCIALICE · Lógica de la app
   ---------------------------------------------------------------------
   Cambiar de pantalla, pintar eventos, amigos, perfil y nav inferior.
   La interfaz se adapta al rol: 'organizador' o 'asistente'.
   ===================================================================== */

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
  btn.textContent = oculto ? '🙈' : '👁️';
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
      <span>🔍</span>
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
      <button class="icon-btn sm" onclick="alert('Ajustes (pendiente)')">⚙️</button>
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
        <button class="icon-btn" onclick="alert('Compartir perfil')">↗</button>
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
      <button class="icon-btn sm" onclick="alert('Ajustes (pendiente)')">⚙️</button>
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
        <button class="icon-btn" onclick="irA('friends')">👥</button>
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
        { go: 'home',    icono: '🏠', texto: 'Inicio' },
        { go: 'create',  icono: '✨', texto: 'Crear'  },
        { go: 'profile', icono: '👤', texto: 'Perfil' }
      ]
    : [
        { go: 'home',    icono: '🏠', texto: 'Explorar' },
        { go: 'friends', icono: '👥', texto: 'Amigos'   },
        { go: 'profile', icono: '👤', texto: 'Perfil'   }
      ];

  const actual = document.body.dataset.screen;
  nav.innerHTML = items.map((it) => `
    <button class="nav-btn ${it.go === actual ? 'is-active' : ''}"
            data-go="${it.go}" onclick="irA('${it.go}')">
      <span class="nav-icon">${it.icono}</span>
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

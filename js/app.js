/* =====================================================================
   SOCIALICE · Lógica de la app
   ---------------------------------------------------------------------
   Aquí va lo que "hace funcionar" la app: cambiar de pantalla, pintar
   las tarjetas de eventos, el perfil y la navegación inferior.
   ===================================================================== */

/* ===================================================================
   1. NAVEGACIÓN ENTRE PANTALLAS
   =================================================================== */

// Muestra una pantalla por su nombre y oculta las demás.
function irA(nombre) {
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('is-active', s.dataset.name === nombre);
  });
  document.body.dataset.screen = nombre;
  // Marcamos el botón activo en la nav inferior
  document.querySelectorAll('.nav-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.go === nombre);
  });
  window.scrollTo({ top: 0 });
}

// Moverse dentro del splash (bienvenida / rol / login / registro).
function splashIr(pagina) {
  document.querySelectorAll('#screen-splash .splash-page').forEach((p) => {
    p.classList.toggle('is-shown', p.dataset.page === pagina);
  });
  window.scrollTo({ top: 0 });
}

// Guarda el rol elegido y adapta los textos del registro.
function elegirRol(rol) {
  DATA.usuario.rol = rol;
  const esOrg = rol === 'organizador';
  // El paso 2 cambia según seas organizador o asistente
  document.getElementById('reg2Title').textContent =
    esOrg ? '¿Quién organiza?' : 'Cuéntanos de ti';
  document.getElementById('reg2NameLabel').textContent =
    esOrg ? 'Nombre del organizador' : 'Tu nombre';
  document.getElementById('reg2Name').placeholder =
    esOrg ? 'Ej: Andrea Eventos' : 'Ej: Andrea Ríos';
  splashIr('reg1');
}

/* ===================================================================
   2. PANTALLA DE INICIO (feed de eventos)
   =================================================================== */

let categoriaActiva = 'todos';

// Dibuja toda la pantalla de Inicio.
function pintarInicio() {
  const cont = document.getElementById('screen-home');
  const u = DATA.usuario;
  const destacado = DATA.eventos.find((e) => e.id === DATA.destacadoId);

  cont.innerHTML = `
    <!-- Barra superior con saludo y avatar -->
    <header class="top-bar">
      <div>
        <small>Hola de nuevo</small>
        <h2>${u.nombre.split(' ')[0]} 👋</h2>
      </div>
      <div class="top-avatar" onclick="irA('profile')">${u.avatar}</div>
    </header>

    <!-- Evento destacado (grande arriba) -->
    <section class="featured anim-float" style="background:${destacado.grad}">
      <span class="featured-tag">★ Próxima fiesta</span>
      <div class="featured-emoji">${destacado.emoji}</div>
      <h2>${destacado.nombre}</h2>
      <p class="featured-meta">${destacado.fecha} · ${destacado.lugar}</p>
      <button class="btn featured-btn">Ver evento</button>
    </section>

    <!-- Chips de categoría -->
    <div class="chips-row" id="chipsRow"></div>

    <!-- Lista de eventos -->
    <h3 class="section-title">Próximas fiestas</h3>
    <div class="event-list" id="eventList"></div>
  `;

  pintarChips();
  pintarEventos();
}

// Dibuja los chips de filtro.
function pintarChips() {
  const fila = document.getElementById('chipsRow');
  fila.innerHTML = DATA.categorias.map((c) => `
    <button class="chip ${c.id === categoriaActiva ? 'is-active' : ''}"
            onclick="filtrar('${c.id}')">${c.texto}</button>
  `).join('');
}

// Cambia el filtro activo y vuelve a pintar.
function filtrar(catId) {
  categoriaActiva = catId;
  pintarChips();
  pintarEventos();
}

// Dibuja las tarjetas de eventos según el filtro.
function pintarEventos() {
  const lista = document.getElementById('eventList');
  const eventos = DATA.eventos.filter((e) =>
    categoriaActiva === 'todos' || e.cat.includes(categoriaActiva)
  );

  if (eventos.length === 0) {
    lista.innerHTML = `<p class="empty">No hay fiestas en esta categoría 🙈</p>`;
    return;
  }

  lista.innerHTML = eventos.map((e) => `
    <article class="event-card">
      <div class="event-cover" style="background:${e.grad}">
        <span>${e.emoji}</span>
        <span class="event-price">${e.precio}</span>
      </div>
      <div class="event-body">
        <h3>${e.nombre}</h3>
        <p class="event-meta">${e.fecha}</p>
        <p class="event-meta">📍 ${e.lugar}</p>
        <div class="event-foot">
          <span class="event-org">por ${e.organizador}</span>
          <span class="badge">👥 ${e.asistentes}</span>
        </div>
      </div>
    </article>
  `).join('');
}

/* ===================================================================
   3. PANTALLA DE PERFIL
   =================================================================== */

function pintarPerfil() {
  const cont = document.getElementById('screen-profile');
  const u = DATA.usuario;
  const esOrg = u.rol === 'organizador';

  // Los eventos creados por este usuario (solo aplica a organizadores)
  const mios = DATA.eventos.filter((e) => e.organizador === u.nombre);

  cont.innerHTML = `
    <section class="profile-hero">
      <div class="profile-avatar">${u.avatar}</div>
      <h2>${u.nombre}</h2>
      <p class="profile-user">${u.usuario} · ${esOrg ? '🎪 Organizador' : '🎟️ Asistente'}</p>
      <p class="profile-bio">${u.bio}</p>

      <div class="profile-stats">
        ${esOrg ? `<div class="stat"><strong>${u.stats.eventos}</strong><small>eventos</small></div>` : ''}
        <div class="stat"><strong>${u.stats.asistentes.toLocaleString()}</strong><small>${esOrg ? 'asistentes' : 'fiestas'}</small></div>
        <div class="stat"><strong>${u.stats.seguidores}</strong><small>seguidores</small></div>
      </div>

      <button class="btn btn-ghost profile-edit">Editar perfil</button>
    </section>

    ${esOrg ? `
      <h3 class="section-title">Mis eventos</h3>
      <div class="event-list">
        ${mios.map((e) => `
          <article class="event-card">
            <div class="event-cover" style="background:${e.grad}">
              <span>${e.emoji}</span>
              <span class="event-price">${e.precio}</span>
            </div>
            <div class="event-body">
              <h3>${e.nombre}</h3>
              <p class="event-meta">${e.fecha}</p>
              <p class="event-meta">📍 ${e.lugar}</p>
            </div>
          </article>
        `).join('')}
      </div>
    ` : `
      <div class="card" style="text-align:center">
        <p>Aún no sigues a ningún organizador.</p>
        <button class="btn" style="margin-top:14px" onclick="irA('home')">Descubrir fiestas</button>
      </div>
    `}
  `;
}

/* ===================================================================
   4. NAVEGACIÓN INFERIOR
   =================================================================== */

function pintarNav() {
  const nav = document.getElementById('bottomNav');
  // Cada botón lleva a una pantalla (data-go)
  const items = [
    { go: 'home',    icono: '🏠', texto: 'Inicio' },
    { go: 'create',  icono: '➕', texto: 'Crear' },
    { go: 'profile', icono: '👤', texto: 'Perfil' }
  ];
  nav.innerHTML = items.map((it) => `
    <button class="nav-btn ${it.go === 'home' ? 'is-active' : ''}"
            data-go="${it.go}" onclick="irA('${it.go}')">
      <span class="nav-icon">${it.icono}</span>
      <span class="nav-text">${it.texto}</span>
    </button>
  `).join('');
}

/* ===================================================================
   5. ARRANQUE
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  pintarInicio();
  pintarPerfil();
  pintarNav();
  // La pantalla "Crear" es un placeholder por ahora (Sesión 2)
  document.getElementById('screen-create').innerHTML = `
    <div class="placeholder">
      <div class="placeholder-emoji anim-float">🎪</div>
      <h2>Crear evento</h2>
      <p>Aquí podrás armar tu fiesta: mapa, asientos, flyer y publicaciones.<br>Lo construimos en el siguiente paso.</p>
    </div>
  `;
  console.log('Socialice listo ✨');
});

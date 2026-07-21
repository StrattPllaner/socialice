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
  // Variantes de fiesta (solo para la barra de navegación): la misma persona
  // pero con gorrito de fiesta inclinado + pompón en la punta
  userParty:  '<circle cx="12" cy="10.4" r="2.9"/><path d="M6 20.5c.8-3.3 3.3-4.9 6-4.9s5.2 1.6 6 4.9"/><path d="M8.2 7.7 10.5 1.5 14.4 6.4Z" stroke-width="1.2"/><circle cx="10.1" cy=".8" r=".75" fill="currentColor" stroke="none"/>',
  usersParty: '<circle cx="9" cy="10.4" r="2.8"/><path d="M4 20c.6-2.9 2.7-4.4 5-4.4s4.4 1.5 5 4.4"/><path d="M15.3 6.8a3 3 0 0 1 0 5"/><path d="M16.8 15.6c1.9.7 3.1 2 3.5 4.4"/><path d="M5.4 7.7 7.6 1.7 11.4 6.5Z" stroke-width="1.2"/><circle cx="7.2" cy="1" r=".7" fill="currentColor" stroke="none"/>',
  // Logo estilizado de código QR (no un QR real): 3 esquinas + puntos
  qr: '<rect x="3" y="3" width="7.2" height="7.2" rx="1.6"/><rect x="13.8" y="3" width="7.2" height="7.2" rx="1.6"/><rect x="3" y="13.8" width="7.2" height="7.2" rx="1.6"/><rect x="5.5" y="5.5" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="16.3" y="5.5" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="5.5" y="16.3" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="13.8" y="13.8" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="18.8" y="13.8" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="16.3" y="16.3" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="13.8" y="18.8" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="18.8" y="18.8" width="2.2" height="2.2" rx=".5" fill="currentColor" stroke="none"/>',
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
  pin:    '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  bell:   '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  cal:    '<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  star:   '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.2 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.2 5.9-.9Z"/>',
  fire:   '<path d="M12 20.5c-3.6 0-6-2.3-6-5.6 0-2.4 1.3-4.1 2.7-5.7.4 1.1 1.1 1.9 2.1 2.3C10.4 8.6 11 5.9 13.3 3.5c.2 2.7 1.5 4.3 2.8 5.8 1.2 1.4 1.9 2.8 1.9 4.6 0 3.3-2.4 6.6-6 6.6Z"/>',
  globe:  '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.2 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.2-3.5-8.5s1.2-6.2 3.5-8.5Z"/>',
  crown:  '<path d="M4 17.5 3 7.5l5 3.5 4-6 4 6 5-3.5-1 10Z"/><path d="M5 20.5h14"/>',
  dollar: '<path d="M12 3.5v17"/><path d="M16.3 6.8c-.9-1.1-2.4-1.7-4.2-1.7-2.3 0-4 1.2-4 3.1 0 4.2 8.6 2.2 8.6 6.5 0 2-1.9 3.2-4.6 3.2-2 0-3.6-.7-4.6-1.9"/>',
  dress:  '<path d="M8 3.5a4 4 0 0 0 8 0"/><path d="m8 3.5-4.2 3 1.8 3.2L8 8.5V20h8V8.5l2.4 1.2 1.8-3.2-4.2-3"/>',
  dots:   '<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/>',
  check:  '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  quest:  '<path d="M9.3 9a2.8 2.8 0 1 1 4 2.6c-1 .5-1.3 1.1-1.3 2.1"/><circle cx="12" cy="17.4" r="1.2" fill="currentColor" stroke="none"/>',
  xmark:  '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
  clock:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  doc:    '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/>',
  mega:   '<path d="M3.5 10.5v3a1.5 1.5 0 0 0 1.5 1.5h2l7 4.5v-15L7 9H5a1.5 1.5 0 0 0-1.5 1.5Z"/><path d="M17.5 9.5a4 4 0 0 1 0 5"/>',
  music:  '<path d="M9 18V6l10-2.2V15"/><circle cx="6.7" cy="18" r="2.5"/><circle cx="16.7" cy="15" r="2.5"/>',
  link:   '<path d="m9.8 14.2 4.4-4.4"/><path d="M8.4 11.6 6 14a3.6 3.6 0 0 0 5.1 5.1l2.4-2.4"/><path d="M15.6 12.4 18 10a3.6 3.6 0 0 0-5.1-5.1L10.5 7.3"/>',
  img:    '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.8" cy="10" r="1.6"/><path d="m5 18.5 5-5 3 3 3.5-3.5 3.5 3.5"/>'
};

// Devuelve el SVG de un icono. cls = clases CSS extra (opcional).
function icon(nombre, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[nombre] || ''}</svg>`;
}

// Escapa texto del usuario antes de meterlo en HTML (nombres, descripciones,
// comentarios…). Sin esto cualquier invitado podría inyectar HTML/JS (XSS).
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Normaliza un link del usuario: solo http/https (nada de javascript: y cía)
function urlSegura(u) {
  u = String(u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u.replace(/^\/+/, '');
  try {
    const p = new URL(u);
    return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : '';
  } catch { return ''; }
}

// Diálogo PROPIO estilo cristal líquido — reemplaza al prompt() nativo del
// navegador (blanco, se sale de pantalla y desentona con la app)
function pedirTexto(titulo, opts = {}) {
  return new Promise((resolve) => {
    document.getElementById('glassDlg')?.remove();
    const ov = document.createElement('div');
    ov.id = 'glassDlg'; ov.className = 'gdlg-overlay';
    ov.innerHTML = `
      <div class="gdlg">
        <p class="gdlg-title"></p>
        <input class="gdlg-input" type="text" autocomplete="off">
        <div class="gdlg-btns">
          <button class="gdlg-btn" type="button">Cancelar</button>
          <button class="gdlg-btn primary" type="button">${opts.ok || 'Listo'}</button>
        </div>
      </div>`;
    ov.querySelector('.gdlg-title').textContent = titulo;
    const inp = ov.querySelector('.gdlg-input');
    inp.value = opts.valor || '';
    inp.placeholder = opts.placeholder || '';
    const fin = (v) => { ov.remove(); resolve(v); };
    ov.querySelector('.gdlg-btn').onclick = () => fin(null);
    ov.querySelector('.gdlg-btn.primary').onclick = () => fin(inp.value);
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') fin(inp.value);
      if (e.key === 'Escape') fin(null);
    });
    ov.addEventListener('pointerdown', (e) => { if (e.target === ov) fin(null); });
    document.body.appendChild(ov);
    setTimeout(() => inp.focus(), 60);
  });
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
  // Al salir de "crear", quitamos el tema de fondo de toda la pantalla
  if (nombre !== 'create') {
    document.body.classList.remove('creando');
    const tbg = document.getElementById('temaBg');
    if (tbg) tbg.style.display = 'none';
    document.querySelectorAll('.efx-layer').forEach((n) => n.remove());
  }
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
  // Los videos de fondo se precargan desde YA (en segundo plano): cuando el
  // usuario llegue a los temas, arrancan al instante
  calentarVideos();
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

// NOTA: ya no hay roles separados — las cuentas están FUSIONADAS: todos
// pueden organizar fiestas Y asistir a las de otros (decisión del usuario).

/* --- Verificación de edad (18+): Socialice es solo para mayores. ---
   Toda la lógica de edad vive aquí para reusarla (registro y, a futuro,
   login social). El backend SIEMPRE debe recalcular la edad; esto es solo
   la primera barrera en el cliente. --- */
const EDAD_MINIMA = 18;

// Edad exacta en años a partir de una fecha ISO 'YYYY-MM-DD' (resta un año si
// aún no ha pasado el cumpleaños de este año). Devuelve null si no es válida.
function edadEnAnios(fechaISO) {
  if (!fechaISO) return null;
  const nac = new Date(fechaISO + 'T00:00:00');
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

// Fecha máxima seleccionable (hace EXACTAMENTE 18 años) como 'YYYY-MM-DD',
// usando la hora LOCAL (nada de toISOString, que usa UTC y se corre un día).
// Sirve para bloquear a menores directamente en el <input type="date">.
function maxFechaNacimiento() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - EDAD_MINIMA);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/* --- Formularios del splash: validación nativa + feedback claro ---
   (Enter envía, los errores se muestran con reportValidity + toast) --- */
async function loginSubmit(ev) {
  ev.preventDefault();
  const f = ev.target;
  if (!f.reportValidity()) { toast('Revisa tu correo y contraseña'); return false; }
  // Con Firebase configurado, login real; si no, modo mock.
  if (window.Socialice && window.Socialice.configurado) {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    try {
      await window.Socialice.login(email, password);
    } catch (e) {
      toast(window.Socialice.mensajeError(e));
      return false;
    }
  }
  entrarApp();
  toast(`¡Qué gusto verte, ${DATA.usuario.nombre.split(' ')[0]}! 🎉`);
  return false;
}
// Login con Google (solo si Firebase está configurado).
async function entrarGoogle() {
  if (!(window.Socialice && window.Socialice.configurado)) {
    toast('Conecta Firebase para usar Google 🔗');
    return;
  }
  try {
    const { nuevo } = await window.Socialice.loginGoogle();
    if (nuevo) {
      // Cuenta nueva por Google: aún no tiene fecha de nacimiento. No la
      // dejamos entrar sin verificar 18+ (falta un paso de onboarding).
      await window.Socialice.logout();
      toast('Para entrar con Google primero necesitamos tu fecha de nacimiento (18+).');
      return;
    }
    entrarApp();
    toast('¡Listo! 🎉');
  } catch (e) {
    toast(window.Socialice.mensajeError(e));
  }
}
function reg1Submit(ev) {
  ev.preventDefault();
  const f = ev.target;
  if (!f.reportValidity()) { toast('Completa tu correo y contraseña (mínimo 6 caracteres)'); return false; }
  const p1 = document.getElementById('regPass');
  const p2 = document.getElementById('regPass2');
  if (p1.value !== p2.value) {
    p2.setCustomValidity('Las contraseñas no coinciden');
    p2.reportValidity();
    p2.setCustomValidity('');
    toast('Las contraseñas no coinciden');
    return false;
  }
  // Verificación de edad 18+ (el campo es required, así que reportValidity ya
  // atrapa el vacío; aquí calculamos la edad exacta y bloqueamos a menores).
  const fNac = document.getElementById('regNacimiento');
  const edad = edadEnAnios(fNac.value);
  if (edad === null) {
    fNac.setCustomValidity('Ingresa tu fecha de nacimiento');
    fNac.reportValidity();
    fNac.setCustomValidity('');
    toast('Ingresa tu fecha de nacimiento');
    return false;
  }
  if (edad < EDAD_MINIMA) {
    fNac.setCustomValidity('Debes tener al menos 18 años');
    fNac.reportValidity();
    fNac.setCustomValidity('');
    toast('Lo sentimos: debes tener 18 años o más para usar Socialice.');
    return false;
  }
  splashIr('reg2');
  return false;
}
function reg2Submit(ev) {
  ev.preventDefault();
  const f = ev.target;
  if (!f.reportValidity()) { toast('Ponle nombre y usuario a tu cuenta'); return false; }
  const user = document.getElementById('reg2User').value.trim().toLowerCase();
  // Usuario duplicado (contra la gente que ya existe en la app)
  const ocupados = [
    ...DATA.amigos, ...DATA.sugerencias,
    ...(DATA.usuario.seguidoresList || []), ...(DATA.usuario.colaboradores || [])
  ].map((x) => (x.usuario || '').toLowerCase());
  if (ocupados.includes('@' + user)) {
    const inp = document.getElementById('reg2User');
    inp.setCustomValidity('Ese usuario ya está ocupado');
    inp.reportValidity();
    inp.setCustomValidity('');
    toast('Ese usuario ya está ocupado, prueba otro');
    return false;
  }
  splashIr('reg3');
  return false;
}
async function reg3Submit(ev) {
  ev.preventDefault();
  const nombre = document.getElementById('reg2Name').value.trim();
  const user = document.getElementById('reg2User').value.trim().toLowerCase();
  const usuario = '@' + user.replace(/^@+/, '');
  const bio = document.getElementById('reg3Bio').value.trim();
  // Fecha de nacimiento capturada en el paso 1 (ISO 'YYYY-MM-DD'). Se envía
  // tal cual; el backend revalida la edad. NO se guarda un booleano "esMayor".
  const fechaNacimiento = document.getElementById('regNacimiento').value;
  // Correo y contraseña vienen del paso 1 (siguen en el DOM).
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPass').value;

  // Con Firebase configurado, crea la cuenta REAL (Auth + Firestore); las
  // reglas rechazan a menores. Si no está configurado, sigue el modo mock.
  if (window.Socialice && window.Socialice.configurado) {
    try {
      await window.Socialice.crearCuenta({ email, password, nombre, usuario, bio, fechaNacimiento });
    } catch (e) {
      toast(window.Socialice.mensajeError(e));
      return false;
    }
  }

  // Refleja los datos en la UI (que hoy lee de DATA.usuario).
  if (nombre) DATA.usuario.nombre = nombre;
  if (user) DATA.usuario.usuario = usuario;
  if (bio) DATA.usuario.bio = bio;
  if (fechaNacimiento) DATA.usuario.fechaNacimiento = fechaNacimiento;
  // Cuenta nueva: SIN redes hasta que las agregue en "Editar perfil"
  DATA.usuario.redes = { instagram: '', tiktok: '', web: '' };
  entrarApp();
  toast('¡Bienvenido a Socialice! 🎉');
  return false;
}

/* ===================================================================
   2. INICIO (feed de eventos)
   =================================================================== */

let categoriaActiva = 'todos';
let notisNuevas = true;   // hay notificaciones sin leer (punto rojo + vibración)

function pintarInicio() {
  const cont = document.getElementById('screen-home');
  const u = DATA.usuario;

  // ¿Vas a ir? (las que confirmaste)
  const vas = DATA.eventos.filter((e) => (e.voy || e._voy) && !e.proximamente && !yaPaso(e));
  // Próximamente (para crear expectativa)
  const pronto = DATA.eventos.filter((e) => e.proximamente);

  const ciudad = u.ciudad || 'CDMX';

  cont.innerHTML = `
    <header class="home-top">
      <button class="home-logo" onclick="abrirConectados(this)" aria-label="Socialice">
        <img src="icons/logo-figure.png" alt="Socialice">
      </button>
      <div class="home-actions">
        <button class="ico-btn" onclick="verCalendario()" aria-label="Calendario">${icon('cal')}</button>
        <button class="ico-btn bell ${notisNuevas ? 'nuevo' : ''}" onclick="abrirNotificaciones()" aria-label="Notificaciones">
          ${icon('bell')}${notisNuevas ? '<span class="bell-dot"></span>' : ''}
        </button>
      </div>
    </header>

    <!-- Abanico de temas (decorativo, estilo Partiful) -->
    <div class="pf-fan">
      <span class="pf-fan-card f1" style="background:${TEMAS[1].grad}">🌅<b>Atardecer</b></span>
      <span class="pf-fan-card f2" style="background:${TEMAS[4].grad}">🌆<b>Synthwave</b></span>
      <span class="pf-fan-card f3" style="background:${TEMAS[3].grad}">💿<b>Vaporwave</b></span>
    </div>

    <!-- CTA crear evento -->
    <button class="crear-pill" onclick="abrirCrearMenu()">＋ Crear evento</button>

    ${vas.length ? `
      <div class="row-between"><h3>Vas a ir</h3><span class="see-all" onclick="irA('search')">${vas.length}</span></div>
      <div class="voy-row">
        ${vas.map(tarjetaVoy).join('')}
      </div>` : ''}

    <div class="row-between pf-section" style="margin-top:${vas.length ? '22px' : '14px'}">
      <h3>Tendencia en ${ciudad} ✨</h3>
      <span class="see-all" onclick="irA('search')">Ver todas</span>
    </div>
    <div class="chips-row" id="chipsRow"></div>
    <div class="event-list" id="eventList"></div>

    ${pronto.length ? `
      <div class="row-between" style="margin-top:24px"><h3>Próximamente</h3></div>
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
  // Recomendaciones: públicas, ni "próximamente" ni las que ya vas
  const eventos = DATA.eventos.filter((e) =>
    e.publico !== false && !e.proximamente && !yaPaso(e) &&
    (categoriaActiva === 'todos' || e.cat.includes(categoriaActiva))
  );

  lista.innerHTML = eventos.length
    ? eventos.map(tarjetaEvento).join('')
    : `<p class="empty">No hay fiestas en esta categoría 🙈</p>`;
}

// ¿El evento está casi lleno? (85% o más del cupo)
function casiLleno(e) {
  return e.capacidad && !e.proximamente && (e.asistentes / e.capacidad) >= 0.85;
}

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
// Chip de fecha (día + mes) para la portada
function chipFecha(e) {
  if (!e.fechaISO) return null;
  const d = new Date(e.fechaISO);
  return { dia: d.getDate(), mes: MESES[d.getMonth()] };
}
// Info del anfitrión (avatar + color)
function hostInfo(e) {
  if (e.organizador === DATA.usuario.nombre) return { avatar: DATA.usuario.avatar, color: DATA.usuario.color, nombre: e.organizador };
  const co = (DATA.usuario.colaboradores || []).find((c) => c.nombre === e.organizador);
  if (co) return { avatar: co.avatar, color: co.color, nombre: co.nombre };
  return { avatar: '🎧', color: 'linear-gradient(135deg,#0ea5e9,#6366f1)', nombre: e.organizador };
}

// Tarjeta de evento (estilo Partiful: miniatura cuadrada + info a un lado
// + fila inferior con anfitrión/invitados). Clicable.
function tarjetaEvento(e) {
  const ch = chipFecha(e);
  const h = hostInfo(e);
  const cara = invitadosMuestra(e, 3);
  return `
    <article class="pf-card" onclick="abrirEvento('${e.id}')">
      <div class="pf-poster" style="${coverStyle(e)}">
        ${e.coverImg ? '' : `<span class="pf-poster-emoji">${e.emoji || '🎉'}</span>`}
        <span class="pf-org"><span class="pf-org-ava" style="background:${h.color}">${h.avatar}</span>${esc(h.nombre.split(' ')[0])}</span>
        ${ch ? `<span class="pf-date"><b>${ch.dia}</b> ${ch.mes}</span>` : `<span class="pf-date soon">✦ PRONTO</span>`}
        ${casiLleno(e) ? `<span class="pf-tag hot">${icon('fire')} Últimos lugares</span>` : ''}
        <button class="pf-star ${e._interesado ? 'on' : ''}" onclick="event.stopPropagation(); interesado('${e.id}', this)" aria-label="Interesado">${icon('star')}</button>
      </div>
      <h3 class="pf-title" ${nombreAttrs(e)}>${esc(e.nombre)}</h3>
      <p class="pf-when">${esc(e.fecha)}${e.ciudad ? " · " + esc(e.ciudad) : ""}</p>
      <div class="pf-foot">
        <span class="pf-faces ${puedeVerLista(e) ? '' : 'anon'}">${cara.map((g) => `<span class="pf-face" style="background:${g.color}">${g.avatar}</span>`).join('')}</span>
        <span class="pf-count ${casiLleno(e) ? 'full' : ''}">${e.proximamente ? totalInteresados(e) + ' interesados' : e.asistentes + (e.capacidad ? '/' + e.capacidad : '') + ' van'}</span>
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
        <strong ${nombreAttrs(e)}>${esc(e.nombre)}</strong>
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
    <article class="pf-card soon" onclick="abrirEvento('${e.id}')">
      <div class="pf-poster" style="${coverStyle(e)}">
        ${e.coverImg ? '' : `<span class="pf-poster-emoji">${e.emoji || '✦'}</span>`}
        <span class="pf-date soon">✦ PRONTO</span>
        <button class="pf-star ${e._interesado ? 'on' : ''}" onclick="event.stopPropagation(); interesado('${e.id}', this)" aria-label="Interesado">${icon('star')}</button>
      </div>
      <h3 class="pf-title" ${nombreAttrs(e)}>${esc(e.nombre)}</h3>
      <p class="pf-when">${esc(e.lugar)}${e.ciudad ? " · " + esc(e.ciudad) : ""}</p>
      <div class="pf-foot">
        <span class="pf-count" id="int-${e.id}">${icon('eye')} ${totalInteresados(e)} interesados</span>
      </div>
    </article>`;
}

// Marca/quita interés en un evento (para recibir avisos)
function interesado(id, btn) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  e._interesado = !e._interesado;
  btn.classList.toggle('on', e._interesado);
  btn.innerHTML = btn.classList.contains('pf-star') ? icon('star') : icon('star') + (e._interesado ? ' Interesado ✓' : ' Interesado');
  // Actualiza el contador de interesados si está visible
  const c = document.getElementById('int-' + id);
  if (c) c.innerHTML = `${icon('eye')} ${totalInteresados(e)} interesados`;
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
    const okTexto  = !t || [e.nombre, e.lugar, e.ciudad, e.organizador].some((c) => (c || '').toLowerCase().includes(t));
    const okCiudad = !ciudad || (e.ciudad || '').toLowerCase().includes(ciudad);
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

// Temas de fondo BOLD y únicos (cada uno con identidad propia; estilo Partiful)
// Las tarjetas tienen su propio velo oscuro, así que el fondo puede ser vivo.
/* Cada tema es UNA ESCENA compuesta (estilo Partiful), no un patrón en mosaico.
   Todas las capas van con no-repeat: nada se repite ni se corta. Las partes
   animadas (llamas, bola disco, rejilla, globos…) viven en CSS (.tema-<slug>). */
const TEMAS = [
  // Medianoche es VIDEO real (icons/medianoche.mp4, luna entre nubes);
  // el gradiente azul noche es solo respaldo
  { nombre: 'Medianoche', grad: 'linear-gradient(135deg,#2f7bff,#38bdf8)',
    bg: 'radial-gradient(120% 60% at 50% 112%, #14204d, transparent 70%), linear-gradient(180deg,#0c1334 0%,#0a0f26 48%,#05070f 100%)' },
  { nombre: 'Atardecer', grad: 'linear-gradient(135deg,#fb923c,#ec4899)',
    bg: 'radial-gradient(circle 56px at 50% 40%, #fff6d0 0 55%, #ffd76a 68%, rgba(255,150,60,.6) 78%, transparent 85%), radial-gradient(75% 34% at 50% 42%, rgba(255,170,90,.55), transparent 72%), radial-gradient(120% 22% at 50% 55%, rgba(255,120,130,.35), transparent 70%), linear-gradient(180deg,#ff9a5b 0%,#ff5f9e 30%,#a23bb0 58%,#3a1450 82%,#120726 100%)' },
  { nombre: 'Y2K', grad: 'linear-gradient(135deg,#dfe7f5,#8fb6ff)',
    bg: 'radial-gradient(150px 95px at 24% 20%, rgba(255,255,255,.95), rgba(255,255,255,0) 70%), radial-gradient(190px 120px at 78% 55%, rgba(255,255,255,.55), transparent 70%), radial-gradient(120px 80px at 40% 86%, rgba(255,255,255,.5), transparent 70%), linear-gradient(160deg,#eef3fb 0%,#9fb4d8 22%,#f2f6fc 38%,#7f97c4 56%,#dbe4f3 72%,#8ea6cf 88%,#e8eef8 100%)' },
  { nombre: 'Vaporwave', grad: 'linear-gradient(135deg,#ec4899,#38bdf8)',
    bg: 'radial-gradient(120% 26% at 50% 76%, rgba(255,120,190,.4), transparent 72%), linear-gradient(180deg,#241059 0%,#4a1d7a 42%,#b3438f 70%,#ff8d5a 100%)' },
  { nombre: 'Synthwave', grad: 'linear-gradient(135deg,#ff2bd6,#22d3ee)',
    bg: 'radial-gradient(70% 30% at 50% 40%, rgba(255,43,214,.35), transparent 65%), linear-gradient(180deg,#0a0424 0%,#1a0640 55%,#2a0a55 100%)' },
  // Disco es VIDEO real (icons/disco.mp4); el gradiente oscuro es solo respaldo
  { nombre: 'Disco', grad: 'linear-gradient(135deg,#c0c8dd,#7b6bf0)',
    bg: 'radial-gradient(60% 40% at 50% 30%, rgba(160,200,60,.25), transparent 70%), linear-gradient(180deg,#151a0e 0%,#0e120a 55%,#070905 100%)' },
  { nombre: 'Holográfico', grad: 'linear-gradient(135deg,#a1c4fd,#fbc2eb)',
    bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 22%, #fbc2eb 50%, #c2a8ff 76%, #8ec5fc 100%)' },
  { nombre: 'Iridiscente', grad: 'linear-gradient(135deg,#a8edea,#fed6e3)',
    bg: 'radial-gradient(90% 80% at 18% 12%, #a8edea, transparent 62%), radial-gradient(85% 75% at 85% 22%, #fed6e3, transparent 64%), radial-gradient(90% 85% at 25% 88%, #c5a3ff, transparent 62%), radial-gradient(85% 80% at 88% 82%, #8ec5fc, transparent 64%), linear-gradient(135deg,#dceefc,#ffe9f3)' },
  { nombre: 'Chicle', grad: 'linear-gradient(135deg,#ff9a9e,#fad0c4)',
    bg: 'radial-gradient(circle 110px at 76% 20%, rgba(255,255,255,.4), transparent 65%), linear-gradient(135deg,#ff9a9e 0%,#fecfef 45%,#a18cd1 100%)' },
  { nombre: 'Cromo', grad: 'linear-gradient(135deg,#c9d6ff,#e2e2e2)',
    bg: 'linear-gradient(135deg, #e2e2e2 0%, #9aa7c7 20%, #f5f7fa 40%, #aab4d4 60%, #f5f7fa 80%, #9aa7c7 100%)' },
  { nombre: 'Menta', grad: 'linear-gradient(135deg,#84fab0,#8fd3f4)',
    bg: 'radial-gradient(70% 40% at 24% 18%, rgba(255,255,255,.35), transparent 65%), linear-gradient(135deg,#84fab0 0%,#8fd3f4 60%,#5b6ef0 100%)' },
  { nombre: 'Tropical', grad: 'linear-gradient(135deg,#f59e0b,#f97316)',
    bg: 'linear-gradient(180deg,#f6b56b 0%,#ef9741 45%,#d96c1e 78%,#8a3a10 100%)' },
  { nombre: 'Fuego', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    bg: 'radial-gradient(85% 62% at 50% 122%, #fbbf24, #ef4444 34%, #7f1d1d 64%, #190606 100%)' },
  { nombre: 'Aurora', grad: 'linear-gradient(135deg,#22d3ee,#34d399)',
    bg: 'radial-gradient(1.6px 1.6px at 18% 22%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 64% 12%, #dfefff 60%, transparent), radial-gradient(1.8px 1.8px at 84% 30%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 35% 42%, #cfeaf5 60%, transparent), radial-gradient(1.6px 1.6px at 50% 7%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 10% 58%, #fff 60%, transparent), linear-gradient(180deg,#03111e 0%,#04202b 55%,#020d14 100%)' },
  { nombre: 'Galaxia', grad: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    bg: 'radial-gradient(60% 46% at 30% 24%, #5b21b6, transparent 62%), radial-gradient(55% 50% at 76% 60%, #9d174d, transparent 62%), radial-gradient(40% 34% at 60% 12%, rgba(56,189,248,.25), transparent 65%), radial-gradient(1.8px 1.8px at 18% 18%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 34% 40%, #e9d5ff 60%, transparent), radial-gradient(2.2px 2.2px at 55% 26%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 72% 14%, #fff 60%, transparent), radial-gradient(1.8px 1.8px at 88% 42%, #e9d5ff 60%, transparent), radial-gradient(1.4px 1.4px at 12% 58%, #fff 60%, transparent), radial-gradient(2px 2px at 44% 70%, #fff 60%, transparent), radial-gradient(1.4px 1.4px at 66% 84%, #e9d5ff 60%, transparent), radial-gradient(1.8px 1.8px at 90% 76%, #fff 60%, transparent), #08041a' },
  { nombre: 'Fiesta', grad: 'linear-gradient(135deg,#f472b6,#fbbf24)',
    bg: 'radial-gradient(90% 45% at 50% 112%, rgba(120,70,220,.4), transparent 72%), linear-gradient(180deg,#1c1140 0%,#241556 55%,#0e0a24 100%)' },
  // Cielo es VIDEO real (icons/cielo.mp4); el gradiente azul es solo respaldo
  { nombre: 'Cielo', grad: 'linear-gradient(135deg,#38bdf8,#a5f3fc)',
    bg: 'linear-gradient(180deg,#2e7cd6 0%,#5aa7e8 55%,#a8d1f4 100%)' },
  { nombre: 'Minimal', grad: 'linear-gradient(135deg,#94a3b8,#475569)',
    bg: 'radial-gradient(100% 70% at 50% 0%, #1b2233, transparent 70%), #0a0c12' },
  // Playa es VIDEO real (icons/playa.mp4); el gradiente aqua es solo el
  // respaldo si el video no puede reproducirse. Bosque es foto real.
  { nombre: 'Playa', grad: 'linear-gradient(135deg,#5fd4d0,#b5ecf2)',
    bg: 'linear-gradient(180deg,#c6ebe6 0%,#9fd8d4 55%,#7ec4c4 100%)' },
  { nombre: 'Bosque', grad: 'linear-gradient(135deg,#4c6b35,#c8dd8a)',
    bg: 'url(icons/bosque.jpg) center / cover no-repeat, linear-gradient(180deg,#8a9a54 0%,#5c6e38 45%,#26331a 100%)' },
  // Nevado es VIDEO real (icons/nevado.mp4); el gradiente helado es solo respaldo
  { nombre: 'Nevado', grad: 'linear-gradient(135deg,#c8d5de,#8fa6b5)',
    bg: 'linear-gradient(180deg,#b9c4cc 0%,#9aa9b3 50%,#6d7f8b 100%)' },
  // Llamas es VIDEO real (icons/llamas.mp4), con color de luces elegible
  // (draft.llamaHue / LLAMA_COLORES); el gradiente de fuego es solo respaldo
  { nombre: 'Llamas', grad: 'linear-gradient(135deg,#f97316,#dc2626)',
    bg: 'radial-gradient(60% 40% at 50% 100%, rgba(255,140,50,.45), transparent 70%), linear-gradient(180deg,#1a0a05 0%,#0d0603 60%,#050302 100%)' },
  // El último SIEMPRE es el editable: el fondo se arma con los colores del usuario
  { nombre: 'Tus colores', custom: true, grad: '', bg: '' }
];

// Mezcla dos colores hex ("#rrggbb") en proporción t (0 = a, 1 = b)
function mixHex(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

// Nombre del tema → slug para su clase CSS (tema-<slug>)
function temaSlug(nombre) {
  return (nombre || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}

// Temas cuyo fondo es un VIDEO real en loop (aportados por el usuario).
// rate = velocidad de reproducción (la playa va lenta para que ondule con calma)
const TEMA_VIDEOS = {
  playa:      { src: 'icons/playa.mp4',      rate: 0.55 },
  tropical:   { src: 'icons/tropical.mp4',   rate: 1 },
  cielo:      { src: 'icons/cielo.mp4',      rate: 1 },
  fuego:      { src: 'icons/fuego.mp4',      rate: 0.6 },
  disco:      { src: 'icons/disco.mp4',      rate: 1 },
  nevado:     { src: 'icons/nevado.mp4',     rate: 1 },
  medianoche: { src: 'icons/medianoche.mp4', rate: 1 },
  llamas:     { src: 'icons/llamas.mp4',     rate: 1 }
};

// Colores elegibles para las LLAMAS: un filtro gira el tono del video
// (calibrados sobre el naranja natural del fuego, no son los mismos
// grados que DISCO_COLORES porque el color base del video es distinto)
const LLAMA_COLORES = [
  { nombre: 'Naranja',    hue: 0,   c: '#f97316' },
  { nombre: 'Verde',      hue: 60,  c: '#4ade80' },
  { nombre: 'Azul',       hue: 180, c: '#38bdf8' },
  { nombre: 'Morado',     hue: 220, c: '#a855f7' },
  { nombre: 'Rosa',       hue: 260, c: '#f472b6' },
  { nombre: 'Multicolor', hue: 'anim', c: 'conic-gradient(#f44,#fb3,#4d4,#3cf,#86f,#f4c,#f44)' }
];

// Aplica al <video> de Llamas el color elegido en draft.llamaHue
function aplicarLlamaHue(v) {
  if (!v) return;
  v.classList.toggle('vfx-hue', draft.llamaHue === 'anim');
  v.style.filter = (typeof draft.llamaHue === 'number' && draft.llamaHue) ? `hue-rotate(${draft.llamaHue}deg)` : '';
}

// Colores elegibles para las LUCES del tema Disco: un filtro gira el tono
// del video al color elegido ('anim' = multicolor, van rotando solas)
const DISCO_COLORES = [
  { nombre: 'Verde',      hue: 0,      c: '#a8e63c' },
  { nombre: 'Azul',       hue: 140,    c: '#3cb4e6' },
  { nombre: 'Morado',     hue: 200,    c: '#8b5cf6' },
  { nombre: 'Rosa',       hue: 250,    c: '#f45fd0' },
  { nombre: 'Rojo',       hue: 290,    c: '#f4504a' },
  { nombre: 'Dorado',     hue: 330,    c: '#f5b93c' },
  { nombre: 'Multicolor', hue: 'anim', c: 'conic-gradient(#f44,#fb3,#4d4,#3cf,#86f,#f4c,#f44)' }
];

// Aplica al <video> de Disco el color elegido en draft.discoHue
function aplicarDiscoHue(v) {
  if (!v) return;
  v.classList.toggle('vfx-hue', draft.discoHue === 'anim');
  v.style.filter = (typeof draft.discoHue === 'number' && draft.discoHue) ? `hue-rotate(${draft.discoHue}deg)` : '';
}

// Pool de <video>: cada video se crea UNA vez y se reutiliza al cambiar de
// tema (nada de re-descargar ni re-arrancar desde cero)
const _videoPool = {};
function temaVideoEl(slug) {
  const tv = TEMA_VIDEOS[slug];
  if (!tv) return null;
  let v = _videoPool[slug];
  if (!v) {
    v = document.createElement('video');
    v.className = 'tema-video';
    v.src = tv.src;
    v.preload = 'auto';
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.playbackRate = tv.rate;
    v.addEventListener('loadeddata', () => { v.playbackRate = tv.rate; });
    _videoPool[slug] = v;
  }
  return v;
}

// Precarga los videos en segundo plano. UNO POR UNO del más ligero al más
// pesado (en paralelo se pelean el ancho de banda y ninguno termina pronto);
// el SW los guarda en caché PERSISTENTE: se bajan una sola vez y en visitas
// siguientes arrancan al instante desde disco.
let _videosCalentados = false;
function calentarVideos() {
  if (_videosCalentados) return;
  _videosCalentados = true;
  const orden = ['llamas', 'nevado', 'cielo', 'medianoche', 'fuego', 'disco', 'playa', 'tropical'];
  setTimeout(async () => {
    for (const slug of orden) {
      if (!TEMA_VIDEOS[slug]) continue;
      try { await (await fetch(TEMA_VIDEOS[slug].src)).blob(); } catch (e) {}
      temaVideoEl(slug);
    }
  }, 400);
}

// Tema personalizado: con 1-2 colores arma un fondo SEDOSO estilo Y2K
// (bandas claras/oscuras del mismo color, nada recargado). Si anim=true, el
// fondo es UN gradiente pandeable que fluye entre los colores (clase .anim).
function customTema(cols, anim) {
  const c1 = (cols && cols[0]) || '#8b5cf6';
  const c2 = (cols && cols[1]) || mixHex(c1, '#0b1020', 0.38);
  const l1 = mixHex(c1, '#ffffff', 0.72), l2 = mixHex(c2, '#ffffff', 0.66);
  return {
    nombre: 'Tus colores', custom: true,
    grad: `linear-gradient(135deg,${c1},${c2})`,
    bg: anim
      ? `linear-gradient(115deg, ${l1} 0%, ${c1} 25%, ${l2} 50%, ${c2} 75%, ${l1} 100%)`
      : `radial-gradient(150px 95px at 24% 20%, rgba(255,255,255,.8), transparent 70%), radial-gradient(190px 120px at 78% 55%, rgba(255,255,255,.42), transparent 70%), radial-gradient(120px 80px at 40% 86%, rgba(255,255,255,.38), transparent 70%), linear-gradient(160deg, ${l1} 0%, ${c1} 22%, ${l2} 38%, ${c2} 56%, ${l1} 72%, ${c1} 88%, ${l2} 100%)`
  };
}

// Tema efectivo del borrador (resuelve el personalizado con sus colores)
function temaActual() {
  const t = TEMAS[draft.tema] || TEMAS[0];
  return t.custom ? customTema(draft.temaColors, draft.temaAnim) : t;
}

// Tipografías (no se muestran todas: se abren en un selector)
const FONTS = [
  { id: 'classic', nombre: 'Clásico',   css: "var(--font-display)" },
  { id: 'sans',    nombre: 'Limpio',    css: "'Hanken Grotesk', sans-serif" },
  { id: 'serif',   nombre: 'Serif',     css: "Georgia, 'Times New Roman', serif" },
  { id: 'baskerville', nombre: 'Editorial', css: "Baskerville, Georgia, serif" },
  { id: 'palatino', nombre: 'Palatino', css: "Palatino, 'Palatino Linotype', serif" },
  { id: 'script',  nombre: 'Script',    css: "'Snell Roundhand','Brush Script MT', cursive" },
  { id: 'savoye',  nombre: 'Cursiva',   css: "'Savoye LET','Snell Roundhand', cursive" },
  { id: 'marker',  nombre: 'Marcador',  css: "'Marker Felt','Comic Sans MS', cursive" },
  { id: 'bradley', nombre: 'A mano',    css: "'Bradley Hand','Segoe Script', cursive" },
  { id: 'chalk',   nombre: 'Tiza',      css: "'Chalkduster', fantasy" },
  { id: 'mono',    nombre: 'Mono',      css: "'Courier New', monospace" },
  { id: 'typewriter', nombre: 'Máquina', css: "'American Typewriter','Courier New', serif" },
  { id: 'impact',  nombre: 'Impacto',   css: "Impact, 'Arial Black', sans-serif" },
  { id: 'futura',  nombre: 'Futura',    css: "Futura, 'Trebuchet MS', sans-serif" },
  { id: 'optima',  nombre: 'Optima',    css: "Optima, 'Segoe UI', sans-serif" },
  { id: 'copperplate', nombre: 'Grabado', css: "Copperplate,'Copperplate Gothic', fantasy" },
  { id: 'condensed', nombre: 'Compacta', css: "'Arial Narrow', sans-serif" },
  { id: 'papyrus', nombre: 'Antigua',   css: "Papyrus, fantasy" }
];

// Tipos de efecto del fondo
const EFECTOS = [
  { id: 'ninguno',   nombre: 'Ninguno',   emoji: '🚫' },
  { id: 'destellos', nombre: 'Destellos', emoji: '✨' },
  { id: 'confeti',   nombre: 'Confeti',   emoji: '🎉' },
  { id: 'burbujas',  nombre: 'Burbujas',  emoji: '🫧' },
  { id: 'nieve',     nombre: 'Nieve',     emoji: '❄️' },
  { id: 'corazones', nombre: 'Corazones', emoji: '💜' },
  { id: 'rayos',     nombre: 'Reflectores',emoji: '🔦' },
  { id: 'humo',      nombre: 'Niebla',    emoji: '🌫️' },
  { id: 'neon',      nombre: 'Neón',      emoji: '💖' },
  { id: 'grano',     nombre: 'Cámara',    emoji: '📹' },
  { id: 'lluvia',      nombre: 'Lluvia',         emoji: '🌧️' },
  { id: 'luciernagas', nombre: 'Luciérnagas',    emoji: '🌟' },
  { id: 'aurora',      nombre: 'Aurora boreal',  emoji: '🌌' },
  { id: 'laser',       nombre: 'Láser',          emoji: '✴️' },
  { id: 'estrobo',     nombre: 'Estrobo',        emoji: '⚡' },
  { id: 'bengalas',    nombre: 'Bengalas',       emoji: '🎇' }
];

// Animaciones para boletos especiales (el usuario elige)
const BOLETO_ANIMS = [
  { id: 'oro',      nombre: 'Oro' },
  { id: 'holo',     nombre: 'Holográfico' },
  { id: 'neon',     nombre: 'Neón' },
  { id: 'arcoiris', nombre: 'Arcoíris' },
  { id: 'pulso',    nombre: 'Pulso' },
  { id: 'diamante', nombre: 'Diamante' }
];

// Paleta simple de colores para el nombre
const NAME_COLORS = ['#ffffff', '#2f7bff', '#38bdf8', '#7dd3fc', '#22d3ee', '#818cf8', '#0ea5e9'];
// Emojis sugeridos para poner en la portada
const COVER_EMOJI_SET = ['🎉','🪩','🔥','✨','🌙','🌃','💜','🍸','🎶','👑','🌌','⚡','🦋','🌴','💎','🎈'];

function nuevoDraft() {
  return {
    id: null,
    paso: 0,
    // Por defecto arranca con el tema PERSONALIZADO (suave, con tus colores)
    tema: TEMAS.findIndex((t) => t.custom),
    temaColors: ['#8b5cf6', '#38bdf8'], // colores del tema personalizado (1-2)
    temaAnim: false,                    // si el tema personalizado fluye animado
    discoHue: 0,                        // color de las luces del tema Disco ('anim' = multicolor)
    llamaHue: 0,                        // color de las llamas del tema Llamas ('anim' = multicolor)
    grupoId: null,                      // si la fiesta es de un grupo, su id
    efecto: 'ninguno',           // tipo de efecto del fondo
    tituloFont: 'classic',       // estilo de letra del título
    descripcion: '',
    dressCode: '',               // código de vestimenta
    costo: '',                   // costo por persona
    fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', // fecha/hora con selector
    links: [],                   // enlaces (música, etc.)
    requireApproval: false,      // requiere aprobación del anfitrión
    reminders: true,             // recordatorios automáticos
    questionnaire: false,        // cuestionario para invitados
    preguntas: [],               // preguntas para los invitados (estilo Partiful)
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
    publico: true,                // público (en el feed) o privado (solo invitación)
    // Quién puede ver la lista de invitados. Protegida por defecto:
    // 'confirmados' (solo quienes van) | 'todos' | 'nadie' (solo el anfitrión)
    listaVisible: 'confirmados',
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
// Al crear una fiesta nueva, PRIMERO eliges tus colores (el tema por defecto
// es el personalizado, así que no se planta un fondo que no escogiste)
function nuevaFiesta() { draft = nuevoDraft(); irA('create'); abrirTemaCustom(); }

// Editar un evento ya creado (carga sus datos al borrador)
function editarFiesta(id) {
  const e = DATA.eventos.find((x) => x.id === id);
  if (!e) return;
  // Solo el organizador, co-organizadores o el grupo organizador editan
  if (!puedeEditar(e)) { toast('Solo los organizadores pueden editar este evento 🔒'); return; }
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
  draft.publico = e.publico !== false;
  draft.listaVisible = e.listaVisible || 'confirmados';
  draft.tema = e.tema || 0;
  if (e.temaColors && e.temaColors.length) draft.temaColors = e.temaColors.slice();
  draft.temaAnim = !!e.temaAnim;
  draft.discoHue = e.discoHue || 0;
  draft.llamaHue = e.llamaHue || 0;
  draft.efecto = e.efecto || 'ninguno';
  draft.grupoId = e.grupoId || null;
  draft.fechaInicio = e.fechaInicio || '';
  draft.fechaFin = e.fechaFin || '';
  draft.horaInicio = e.horaInicio || '';
  draft.horaFin = e.horaFin || '';
  draft.questionnaire = !!e.questionnaire;
  draft.reminders = !!e.reminders;
  draft.tituloFont = e.tituloFont || 'classic';
  draft.descripcion = e.descripcion || '';
  draft.dressCode = e.dressCode || '';
  draft.costo = e.costo || '';
  draft.requireApproval = !!e.requireApproval;
  draft.preguntas = (e.preguntas || []).slice();
  draft.links = (e.links || []).map((l) => ({ ...l }));
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

// El FONDO DEL TEMA que se eligió al crear el evento (la escena real:
// fuego, disco, playa…), no la portada — se usa en el pase/boleto
function temaFondoEvento(e) {
  const t = TEMAS[e.tema];
  if (!t) return { bg: e.grad || 'linear-gradient(135deg,#2f7bff,#38bdf8)', grad: e.grad };
  const tt = t.custom ? customTema(e.temaColors, e.temaAnim) : t;
  return { bg: tt.bg, grad: tt.grad };
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

let mostrarMapa = false;

// --- Página de creación de evento (una sola página, con tema de fondo) ---
function pintarCrear() {
  const editando = !!draft.id;
  const t = temaActual();
  const font = (FONTS.find((f) => f.id === draft.tituloFont) || FONTS[0]).css;
  const anim = draft.cover.anim && draft.cover.anim.length >= 2;
  const efxOn = draft.efecto && draft.efecto !== 'ninguno';
  const u = DATA.usuario;
  const cont = document.getElementById('screen-create');
  // OJO: NO sobrescribir className (borraría la clase .screen y quedaría visible siempre).
  cont.classList.add('crear-screen');
  [...cont.classList].filter((c) => c.startsWith('efx-')).forEach((c) => cont.classList.remove(c));
  if (efxOn) cont.classList.add('efx-' + draft.efecto);
  cont.style.background = 'transparent';

  // El TEMA cubre TODA la pantalla con una CAPA FIJA (sin background-attachment,
  // que causa tirones y deja ver "atrás" al hacer scroll en móvil)
  document.body.classList.add('creando');
  let temaBg = document.getElementById('temaBg');
  if (!temaBg) { temaBg = document.createElement('div'); temaBg.id = 'temaBg'; document.body.prepend(temaBg); }
  const slug = temaSlug(t.nombre);
  temaBg.className = 'tema-' + slug;
  // Tus colores + animado: el gradiente fluye entre los colores elegidos
  if (t.custom && draft.temaAnim) temaBg.classList.add('anim');
  temaBg.style.background = t.bg;
  // Nada se repite en mosaico: cada capa es parte de UNA escena (no un patrón)
  temaBg.style.backgroundRepeat = 'no-repeat';
  temaBg.style.display = 'block';
  temaBg.innerHTML = '';
  // Temas con VIDEO real de fondo (playa, tropical, cielo, fuego): se
  // REUTILIZA el <video> del pool (ya precargado); si no puede reproducirse
  // queda el gradiente del tema como respaldo.
  const vEl = temaVideoEl(slug);
  if (vEl) {
    temaBg.classList.add('con-video');
    temaBg.appendChild(vEl);
    if (slug === 'disco') aplicarDiscoHue(vEl);
    if (slug === 'llamas') aplicarLlamaHue(vEl);
    vEl.play().catch(() => {});
  }
  calentarVideos();

  cont.innerHTML = `
    <div class="crear-page">

      <!-- Barra superior (sin público/privado: eso va en Ajustes) -->
      <div class="crear-bar">
        <button class="round-btn" onclick="salirCrear()" aria-label="Volver">←</button>
        <button class="save-btn" onclick="guardarFiesta()">${editando ? 'Guardar cambios' : 'Guardar'}</button>
      </div>

      <!-- HERO: título arriba (sin tarjeta) y portada centrada abajo —
           MISMO look que la ficha ya publicada del evento -->
      <div class="ev-hero cr-ev-hero">
        <h1 class="ev-nombre titulo-input ${anim ? 'name-anim' : ''}" id="cvTitulo" contenteditable="true"
             data-ph="Título" style="font-family:${font}; ${anim ? `background-image:${animGrad(draft.cover.anim)}` : `color:${draft.cover.titleColor}`}"
             oninput="draft.nombre=this.textContent">${esc(draft.nombre)}</h1>
        <div class="titulo-tools cr-titulo-tools">
          <button class="tt-more" onclick="this.closest('.titulo-tools').classList.toggle('open')" aria-label="Estilo del título">${icon('dots')}</button>
          <div class="tt-menu">
            <button class="tt-btn" onclick="abrirTipografias()" style="font-family:${font}">Aa <small>Tipografía</small></button>
            <label class="tt-color" style="background:${anim ? 'conic-gradient(from 0deg,#2f7bff,#38bdf8,#a855f7,#22d3ee,#2f7bff)' : draft.cover.titleColor}" title="Color del título">
              <input type="color" value="${anim ? '#2f7bff' : draft.cover.titleColor}" oninput="setNombreColorLive(this.value)" onchange="setNombreColor(this.value)">
            </label>
            <button class="tt-anim ${anim ? 'on' : ''}" onclick="abrirColorAnim()" title="Color animado">${icon('spark')}</button>
          </div>
        </div>
        <div class="ev-cover cr-ev-cover ${draft.cover.img ? 'has-img' : ''}" style="${coverStyleDraft()}">
          ${draft.cover.img ? '' : '<button class="cover-empty" onclick="document.getElementById(\'coverFile\').click()"><span class="cover-empty-ic">＋</span>Portada</button>'}
          <input type="file" accept="image/*" id="coverFile" hidden onchange="subirPortada(event)">
          <button class="cover-edit" onclick="document.getElementById('coverFile').click()" aria-label="Cambiar portada">✎</button>
        </div>
      </div>

      <!-- En PC: dos columnas (izq: hero/descripción/organizadores/mapa ·
           der: boletos/acciones/publicaciones). En teléfono: una columna -->
      <div class="cr-col-izq">

      <!-- INFO: una sola tarjeta con fecha, lugar y organizadores
           (divididas por líneas) — MISMO patrón que .ev-info publicado -->
      <div class="ev-info cr-ev-info">
        <div class="ev-irow">
          ${icon('cal', 'mute')}
          <input type="date" class="cr-inline-input" value="${draft.fechaInicio}" oninput="draft.fechaInicio=this.value; if(!draft.fechaFin)draft.fechaFin=this.value; syncFecha()">
          <input type="text" class="cr-inline-input cr-hora-input" inputmode="numeric" value="${draft.horaInicio}" placeholder="9:30 pm" oninput="draft.horaInicio=this.value; syncFecha()">
          <span class="cr-dash">–</span>
          <input type="text" class="cr-inline-input cr-hora-input" inputmode="numeric" value="${draft.horaFin}" placeholder="2:00 am" oninput="draft.horaFin=this.value">
        </div>
        <div class="ev-irow">
          ${icon('pin', 'mute')}
          <input class="cr-inline-input" id="cvLugar" value="${esc(draft.lugar)}" placeholder="Ubicación" oninput="draft.lugar=this.value">
        </div>
        <div class="ev-irow cr-ev-row-org">
          <div class="ev-host-avas"><span class="host-ava" style="${avatarFondo(u)}">${avatarContenido(u)}</span></div>
          <div><small>Organiza</small><strong>${esc(u.nombre)}</strong></div>
          <div class="cr-org-add">
            <button class="chip" onclick="agregarCoanfitrion()">＋ Co‑anfitrión</button>
            <button class="chip" onclick="agregarGrupoOrg()">＋ Grupo</button>
          </div>
        </div>
        <div id="orgList"></div>
      </div>

      <!-- Descripción: texto plano editable, sin tarjeta — igual que
           "Detalles" en la ficha publicada -->
      <div class="row-between"><h3>Detalles</h3></div>
      <textarea class="ev-desc cr-ev-desc" placeholder="Descripción de tu evento…" oninput="draft.descripcion=this.value">${esc(draft.descripcion)}</textarea>

      <!-- Código de vestimenta y costo como chips — igual que los
           .detail-chips de la ficha publicada -->
      <div class="detail-chips">
        <label class="dchip cr-dchip-edit"><span>${icon('dress', 'mute')} Código</span><input id="cvDress" value="${esc(draft.dressCode)}" placeholder="Libre" oninput="draft.dressCode=this.value"></label>
        <label class="dchip cr-dchip-edit"><span>${icon('dollar', 'mute')} Entrada</span><input id="cvCosto" value="${esc(draft.costo)}" placeholder="Gratis" oninput="draft.costo=this.value"></label>
      </div>

      <!-- Chips rápidos -->
      <div class="quick-chips">
        <button class="chip" onclick="agregarLinkEvento()">＋ Link</button>
        <button class="chip" onclick="agregarLinkEvento('playlist')">＋ Playlist</button>
        <button class="chip" onclick="agregarPregunta()">＋ Pregunta</button>
        <button class="chip" onclick="toggleMapa()">${mostrarMapa ? '－' : '＋'} Mapa del lugar</button>
      </div>
      ${draft.preguntas.length ? `<div class="preg-list">${draft.preguntas.map((p, i) => `<div class="preg-chip">${icon('quest', 'mute')} ${esc(p)}<span onclick="delPregunta(${i})">✕</span></div>`).join('')}</div>` : ''}
      ${draft.links.length ? `<div class="link-list">${draft.links.map((l, i) => `<a class="link-chip" href="${esc(urlSegura(l.url))}" target="_blank" rel="noopener">${icon(l.tipo === 'playlist' ? 'music' : 'link', 'mute')} ${esc(l.url)} <span onclick="event.preventDefault(); delLink(${i})">✕</span></a>`).join('')}</div>` : ''}

      <!-- Mapa del lugar (colapsable, con foto de fondo) -->
      <div id="mapaWrap" style="${mostrarMapa ? '' : 'display:none'}">
        <div class="row-between"><h3>Mapa del lugar</h3><span class="see-all" onclick="limpiarVenue()">Vaciar</span></div>
        <input type="file" accept="image/*" id="planoBgFile" hidden onchange="subirPlanoBg(event)">
        <div class="cover-actions">
          <button class="chip" onclick="document.getElementById('planoBgFile').click()">${icon('img', 'mute')} Foto de fondo</button>
          ${pisoActual().bg ? `<button class="chip" onclick="quitarPlanoBg()">Quitar foto</button>` : ''}
        </div>
        <div class="floor-tabs" id="floorTabs"></div>
        <div class="tool-row" id="toolRow"></div>
        <div class="venue" id="venue" onclick="venueTap(event)" onpointermove="venueMove(event)" onpointerup="venueDrop()" onpointerleave="venueDrop()" onwheel="venueWheel(event)">
          <div class="venue-inner" id="venueInner"><div class="venue-grid"></div></div>
          <span class="venue-hint" id="venueHint"></span>
          <div class="venue-zoom"><button onclick="zoomVenue(-1)">−</button><span id="zoomLabel">100%</span><button onclick="zoomVenue(1)">+</button></div>
        </div>
        <div class="venue-controls" id="venueControls"></div>
      </div>

      </div>
      <div class="cr-col-der">

      <!-- Boletos y zonas (con animación para boletos especiales) -->
      <div class="row-between"><h3>Boletos y zonas</h3><span class="see-all" id="capTotal"></span></div>
      <div id="boletosList"></div>
      <button class="add-zone" onclick="addBoleto()">＋ Agregar tipo de boleto</button>

      <!-- Acciones de anfitrión -->
      <div class="row-between" style="margin-top:24px"><h3>Acciones de anfitrión</h3></div>
      <div class="host-actions">
        <button class="ha ${draft.questionnaire ? 'on' : ''}" onclick="draft.questionnaire=!draft.questionnaire; this.classList.toggle('on')">${icon('doc', 'mute')} Cuestionario</button>
        <button class="ha ${draft.reminders ? 'on' : ''}" onclick="draft.reminders=!draft.reminders; this.classList.toggle('on')">${icon('clock', 'mute')} Recordatorios</button>
        <button class="ha ${draft.requireApproval ? 'on' : ''}" onclick="draft.requireApproval=!draft.requireApproval; this.classList.toggle('on')">${icon('check', 'mute')} Requiere aprobación</button>
        <button class="ha" onclick="abrirAjustesEvento()">⋯ Más</button>
      </div>

      <!-- Publicaciones (varias a la vez) -->
      <div class="row-between" style="margin-top:24px"><h3>Publicaciones</h3></div>
      <div class="post-compose">
        <textarea id="newsInput" placeholder="Escribe una publicación…" rows="1"></textarea>
        <div id="newsThumbs" class="news-thumbs"></div>
        <div class="post-compose-bar">
          <input type="file" accept="image/*,video/*" multiple id="newsFile" hidden onchange="adjuntarNoticia(event)">
          <button class="post-attach" onclick="document.getElementById('newsFile').click()">📎 Fotos / videos</button>
          <span id="newsAttachInfo" class="post-attach-info"></span>
          <button class="add-btn" onclick="addNoticia()">Publicar</button>
        </div>
      </div>
      <div class="news-list" id="newsList"></div>

      <button class="btn full" style="margin:24px 0" onclick="guardarFiesta()">${editando ? 'Guardar cambios' : 'Publicar evento'}</button>
      </div>
    </div>
  `;

  // Barra Tema/Efecto/Ajustes: vive a NIVEL DEL BODY para que SIEMPRE flote
  // (ninguna animación de pantalla puede afectar su position:fixed)
  let tb = document.getElementById('crearToolbar');
  if (!tb) { tb = document.createElement('div'); tb.id = 'crearToolbar'; tb.className = 'crear-toolbar'; document.body.appendChild(tb); }
  tb.innerHTML = `
    <button onclick="abrirTemas()" aria-label="Tema"><span class="ct-ico" style="background:${t.grad}"></span></button>
    <button class="${efxOn ? 'on' : ''}" onclick="abrirEfectos()" aria-label="Efecto"><span class="ct-fx">${icon('spark')}</span></button>
    <button onclick="abrirAjustesEvento()" aria-label="Ajustes"><span class="ct-fx">${icon('gear')}</span></button>
    <button onclick="vistaPreviaEvento()" aria-label="Vista previa"><span class="ct-fx">${icon('eye')}</span></button>
  `;

  pintarBoletos();
  pintarOrganizadores();
  pintarNoticias();
  pintarNewsThumbs();
  pintarEfecto();
  if (mostrarMapa) { pintarFloors(); pintarTools(); pintarVenue(); pintarControls(); }
}

// Efectos con partículas REALES (se ven naturales, no degradados).
// Sin argumentos pinta el efecto del borrador a nivel del body (pantalla de
// crear); con (efecto, destino) pinta dentro de otro contenedor (la vista
// completa del evento usa el suyo, sin pisar las capas del body).
function pintarEfecto(efecto, destino) {
  destino = destino || document.body;
  destino.querySelectorAll(':scope > .efx-layer').forEach((n) => n.remove());
  const e = efecto !== undefined ? efecto : draft.efecto;
  if (!e || e === 'ninguno' || e === 'neon') return; // neón vive en las tarjetas, no en una capa
  // La capa vive a NIVEL DEL CONTENEDOR (como la barra y #temaBg): si viviera
  // dentro de la pantalla, cualquier transform de esta rompería su
  // position:fixed y las partículas se quedarían pegadas arriba al hacer scroll.
  const layer = document.createElement('div');
  layer.className = 'efx-layer efx-' + e;
  destino.appendChild(layer);
  if (e === 'grano') layer.insertAdjacentHTML('beforeend', '<div class="efx-vhs-band"></div>');
  const conParticulas = ['destellos', 'confeti', 'burbujas', 'nieve', 'corazones', 'rayos', 'lluvia', 'luciernagas', 'laser', 'bengalas'];
  if (!conParticulas.includes(e)) return; // humo/grano/aurora/estrobo son solo capas CSS
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const cols = ['#f43f5e', '#fb7185', '#fbbf24', '#facc15', '#34d399', '#22d3ee', '#38bdf8', '#a855f7', '#f472b6', '#ffffff'];
  const counts = { confeti: 34, burbujas: 26, destellos: 42, nieve: 44, corazones: 24, rayos: 5, lluvia: 64, luciernagas: 18, laser: 9, bengalas: 54 };
  const n = counts[e];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    // Distribución PAREJA a lo ancho (ambos lados), no aleatoria que se amontona
    const leftPct = ((i + rnd(0.12, 0.88)) / n) * 100;
    // Profundidad: ~30% de partículas "lejos" (chicas, difusas, lentas) y
    // ~20% "cerca" (grandes, rápidas). Da tridimensionalidad, no lluvia plana.
    const prof = Math.random();
    const lejos = prof < 0.3, cerca = prof > 0.8;
    const kProf = lejos ? 0.62 : cerca ? 1.45 : 1;          // escala de tamaño
    const kDur = lejos ? 1.45 : cerca ? 0.78 : 1;           // lejos cae más lento
    const blur = lejos ? 'filter:blur(1.6px);' : '';
    if (e === 'destellos') {
      const sz = rnd(3, 8) * kProf;
      s.className = 'efp-spark ' + pick(['', '', 'star']);
      s.style.cssText = `${blur}left:${leftPct}%;top:${rnd(0, 100)}%;width:${sz}px;height:${sz}px;animation-duration:${rnd(1, 2.6)}s;animation-delay:${rnd(0, 2.5)}s`;
    } else if (e === 'confeti') {
      // confeti REAL: tiras de papel (rectángulos/listones), nada de puntos
      const ribbon = Math.random() < 0.4;
      const w = (ribbon ? rnd(3, 5) : rnd(7, 12)) * kProf;
      const h = (ribbon ? rnd(16, 28) : rnd(12, 20)) * kProf;
      const cd = rnd(2.6, 5) * kDur;
      s.className = 'efp-conf';
      s.style.cssText = `${blur}left:${leftPct}%;width:${w}px;height:${h}px;background:${pick(cols)};--sway:${rnd(-70, 70)}px;animation-duration:${cd}s;animation-delay:-${rnd(0, cd)}s`;
    } else if (e === 'burbujas') {
      const sz = rnd(10, 28) * kProf;
      const bd = rnd(4, 8) * kDur;
      s.className = 'efp-bub';
      s.style.cssText = `${blur}left:${leftPct}%;width:${sz}px;height:${sz}px;--sway:${rnd(-30, 30)}px;animation-duration:${bd}s;animation-delay:-${rnd(0, bd)}s`;
    } else if (e === 'rayos') {
      // reflectores de disco: repartidos a lo ancho (ambos lados) y siempre moviéndose
      const c = pick(['56,189,248', '168,85,247', '244,114,182', '34,211,238', '255,255,255']);
      const dur = rnd(4, 7);
      s.className = 'efp-beam';
      s.style.cssText = `left:${leftPct}%;--swing:${rnd(16, 32)}deg;background:linear-gradient(180deg, rgba(${c},.28), rgba(${c},.05) 70%, transparent 90%);animation-duration:${dur}s;animation-delay:-${rnd(0, dur)}s`;
    } else if (e === 'nieve') {
      // copos de nieve suaves (puntos blancos difusos, no emoji)
      const sz = rnd(3, 7) * kProf;
      const ed = rnd(6, 13) * kDur;
      s.className = 'efp-snow';
      s.style.cssText = `${blur}left:${leftPct}%;width:${sz}px;height:${sz}px;opacity:${rnd(0.5, 0.95).toFixed(2)};--sway:${rnd(-40, 40)}px;animation-duration:${ed}s;animation-delay:-${rnd(0, ed)}s`;
    } else if (e === 'lluvia') {
      // gotas: rayitas finas que caen rápido, ligeramente inclinadas
      const h = rnd(12, 22) * kProf;
      const ld = rnd(0.7, 1.3) * kDur;
      s.className = 'efp-rain';
      s.style.cssText = `${blur}left:${leftPct}%;height:${h}px;--sway:${rnd(-26, 6)}px;animation-duration:${ld}s;animation-delay:-${rnd(0, ld)}s`;
    } else if (e === 'laser') {
      // láseres de antro: líneas delgadas saturadas que barren desde arriba
      const c = pick(['0,255,140', '255,0,170', '0,210,255', '255,230,0', '170,80,255']);
      const dur = rnd(1.6, 3.4);
      s.className = 'efp-laser';
      s.style.cssText = `left:${leftPct}%;--swing:${rnd(24, 46)}deg;background:linear-gradient(180deg, rgba(${c},.9), rgba(${c},.25) 70%, transparent);box-shadow:0 0 6px rgba(${c},.8), 0 0 18px rgba(${c},.4);animation-duration:${dur}s;animation-delay:-${rnd(0, dur)}s`;
    } else if (e === 'bengalas') {
      // bengalas frías (como en las mesas del antro): chispas que brotan
      // hacia arriba desde 3 fuentes y se apagan
      const cx2 = pick([18, 50, 82]) + rnd(-4, 4);
      const bd = rnd(0.8, 1.7);
      const sz = rnd(1.8, 3.2);
      s.className = 'efp-chispa';
      s.style.cssText = `left:${cx2.toFixed(1)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;--dx:${rnd(-46, 46).toFixed(0)}px;--alto:${rnd(-46, -24).toFixed(0)}vh;animation-duration:${bd.toFixed(2)}s;animation-delay:-${rnd(0, bd).toFixed(2)}s`;
    } else if (e === 'luciernagas') {
      // puntitos ámbar que vagan lento y parpadean (dos animaciones)
      const sz = rnd(3, 5.5) * kProf;
      const wd = rnd(5, 9), bd = rnd(2.4, 4.5);
      s.className = 'efp-fly';
      s.style.cssText = `left:${leftPct}%;top:${rnd(6, 92)}%;width:${sz}px;height:${sz}px;--dx:${rnd(-60, 60)}px;--dy:${rnd(-70, 50)}px;animation-duration:${wd}s,${bd}s;animation-delay:-${rnd(0, wd)}s,-${rnd(0, bd)}s`;
    } else {
      // corazones: caen con vaivén suave (no giran como rehilete)
      s.className = 'efp-emoji efp-heart';
      s.textContent = pick(['💜', '💙', '💖', '🩵']);
      const ed = rnd(4, 8) * kDur;
      s.style.cssText = `${blur}left:${leftPct}%;font-size:${rnd(13, 22) * kProf}px;--sway:${rnd(-50, 50)}px;animation-duration:${ed}s;animation-delay:-${rnd(0, ed)}s`;
    }
    layer.appendChild(s);
  }
  // Nieve: montículo de nieve que se va acumulando abajo
  if (e === 'nieve') {
    const pila = document.createElement('div');
    pila.className = 'efx-snow-pile';
    layer.appendChild(pila);
  }
}

/* --- Acciones de la página de creación --- */
function salirCrear() { document.body.classList.remove('creando'); irA('home'); }
// Junta fecha/hora en un texto legible para mostrar en el evento
function syncFecha() {
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  if (!draft.fechaInicio) { draft.fecha = ''; return; }
  const d = new Date(draft.fechaInicio + 'T00:00');
  let s = `${['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
  if (draft.horaInicio && draft.horaInicio.trim()) s += ` · ${draft.horaInicio.trim()}`;
  draft.fecha = s;
}
// Selector de tipografías (se abre, no se muestran todas de una)
function abrirTipografias() {
  abrirSheet('Tipografía del título', `
    <div class="font-list">
      ${FONTS.map((f) => `<button class="font-item ${f.id === draft.tituloFont ? 'on' : ''}" style="font-family:${f.css}" onclick="setTituloFont('${f.id}'); cerrarSheet()">${draft.nombre || 'Tu evento'}<small>${f.nombre}</small></button>`).join('')}
    </div>
  `);
}
// Elegir animación de un boleto especial
function abrirBoletoAnim(i) {
  abrirSheet('Animación del boleto', `
    <p class="hint">Dale un estilo especial a este boleto.</p>
    <div class="efx-grid">
      <button class="efx-opt ${!draft.boletos[i].animado ? 'on' : ''}" onclick="setBoletoAnim(${i}, null)"><span>🚫</span>Ninguna</button>
      ${BOLETO_ANIMS.map((a) => `<button class="efx-opt ${draft.boletos[i].animado && draft.boletos[i].anim === a.id ? 'on' : ''}" onclick="setBoletoAnim(${i}, '${a.id}')"><span class="ba-prev bx-${a.id}"></span>${a.nombre}</button>`).join('')}
    </div>
  `);
}
function setBoletoAnim(i, id) {
  draft.boletos[i].animado = !!id;
  draft.boletos[i].anim = id || null;
  cerrarSheet();
  pintarBoletos();
}
// Paletas de color animado para el título (se eligen en un recuadro)
const ANIM_PALETTES = [
  ['#2f7bff', '#38bdf8', '#a855f7', '#22d3ee'],
  ['#f43f5e', '#fb923c', '#fbbf24'],
  ['#34d399', '#22d3ee', '#38bdf8'],
  ['#a855f7', '#ec4899', '#f472b6'],
  ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a855f7'],
  ['#fbbf24', '#fde68a', '#f59e0b'],
  ['#22d3ee', '#a855f7', '#f472b6'],
  ['#e2e8f0', '#94a3b8', '#cbd5e1']
];
// Abre el recuadro para elegir un color animado (varias paletas)
function abrirColorAnim() {
  const cur = (draft.cover.anim || []).join(',');
  abrirSheet('Color animado', `
    <div class="anim-grid">
      ${ANIM_PALETTES.map((p, i) => `<button class="anim-swatch ${p.join(',') === cur ? 'on' : ''}" style="background:linear-gradient(90deg,${p.join(',')})" onclick="setAnimPalette(${i})"></button>`).join('')}
    </div>
    <div class="sheet-actions"><button class="btn-ghost full" onclick="quitarTituloAnim()">Quitar color animado</button></div>
  `);
}
function setAnimPalette(i) { draft.cover.anim = ANIM_PALETTES[i].slice(); cerrarSheet(); pintarCrear(); }
function quitarTituloAnim() { draft.cover.anim = []; cerrarSheet(); pintarCrear(); }
// Elegir tipo de efecto
function abrirEfectos() {
  abrirSheet('Efecto del fondo', `
    <div class="efx-grid">
      ${EFECTOS.map((e) => `<button class="efx-opt ${e.id === draft.efecto ? 'on' : ''}" onclick="setEfecto('${e.id}')"><span>${e.emoji}</span>${e.nombre}</button>`).join('')}
    </div>
  `);
}
function setEfecto(id) { draft.efecto = id; cerrarSheet(); pintarCrear(); }
// Agregar un grupo de organizadores como co-anfitriones
function agregarGrupoOrg() {
  const grupos = DATA.grupos || [];
  if (!grupos.length) { toast('Primero crea un grupo en Amigos 👥'); return; }
  abrirSheet('Agregar grupo', `
    <p class="hint">Suma todo un grupo como co‑anfitriones.</p>
    <div class="grupo-list">
      ${grupos.map((g) => `<button class="grupo-card" onclick="usarGrupoOrg('${g.id}')">
        <span class="grupo-emoji" style="background:${g.color}">${g.emoji}</span>
        <span class="grupo-main"><strong>${g.nombre}</strong><small>${g.miembros.length} organizadores</small></span>
      </button>`).join('')}
    </div>
  `);
}
function usarGrupoOrg(id) {
  const g = (DATA.grupos || []).find((x) => x.id === id);
  if (!g) return;
  g.miembros.forEach((m) => {
    if (m.nombre !== DATA.usuario.nombre && !draft.organizadores.some((o) => o.nombre === m.nombre))
      draft.organizadores.push({ nombre: m.nombre, avatar: m.avatar });
  });
  cerrarSheet();
  pintarCrear();
  toast(`Grupo "${g.nombre}" agregado`);
}
function setTituloFont(id) { draft.tituloFont = id; pintarCrear(); }
function toggleMapa() { mostrarMapa = !mostrarMapa; pintarCrear(); }
function agregarCoanfitrion() {
  abrirSheet('Agregar co‑anfitriones', `
    <p class="hint">Toca a tus amigos para sumarlos como organizadores.</p>
    <div class="chips-row mini wrap">
      ${DATA.amigos.map((a) => `<button class="chip" onclick="addOrgObj('${a.nombre}','${a.avatar}','${a.color}'); cerrarSheet()">${a.avatar} ${a.nombre.split(' ')[0]}</button>`).join('')}
    </div>
  `);
}
async function agregarLinkEvento(tipo) {
  const url = await pedirTexto(tipo === 'playlist' ? 'Pega el link de la playlist' : 'Pega un link', { placeholder: 'https://…', ok: 'Agregar' });
  if (!url) return;
  const limpio = urlSegura(url);
  if (!limpio) { toast('Ese link no es válido'); return; }
  draft.links.push({ tipo: tipo || 'link', url: limpio });
  pintarCrear();
}
function delLink(i) { draft.links.splice(i, 1); pintarCrear(); }
// Preguntas para los invitados (estilo Partiful)
async function agregarPregunta() {
  const q = await pedirTexto('Pregunta para tus invitados', { placeholder: '¿Qué traes a la fiesta?', ok: 'Agregar' });
  if (!q || !q.trim()) return;
  draft.preguntas.push(q.trim());
  pintarCrear();
}
function delPregunta(i) { draft.preguntas.splice(i, 1); pintarCrear(); }

// Elegir tema de fondo. "Tus colores" va HASTA ARRIBA: un toque lo equipa
// y el lápiz abre el editor de colores. Cada mosaico trae VISTA PREVIA REAL:
// un div con la clase tema-<slug> renderiza la escena completa (bola disco,
// llamas, auroras…) en miniatura y ANIMADA, no solo el gradiente.
function abrirTemas() {
  const idxC = TEMAS.findIndex((t) => t.custom);
  const orden = [idxC, ...TEMAS.map((_, i) => i).filter((i) => i !== idxC)];
  // Apartado de COLOR arriba: los temas que aceptan cambio de color
  // (Disco, Llamas) se recolorean aquí mismo, sin abrir otro panel
  const colorables = [
    { slug: 'disco', nombre: 'Disco', colores: DISCO_COLORES, cur: draft.discoHue },
    { slug: 'llamas', nombre: 'Llamas', colores: LLAMA_COLORES, cur: draft.llamaHue },
  ];
  abrirSheet('Tema del evento', `
    <div class="tc-top">
      <p class="hint">Color del tema (los que se pueden cambiar):</p>
      ${colorables.map((c) => `
        <div class="tc-row">
          <small class="tc-name">${c.nombre}</small>
          <div class="disco-dots">
            ${c.colores.map((o) => `
              <button class="disco-dot ${String(c.cur) === String(o.hue) ? 'on' : ''}"
                style="background:${o.c}" title="${o.nombre}"
                onclick="setHueTema('${c.slug}', ${typeof o.hue === 'number' ? o.hue : `'${o.hue}'`}, this)"></button>`).join('')}
          </div>
        </div>`).join('')}
    </div>
    <div class="tema-grid">
      ${orden.map((i) => {
        const t = TEMAS[i];
        const tt = t.custom ? customTema(draft.temaColors, draft.temaAnim) : t;
        const anim = t.custom && draft.temaAnim ? ' anim' : '';
        const slug = temaSlug(t.nombre);
        // Temas con video: la vista previa también es el VIDEO real
        const tv = TEMA_VIDEOS[slug];
        // Disco/Llamas: la vista previa sale del color elegido
        const hueVal = slug === 'disco' ? draft.discoHue : slug === 'llamas' ? draft.llamaHue : 0;
        const hueAttr = (slug === 'disco' || slug === 'llamas')
          ? (hueVal === 'anim' ? ' class="vfx-hue"' : (hueVal ? ` style="filter:hue-rotate(${hueVal}deg)"` : ''))
          : '';
        const video = tv ? `<video${hueAttr} src="${tv.src}" data-rate="${tv.rate}" muted loop autoplay playsinline></video>` : '';
        return `
        <button class="tema-swatch ${i === draft.tema ? 'on' : ''}" onclick="setTema(${i})">
          <span class="tema-prev tema-${slug}${anim}" style="background:${tt.bg}">${video}</span>
          ${t.custom ? `<span class="tema-edit" onclick="event.stopPropagation(); abrirTemaCustom()" title="Cambiar colores">✎</span>` : ''}
          ${slug === 'disco' ? `<span class="tema-edit" onclick="event.stopPropagation(); abrirDiscoColor()" title="Color de las luces">✎</span>` : ''}
          ${slug === 'llamas' ? `<span class="tema-edit" onclick="event.stopPropagation(); abrirLlamaColor()" title="Color de las llamas">✎</span>` : ''}
          <span class="tema-pill" style="background:${tt.grad}"></span>
          <small>${t.custom ? '🎨 ' : ''}${t.nombre}</small>
        </button>`;
      }).join('')}
    </div>
  `);
  // Los videos de la vista previa van a su velocidad y arrancan aunque el
  // autoplay del markup se quede dormido
  document.querySelectorAll('.tema-prev video').forEach((v) => {
    v.playbackRate = +v.dataset.rate || 1;
    v.play().catch(() => {});
  });
}
// Cambia el color de un tema coloreable DESDE el selector de temas: marca
// el punto, recolorea la vista previa del mosaico y (si ese tema ya está
// puesto) también el fondo en vivo
function setHueTema(slug, hue, btn) {
  if (slug === 'disco') draft.discoHue = hue; else draft.llamaHue = hue;
  const aplicar = slug === 'disco' ? aplicarDiscoHue : aplicarLlamaHue;
  btn.parentElement.querySelectorAll('.disco-dot').forEach((d) => d.classList.remove('on'));
  btn.classList.add('on');
  aplicar(document.querySelector(`.tema-prev.tema-${slug} video`));
  if (temaSlug((TEMAS[draft.tema] || {}).nombre || '') === slug) {
    aplicar(document.querySelector('#temaBg video'));
  }
}
function setTema(i) {
  const tt = TEMAS[i].custom ? customTema(draft.temaColors) : TEMAS[i];
  draft.tema = i;
  draft.cover.grad = tt.grad;
  cerrarSheet();
  pintarCrear();
  toast(`Tema: ${tt.nombre}`);
}

// --- Tema personalizado: elegir 1 o 2 colores (y si fluye animado) ---
function abrirTemaCustom() {
  const dos = draft.temaColors.length > 1;
  const t = customTema(draft.temaColors, draft.temaAnim);
  abrirSheet('Tus colores', `
    <p class="hint">Elige 1 o 2 colores y armamos un fondo suave y sedoso con ellos (para quienes no quieren fondos tan llenos).</p>
    <div class="cc-row">
      <label class="cc-swatch" style="background:${draft.temaColors[0]}">
        <input type="color" value="${draft.temaColors[0]}" oninput="setColorCustom(0, this.value)">
      </label>
      ${dos ? `
        <label class="cc-swatch" style="background:${draft.temaColors[1]}">
          <input type="color" value="${draft.temaColors[1]}" oninput="setColorCustom(1, this.value)">
        </label>
        <button class="chip" onclick="quitarColorCustom()">✕ Solo un color</button>`
      : `<button class="chip" onclick="agregarColorCustom()">＋ Segundo color</button>`}
      <button class="chip ${draft.temaAnim ? 'is-active' : ''}" onclick="toggleTemaAnim()">${icon('spark')} Animado</button>
    </div>
    <div class="cc-prev ${draft.temaAnim ? 'anim' : ''}" id="ccPrev" style="background:${t.bg}"></div>
    <button class="btn full" onclick="aplicarTemaCustom()">Usar estos colores</button>
  `);
}
function setColorCustom(i, v) {
  draft.temaColors[i] = v;
  const prev = document.getElementById('ccPrev');
  if (prev) prev.style.background = customTema(draft.temaColors, draft.temaAnim).bg;
  const sw = document.querySelectorAll('.cc-swatch')[i];
  if (sw) sw.style.background = v;
  // Si ya está activo, el fondo de la página se actualiza en vivo
  if ((TEMAS[draft.tema] || {}).custom) {
    const bg = document.getElementById('temaBg');
    if (bg) bg.style.background = customTema(draft.temaColors, draft.temaAnim).bg;
  }
}
// El fondo personalizado puede FLUIR animado entre los colores elegidos
function toggleTemaAnim() {
  draft.temaAnim = !draft.temaAnim;
  abrirTemaCustom();
  if ((TEMAS[draft.tema] || {}).custom) pintarCrear();
}
function agregarColorCustom() {
  draft.temaColors[1] = mixHex(draft.temaColors[0], '#38bdf8', 0.6);
  abrirTemaCustom();
}
function quitarColorCustom() {
  draft.temaColors = [draft.temaColors[0]];
  abrirTemaCustom();
}
function aplicarTemaCustom() {
  draft.tema = TEMAS.findIndex((t) => t.custom);
  draft.cover.grad = customTema(draft.temaColors).grad;
  cerrarSheet();
  pintarCrear();
  toast('Tema: tus colores 🎨');
}

// --- Disco: elegir el COLOR de las luces (un filtro gira el tono del video;
// 'anim' = multicolor, los colores van rotando solos) ---
function abrirDiscoColor() {
  abrirSheet('Luces del disco', `
    <p class="hint">Elige de qué color se ven las luces de la bola de espejos, o multicolor para que vayan cambiando solas.</p>
    <div class="disco-prev"><video id="discoPrevVid" src="${TEMA_VIDEOS.disco.src}" muted loop autoplay playsinline></video></div>
    <div class="disco-dots">
      ${DISCO_COLORES.map((d) => `
        <button class="disco-dot ${draft.discoHue === d.hue ? 'on' : ''}" style="background:${d.c}" title="${d.nombre}"
          onclick="setDiscoHue(${typeof d.hue === 'number' ? d.hue : `'anim'`})"></button>`).join('')}
    </div>
    <button class="btn full" onclick="aplicarDiscoColor()">Usar este color</button>
  `);
  const pv = document.getElementById('discoPrevVid');
  aplicarDiscoHue(pv);
  pv.play().catch(() => {});
}
function setDiscoHue(h) {
  draft.discoHue = h;
  aplicarDiscoHue(document.getElementById('discoPrevVid'));
  document.querySelectorAll('.disco-dot').forEach((b, i) => b.classList.toggle('on', DISCO_COLORES[i].hue === h));
  // Si Disco ya está de fondo, el color cambia EN VIVO
  if (temaSlug((TEMAS[draft.tema] || {}).nombre) === 'disco') aplicarDiscoHue(_videoPool.disco);
}
function aplicarDiscoColor() {
  draft.tema = TEMAS.findIndex((t) => temaSlug(t.nombre) === 'disco');
  cerrarSheet();
  pintarCrear();
  toast('Luces del disco 🪩');
}

function abrirLlamaColor() {
  abrirSheet('Color de las llamas', `
    <p class="hint">Elige de qué color se ven las llamas, o multicolor para que vayan cambiando solas.</p>
    <div class="disco-prev"><video id="llamaPrevVid" src="${TEMA_VIDEOS.llamas.src}" muted loop autoplay playsinline></video></div>
    <div class="disco-dots">
      ${LLAMA_COLORES.map((d) => `
        <button class="disco-dot ${draft.llamaHue === d.hue ? 'on' : ''}" style="background:${d.c}" title="${d.nombre}"
          onclick="setLlamaHue(${typeof d.hue === 'number' ? d.hue : `'anim'`})"></button>`).join('')}
    </div>
    <button class="btn full" onclick="aplicarLlamaColor()">Usar este color</button>
  `);
  const pv = document.getElementById('llamaPrevVid');
  aplicarLlamaHue(pv);
  pv.play().catch(() => {});
}
function setLlamaHue(h) {
  draft.llamaHue = h;
  aplicarLlamaHue(document.getElementById('llamaPrevVid'));
  document.querySelectorAll('.disco-dot').forEach((b, i) => b.classList.toggle('on', LLAMA_COLORES[i].hue === h));
  // Si Llamas ya está de fondo, el color cambia EN VIVO
  if (temaSlug((TEMAS[draft.tema] || {}).nombre) === 'llamas') aplicarLlamaHue(_videoPool.llamas);
}
function aplicarLlamaColor() {
  draft.tema = TEMAS.findIndex((t) => temaSlug(t.nombre) === 'llamas');
  cerrarSheet();
  pintarCrear();
  toast('Color de las llamas 🔥');
}

// Ajustes del evento (público, edad, etc.)
function abrirAjustesEvento() {
  abrirSheet('Ajustes del evento', `
    <div class="set-list">
      <label class="set-row"><div><strong>Evento público</strong><small>Aparece en el feed</small></div>
        <span class="toggle ${draft.publico ? 'is-on' : ''}" onclick="draft.publico=!draft.publico; this.classList.toggle('is-on')"><span class="toggle-knob"></span></span></label>
      <label class="set-row"><div><strong>Próximamente</strong><small>Crea expectativa sin fecha</small></div>
        <span class="toggle ${draft.proximamente ? 'is-on' : ''}" onclick="draft.proximamente=!draft.proximamente; this.classList.toggle('is-on')"><span class="toggle-knob"></span></span></label>
      <label class="set-row"><div><strong>Requiere aprobación</strong><small>Tú apruebas a los invitados</small></div>
        <span class="toggle ${draft.requireApproval ? 'is-on' : ''}" onclick="draft.requireApproval=!draft.requireApproval; this.classList.toggle('is-on')"><span class="toggle-knob"></span></span></label>
      <div class="set-row col">
        <div><strong>Quién ve la lista de invitados</strong><small>Tú ves todo; los invitados solo ven a sus propios amigos</small></div>
        <div class="chips-row mini">
          ${[['confirmados','Solo confirmados'],['nadie','Solo yo'],['todos','Todos']].map(([v, t]) => `
            <button class="chip ${(draft.listaVisible || 'confirmados') === v ? 'is-active' : ''}"
                    onclick="draft.listaVisible='${v}'; abrirAjustesEvento()">${t}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="sheet-actions"><button class="btn full" onclick="cerrarSheet()">Listo</button></div>
  `);
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
    <div class="row-between"><h3>Boletos y zonas</h3><span class="see-all" id="capTotal"></span></div>
    <p class="hint">Crea distintos boletos: general, VIP, zonas exclusivas…</p>
    <div id="boletosList"></div>
    <button class="add-zone" onclick="addBoleto()">＋ Agregar tipo de boleto</button>`;
  if (paso === 3) return `
    <div class="row-between"><h3>Organizadores</h3></div>
    <p class="hint">Agrega a tu equipo para que la gente vea qué perfiles organizan.</p>
    <div class="guest-add">
      <input id="orgInput" placeholder="Nombre del organizador" onkeydown="if(event.key==='Enter') addOrganizador()">
      <button class="add-btn" onclick="addOrganizador()">Añadir</button>
    </div>
    <p class="filtro-label" style="margin-top:6px">Sugerencias</p>
    <div class="chips-row mini wrap">
      ${DATA.amigos.map((a) => `<button class="chip" onclick="addOrgObj('${a.nombre}','${a.avatar}','${a.color}')">${a.avatar} ${a.nombre.split(' ')[0]}</button>`).join('')}
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
             onpointerdown="coverGrab(event,${i})" onclick="selCoverText(event,${i})">${esc(t.texto)}</div>`).join('')}
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
      <input class="field-input" value="${esc(draft.nombre)}" placeholder="Ej: Summer Rooftop"
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
      <span class="filtro-label" style="margin:0">Color animado</span>
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
      <input class="field-input" value="${esc(draft.lugar)}" placeholder="Ej: Terraza Skyline" oninput="draft.lugar=this.value">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Ciudad</label>
      <input class="field-input" value="${draft.ciudad}" placeholder="Ej: Polanco" oninput="draft.ciudad=this.value">
    </div></div>
    <button class="maps-btn" onclick="toast('Vista en Google Maps · próximamente 🗺️')">📍 Ver el lugar en Google Maps</button>

    <div class="mini-toggle-row">
      <span>Marcar como “Próximamente”</span>
      <button class="toggle ${draft.proximamente ? 'is-on' : ''}" onclick="draft.proximamente=!draft.proximamente; this.classList.toggle('is-on')"><span class="toggle-knob"></span></button>
    </div>

    <div class="mini-toggle-row">
      <span>Solo mayores (18+)</span>
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
    <div class="row-between"><h3>Plano del antro</h3><span class="see-all" onclick="limpiarVenue()">Vaciar piso</span></div>
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
    <div class="row-between"><h3>Lista de ingreso</h3><span class="see-all" id="guestCount"></span></div>
    <div class="guest-add">
      <input id="guestInput" placeholder="Nombre del invitado" onkeydown="if(event.key==='Enter') addGuest()">
      <button class="add-btn" onclick="addGuest()">Añadir</button>
    </div>
    <div class="guest-list" id="guestList"></div>

    <div class="row-between" style="margin-top:24px"><h3>Publicaciones del evento</h3></div>
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
  ['coverTitle', 'cvTitulo'].forEach((id) => {
    const t = document.getElementById(id);
    if (t) {
      t.classList.remove('name-anim');
      t.style.backgroundImage = '';
      t.style.webkitTextFillColor = c;
      t.style.color = c;
    }
  });
  const sw = document.querySelector('.tt-color');
  if (sw) sw.style.background = c;
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

async function addCoverText() {
  const texto = await pedirTexto('Texto a mostrar en la portada', { ok: 'Agregar' });
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
async function editCoverText() {
  const t = draft.cover.textos[draft.coverSel];
  if (!t) return;
  const nuevo = await pedirTexto('Editar texto', { valor: t.texto, ok: 'Guardar' });
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
  // Sin estado vacío: si no hay equipo, no ocupa espacio.
  // MISMA fila que el anfitrión (avatar de color + nombre, sin cajita).
  cont.innerHTML = draft.organizadores.map((o, i) => `
        <div class="org-row">
          <span class="host-ava" style="background:${o.color || 'var(--grad-cool)'}">${o.avatar}</span>
          <strong>${o.nombre}</strong>
          <button class="guest-del" onclick="delOrganizador(${i})">✕</button>
        </div>`).join('');
}
function addOrganizador() {
  const inp = document.getElementById('orgInput');
  const nombre = inp.value.trim();
  if (!nombre) return;
  draft.organizadores.push({ nombre, avatar: '🎤' });
  inp.value = '';
  pintarOrganizadores();
}
function addOrgObj(nombre, avatar, color) {
  if (draft.organizadores.some((o) => o.nombre === nombre)) return;
  draft.organizadores.push({ nombre, avatar, color: color || 'var(--grad-cool)' });
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
  cont.innerHTML = draft.boletos.map((b, i) => {
    const animName = b.animado ? (BOLETO_ANIMS.find((a) => a.id === b.anim) || {}).nombre || 'Especial' : '';
    return `
    <div class="zona-card ${b.animado ? 'especial bx-' + (b.anim || 'oro') : ''}">
      <div class="zona-top">
        <input class="zona-name" value="${esc(b.nombre)}" placeholder="Nombre (ej: VIP)" oninput="draft.boletos[${i}].nombre=this.value">
        ${draft.boletos.length > 1 ? `<button class="guest-del" onclick="delBoleto(${i})">✕</button>` : ''}
      </div>
      <div class="zona-fields">
        <div class="zona-f"><label>Precio $</label>
          <input type="number" value="${b.precio}" oninput="draft.boletos[${i}].precio=+this.value||0"></div>
        <div class="zona-f"><label>Cantidad</label>
          <input type="number" value="${b.cantidad}" oninput="draft.boletos[${i}].cantidad=+this.value||0; actualizarCapTotal()"></div>
      </div>
      <button class="boleto-fx ${b.animado ? 'on' : ''}" onclick="abrirBoletoAnim(${i})">${icon('spark', 'mute')} ${b.animado ? `Animación: ${animName}` : 'Boleto especial (elige animación)'}</button>
    </div>`;
  }).join('');
  actualizarCapTotal();
}
function actualizarCapTotal() {
  const total = draft.boletos.reduce((s, b) => s + (+b.cantidad || 0), 0);
  const el = document.getElementById('capTotal');
  if (el) el.textContent = `Cap. total: ${total}`;
  const mini = document.getElementById('capTotalMini');
  if (mini) mini.textContent = total;
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

// Foto de fondo del mapa del lugar
function subirPlanoBg(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { pisoActual().bg = reader.result; pintarCrear(); };
  reader.readAsDataURL(file);
}
function quitarPlanoBg() { pisoActual().bg = null; pintarCrear(); }

// --- Publicaciones (tipo Instagram: texto + foto/video) ---
let _newsMedia = [];  // adjuntos temporales del compositor (varios a la vez)
function adjuntarNoticia(ev) {
  const files = Array.from(ev.target.files || []);
  if (!files.length) return;
  let pend = files.length;
  files.forEach((file) => {
    const tipo = file.type.startsWith('video') ? 'video' : 'img';
    const reader = new FileReader();
    reader.onload = () => {
      _newsMedia.push({ tipo, url: reader.result });
      if (--pend === 0) { pintarNewsThumbs(); }
    };
    reader.readAsDataURL(file);
  });
  ev.target.value = '';
}
function pintarNewsThumbs() {
  const cont = document.getElementById('newsThumbs');
  if (!cont) return;
  cont.innerHTML = _newsMedia.map((m, i) => `
    <span class="news-thumb">${m.tipo === 'video' ? '🎬' : `<img src="${m.url}" alt="">`}<b onclick="quitarNewsMedia(${i})">✕</b></span>`).join('');
  const info = document.getElementById('newsAttachInfo');
  if (info) info.textContent = _newsMedia.length ? `${_newsMedia.length} adjunto(s)` : '';
}
function quitarNewsMedia(i) { _newsMedia.splice(i, 1); pintarNewsThumbs(); }
function unoMediaHTML(m) {
  return m.tipo === 'video'
    ? `<video class="post-media" src="${m.url}" controls playsinline></video>`
    : `<img class="post-media" src="${m.url}" alt="">`;
}
function mediaHTML(n) {
  const arr = Array.isArray(n.media) ? n.media : (n.media ? [n.media] : []);
  if (!arr.length) return '';
  return `<div class="post-gallery ${arr.length > 1 ? 'multi' : ''}">${arr.map(unoMediaHTML).join('')}</div>`;
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
          ${n.texto ? `<p class="post-text">${esc(n.texto)}</p>` : ''}
          ${mediaHTML(n)}
        </div>`).join('')
    : `<p class="empty">Aún no hay publicaciones. Comparte la primera 📣</p>`;
}
function addNoticia() {
  const inp = document.getElementById('newsInput');
  const texto = inp.value.trim();
  if (!texto && !_newsMedia.length) return;
  draft.noticias.unshift({ texto, media: _newsMedia.slice(), fecha: 'ahora' });
  inp.value = '';
  _newsMedia = [];
  pintarNewsThumbs();
  pintarNoticias();
  toast('Publicación añadida 📣');
}
function delNoticia(i) { draft.noticias.splice(i, 1); pintarNoticias(); }

// --- Guardar / publicar (crea o actualiza el evento) ---
// Convierte el borrador actual en el objeto de evento publicado
// (lo usan guardarFiesta y la VISTA PREVIA)
function draftAEvento() {
  const capacidad = draft.boletos.reduce((s, b) => s + (+b.cantidad || 0), 0);
  // Precio: el más barato de los boletos
  const precios = draft.boletos.map((b) => +b.precio || 0);
  const minPrecio = precios.length ? Math.min(...precios) : 0;
  return {
    nombre: draft.nombre.trim(),
    lugar: draft.lugar.trim() || 'Lugar por confirmar',
    ciudad: draft.ciudad.trim(),
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
    tema: draft.tema,
    temaColors: draft.temaColors.slice(),
    temaAnim: !!draft.temaAnim,
    discoHue: draft.discoHue,
    llamaHue: draft.llamaHue,
    efecto: draft.efecto,
    grupoId: draft.grupoId || null,
    tituloFont: draft.tituloFont,
    descripcion: draft.descripcion.trim(),
    dressCode: draft.dressCode.trim(),
    costo: draft.costo.trim(),
    requireApproval: draft.requireApproval,
    preguntas: draft.preguntas.slice(),
    links: draft.links.map((l) => ({ ...l })),
    proximamente: draft.proximamente,
    publico: draft.publico !== false,
    listaVisible: draft.listaVisible || 'confirmados',
    fecha: draft.proximamente ? 'Próximamente' : (draft.fecha.trim() || 'Fecha por confirmar'),
    // Campos crudos de fecha/hora y toggles: sin esto, al EDITAR el evento
    // los selectores regresaban vacíos
    fechaInicio: draft.fechaInicio, fechaFin: draft.fechaFin,
    horaInicio: draft.horaInicio, horaFin: draft.horaFin,
    questionnaire: !!draft.questionnaire, reminders: !!draft.reminders,
    capacidad,
    boletos: draft.boletos.map((b) => ({ ...b })),
    edadRango: draft.edad.activo ? { min: 18, max: draft.edad.max || null } : null,
    edad: '18+',
    noticias: draft.noticias.map((n) => ({ ...n })),
    precio: minPrecio > 0 ? `$${minPrecio}` : 'Gratis',
    cuando: 'semana'
  };
}

function guardarFiesta() {
  if (!draft.nombre.trim()) { toast('Ponle un nombre a tu fiesta'); return; }
  const campos = draftAEvento();

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

// VISTA PREVIA: abre la ficha del evento tal cual se verá ya publicado,
// SIN guardarlo (el evento temporal nunca toca el feed)
function vistaPreviaEvento() {
  const campos = draftAEvento();
  if (!campos.nombre) campos.nombre = 'Evento sin título';
  DATA.eventos = DATA.eventos.filter((e) => e.id !== '__preview');
  // El evento temporal vive SOLO mientras la vista está abierta (así los
  // botones de la ficha funcionan); cerrarEvento() lo borra y nunca toca
  // el feed porque la vista lo cubre todo
  DATA.eventos.push({ id: '__preview', asistentes: 0, cat: [], ...campos });
  abrirEvento('__preview');
  toast('Así se verá tu evento 👀');
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
  // Imagen de fondo del piso: se proporciona al 94% del mapa (sin recortar)
  const bg = pisoActual().bg;
  inner.style.backgroundImage = bg ? `url(${bg})` : '';
  inner.style.backgroundSize = bg ? '94% auto' : 'cover';
  inner.style.backgroundRepeat = 'no-repeat';
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
  const grupos = DATA.grupos || [];

  cont.innerHTML = `
    <header class="page-head row-between">
      <h1>Amigos</h1>
      <button class="icon-btn sm" onclick="toggleBuscarAmigos()" aria-label="Buscar">${icon('search')}</button>
    </header>

    <!-- Búsqueda (oculta hasta tocar el botón) -->
    <div class="search-bar friend-search" id="friendSearchBar" style="display:none">
      ${icon('search', 'mute')}
      <input id="friendSearch" placeholder="Busca por nombre o @usuario" oninput="filtrarAmigos(this.value)">
    </div>

    <!-- Grupos de organizadores -->
    <div class="row-between"><h3>Grupos</h3><button class="cal-link" onclick="crearGrupo()">＋ Crear grupo</button></div>
    <p class="hint">Junta a tu equipo para crear fiestas; todos pueden editarlas.</p>
    <div class="grupo-list">
      ${grupos.length ? grupos.map(tarjetaGrupo).join('') : `<p class="empty">Aún no tienes grupos. Crea uno con tus amigos 👥</p>`}
    </div>

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

// Mostrar/ocultar la barra de búsqueda de amigos
function toggleBuscarAmigos() {
  const bar = document.getElementById('friendSearchBar');
  if (!bar) return;
  const abrir = bar.style.display === 'none';
  bar.style.display = abrir ? 'flex' : 'none';
  if (abrir) setTimeout(() => document.getElementById('friendSearch')?.focus(), 50);
}

// Tarjeta de un grupo de organizadores
function tarjetaGrupo(g) {
  return `
    <button class="grupo-card" onclick="abrirGrupo('${g.id}')">
      <span class="grupo-emoji" style="background:${g.color}">${g.emoji}</span>
      <span class="grupo-main">
        <strong>${g.nombre}</strong>
        <small>${g.miembros.length} en el equipo${(g.comunidad || 0) ? ` · ${g.comunidad} en la comunidad` : ''}</small>
      </span>
      <span class="grupo-avas">${g.miembros.slice(0, 3).map((m) => `<span class="grupo-ava" style="background:${m.color}">${m.avatar}</span>`).join('')}</span>
    </button>`;
}

// Crear un grupo (elige nombre y amigos)
let _grupoSel = [];
function crearGrupo() {
  _grupoSel = [];
  abrirSheet('Nuevo grupo', `
    <div class="field"><div class="field-main">
      <label class="field-label">Nombre del grupo</label>
      <input class="field-input" id="grupoNombre" placeholder="Ej: La Crew">
    </div></div>
    <p class="form-label">Agrega organizadores</p>
    <div class="friend-list" id="grupoPick">
      ${DATA.amigos.map((a, i) => `
        <article class="friend-card" onclick="togglePickGrupo(${i}, this)">
          <div class="friend-ava" style="background:${a.color}">${a.avatar}</div>
          <div class="friend-main"><strong>${a.nombre}</strong><small>${a.usuario}</small></div>
          <span class="pick-check">○</span>
        </article>`).join('')}
    </div>
    <div class="sheet-actions"><button class="btn full" onclick="guardarGrupo()">Crear grupo</button></div>
  `);
}
function togglePickGrupo(i, el) {
  const idx = _grupoSel.indexOf(i);
  if (idx >= 0) _grupoSel.splice(idx, 1); else _grupoSel.push(i);
  el.classList.toggle('picked', _grupoSel.includes(i));
  el.querySelector('.pick-check').textContent = _grupoSel.includes(i) ? '✓' : '○';
}
function guardarGrupo() {
  const nombre = document.getElementById('grupoNombre').value.trim() || 'Mi grupo';
  const miembros = [{ nombre: DATA.usuario.nombre, avatar: DATA.usuario.avatar, color: DATA.usuario.color }]
    .concat(_grupoSel.map((i) => ({ nombre: DATA.amigos[i].nombre, avatar: DATA.amigos[i].avatar, color: DATA.amigos[i].color })));
  DATA.grupos = DATA.grupos || [];
  DATA.grupos.push({ id: 'g' + Date.now(), nombre, emoji: '🎪', color: 'linear-gradient(135deg,#2f7bff,#38bdf8)', miembros, comunidad: 0, _unido: false, difusion: [] });
  cerrarSheet();
  pintarAmigos();
  toast(`Grupo "${nombre}" creado 🎉`);
}
// --- GRUPO a fondo: equipo + COMUNIDAD + canal de difusión estilo canal
// de IG (solo el equipo publica avisos/encuestas; la comunidad REACCIONA
// con emojis, no puede comentar) ---
const REACCIONES = ['🔥', '❤️', '🎉', '😍', '👀'];

function _grupo(id) { return (DATA.grupos || []).find((x) => x.id === id); }

function reactsHTML(gid, p) {
  return `<div class="dif-reacts" id="reacts-${p.id}">
    ${REACCIONES.map((em) => {
      const n = (p.reacciones || {})[em] || 0;
      return `<button class="reac-btn ${p.mia === em ? 'on' : ''}" onclick="reaccionar('${gid}','${p.id}','${em}', this)">${em}${n ? ` <b>${n}</b>` : ''}</button>`;
    }).join('')}
  </div>`;
}

function pollHTML(gid, p) {
  const total = p.opciones.reduce((s2, o) => s2 + o.votos, 0);
  return `<div class="dif-poll" id="poll-${p.id}">
    ${p.opciones.map((o, i) => {
      const pct = total ? Math.round(o.votos * 100 / total) : 0;
      return `<button class="poll-opt ${p.miVoto === i ? 'on' : ''}" style="--pct:${pct}%" onclick="votar('${gid}','${p.id}',${i})">
        <span class="poll-txt">${esc(o.t)}</span><span class="poll-pct">${pct}%</span>
      </button>`;
    }).join('')}
    <small class="poll-total">${total} voto${total === 1 ? '' : 's'}</small>
  </div>`;
}

function difusionHTML(g) {
  if (!(g.difusion || []).length) {
    return `<p class="empty">Aún no hay avisos. Manda el primero a tu comunidad 📣</p>`;
  }
  return g.difusion.map((p) => `
    <div class="dif-post">
      <div class="dif-head">
        <span class="dif-ava" style="background:${g.color}">${g.emoji}</span>
        <div><strong>${esc(g.nombre)}</strong><small>${esc(p.fecha || 'ahora')}</small></div>
        ${p.tipo === 'encuesta' ? '<span class="dif-tag">Encuesta</span>' : ''}
      </div>
      ${p.texto ? `<p class="dif-txt">${esc(p.texto)}</p>` : ''}
      ${p.tipo === 'encuesta' ? pollHTML(g.id, p) : ''}
      ${reactsHTML(g.id, p)}
    </div>`).join('');
}

function abrirGrupo(id) {
  const g = _grupo(id);
  if (!g) return;
  g.difusion = g.difusion || [];
  cerrarSheet();
  // Fiestas organizadas por el grupo (visibles para la comunidad)
  const evs = DATA.eventos.filter((ev) => ev.grupoId === g.id && ev.publico !== false && !yaPaso(ev));
  let ov = document.getElementById('grupoFull');
  if (!ov) { ov = document.createElement('div'); ov.id = 'grupoFull'; ov.className = 'evfull'; document.body.appendChild(ov); }
  ov.innerHTML = `
    <div class="evfull-tema" style="background:linear-gradient(180deg, rgba(6,7,10,.55), var(--bg) 62%), ${g.color};background-repeat:no-repeat"></div>
    <div class="evfull-bar">
      <button class="round-btn" onclick="cerrarGrupo()" aria-label="Cerrar">✕</button>
    </div>
    <div class="evfull-inner gr-inner">
    <div class="amigo-top">
      <div class="amigo-ava" style="background:${g.color}">${g.emoji}</div>
      <strong>${esc(g.nombre)}</strong>
      <small>${g.miembros.length} en el equipo · ${(g.comunidad || 0) + (g._unido ? 1 : 0)} en la comunidad</small>
      <div class="grupo-avas-row">${g.miembros.slice(0, 6).map((m) => `<span class="grupo-ava" style="background:${m.color}" title="${esc(m.nombre)}">${m.avatar}</span>`).join('')}</div>
    </div>

    <button class="btn-unirse ${g._unido ? 'on' : ''}" onclick="unirseGrupo('${g.id}')">
      ${g._unido ? icon('check') + ' En la comunidad · recibirás avisos' : icon('bell') + ' Unirme a la comunidad'}
    </button>

    <div class="grupo-acciones">
      <button class="chip" onclick="crearFiestaGrupo('${g.id}')">＋ Fiesta del grupo</button>
      <button class="chip" onclick="nuevoAviso('${g.id}')">${icon('mega', 'mute')} Aviso</button>
      <button class="chip" onclick="nuevaEncuesta('${g.id}')">${icon('doc', 'mute')} Encuesta</button>
    </div>

    ${evs.length ? `
      <div class="row-between"><h3>Fiestas del grupo</h3></div>
      <div class="event-list gr-evs">${evs.map(tarjetaEvento).join('')}</div>` : ''}

    <div class="row-between"><h3>Canal de difusión</h3></div>
    <p class="hint">Solo el equipo publica. La comunidad reacciona con emojis (no hay comentarios), como un canal de difusión.</p>
    <div class="dif-list" id="difList">${difusionHTML(g)}</div>
    </div>
  `;
  ov.scrollTop = 0;
  ov.classList.add('is-open');
}

// Cierra la vista completa del grupo
function cerrarGrupo() {
  const ov = document.getElementById('grupoFull');
  if (ov) { ov.classList.remove('is-open'); ov.innerHTML = ''; }
}

// Unirse / salir de la comunidad del grupo (recibe los avisos)
function unirseGrupo(id) {
  const g = _grupo(id);
  if (!g) return;
  g._unido = !g._unido;
  toast(g._unido ? `Te uniste a la comunidad de ${g.nombre} 🔔` : 'Saliste de la comunidad');
  abrirGrupo(id);
}

// Crear fiesta del grupo: el equipo entra como co-anfitriones automáticamente
function crearFiestaGrupo(id) {
  const g = _grupo(id);
  if (!g) return;
  cerrarGrupo();
  draft = nuevoDraft();
  draft.grupoId = g.id;
  draft.organizadores = g.miembros
    .filter((m) => m.nombre !== DATA.usuario.nombre)
    .map((m) => ({ ...m }));
  irA('create');
  toast(`Fiesta de "${g.nombre}": el equipo ya está como co-anfitrión 🎪`);
}

// Aviso a la comunidad (difusión): texto simple, la gente solo reacciona
async function nuevoAviso(id) {
  const g = _grupo(id);
  if (!g) return;
  const texto = await pedirTexto('Aviso para la comunidad', { placeholder: 'Ej: ¡Boletos a la venta este viernes!', ok: 'Enviar' });
  if (!texto || !texto.trim()) return;
  g.difusion.unshift({ id: 'd' + Date.now(), tipo: 'aviso', texto: texto.trim(), fecha: 'ahora', reacciones: {}, mia: null });
  toast(`Aviso enviado a ${(g.comunidad || 0) + (g._unido ? 1 : 0)} personas 📣`);
  abrirGrupo(id);
}

// Encuesta: pregunta + opciones separadas por coma; la comunidad vota
async function nuevaEncuesta(id) {
  const g = _grupo(id);
  if (!g) return;
  const pregunta = await pedirTexto('Pregunta de la encuesta', { placeholder: 'Ej: ¿Qué día prefieren?', ok: 'Siguiente' });
  if (!pregunta || !pregunta.trim()) return;
  const ops = await pedirTexto('Opciones separadas por coma', { placeholder: 'Viernes, Sábado, Domingo', ok: 'Publicar' });
  if (!ops) return;
  const opciones = ops.split(',').map((o) => o.trim()).filter(Boolean).slice(0, 6).map((t) => ({ t, votos: 0 }));
  if (opciones.length < 2) { toast('Pon al menos 2 opciones separadas por coma'); return; }
  g.difusion.unshift({ id: 'd' + Date.now(), tipo: 'encuesta', texto: pregunta.trim(), fecha: 'ahora', reacciones: {}, mia: null, opciones, miVoto: null });
  toast('Encuesta publicada 📊');
  abrirGrupo(id);
}

// Reaccionar con emoji (una reacción por persona; tocar de nuevo la quita).
// Los emojis tienen FÍSICA: el tocado da un pop con rebote, los vecinos se
// empujan como resortes y el emoji sale flotando hacia arriba.
function reaccionar(gid, pid, em, btn) {
  const g = _grupo(gid);
  const p = g && g.difusion.find((x) => x.id === pid);
  if (!p) return;
  p.reacciones = p.reacciones || {};
  const quitando = p.mia === em;
  if (quitando) {
    p.reacciones[em] = Math.max(0, (p.reacciones[em] || 1) - 1);
    p.mia = null;
  } else {
    if (p.mia) p.reacciones[p.mia] = Math.max(0, (p.reacciones[p.mia] || 1) - 1);
    p.reacciones[em] = (p.reacciones[em] || 0) + 1;
    p.mia = em;
  }
  // Actualiza los botones EN SITIO (así la animación no se corta)
  const row = document.getElementById('reacts-' + pid);
  if (!row) return;
  const botones = [...row.querySelectorAll('.reac-btn')];
  botones.forEach((b, i) => {
    const emoji = REACCIONES[i];
    const n = (p.reacciones || {})[emoji] || 0;
    b.classList.toggle('on', p.mia === emoji);
    b.innerHTML = `${emoji}${n ? ` <b>${n}</b>` : ''}`;
  });
  fisicaReaccion(botones, btn, em, quitando);
}

// La "física" de los emojis: pop elástico del tocado, empujón con resorte a
// los vecinos (más fuerte mientras más cerca) y emojis flotando hacia arriba
function fisicaReaccion(botones, btn, em, quitando) {
  if (!btn) return;
  const i0 = botones.indexOf(btn);
  botones.forEach((b, i) => {
    b.classList.remove('fx-pop', 'fx-push');
    b.style.removeProperty('--fuerza');
    void b.offsetWidth; // reinicia la animación si tocas rápido
    if (i === i0) {
      b.classList.add('fx-pop');
    } else {
      const d = i - i0;
      const fuerza = Math.max(0, 4 - Math.abs(d)) * 6 * (d < 0 ? -1 : 1);
      if (fuerza) {
        b.style.setProperty('--fuerza', fuerza + 'px');
        b.classList.add('fx-push');
      }
    }
  });
  if (quitando) return;
  // Ráfaga del emoji flotando desde el botón
  const r = btn.getBoundingClientRect();
  for (let k = 0; k < 3; k++) {
    const f = document.createElement('span');
    f.className = 'reac-float';
    f.textContent = em;
    f.style.left = (r.left + r.width / 2) + 'px';
    f.style.top = r.top + 'px';
    f.style.setProperty('--dx', ((Math.random() - 0.5) * 60) + 'px');
    f.style.animationDelay = (k * 90) + 'ms';
    document.body.appendChild(f);
    f.addEventListener('animationend', () => f.remove());
  }
}

// Votar en una encuesta (puedes cambiar tu voto)
function votar(gid, pid, i) {
  const g = _grupo(gid);
  const p = g && g.difusion.find((x) => x.id === pid);
  if (!p) return;
  if (p.miVoto === i) { p.opciones[i].votos--; p.miVoto = null; }
  else {
    if (p.miVoto !== null && p.miVoto !== undefined) p.opciones[p.miVoto].votos--;
    p.opciones[i].votos++;
    p.miVoto = i;
  }
  const bloque = document.getElementById('poll-' + pid);
  if (bloque) bloque.outerHTML = pollHTML(gid, p);
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
          <p class="friend-locked">${icon('lock', 'mute')} Privado · solo sus mejores amigos ven su actividad</p>
        </div>
      </article>`;
  }
  // (Se quitó la ubicación en tiempo real "en X ahora")
  const estado = a.fue[0]
    ? `<span class="friend-was">Última: ${a.fue[0]}</span>`
    : `<span class="friend-was">Sin fiestas aún</span>`;
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
      <div class="locked-box">${icon('lock', 'mute')} Este perfil es privado.<br>Solo sus mejores amigos ven su actividad.</div>
      <div class="sheet-actions">${btnBest}</div>
    `);
    return;
  }
  abrirSheet(a.nombre, `
    <div class="amigo-top">
      <div class="amigo-ava ${a.mejorAmigo ? 'best' : ''}" style="background:${a.color}">${a.avatar}</div>
      <strong>${a.nombre}</strong><small>${a.usuario}</small>
      ${a.mejorAmigo ? '<span class="best-tag">★ Mejor amigo</span>' : ''}
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

// --- Perfil ÚNICO (todo en una cuenta) ---
// v3: portada grande con botones de vidrio, avatar cuadrado-redondeado a la
// izquierda, pase de entrada estilo BOLETO con QR y pestañas de contenido.
let pfTab = 'fiestas';
function setPfTab(t) { pfTab = t; pintarPerfil(); }

// Pseudo-QR decorativo y determinista (mismo usuario = mismo dibujo)
// Token ALEATORIO criptográfico: se genera UNA sola vez por pase y nunca
// se repite (no se deriva de nada, así que no hay forma de reconstruirlo
// ni de que dos pases coincidan). Queda guardado en el evento (e._paseId).
function tokenUnico() {
  const bytes = new Uint8Array(10);
  (self.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach((_, i) => bytes[i] = Math.random() * 256 | 0);
  return [...bytes].map((b) => b.toString(36).padStart(2, '0')).join('').toUpperCase().slice(0, 14);
}

// Folio corto y legible para mostrar en el pase (derivado del token, solo
// para lectura humana — el QR real usa el token completo)
function folioDe(token) {
  let h = 5381;
  for (let i = 0; i < token.length; i++) h = ((h << 5) + h + token.charCodeAt(i)) >>> 0;
  return h.toString(36).toUpperCase().padStart(7, '0');
}

// Asegura que el evento tenga un pase único para ESTE usuario (lo crea la
// primera vez que hace falta y ya no cambia): así el QR nunca se repite
// entre pases ni entre personas, y sigue siendo el mismo pase mientras
// no se use.
function asegurarPase(e) {
  e._pases = e._pases || {};
  const u = DATA.usuario.usuario;
  if (!e._pases[u]) e._pases[u] = { token: tokenUnico(), usado: false };
  return e._pases[u];
}

// Contenido ÚNICO y ALEATORIO del QR (fiesta + invitado + token real)
function pasePayload(e, u) {
  const pase = asegurarPase(e);
  return `SOC1|${e.id}|${u.usuario}|${pase.token}`;
}

// Simula el escaneo del staff en la puerta: valida el pase UNA vez y lo
// CANCELA (de un solo uso). Sin backend no hay forma de impedir que el
// mismo dueño del teléfono "reescanee" su propio pase — la validación
// real en la puerta necesita un servidor (Firebase) que sea la única
// fuente de verdad de qué pases ya se usaron; esto es la simulación.
function usarPase(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  const pase = asegurarPase(e);
  if (pase.usado) { toast('Este pase ya fue usado ⛔'); return; }
  pase.usado = true;
  toast('Pase validado ✓ — acceso concedido 🎉');
  abrirPases();
}

// QR REAL y ESCANEABLE (librería MIT qrcode-generator hospedada en el repo).
// Cualquier lector de QR lo lee; el contenido es único por fiesta+invitado.
function qrSVG(payload, cls = '') {
  try {
    const qr = qrcode(0, 'M');
    qr.addData(String(payload));
    qr.make();
    const n = qr.getModuleCount();
    let cells = '';
    for (let r = 0; r < n; r++) for (let c2 = 0; c2 < n; c2++) {
      if (qr.isDark(r, c2)) cells += `<rect x="${c2 + 1}" y="${r + 1}" width="1" height="1"/>`;
    }
    return `<svg class="${cls}" viewBox="0 0 ${n + 2} ${n + 2}" shape-rendering="crispEdges" role="img" aria-label="Código QR del pase"><rect width="${n + 2}" height="${n + 2}" fill="#fff"/><g fill="#000">${cells}</g></svg>`;
  } catch (err) { return ''; }
}

// Mis pases: UNO POR FIESTA confirmada (cada QR es único: usuario + evento)
function abrirPases() {
  const u = DATA.usuario;
  const voy = DATA.eventos.filter((e) => (e.voy || e._voy) && !e.proximamente);
  abrirSheet('Mis pases', voy.length ? `
    <p class="hint">Un pase por fiesta, con QR único e intransferible. El staff lo escanea en la puerta y se cancela — no se puede volver a usar.</p>
    <div class="pases-list">
      ${voy.map((e) => {
        const pase = asegurarPase(e);
        const tf = temaFondoEvento(e);
        return `
        <div class="tikt ${pase.usado ? 'is-usado' : ''}">
          <div class="tikt-main" style="background:${tf.bg}">
            <div class="tikt-veil"></div>
            <small class="tikt-brand">${icon('spark')} SOCIALICE · PASE DE ENTRADA</small>
            <strong class="tikt-name">${esc(e.nombre)}</strong>
            <span class="tikt-meta">${icon('cal','mute')} ${esc(e.fecha)}</span>
            <span class="tikt-meta">${icon('pin','mute')} ${esc(e.lugar)}${e.ciudad ? ' · ' + esc(e.ciudad) : ''}</span>
            <span class="pt-user"><span class="host-ava sm" style="${avatarFondo(u)}">${avatarContenido(u)}</span>${esc(u.usuario)}</span>
          </div>
          <div class="tikt-stub">
            <span class="notch"></span><span class="notch"></span>
            <div class="tikt-qr-wrap">
              ${qrSVG(pasePayload(e, u), 'qr-real')}
              ${pase.usado ? `<div class="tikt-usado-x">${icon('xmark')}</div>` : ''}
            </div>
            <small class="tikt-folio">Nº ${folioDe(pase.token)}</small>
            ${pase.usado
              ? `<small class="tikt-estado usado">${icon('check')} Ya usado</small>`
              : `<button class="tikt-scan" onclick="usarPase('${e.id}')" title="Solo para probar cómo se ve al escanearlo">${icon('eye')} Simular escaneo</button>`}
          </div>
          ${pase.usado ? `<div class="tikt-ribbon">${icon('check')} Acceso concedido</div>` : ''}
        </div>`;
      }).join('')}
    </div>` : `
    <p class="empty">Aún no tienes pases.<br>Confirma tu asistencia a una fiesta y aquí aparece su pase con QR 🎟️</p>
  `);
}


function pintarPerfil() {
  const cont = document.getElementById('screen-profile');
  const u = DATA.usuario;
  const mios = DATA.eventos.filter((e) => e.organizador === u.nombre);
  const voy = DATA.eventos.filter((e) => (e.voy || e._voy) && !e.proximamente);
  const historial = (u.eventosPasados || []);
  const popular = u.stats.seguidores >= 1000;
  const insignia =
    `${u.verificado ? `<span class="verif" title="Verificado">❄</span>` : ''}` +
    `${popular ? `<span class="popular" title="Popular · +1000 seguidores">★</span>` : ''}`;

  const tabs = {
    fiestas: () => `
      <div class="privacy-card">
        <div class="privacy-text">
          <strong>${u.privado ? 'Perfil privado' : 'Perfil público'}</strong>
          <small>${u.privado ? 'Solo tus amigos ven a qué fiestas vas.' : 'Cualquiera puede ver a qué fiestas vas.'}</small>
        </div>
        <button class="toggle ${u.privado ? '' : 'is-on'}" onclick="alternarPrivacidad()"><span class="toggle-knob"></span></button>
      </div>

      ${(u.colaboradores && u.colaboradores.length) ? `
        <div class="row-between"><h3>Mi equipo</h3></div>
        <div class="colab-row">
          ${u.colaboradores.map((c) => `
            <button class="colab" onclick="verPerfilDe('${c.nombre}','${c.usuario}','${c.avatar}')">
              <span class="colab-ava" style="background:${c.color}">${c.avatar}</span>
              <span class="colab-name">${c.nombre.split(' ')[0]}</span>
              <span class="colab-user">${c.usuario}</span>
            </button>`).join('')}
        </div>` : ''}

      <div class="row-between"><h3>Mis eventos</h3><button class="cal-link" onclick="verCalendario()">Calendario</button></div>
      <div class="event-list">
        ${mios.length ? mios.map((e) => `
          <div class="mio-wrap">
            ${tarjetaEvento(e)}
            <button class="mio-edit" onclick="event.stopPropagation(); editarFiesta('${e.id}')">Editar</button>
          </div>`).join('') : `<button class="empty-cta" onclick="nuevaFiesta()">Aún no creas eventos · Crear uno</button>`}
      </div>

      ${voy.length ? `
        <div class="row-between"><h3>Voy a ir</h3><span class="see-all">${voy.length}</span></div>
        <div class="mini-list">${voy.map((e) => filaFiesta(e, 'voy')).join('')}</div>` : ''}`,

    recuerdos: () => historial.length ? `
      <div class="past-list" style="margin-top:14px">
        ${historial.map((p) => `
          <article class="past2">
            <div class="past2-cover" style="background:${p.grad}">
              <div class="past2-overlay"><strong>${p.nombre}</strong><small>${p.fecha} · ${p.asistentes} asistentes</small></div>
            </div>
            <div class="past2-photos">
              ${p.fotos.map((f) => `<button class="past2-photo" onclick="toast('Foto de ${p.nombre}')"><span>${f}</span></button>`).join('')}
            </div>
          </article>`).join('')}
      </div>` : `<p class="empty">Cuando pasen tus fiestas, aquí quedan los recuerdos ✨</p>`,

    fotos: () => `
      <div class="row-between" style="margin-top:14px"><h3>Mis fotos</h3><span class="see-all" onclick="toast('Subir foto · próximamente')">Subir</span></div>
      <div class="photo-grid">
        ${['🌃','🪩','🥂','💃','✨','🎉'].map((f) => `<button class="photo-cell" onclick="toast('Foto de fiesta')">${f}</button>`).join('')}
      </div>`
  };

  cont.innerHTML = `
    <section class="pf2 ${popular ? 'is-popular' : ''}">
      <div class="pf2-cover" style="${portadaBg(u)}">
        <div class="pf2-topbtns">
          <button class="pf2-fab" onclick="compartir('mi perfil')" aria-label="Compartir">${icon('share')}</button>
          <button class="pf2-fab" onclick="abrirAjustes()" aria-label="Ajustes">${icon('gear')}</button>
        </div>
      </div>
      <div class="pf2-head">
        <div class="pf2-ava ${popular ? 'ring' : ''}" style="${avatarFondo(u)}">${avatarContenido(u)}</div>
        <div class="pf2-id">
          <h2 style="font-family:${fontCss(u.nombreFont)}">${u.nombre} ${insignia}</h2>
          <p>${u.usuario}</p>
        </div>
        <button class="pf2-editbtn" onclick="editarPerfil()">Editar</button>
      </div>
      <p class="pf2-bio">${u.bio}</p>
      <div class="pf2-conn">
        ${redesHTML(u)}
        <button class="pases-mini" onclick="abrirPases()" aria-label="Mis pases">
          <span class="pases-mini-qr">${icon('qr')}</span>
          <span class="pases-mini-tx"><strong>Pases</strong><small>${voy.length ? `${voy.length} ${voy.length === 1 ? 'fiesta' : 'fiestas'}` : 'sin fiestas'}</small></span>
        </button>
      </div>
      <div class="pf2-stats">
        <div class="pf2-stat"><strong>${u.stats.eventos}</strong><small>eventos</small></div>
        <div class="pf2-stat"><strong>${u.stats.fueA}</strong><small>fiestas</small></div>
        <button class="pf2-stat" onclick="irA('friends')"><strong>${u.stats.amigos}</strong><small>amigos</small></button>
        <button class="pf2-stat" onclick="verSeguidores()"><strong>${kilo(u.stats.seguidores)}</strong><small>seguidores</small></button>
      </div>
    </section>

    <div class="pf2-tabs">
      <button class="${pfTab === 'fiestas' ? 'on' : ''}" onclick="setPfTab('fiestas')">Fiestas</button>
      <button class="${pfTab === 'recuerdos' ? 'on' : ''}" onclick="setPfTab('recuerdos')">Recuerdos</button>
      <button class="${pfTab === 'fotos' ? 'on' : ''}" onclick="setPfTab('fotos')">Fotos</button>
    </div>
    ${(tabs[pfTab] || tabs.fiestas)()}
  `;
}


// Fila de redes sociales / contacto
// Redes del perfil: iconos limpios y compactos (sin sitio web)
function redesHTML(u) {
  const r = u.redes || {};
  const items = [];
  if (r.instagram) items.push(`<a class="red2 ig" href="https://instagram.com/${encodeURIComponent(r.instagram)}" target="_blank" rel="noopener" title="Instagram">${IG_SVG}</a>`);
  if (r.tiktok)    items.push(`<a class="red2 tk" href="https://tiktok.com/@${encodeURIComponent(r.tiktok)}" target="_blank" rel="noopener" title="TikTok">${TT_SVG}</a>`);
  return items.length ? `<div class="redes-row2">${items.join('')}</div>` : '';
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
  return u.avatar || `<span class="ava-ini">${inicialesDe(u.nombre)}</span>`;
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
  abrirSheet('Calendario', `
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

  // Cuenta única: todos pueden explorar, buscar, crear, ver amigos y su perfil.
  const items = [
    { go: 'home',    ic: 'home',   texto: 'Inicio' },
    { go: 'search',  ic: 'search', texto: 'Buscar' },
    { go: 'create',  ic: 'plus',   texto: 'Crear'  },
    { go: 'friends', ic: 'usersParty', texto: 'Amigos' },
    { go: 'profile', ic: 'userParty',  texto: 'Perfil' }
  ];

  const actual = document.body.dataset.screen;
  nav.innerHTML = items.map((it) => `
    <button class="nav-btn ${it.go === actual ? 'is-active' : ''}"
            data-go="${it.go}" onclick="${it.go === 'create' ? 'abrirCrearMenu()' : `irA('${it.go}')`}">
      <span class="nav-icon">${icon(it.ic)}</span>
      <span class="nav-text">${it.texto}</span>
    </button>
  `).join('');
}

// Panel al tocar "Crear": elegir evento público o privado (antes de crear)
function abrirCrearMenu() {
  abrirSheet('Crear', `
    <button class="crear-card publico" onclick="nuevaFiestaTipo(true)">
      <span class="crear-plus">＋</span>
      <span class="crear-txt"><strong>Evento público</strong><small>Cualquiera puede verlo y unirse · recopila confirmaciones</small></span>
    </button>
    <button class="crear-card privado" onclick="nuevaFiestaTipo(false)">
      <span class="crear-plus">＋</span>
      <span class="crear-txt"><strong>Evento privado</strong><small>Solo por invitación · no aparece en el feed</small></span>
    </button>
  `);
}
function nuevaFiestaTipo(publico) {
  cerrarSheet();
  draft = nuevoDraft();
  draft.publico = publico;
  irA('create');
  abrirTemaCustom();
}

// Iconos SVG limpios para redes
const IG_SVG = '<svg class="soc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>';
const TT_SVG = '<svg class="soc-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M15.4 3h-2.6v12.1a2.6 2.6 0 1 1-2.2-2.6v-2.7a5.3 5.3 0 1 0 4.8 5.3V9.2a6.6 6.6 0 0 0 4 1.3V7.9A3.9 3.9 0 0 1 15.4 3z"/></svg>';

// Abre el panel "Mantente conectado" (con el giro del logo antes de abrir)
function mostrarConectados() {
  abrirSheet('Mantente conectado', `
    <div class="conect-logo"><img src="icons/logo-figure.png" alt="Socialice"></div>

    <div class="set-list">
      <button class="set-row link" onclick="toast('Newsletter · pronto 📩')">
        <div><strong>Hazte insider</strong><small>Recibe nuestro newsletter de fiestas</small></div>
        ${icon('mail','mute')}
      </button>
      <button class="set-row link" onclick="toast('Comunidad · pronto ✦')">
        <div><strong>La lista VIP</strong><small>Entérate primero de cada evento</small></div>
        ${icon('spark','mute')}
      </button>
    </div>

    <div class="set-list">
      <a class="set-link conect-social" href="https://www.instagram.com/socialice.mx/" target="_blank" rel="noopener">${IG_SVG} Instagram <span>↗</span></a>
      <a class="set-link conect-social" href="https://www.tiktok.com/@socialice.mx" target="_blank" rel="noopener">${TT_SVG} TikTok <span>↗</span></a>
    </div>

    <p class="set-version">Socialice · versión 0.1</p>
  `);
}
// Panel de notificaciones
// Notificaciones: NO es un panel de abajo — es una "nube" pequeña que
// se abre justo debajo de la campana, como un menú desplegable.
function abrirNotificaciones() {
  if (document.getElementById('notiDrop')) { cerrarNotiDrop(); return; }
  const notis = [
    { ava: '🐺', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)', txt: '<b>Mateo</b> confirmó que va a Neon Nights', t: 'hace 10 min' },
    { ava: '🌸', color: 'linear-gradient(135deg,#ec4899,#f43f5e)', txt: '<b>Sofía</b> comentó en Rooftop Sunset', t: 'hace 1 h' },
    { ava: '🎪', color: 'linear-gradient(135deg,#2f7bff,#38bdf8)', txt: 'Aurora Fest ya tiene fecha — ¡revísala!', t: 'hace 3 h' },
    { ava: '⭐', color: 'linear-gradient(135deg,#f59e0b,#ef4444)', txt: '<b>Valeria</b> te marcó como mejor amigo', t: 'ayer' }
  ];
  // Al abrir, se marcan como leídas: quita el punto rojo y la vibración
  notisNuevas = false;
  const bell = document.querySelector('.ico-btn.bell');
  if (bell) { bell.classList.remove('nuevo'); bell.querySelector('.bell-dot')?.remove(); }

  const drop = document.createElement('div');
  drop.className = 'noti-drop';
  drop.id = 'notiDrop';
  drop.setAttribute('role', 'dialog');
  drop.setAttribute('aria-label', 'Notificaciones');
  drop.innerHTML = `
    <div class="noti-drop-head"><h3>Notificaciones</h3></div>
    <div class="noti-list">
      ${notis.map((n) => `
        <div class="noti-item">
          <span class="noti-ava" style="background:${n.color}">${n.ava}</span>
          <div class="noti-body"><p>${n.txt}</p><small>${n.t}</small></div>
        </div>`).join('')}
    </div>
  `;
  document.body.appendChild(drop);

  if (bell) {
    const r = bell.getBoundingClientRect();
    drop.style.top = Math.round(r.bottom + 10) + 'px';
    drop.style.right = Math.round(window.innerWidth - r.right) + 'px';
  }
  requestAnimationFrame(() => drop.classList.add('is-on'));

  // Se cierra al tocar fuera, al hacer scroll, o con Escape
  const fuera = (ev) => { if (!drop.contains(ev.target)) cerrarNotiDrop(); };
  document.addEventListener('keydown', _notiEsc);
  setTimeout(() => {
    document.addEventListener('click', fuera, { capture: true });
    window.addEventListener('scroll', cerrarNotiDrop, { once: true, passive: true });
  }, 0);
  drop._fuera = fuera;
}
function _notiEsc(e) { if (e.key === 'Escape') cerrarNotiDrop(); }
function cerrarNotiDrop() {
  const drop = document.getElementById('notiDrop');
  if (!drop) return;
  document.removeEventListener('click', drop._fuera, { capture: true });
  document.removeEventListener('keydown', _notiEsc);
  window.removeEventListener('scroll', cerrarNotiDrop);
  drop.classList.remove('is-on');
  setTimeout(() => drop.remove(), 200);
}

// Logo del inicio: gira y luego abre el panel (para que el giro se vea)
function abrirConectados(btn) {
  const img = btn && btn.querySelector('img');
  if (img) {
    img.classList.remove('spin'); void img.offsetWidth; img.classList.add('spin');
    setTimeout(mostrarConectados, 380);
  } else {
    mostrarConectados();
  }
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
// Accesibilidad: el foco queda ATRAPADO dentro del panel mientras está
// abierto (Tab cicla, Escape cierra) y regresa a quien lo abrió al cerrar.
let _sheetOpener = null;
function _sheetFocusables() {
  return [...document.getElementById('sheet').querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.disabled && el.offsetParent !== null);
}
function _sheetTrap(e) {
  if (e.key === 'Escape') { cerrarSheet(); return; }
  if (e.key !== 'Tab') return;
  const f = _sheetFocusables();
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  else if (!document.getElementById('sheet').contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
}
function abrirSheet(titulo, html) {
  _sheetOpener = document.activeElement;
  document.getElementById('sheetTitle').textContent = titulo;
  document.getElementById('sheetBody').innerHTML = html;
  document.getElementById('sheetOverlay').classList.add('is-on');
  document.body.classList.add('no-scroll');
  document.addEventListener('keydown', _sheetTrap);
  // El foco se manda DESPUÉS de que termine la animación de entrada:
  // en iOS Safari, enfocar un elemento mientras el panel todavía está
  // fuera de pantalla (a medio deslizar) hace que Safari "salte" el
  // viewport para intentar mostrarlo — se veía como si el panel
  // apareciera arriba y luego se acomodara abajo.
  setTimeout(() => {
    const f = _sheetFocusables();
    if (f.length) f[0].focus({ preventScroll: true });
  }, 320);
}
function cerrarSheet(ev) {
  // Si se hizo clic dentro del panel (no en el fondo), no cerrar
  if (ev && ev.target.closest('.sheet') && ev.type === 'click' &&
      ev.currentTarget.id === 'sheetOverlay' && ev.target !== ev.currentTarget) return;
  const s = document.getElementById('sheet');
  s.style.transition = ''; s.style.transform = '';
  document.getElementById('sheetOverlay').classList.remove('is-on');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', _sheetTrap);
  // El foco regresa al elemento que abrió el panel
  if (_sheetOpener && document.contains(_sheetOpener)) { try { _sheetOpener.focus(); } catch (e) {} }
  _sheetOpener = null;
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

// ¿Puedo EDITAR este evento? Solo el organizador, sus co-organizadores o
// los miembros del grupo organizador. Nadie más.
function puedeEditar(e) {
  if (!e) return false;
  const yo = DATA.usuario.nombre;
  if (e.organizador === yo) return true;
  if ((e.organizadores || []).some((o) => o.nombre === yo)) return true;
  if (e.grupoId) {
    const g = (DATA.grupos || []).find((x) => x.id === e.grupoId);
    if (g && g.miembros.some((m) => m.nombre === yo)) return true;
  }
  return false;
}

// ¿El evento ya pasó? (para ocultar invitación/RSVP y sacarlo del inicio)
function yaPaso(e) {
  return !!e.fechaISO && cuentaRegresiva(e) === 'Ya pasó';
}

// Conteo de respuestas (van / tal vez / no), con tu respuesta incluida
function rsvpCounts(e) {
  const base = e.asistentes || 0;
  let van = base, tal = Math.round(base * 0.18), no = Math.round(base * 0.06);
  if (e._rsvp === 'voy') van += 1 + (e._rsvpExtra || 0);
  else if (e._rsvp === 'tal') tal += 1;
  else if (e._rsvp === 'no') no += 1;
  return { van, tal, no };
}

// ¿Este usuario puede ver la lista de invitados? Protegida por defecto:
// solo el anfitrión y los confirmados la ven, salvo que el anfitrión la abra.
function puedeVerLista(e) {
  if (e.organizador === DATA.usuario.nombre) return true;
  const modo = e.listaVisible || 'confirmados';
  if (modo === 'todos') return true;
  if (modo === 'nadie') return false;
  return e._rsvp === 'voy';
}

// ¿Es tu amigo? (para filtrar qué invitados puedes ver)
function esAmigo(nombre) { return (DATA.amigos || []).some((a) => a.nombre === nombre); }

// Muestra deterministe de invitados desde el pool.
// Si NO eres el anfitrión, solo ves a TUS AMIGOS: los demás asistentes
// nunca se te muestran con nombre (protección de la gente que va).
function invitadosMuestra(e, n) {
  const soyHost = e.organizador === DATA.usuario.nombre;
  const pool = soyHost ? (DATA.gente || []) : (DATA.gente || []).filter((g) => esAmigo(g.nombre));
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
  if (e._rsvp === undefined && e.voy) e._rsvp = 'voy';   // ya estabas confirmado
  const esMio = puedeEditar(e); // organizador, co-organizadores o su grupo
  const orgs = [{ nombre: e.organizador, avatar: DATA.usuario.avatar, color: DATA.usuario.color }].concat(e.organizadores || []);
  const c = rsvpCounts(e);
  const cuenta = cuentaRegresiva(e);
  const muestra = invitadosMuestra(e, 7);
  const listaOk = puedeVerLista(e);
  const paso = yaPaso(e);

  // El evento se ve en PANTALLA COMPLETA (no en ventana) con SU tema de
  // fondo (video/gradiente) y SUS efectos, tal como lo armó el organizador
  const tt = TEMAS[e.tema] ? (TEMAS[e.tema].custom ? customTema(e.temaColors, e.temaAnim) : TEMAS[e.tema]) : null;
  const slug = tt ? temaSlug(TEMAS[e.tema].custom ? 'Tus colores' : tt.nombre) : '';
  const tv = TEMA_VIDEOS[slug];
  let videoTag = '';
  if (tv) {
    const hue = slug === 'disco' ? (e.discoHue || 0) : slug === 'llamas' ? (e.llamaHue || 0) : 0;
    videoTag = `<video class="tema-video${hue === 'anim' ? ' vfx-hue' : ''}"${(typeof hue === 'number' && hue) ? ` style="filter:hue-rotate(${hue}deg)"` : ''} src="${tv.src}" data-rate="${tv.rate}" muted loop autoplay playsinline></video>`;
  }
  let ov = document.getElementById('eventoFull');
  if (!ov) { ov = document.createElement('div'); ov.id = 'eventoFull'; ov.className = 'evfull'; document.body.appendChild(ov); }
  ov.innerHTML = `
    <div class="evfull-tema ${slug ? 'tema-' + slug : ''}${TEMAS[e.tema] && TEMAS[e.tema].custom && e.temaAnim ? ' anim' : ''}${tv ? ' con-video' : ''}" style="background:${tt ? tt.bg.replace(/"/g, '&quot;') : 'var(--bg)'};background-repeat:no-repeat">${videoTag}</div>
    <div class="evfull-bar">
      <button class="round-btn" onclick="cerrarEvento()" aria-label="Cerrar">✕</button>
      <span class="evfull-sp"></span>
      <button class="round-btn" data-n="${esc(e.nombre)}" onclick="compartir(this.dataset.n)" aria-label="Compartir">${icon('share')}</button>
    </div>
    <div class="evfull-inner">
    <!-- En laptop la ficha se parte en 2 columnas (.ev-main | .ev-side);
         en teléfono los wrappers son display:contents y no cambian nada -->
    <div class="ev-main">
    <!-- HERO: TÍTULO arriba, portada abajo, cuenta regresiva al final -->
    <div class="ev-hero">
      <h1 class="ev-nombre" ${nombreAttrs(e)}>${esc(e.nombre)}</h1>
      <div class="ev-cover" style="${coverStyle(e)}">
        <span class="ev-cover-emoji">${e.coverImg ? '' : (e.emoji || '')}</span>
        <span class="event-price">${e.precio}</span>
      </div>
      ${cuenta ? `<div class="ev-count ${cuenta === '¡Es hoy!' ? 'today' : ''}">${icon('clock', 'mute')} ${cuenta}</div>` : ''}
    </div>

    <!-- Info del evento: UNA tarjeta compacta con fecha, lugar y organizadores -->
    <div class="ev-info">
      <div class="ev-irow">
        ${icon('cal','mute')}<strong>${esc(e.fecha)}</strong>
        ${(e.fechaISO && !paso) ? `<button class="ev-line-act" onclick="addCalendario('${e.id}')">＋ Calendario</button>` : ''}
      </div>
      <div class="ev-irow">
        ${icon('pin','mute')}<div><strong>${esc(e.lugar)}</strong>${e.ciudad ? `<small>${esc(e.ciudad)}</small>` : ''}</div>
        <button class="ev-line-act" onclick="toast('Mapa · próximamente 🗺️')">Ver mapa</button>
      </div>
      <div class="ev-irow">
        <div class="ev-host-avas">${orgs.slice(0, 3).map((o) => `<span class="ev-host-ava" style="background:${o.color || 'var(--grad-cool)'}">${o.avatar || '🎤'}</span>`).join('')}</div>
        <div><small>Organiza</small><strong>${esc(orgs.map((o) => o.nombre.split(' ')[0]).join(', '))}</strong></div>
      </div>
    </div>

    ${casiLleno(e) ? `<div class="warn-full">${icon('fire')} ¡Casi se agotan los lugares! Quedan pocos.</div>` : ''}

    <!-- Detalles -->
    <div class="row-between"><h3>Detalles</h3></div>
    <p class="ev-desc">${esc(e.descripcion) || `Una noche para recordar en ${esc(e.lugar)}. Música, luces y la mejor energía.`}</p>
    <div class="detail-chips">
      <span class="dchip"><span>${icon('dress', 'mute')} Código</span><b>${e.dressCode || 'Libre'}</b></span>
      <span class="dchip"><span>${icon('ticket', 'mute')} Entrada</span><b>${e.precio}</b></span>
    </div>

    <!-- Boletos, justo debajo de la descripción, con el cupo total -->
    ${(e.boletos && e.boletos.length) ? `
      <div class="row-between"><h3>Boletos</h3>${e.capacidad ? `<span class="see-all">${icon('user','mute')} ${e.capacidad} cupos</span>` : ''}</div>
      <div class="zona-list">
        ${e.boletos.map((b) => `
          <div class="zona-row">
            <div><strong>${esc(b.nombre) || 'Boleto'}</strong><small>${b.cantidad} disponibles</small></div>
            <span class="zona-precio">${(+b.precio) > 0 ? '$' + b.precio : 'Gratis'}</span>
          </div>`).join('')}
      </div>` : ''}

    ${(esMio || paso) ? '' : `
      ${e._rsvp === 'voy' ? `
      <div class="rsvp">
        <p class="rsvp-q">${icon('check')} Vas a esta fiesta</p>
          <div class="rsvp-extra">
            <div class="rsvp-extra-row">
              <span>¿Traes invitados?</span>
              <div class="cap-control">
                <button onclick="acomp('${e.id}',-1)">−</button>
                <b id="acompN">+${e._rsvpExtra || 0}</b>
                <button onclick="acomp('${e.id}',1)">+</button>
              </div>
            </div>
            <input class="field-input nota" placeholder="Deja una nota (opcional)" value="${esc(e._rsvpNota || '')}" onchange="DATA.eventos.find(x=>x.id==='${e.id}')._rsvpNota=this.value">
            ${(e.preguntas && e.preguntas.length) ? e.preguntas.map((q, i) => `
              <div class="rsvp-preg"><label>${esc(q)}</label>
                <input class="field-input" placeholder="Tu respuesta" value="${esc((e._respuestas || [])[i] || '')}" onchange="guardarRespuesta('${e.id}',${i},this.value)"></div>`).join('') : ''}
          </div>
        <div class="mini-toggle-row">
          <span>${icon('bell', 'mute')} Recordármelo</span>
          <button class="toggle ${e._recordar ? 'is-on' : ''}" onclick="toggleRecordar('${e.id}', this)"><span class="toggle-knob"></span></button>
        </div>
      </div>` : ''}`}
    </div>
    <div class="ev-side">

    <!-- Quién va: más abajo, avatares primero y el número como protagonista
         (nada de contadores-pill de colores, se veía muy "generado") -->
    <div class="row-between"><h3>Quién va</h3>${listaOk ? `<span class="see-all" onclick="verListaInvitados('${e.id}')">Ver lista</span>` : ''}</div>
    <div class="ev-quien" onclick="verListaInvitados('${e.id}')">
      <div class="ava-stack ${listaOk ? '' : 'anon'}">
        ${muestra.map((g) => `<span class="ava-mini" style="background:${g.color}">${g.avatar}</span>`).join('')}
        ${c.van > muestra.length ? `<span class="ava-more">+${c.van - muestra.length}</span>` : ''}
      </div>
      <div class="quien-txt">
        <strong>${c.van} van</strong>
        <small>${c.tal} tal vez · ${c.no} no pueden</small>
      </div>
    </div>
    ${listaOk ? '' : `<div class="lock-note-in">${icon('lock','mute')}<span>${(e.listaVisible || 'confirmados') === 'nadie'
      ? 'El anfitrión mantiene la lista de invitados privada.'
      : 'Lista protegida: confirma tu asistencia para ver quién va.'}</span></div>`}

    <!-- Álbum: solo después de que la fiesta ya pasó -->
    ${paso ? `
    <div class="row-between"><h3>Álbum</h3><span class="see-all" onclick="toast('Subir foto · próximamente')">Subir</span></div>
    <div class="album-grid">
      ${(e.album || ['🌃','🪩','🥂','💃','✨','🎶']).map((f) => `<button class="album-cell" onclick="toast('Foto del evento')">${f}</button>`).join('')}
    </div>` : ''}

    <!-- Invitar -->
    ${paso ? '' : `<div class="invite-row">
      <button class="btn full" onclick="copiarInvitacion('${e.id}')">${icon('link')} Copiar invitación</button>
      <button class="icon-btn" data-n="${esc(e.nombre)}" onclick="compartir(this.dataset.n)" aria-label="Compartir">${icon('share')}</button>
    </div>`}

    ${(e.noticias && e.noticias.length) ? `
      <div class="row-between"><h3>Publicaciones</h3></div>
      <div class="news-list">
        ${e.noticias.map((n) => `
          <div class="post-card">
            <div class="post-head">
              <div class="post-ava" style="background:${DATA.usuario.color}">${DATA.usuario.avatar}</div>
              <div><strong>${esc(e.organizador)}</strong><small>${esc(n.fecha || '')}</small></div>
            </div>
            ${n.texto ? `<p class="post-text">${esc(n.texto)}</p>` : ''}
            ${mediaHTML(n)}
          </div>`).join('')}
      </div>` : ''}

    <!-- Muro de comentarios -->
    <div class="row-between"><h3>Comentarios</h3></div>
    <div class="post-compose">
      <textarea id="evComInput" placeholder="Escribe un comentario…" rows="1"></textarea>
      <div class="post-compose-bar">
        <span class="post-attach-info"></span>
        <button class="add-btn" onclick="addComentario('${e.id}')">Enviar</button>
      </div>
    </div>
    <div class="com-list" id="evComList">${comentariosHTML(e)}</div>

    </div>

    <!-- Barra FIJA de acciones (RSVP para invitados / Editar+Avisar para el anfitrión) -->
    <div class="ev-actions">
      ${esMio ? `
        <button class="eva-btn" onclick="cerrarEvento(); editarFiesta('${e.id}')">✎ Editar</button>
        <button class="eva-btn" onclick="verListaInvitados('${e.id}')">${icon('users')} Invitados</button>
        <button class="eva-btn primary" onclick="avisarTodos('${e.id}')">${icon('mega')} Avisar</button>`
      : e.proximamente ? `
        <button class="eva-btn primary ${e._interesado ? 'on' : ''}" onclick="interesadoPage('${e.id}')">${icon('star')} ${e._interesado ? 'Interesado ✓' : 'Me interesa'}</button>`
      : paso ? '' : `
        <button class="eva-btn voy ${e._rsvp === 'voy' ? 'on' : ''}" onclick="setRsvp('${e.id}','voy')">${icon('check')} Voy</button>
        <button class="eva-btn tal ${e._rsvp === 'tal' ? 'on' : ''}" onclick="setRsvp('${e.id}','tal')">${icon('quest')} Tal vez</button>
        <button class="eva-btn no ${e._rsvp === 'no' ? 'on' : ''}" onclick="setRsvp('${e.id}','no')">${icon('xmark')} No</button>`}
    </div>
    </div>
  `;
  ov.scrollTop = 0;
  ov.classList.add('is-open');
  const vid = ov.querySelector('.tema-video');
  if (vid) { vid.playbackRate = +vid.dataset.rate || 1; vid.play().catch(() => {}); }
  // Los efectos del evento viven DENTRO de la vista (no pisan los del body)
  pintarEfecto(e.efecto || 'ninguno', ov);
}

// Cierra la vista completa del evento (y limpia el evento de vista previa)
function cerrarEvento() {
  const ov = document.getElementById('eventoFull');
  if (ov) { ov.classList.remove('is-open'); ov.innerHTML = ''; }
  DATA.eventos = DATA.eventos.filter((e) => e.id !== '__preview');
}

// Comentarios → HTML
function comentariosHTML(e) {
  if (!e._comentarios || !e._comentarios.length) return `<p class="empty">Sé el primero en comentar 💬</p>`;
  return e._comentarios.map((c) => `
    <div class="com-item">
      <span class="com-ava" style="background:${c.color}">${c.avatar}</span>
      <div class="com-body"><strong>${esc(c.nombre)} <small>${esc(c.fecha || '')}</small></strong><p>${esc(c.texto)}</p></div>
    </div>`).join('');
}
function addComentario(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
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
  if (!e) return;
  e._rsvp = (e._rsvp === estado) ? null : estado;
  e._voy = e._rsvp === 'voy';
  const msg = { voy: `¡Confirmado! Vas a ${e.nombre} 🎉`, tal: 'Quedaste como "tal vez" 🤔', no: 'Marcaste que no puedes 🙅' };
  toast(e._rsvp ? msg[e._rsvp] : 'Quitaste tu respuesta');
  abrirEvento(id);
}
// + / − invitados que traes (actualiza el conteo en vivo)
function acomp(id, d) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  e._rsvpExtra = Math.max(0, (e._rsvpExtra || 0) + d);
  const n = document.getElementById('acompN'); if (n) n.textContent = '+' + e._rsvpExtra;
}
// Recordatorio del evento
function toggleRecordar(id, btn) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  e._recordar = !e._recordar;
  btn.classList.toggle('is-on', e._recordar);
  toast(e._recordar ? '🔔 Te recordaremos antes del evento' : 'Recordatorio quitado');
}

// Interés desde la página
function interesadoPage(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  e._interesado = !e._interesado;
  toast(e._interesado ? `¡Listo! Te avisaremos de ${e.nombre} 🔔` : 'Ya no recibirás avisos');
  abrirEvento(id);
}

// Lista completa de invitados con PESTAÑAS (Van / Tal vez / No) + buscador
let _guestTab = 'van';
function verListaInvitados(id, tab) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  if (!puedeVerLista(e)) {
    toast((e.listaVisible || 'confirmados') === 'nadie'
      ? 'El anfitrión mantiene la lista privada 🔒'
      : 'Confirma tu asistencia para ver la lista 🔒');
    return;
  }
  _guestTab = tab || 'van';
  const c = rsvpCounts(e);
  const soyHost = e.organizador === DATA.usuario.nombre;
  // Si no eres el anfitrión, en TODAS las pestañas solo ves a tus amigos
  const soloAmigos = (arr) => soyHost ? arr : arr.filter((g) => esAmigo(g.nombre));
  const listas = {
    van: invitadosMuestra(e, Math.min(c.van, 40)),
    tal: soloAmigos((DATA.gente || []).slice(2, 2 + Math.min(c.tal, 12))),
    no:  soloAmigos((DATA.gente || []).slice(5, 5 + Math.min(c.no, 10)))
  };
  const cur = listas[_guestTab] || [];
  const tarjeta = (g) => `<article class="friend-card gci" data-nombre="${g.nombre.toLowerCase()}"><div class="friend-ava" style="background:${g.color}">${g.avatar}</div><div class="friend-main"><strong>${g.nombre}</strong></div></article>`;
  abrirSheet('Quién va', `
    ${soyHost ? '' : `<div class="lock-note">${icon('lock','mute')}<span>Por seguridad solo ves a tus amigos. El anfitrión ve la lista completa.</span></div>`}
    <div class="guest-tabs">
      <button class="gtab ${_guestTab === 'van' ? 'on' : ''}" onclick="verListaInvitados('${e.id}','van')">✅ Van<b>${c.van}</b></button>
      <button class="gtab ${_guestTab === 'tal' ? 'on' : ''}" onclick="verListaInvitados('${e.id}','tal')">🤔 Tal vez<b>${c.tal}</b></button>
      <button class="gtab ${_guestTab === 'no' ? 'on' : ''}" onclick="verListaInvitados('${e.id}','no')">🙅 No<b>${c.no}</b></button>
    </div>
    <div class="search-bar"><input placeholder="Buscar invitado…" oninput="filtrarInvitados(this.value)"></div>
    <div class="friend-list" id="guestSearchList">
      ${cur.length ? cur.map(tarjeta).join('') : `<p class="empty">Nadie por aquí todavía</p>`}
    </div>
    <div class="sheet-actions"><button class="btn-ghost full" onclick="abrirEvento('${e.id}')">‹ Volver al evento</button></div>
  `);
}
function filtrarInvitados(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('#guestSearchList .gci').forEach((el) => {
    el.style.display = el.dataset.nombre.includes(q) ? '' : 'none';
  });
}

// Guarda la respuesta del invitado a una pregunta
function guardarRespuesta(id, i, val) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  e._respuestas = e._respuestas || [];
  e._respuestas[i] = val;
}

// Anfitrión: enviar un aviso a todos los invitados (blast)
async function avisarTodos(id) {
  const e = DATA.eventos.find((ev) => ev.id === id);
  if (!e) return;
  const msg = await pedirTexto('Mensaje para todos los invitados', { ok: 'Enviar' });
  if (!msg || !msg.trim()) return;
  e._comentarios = e._comentarios || [];
  const u = DATA.usuario;
  e._comentarios.unshift({ nombre: u.nombre.split(' ')[0] + ' (anfitrión)', avatar: u.avatar, color: u.color, texto: '📣 ' + msg.trim(), fecha: 'ahora' });
  toast(`Aviso enviado a los invitados 📣`);
  abrirEvento(id);
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
  if (!e) return;
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

// Fondos de portada del perfil: gradientes en capas (luz + color) para que
// se vean con profundidad, no planos. El usuario también puede subir su foto.
const PORTADAS = [
  { id: 'aurora',     nombre: 'Aurora',     bg: 'radial-gradient(120% 140% at 15% 0%, rgba(34,211,238,.5), transparent 52%), radial-gradient(120% 130% at 88% 8%, rgba(168,85,247,.55), transparent 55%), linear-gradient(165deg, #0b1c3f, #16337e 55%, #0e7490)' },
  { id: 'neon',       nombre: 'Neón',       bg: 'radial-gradient(110% 130% at 85% 12%, rgba(244,63,94,.5), transparent 55%), radial-gradient(120% 120% at 8% 90%, rgba(0,212,255,.35), transparent 55%), linear-gradient(140deg, #1a0533, #5b21b6 58%, #db2777)' },
  { id: 'atardecer',  nombre: 'Atardecer',  bg: 'radial-gradient(130% 110% at 50% 108%, rgba(255,200,80,.75), transparent 55%), linear-gradient(180deg, #312e81, #7c3aed 42%, #f472b6 78%, #fb923c)' },
  { id: 'medianoche', nombre: 'Medianoche', bg: 'radial-gradient(circle at 22% 30%, rgba(255,255,255,.9) 0 1px, transparent 1.6px), radial-gradient(circle at 68% 18%, rgba(255,255,255,.8) 0 1px, transparent 1.6px), radial-gradient(circle at 42% 62%, rgba(255,255,255,.7) 0 .8px, transparent 1.4px), radial-gradient(circle at 85% 45%, rgba(255,255,255,.85) 0 1px, transparent 1.6px), radial-gradient(circle at 12% 70%, rgba(255,255,255,.6) 0 .8px, transparent 1.4px), linear-gradient(180deg, #050816, #0d1b3e 70%, #17275c)' },
  { id: 'oceano',     nombre: 'Océano',     bg: 'radial-gradient(120% 120% at 80% 0%, rgba(125,211,252,.55), transparent 55%), linear-gradient(160deg, #032b45, #0369a1 55%, #06b6d4)' },
  { id: 'esmeralda',  nombre: 'Esmeralda',  bg: 'radial-gradient(120% 130% at 15% 5%, rgba(52,211,153,.5), transparent 55%), linear-gradient(150deg, #022c22, #065f46 55%, #0d9488)' },
  { id: 'dorado',     nombre: 'Dorado',     bg: 'radial-gradient(120% 140% at 80% 0%, rgba(253,224,71,.5), transparent 55%), linear-gradient(150deg, #451a03, #92400e 55%, #f59e0b)' },
  { id: 'cerezo',     nombre: 'Cerezo',     bg: 'radial-gradient(120% 130% at 20% 0%, rgba(251,207,232,.6), transparent 55%), linear-gradient(150deg, #4c0519, #9f1239 55%, #f472b6)' },
  { id: 'lava',       nombre: 'Lava',       bg: 'radial-gradient(130% 120% at 50% 110%, rgba(251,146,60,.7), transparent 55%), linear-gradient(170deg, #18020a, #7f1d1d 60%, #ea580c)' },
  { id: 'uva',        nombre: 'Uva',        bg: 'radial-gradient(120% 130% at 85% 10%, rgba(196,181,253,.5), transparent 55%), linear-gradient(150deg, #1e1040, #5b21b6 60%, #8b5cf6)' },
  { id: 'hielo',      nombre: 'Hielo',      bg: 'radial-gradient(120% 130% at 20% 0%, rgba(255,255,255,.5), transparent 50%), linear-gradient(160deg, #0c4a6e, #0284c7 55%, #7dd3fc)' },
  { id: 'grafito',    nombre: 'Grafito',    bg: 'radial-gradient(120% 140% at 80% 0%, rgba(148,163,184,.35), transparent 55%), linear-gradient(160deg, #0b0f19, #1f2937 60%, #475569)' }
];

// CSS de la fuente elegida para el nombre (reusa la lista FONTS de eventos)
function fontCss(id) { return (FONTS.find((f) => f.id === id) || FONTS[0]).css; }

// Estilo de la portada del perfil: foto propia > fondo elegido > color base
function portadaBg(u) {
  if (u.portadaImg) return `background-image:url(${u.portadaImg});background-size:cover;background-position:center`;
  const p = PORTADAS.find((x) => x.id === u.portada);
  return `background:${p ? p.bg : u.color}`;
}

// Redes que se pueden vincular al perfil. El usuario ELIGE cuáles: en el
// editor cada red es un chip que se prende/apaga; solo las prendidas tienen
// campo, y en el perfil solo se muestran las que tengan algo escrito.
const RED_DEFS = {
  instagram: { nombre: 'Instagram', label: 'Usuario de Instagram', ph: 'tuusuario', cls: 'ig' },
  tiktok:    { nombre: 'TikTok',    label: 'Usuario de TikTok',    ph: 'tuusuario', cls: 'tk' }
};
const RED_SVGS = () => ({ instagram: IG_SVG, tiktok: TT_SVG });

let _redesTmp = null;   // borrador del editor: texto por red, o null = red no vinculada
let _perfilTmp = null;  // lo escrito en nombre/usuario/bio que aún no se guarda
let _edpFont = null;      // tipografía del nombre (borrador)
let _edpPortada = null;   // fondo elegido (id de PORTADAS, o null = color base)
let _edpPortadaImg = null; // foto propia de portada (borrador)

// Editar perfil abre en PANTALLA COMPLETA (mismo patrón que eventos/grupos),
// no en sheet. cerrarEditarPerfil() cierra sin guardar.
function editarPerfil(rePintado) {
  const u = DATA.usuario;
  if (!rePintado) {
    // Apertura fresca: el borrador arranca desde lo guardado
    _perfilTmp = null;
    _avatarTmp = null;
    _edpFont = u.nombreFont || 'classic';
    _edpPortada = u.portada || null;
    _edpPortadaImg = u.portadaImg || null;
    const r = u.redes || {};
    _redesTmp = {
      instagram: r.instagram || null,
      tiktok:    r.tiktok    || null
    };
  }
  const v = _perfilTmp || {};
  cerrarSheet();
  let ov = document.getElementById('editarFull');
  if (!ov) { ov = document.createElement('div'); ov.id = 'editarFull'; ov.className = 'evfull'; document.body.appendChild(ov); }
  const scroll = rePintado ? ov.scrollTop : 0;   // no brincar al re-pintar por logo
  ov.innerHTML = `
    <div class="evfull-tema" style="background:linear-gradient(180deg, rgba(6,7,10,.55), var(--bg) 62%), ${u.color};background-repeat:no-repeat"></div>
    <div class="evfull-bar">
      <button class="round-btn" onclick="cerrarEditarPerfil()" aria-label="Cerrar">✕</button>
      <strong class="edp-title">Editar perfil</strong>
    </div>
    <div class="evfull-inner edp-inner">
    <p class="form-label">Logo o foto</p>
    <div class="logo-edit">
      <div class="logo-prev" style="${avatarFondo(u)}">${u.logo ? '' : ((_avatarTmp || u.avatar) || inicialesDe(u.nombre))}</div>
      <input type="file" accept="image/*" id="logoFile" hidden onchange="subirLogo(event)">
      <button class="chip" onclick="document.getElementById('logoFile').click()">⬆ Subir logo</button>
      ${u.logo ? `<button class="chip" onclick="quitarLogo()">Quitar</button>` : ''}
    </div>
    <p class="form-label">…o elige un emoji</p>
    <div class="avatar-grid" id="avatarGrid">
      ${AVATARES.map((a) => `
        <button class="avatar-opt ${a === (_avatarTmp || u.avatar) ? 'is-sel' : ''}" onclick="elegirAvatar('${a}', this)">${a}</button>
      `).join('')}
    </div>

    <div class="field"><div class="field-main">
      <label class="field-label">Nombre</label>
      <input class="field-input" id="edNombre" value="${esc(v.nombre ?? u.nombre)}"
        oninput="const n=document.querySelector('.edp-cover-name'); if(n) n.textContent=this.value||'Tu nombre'">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Usuario</label>
      <input class="field-input" id="edUsuario" value="${esc(v.usuario ?? u.usuario)}">
    </div></div>
    <div class="field"><div class="field-main">
      <label class="field-label">Bio</label>
      <input class="field-input" id="edBio" value="${esc(v.bio ?? u.bio)}">
    </div></div>

    <div id="edpEstilo">${estiloEdHTML()}</div>

    <p class="form-label" style="margin-top:18px">Redes sociales</p>
    <p class="hint">Toca las que quieras mostrar en tu perfil. Solo se ven las que agregues.</p>
    <div id="redesEd">${redesEdHTML()}</div>

    <div class="sheet-actions">
      <button class="btn full" onclick="guardarPerfil()">Guardar cambios</button>
    </div>
    </div>
  `;
  ov.classList.add('is-open');
  ov.scrollTop = scroll;
}

// Cierra la pantalla de editar perfil (sin guardar)
function cerrarEditarPerfil() {
  const ov = document.getElementById('editarFull');
  if (ov) { ov.classList.remove('is-open'); ov.innerHTML = ''; }
}

// Sección "estilo" del editor: preview en vivo + fondos + tipografía
function estiloEdHTML() {
  const u = DATA.usuario;
  const nombre = (_perfilTmp && _perfilTmp.nombre != null ? _perfilTmp.nombre : u.nombre) || 'Tu nombre';
  const prevBg = _edpPortadaImg
    ? `background-image:url(${_edpPortadaImg});background-size:cover;background-position:center`
    : `background:${(PORTADAS.find((p) => p.id === _edpPortada) || {}).bg || u.color}`;
  return `
    <p class="form-label" style="margin-top:18px">Fondo del perfil</p>
    <div class="edp-cover" style="${prevBg}">
      <span class="edp-cover-name" style="font-family:${fontCss(_edpFont)}">${esc(nombre)}</span>
    </div>
    <div class="port-grid">
      <button type="button" class="port-opt ${!_edpPortada && !_edpPortadaImg ? 'is-sel' : ''}" style="background:${u.color}" title="Tu color" onclick="setPortada(null)"></button>
      ${PORTADAS.map((p) => `
        <button type="button" class="port-opt ${_edpPortada === p.id && !_edpPortadaImg ? 'is-sel' : ''}" style="background:${p.bg}" title="${p.nombre}" onclick="setPortada('${p.id}')"></button>`).join('')}
    </div>
    <div class="logo-edit" style="margin-top:10px">
      <input type="file" accept="image/*" id="portFile" hidden onchange="subirPortada(event)">
      <button class="chip" onclick="document.getElementById('portFile').click()">⬆ Tu propia foto</button>
      ${_edpPortadaImg ? `<button class="chip" onclick="quitarPortada()">Quitar foto</button>` : ''}
    </div>

    <p class="form-label" style="margin-top:18px">Tipografía de tu nombre</p>
    <div class="fontsel-row">
      ${FONTS.map((f) => `
        <button type="button" class="fontsel ${f.id === _edpFont ? 'is-sel' : ''}" onclick="setEdpFont('${f.id}')">
          <b style="font-family:${f.css}">Aa</b><small>${f.nombre}</small>
        </button>`).join('')}
    </div>`;
}
// Re-pinta SOLO la sección de estilo (sin tocar lo escrito en los campos)
function refrescarEstiloEd() {
  const c = document.getElementById('edpEstilo');
  if (c) { _capturarPerfil(); c.innerHTML = estiloEdHTML(); }
}
function setPortada(id) { _edpPortada = id; _edpPortadaImg = null; refrescarEstiloEd(); }
function setEdpFont(id) { _edpFont = id; refrescarEstiloEd(); }
function subirPortada(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => { _edpPortadaImg = r.result; refrescarEstiloEd(); };
  r.readAsDataURL(f);
}
function quitarPortada() { _edpPortadaImg = null; refrescarEstiloEd(); }

// Chips de redes + campos SOLO de las redes prendidas
function redesEdHTML() {
  const svgs = RED_SVGS();
  const chips = Object.keys(RED_DEFS).map((k) => {
    const d = RED_DEFS[k], on = _redesTmp[k] !== null;
    return `<button type="button" class="redsel ${d.cls} ${on ? 'is-on' : ''}" onclick="toggleRed('${k}')">${svgs[k]}<span>${d.nombre}</span></button>`;
  }).join('');
  const campos = Object.keys(RED_DEFS).filter((k) => _redesTmp[k] !== null).map((k) => {
    const d = RED_DEFS[k];
    return `
      <div class="field"><span class="field-icon red-ic ${d.cls}">${svgs[k]}</span><div class="field-main">
        <label class="field-label">${d.label}</label>
        <input class="field-input" id="edRed_${k}" value="${esc(_redesTmp[k])}" placeholder="${d.ph}">
      </div></div>`;
  }).join('');
  return `<div class="redsel-row">${chips}</div>${campos}`;
}

// Junta lo escrito en los campos de redes visibles (antes de re-pintar)
function _capturarRedes() {
  Object.keys(RED_DEFS).forEach((k) => {
    const inp = document.getElementById('edRed_' + k);
    if (inp) _redesTmp[k] = inp.value;
  });
}
// Junta TODO lo escrito en el editor (para que no se pierda al re-pintar)
function _capturarPerfil() {
  _capturarRedes();
  _perfilTmp = {
    nombre:  document.getElementById('edNombre')?.value,
    usuario: document.getElementById('edUsuario')?.value,
    bio:     document.getElementById('edBio')?.value
  };
}
function toggleRed(k) {
  _capturarRedes();
  _redesTmp[k] = _redesTmp[k] === null ? '' : null;   // prender ↔ apagar
  document.getElementById('redesEd').innerHTML = redesEdHTML();
  if (_redesTmp[k] !== null) document.getElementById('edRed_' + k)?.focus();
}

function subirLogo(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => { _capturarPerfil(); DATA.usuario.logo = r.result; editarPerfil(true); };
  r.readAsDataURL(f);
}
function quitarLogo() { _capturarPerfil(); DATA.usuario.logo = null; editarPerfil(true); }

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
  // Estilo: tipografía del nombre y fondo del perfil
  u.nombreFont = _edpFont;
  u.portada = _edpPortada;
  u.portadaImg = _edpPortadaImg;
  // Redes sociales: solo las que el usuario dejó vinculadas
  _capturarRedes();
  u.redes = u.redes || {};
  u.redes.instagram = (_redesTmp.instagram || '').trim().replace(/^@+/, '');
  u.redes.tiktok    = (_redesTmp.tiktok    || '').trim().replace(/^@+/, '');
  delete u.redes.whatsapp;   // ya no pedimos teléfono
  _redesTmp = null;
  _perfilTmp = null;
  cerrarEditarPerfil();
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
  if (window.Socialice && window.Socialice.configurado) window.Socialice.logout();
  document.querySelectorAll('.screen').forEach((s) =>
    s.classList.toggle('is-active', s.id === 'screen-splash'));
  document.body.dataset.screen = 'splash';
  splashIr('welcome');
  toast('Sesión cerrada');
}

// Enrutado según la sesión de Firebase (lo llama firebase-init cuando el
// estado de autenticación cambia: al abrir, al entrar o al cerrar sesión).
function rutaSesion(user) {
  const splash = document.getElementById('screen-splash');
  if (!splash) return;
  if (user) {
    splash.classList.remove('is-active');
    if (document.body.dataset.screen === 'splash') entrarApp();
  } else {
    splash.classList.add('is-active');
    document.body.dataset.screen = 'splash';
    splashIr('welcome');
  }
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

  // Rellena los iconos declarados en el HTML estático (<span data-icon="mail">):
  // un solo lugar (ICON_PATHS) en vez de SVGs repetidos por pantalla
  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

  // Registro: el selector de fecha no permite elegir a un menor de 18
  // (el máximo es "hace 18 años"). Se calcula al abrir por si cambia el día.
  const fNacInput = document.getElementById('regNacimiento');
  if (fNacInput) fNacInput.max = maxFechaNacimiento();

  // La barra de navegación se ENCOGE un poco mientras haces scroll (deja ver
  // más el contenido detrás del vidrio) y vuelve a su tamaño al soltar.
  // Se escucha en document con capture: así también cuenta el scroll de
  // contenedores internos (vistas full-screen, listas), no solo el del body.
  let navMiniT = null;
  const navEl = document.querySelector('.bottom-nav');
  document.addEventListener('scroll', () => {
    if (!navEl) return;
    navEl.classList.add('nav-mini');
    clearTimeout(navMiniT);
    navMiniT = setTimeout(() => navEl.classList.remove('nav-mini'), 480);
  }, { capture: true, passive: true });

  // Arranque según la sesión:
  // - Con Firebase configurado: dejamos el splash visible; firebase-init
  //   enruta cuando resuelve la sesión (ver rutaSesion más abajo). Si hay
  //   sesión abierta, entra a la app; si no, se queda en la bienvenida.
  // - Sin Firebase (modo mock local): entra directo como antes.
  if (!(window.Socialice && window.Socialice.configurado)) {
    document.getElementById('screen-splash').classList.remove('is-active');
    entrarApp();
  }

  // --- Atajo de desarrollo (solo para pruebas) ---
  // Permite abrir una pantalla directa, ej: ?screen=home&rol=asistente
  const p = new URLSearchParams(location.search);
  if (p.get('rol')) DATA.usuario.rol = p.get('rol');
  if (p.get('splash')) splashIr(p.get('splash'));
  if (p.get('efx')) draft.efecto = p.get('efx');   // prueba: ?screen=create&efx=confeti
  if (p.get('tema')) draft.tema = +p.get('tema');  // prueba: ?screen=create&tema=2
  if (p.get('seq')) {  // prueba de navegación: ?seq=create,home,search
    document.getElementById('screen-splash').classList.remove('is-active');
    entrarApp();
    p.get('seq').split(',').forEach((n) => { if (n === 'create') { draft = nuevoDraft(); } irA(n.trim()); });
  }
  if (p.get('screen')) {
    document.getElementById('screen-splash').classList.remove('is-active');
    entrarApp();
    irA(p.get('screen'));
  }
  if (p.get('sheet') === 'evento')  abrirEvento('e1');
  if (p.get('sheet') === 'crear')   abrirCrearMenu();
  if (p.get('sheet') === 'conect')  abrirConectados();
  if (p.get('evento')) { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); abrirEvento(p.get('evento')); }
  if (p.get('sheet') === 'ajustes') abrirAjustes();
  if (p.get('sheet') === 'ajustesEvento') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('create'); abrirAjustesEvento(); }
  if (p.get('sheet') === 'editar')  editarPerfil();
  if (p.get('sheet') === 'temaCustom') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('create'); abrirTemaCustom(); }
  if (p.get('sheet') === 'temas') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('create'); abrirTemas(); }
  if (p.get('sheet') === 'discoColor') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('create'); abrirDiscoColor(); }
  if (p.get('sheet') === 'preview') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('create'); vistaPreviaEvento(); }
  if (p.get('sheet') === 'pases') { document.getElementById('screen-splash').classList.remove('is-active'); entrarApp(); irA('profile'); abrirPases(); }
  if (p.get('sheet') === 'grupo') { irA('friends'); abrirGrupo(((DATA.grupos || [])[0] || {}).id); }
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

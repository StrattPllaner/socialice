/* =====================================================================
   SOCIALICE · Inicialización de Firebase (Auth + Firestore)
   ---------------------------------------------------------------------
   Módulo ES aislado: NO reescribe app.js. Expone una mini-API en
   window.Socialice que app.js llama en el registro / login.

   >>> PARA ACTIVARLO: pega abajo tu firebaseConfig (consola de Firebase,
       Project settings → tus apps → Web). Mientras siga el placeholder,
       la app funciona en MODO MOCK como hasta ahora (no rompe nada).

   Enforcement real de la edad 18+: las reglas de Firestore (firestore.rules)
   revalidan la fecha en el servidor; este cliente es solo la 1ª barrera.
   ===================================================================== */

// Versión del SDK por CDN (sin npm/build). Puedes subirla cuando quieras.
const FB = '11.0.0';

const firebaseConfig = {
  apiKey: 'AIzaSyAj9s4-wTQZkBRY2BWtUmAc9CXhkraCJRU',
  authDomain: 'socialice-1f01d.firebaseapp.com',
  projectId: 'socialice-1f01d',
  storageBucket: 'socialice-1f01d.firebasestorage.app',
  messagingSenderId: '598616002100',
  appId: '1:598616002100:web:ae9fb13aa136f1b7488461',
  measurementId: 'G-BD75L85ZH3',
};

// ¿Ya pegaste tus claves? Si no, arrancamos en modo mock y salimos.
const CONFIGURADO = !firebaseConfig.apiKey.startsWith('TU_');

// La API que verá app.js. 'configurado' le dice si hay backend real.
window.Socialice = { configurado: CONFIGURADO };

if (!CONFIGURADO) {
  console.info('[Socialice] Firebase no configurado todavía → modo mock. Pega tu firebaseConfig en js/firebase-init.js');
} else {
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${FB}/firebase-app.js`);
  const {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged,
    sendPasswordResetEmail,
  } = await import(`https://www.gstatic.com/firebasejs/${FB}/firebase-auth.js`);
  const {
    getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, writeBatch,
    collection, query, where, getDocs, limit, addDoc, increment,
    serverTimestamp, Timestamp,
  } = await import(`https://www.gstatic.com/firebasejs/${FB}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // 'YYYY-MM-DD' -> Timestamp de Firestore (hora local, medianoche).
  const fechaATimestamp = (iso) => Timestamp.fromDate(new Date(iso + 'T00:00:00'));

  // Traduce errores de Firebase a mensajes en español para el toast.
  function mensajeError(e) {
    const c = e && e.code || '';
    console.error('[Socialice] Error de Firebase:', c, e && e.message);
    if (c === 'auth/email-already-in-use') return 'Ese correo ya tiene cuenta.';
    if (c === 'auth/invalid-email') return 'El correo no es válido.';
    if (c === 'auth/weak-password') return 'La contraseña es muy débil (mínimo 6).';
    if (c === 'auth/invalid-credential' || c === 'auth/wrong-password') return 'Correo o contraseña incorrectos.';
    if (c === 'auth/operation-not-allowed') return 'Falta habilitar Email/Password en Firebase → Authentication.';
    if (c === 'auth/popup-closed-by-user') return 'Cerraste la ventana de Google.';
    if (c === 'auth/network-request-failed') return 'Sin conexión. Revisa tu internet.';
    if (c === 'auth/too-many-requests') return 'Demasiados intentos. Espera un momento.';
    if (c === 'permission-denied') return 'No se pudo completar (revisa tu edad o usuario).';
    return 'Algo salió mal. Intenta de nuevo.';
  }

  // Normaliza un @usuario a la clave del documento en 'usernames' (sin @, minúsculas).
  const claveUsuario = (usuario) => (usuario || '').replace(/^@+/, '').toLowerCase();

  // ¿El @usuario está libre? Lectura pública de 'usernames' (para UX). La
  // garantía real de unicidad es el batch de creación (las reglas impiden
  // sobrescribir un usuario ya tomado).
  async function usuarioDisponible(usuario) {
    const snap = await getDoc(doc(db, 'usernames', claveUsuario(usuario)));
    return !snap.exists();
  }

  // Guarda el perfil + RESERVA el usuario de forma atómica (batch). Si el
  // usuario ya está tomado, el batch falla entero (no crea nada). Las reglas
  // también rechazan a menores. Guarda la FECHA, no un booleano.
  function guardarPerfil(uid, { nombre, usuario, bio, fechaNacimiento, proveedor }) {
    const batch = writeBatch(db);
    // El doc de username lleva info pública mínima (para descubrir/agregar amigos).
    batch.set(doc(db, 'usernames', claveUsuario(usuario)), { uid, nombre: nombre || '' });
    batch.set(doc(db, 'usuarios', uid), {
      nombre,
      usuario,
      bio: bio || '',
      fechaNacimiento: fechaATimestamp(fechaNacimiento),
      proveedor: proveedor || 'email',
      creado: serverTimestamp(),
    });
    return batch.commit();
  }

  // Registro por email: crea la cuenta (Auth) + su documento. Si las reglas
  // rechazan el documento (menor), borramos el usuario Auth para no dejar
  // cuentas huérfanas.
  async function crearCuenta({ email, password, nombre, usuario, bio, fechaNacimiento }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await guardarPerfil(cred.user.uid, { nombre, usuario, bio, fechaNacimiento, proveedor: 'email' });
    } catch (e) {
      try { await cred.user.delete(); } catch (_) {}
      throw e;
    }
    return cred.user.uid;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user.uid;
  }

  // Solo abre el popup de Google. El enrutado (entrar vs. onboarding) lo decide
  // el listener de sesión según si el usuario ya tiene documento de perfil.
  function loginGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }

  // Crea el documento de perfil de un usuario de Google recién entrado (que aún
  // no lo tiene). Requiere sesión activa; las reglas revalidan la edad 18+.
  function completarPerfilGoogle({ nombre, usuario, bio, fechaNacimiento }) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return guardarPerfil(u.uid, { nombre, usuario, bio, fechaNacimiento, proveedor: 'google' });
  }

  // Actualiza campos del perfil del usuario logueado. NO toca fechaNacimiento
  // (las reglas exigen que no cambie) ni el usuario (eso usa cambiarUsuario).
  function actualizarPerfil(cambios) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return updateDoc(doc(db, 'usuarios', u.uid), cambios);
  }

  // Cambia el @usuario: reserva el nuevo, libera el viejo y actualiza el perfil,
  // todo en un batch. Si el nuevo ya está tomado, el batch falla (no cambia nada).
  // 'display' = { nombre, avatar, color } para el doc público del username.
  function cambiarUsuario(nuevo, viejo, display) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    const nuevoKey = claveUsuario(nuevo);
    const viejoKey = claveUsuario(viejo);
    const batch = writeBatch(db);
    batch.set(doc(db, 'usernames', nuevoKey), { uid: u.uid, ...(display || {}) });  // create → falla si existe
    if (viejoKey && viejoKey !== nuevoKey) batch.delete(doc(db, 'usernames', viejoKey));
    batch.update(doc(db, 'usuarios', u.uid), { usuario: nuevo });
    return batch.commit();
  }

  // Mantiene fresca la info pública del username (nombre/avatar/color) al editar
  // el perfil, para que al agregarte de amigo se vea bien.
  function sincronizarPerfilPublico(usuario, display) {
    return updateDoc(doc(db, 'usernames', claveUsuario(usuario)), display);
  }

  // Busca un usuario por @usuario (lectura pública de 'usernames'). Devuelve
  // { uid, usuario, nombre, avatar, color, redes, seguidores } o null si no existe.
  async function buscarUsuario(usuario) {
    const snap = await getDoc(doc(db, 'usernames', claveUsuario(usuario)));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: d.uid, usuario: '@' + claveUsuario(usuario),
      nombre: d.nombre || '', avatar: d.avatar || null, color: d.color || null,
      redes: d.redes || {}, seguidores: d.seguidores || 0,
    };
  }

  /* --- AMIGOS ---
     Lista de amigos del usuario en usuarios/{uid}/amigos/{amigoUid} (privada:
     solo el dueño). Se guarda info denormalizada del amigo para no leer su
     documento privado. Modelo de "seguir" (agregar directo). */
  function agregarAmigo(amigo) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    if (!amigo.uid) throw new Error('Falta el uid del amigo');
    return setDoc(doc(db, 'usuarios', u.uid, 'amigos', amigo.uid),
      { ...amigo, agregado: serverTimestamp() });
  }
  function quitarAmigo(amigoUid) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return deleteDoc(doc(db, 'usuarios', u.uid, 'amigos', amigoUid));
  }
  function setMejorAmigo(amigoUid, valor) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return updateDoc(doc(db, 'usuarios', u.uid, 'amigos', amigoUid), { mejorAmigo: !!valor });
  }
  async function cargarAmigos() {
    const u = auth.currentUser;
    if (!u) return [];
    const snap = await getDocs(collection(db, 'usuarios', u.uid, 'amigos'));
    const out = [];
    snap.forEach((d) => out.push(d.data()));
    return out;
  }

  /* --- SEGUIR ---
     A diferencia de "amigos" (mutuo, agregar directo), seguir es de UNA VÍA:
     yo decido a quién sigo, sin que la otra persona lo apruebe. Lo que YO
     sigo vive en usuarios/{uid}/siguiendo/{targetUid} (privado, solo yo lo
     leo/escribo). El CONTADOR público de seguidores vive en
     usernames/{handle}.seguidores — se ajusta ±1 en el mismo batch que crea/
     borra mi registro de "siguiendo", así nunca queda desincronizado. */
  function seguirUsuario(target) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    if (!target.uid || !target.usuario) throw new Error('Falta el usuario a seguir');
    const batch = writeBatch(db);
    batch.set(doc(db, 'usuarios', u.uid, 'siguiendo', target.uid),
      { usuario: target.usuario, nombre: target.nombre || '', desde: serverTimestamp() });
    batch.update(doc(db, 'usernames', claveUsuario(target.usuario)), { seguidores: increment(1) });
    return batch.commit();
  }
  function dejarDeSeguir(target) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    const batch = writeBatch(db);
    batch.delete(doc(db, 'usuarios', u.uid, 'siguiendo', target.uid));
    batch.update(doc(db, 'usernames', claveUsuario(target.usuario)), { seguidores: increment(-1) });
    return batch.commit();
  }
  async function cargarSiguiendo() {
    const u = auth.currentUser;
    if (!u) return [];
    const snap = await getDocs(collection(db, 'usuarios', u.uid, 'siguiendo'));
    const out = [];
    snap.forEach((d) => out.push({ uid: d.id, ...d.data() }));
    return out;
  }

  /* --- BLOQUEAR ---
     usuarios/{uid}/bloqueados/{targetUid}: privado, solo yo lo leo/escribo.
     El cliente usa esta lista para sacar de MI feed a quien bloqueé (no es
     un baneo del lado del servidor, es "ya no lo quiero ver"). */
  function bloquearUsuario(target) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return setDoc(doc(db, 'usuarios', u.uid, 'bloqueados', target.uid),
      { usuario: target.usuario, nombre: target.nombre || '', desde: serverTimestamp() });
  }
  function desbloquearUsuario(targetUid) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return deleteDoc(doc(db, 'usuarios', u.uid, 'bloqueados', targetUid));
  }
  async function cargarBloqueados() {
    const u = auth.currentUser;
    if (!u) return [];
    const snap = await getDocs(collection(db, 'usuarios', u.uid, 'bloqueados'));
    const out = [];
    snap.forEach((d) => out.push({ uid: d.id, ...d.data() }));
    return out;
  }

  /* --- REPORTAR ---
     reportes/{id}: solo CREAR (nadie puede leer reportes ajenos desde el
     cliente; se revisan desde la consola de Firebase). */
  function crearReporte({ targetUid, targetUsuario, targetNombre, motivo }) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return addDoc(collection(db, 'reportes'), {
      reporterUid: u.uid, targetUid, targetUsuario, targetNombre: targetNombre || '',
      motivo: motivo || '', creado: serverTimestamp(),
    });
  }

  // Envía el correo de restablecimiento de contraseña (Firebase). Con la
  // protección anti-enumeración activa, no revela si el correo existe.
  function recuperarPass(email) {
    return sendPasswordResetEmail(auth, email);
  }

  /* --- EVENTOS ---
     Cada evento es eventos/{id}. El dueño (organizerUid) es el único que puede
     crear/editar/borrar; cualquiera logueado lee los públicos y los suyos.
     Los posts/noticias del evento NO van aquí todavía (crecen mucho: irán en
     una subcolección más adelante). */
  function crearEvento(id, datos) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return setDoc(doc(db, 'eventos', id), {
      ...datos, organizerUid: u.uid, creado: serverTimestamp(),
    });
  }
  function actualizarEvento(id, datos) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return setDoc(doc(db, 'eventos', id), {
      ...datos, organizerUid: u.uid, actualizado: serverTimestamp(),
    }, { merge: true });
  }
  function borrarEvento(id) {
    return deleteDoc(doc(db, 'eventos', id));
  }
  // Carga los eventos públicos + los del propio usuario (para el feed).
  // Sin orderBy para no requerir índice compuesto; se ordena en el cliente.
  async function cargarEventos() {
    const u = auth.currentUser;
    if (!u) return [];
    const [pub, mios] = await Promise.all([
      getDocs(query(collection(db, 'eventos'), where('publico', '==', true), limit(100))),
      getDocs(query(collection(db, 'eventos'), where('organizerUid', '==', u.uid))),
    ]);
    const mapa = new Map();
    const meter = (d) => mapa.set(d.id, { id: d.id, ...d.data() });
    pub.forEach(meter); mios.forEach(meter);
    return [...mapa.values()];
  }

  /* --- RSVP ("voy" / "tal vez" / "no" / interesado) ---
     La respuesta de CADA usuario vive en usuarios/{uid}/rsvps/{eid} (privado:
     solo el dueño la lee/escribe). Así "voy a ir" persiste por usuario. La
     lista/conteo de invitados de cara al evento es un slice posterior. */
  function guardarRsvp(eid, datos) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return setDoc(doc(db, 'usuarios', u.uid, 'rsvps', eid),
      { ...datos, actualizado: serverTimestamp() }, { merge: true });
  }
  function borrarRsvp(eid) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return deleteDoc(doc(db, 'usuarios', u.uid, 'rsvps', eid));
  }
  async function cargarRsvps() {
    const u = auth.currentUser;
    if (!u) return {};
    const snap = await getDocs(collection(db, 'usuarios', u.uid, 'rsvps'));
    const out = {};
    snap.forEach((d) => { out[d.id] = d.data(); });
    return out;   // { eid: { rsvp, interesado, extra } }
  }

  const logout = () => signOut(auth);
  const onSesion = (cb) => onAuthStateChanged(auth, cb);

  Object.assign(window.Socialice, {
    crearCuenta, login, loginGoogle, completarPerfilGoogle, actualizarPerfil,
    usuarioDisponible, cambiarUsuario, recuperarPass,
    crearEvento, actualizarEvento, borrarEvento, cargarEventos,
    guardarRsvp, borrarRsvp, cargarRsvps,
    sincronizarPerfilPublico, buscarUsuario,
    agregarAmigo, quitarAmigo, setMejorAmigo, cargarAmigos,
    seguirUsuario, dejarDeSeguir, cargarSiguiendo,
    bloquearUsuario, desbloquearUsuario, cargarBloqueados,
    crearReporte,
    logout, onSesion, mensajeError,
  });

  // Router de sesión (las funciones viven en app.js). Se dispara al cargar y en
  // cada cambio de autenticación:
  //  - Sin sesión           → rutaSesion(null)  (bienvenida)
  //  - Usuario por email     → rutaSesion(user)  (su doc se crea en el registro)
  //  - Google con perfil     → rutaSesion(user)  (entra)
  //  - Google SIN perfil     → rutaOnboarding()  (pide fecha 18+ y crea el doc)
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.rutaSesion && window.rutaSesion(null); return; }
    // Carga el documento de perfil del usuario logueado.
    let perfil = null;
    try {
      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      if (snap.exists()) perfil = snap.data();
    } catch (_) {}
    if (perfil) {
      // Timestamp -> 'YYYY-MM-DD' para que app.js no dependa de tipos de Firestore.
      if (perfil.fechaNacimiento && perfil.fechaNacimiento.toDate) {
        const d = perfil.fechaNacimiento.toDate();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        perfil.fechaNacimiento = `${d.getFullYear()}-${mm}-${dd}`;
      }
      if (window.aplicarPerfil) window.aplicarPerfil(perfil);
      // Carga los eventos reales al feed y las respuestas RSVP del usuario
      // (no bloquea si falla). Los RSVP se aplican después de los eventos.
      try {
        const evs = await cargarEventos();
        if (window.aplicarEventos) window.aplicarEventos(evs);
        const rs = await cargarRsvps();
        if (window.aplicarRsvps) window.aplicarRsvps(rs);
        const ams = await cargarAmigos();
        if (window.aplicarAmigos) window.aplicarAmigos(ams);
        const sig = await cargarSiguiendo();
        if (window.aplicarSiguiendo) window.aplicarSiguiendo(sig);
        const bloq = await cargarBloqueados();
        if (window.aplicarBloqueados) window.aplicarBloqueados(bloq);
      } catch (_) {}
      window.rutaSesion && window.rutaSesion(user);
      return;
    }
    // Sin documento: Google en su primer login → onboarding. Un usuario por
    // email en pleno registro ya tiene DATA seteado por reg3Submit → entra.
    const esGoogle = (user.providerData || []).some((p) => p.providerId === 'google.com');
    if (esGoogle && window.rutaOnboarding) {
      window.rutaOnboarding({ uid: user.uid, nombre: user.displayName || '', email: user.email || '' });
    } else {
      window.rutaSesion && window.rutaSesion(user);
    }
  });

  console.info('[Socialice] Firebase conectado ✓');
}

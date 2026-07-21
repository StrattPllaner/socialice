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
  } = await import(`https://www.gstatic.com/firebasejs/${FB}/firebase-auth.js`);
  const {
    getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp,
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
    if (c === 'permission-denied') return 'Debes tener 18 años o más para usar Socialice.';
    return 'Algo salió mal. Intenta de nuevo.';
  }

  // Guarda el documento de perfil en Firestore. Las reglas rechazan a menores
  // (recalculan la edad desde la fecha). Se usa tanto en el registro por email
  // como al completar el perfil tras entrar con Google. Guarda la FECHA, no un
  // booleano, para poder auditar/recalcular.
  function guardarPerfil(uid, { nombre, usuario, bio, fechaNacimiento, proveedor }) {
    return setDoc(doc(db, 'usuarios', uid), {
      nombre,
      usuario,
      bio: bio || '',
      fechaNacimiento: fechaATimestamp(fechaNacimiento),
      proveedor: proveedor || 'email',
      creado: serverTimestamp(),
    });
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
  // (las reglas exigen que no cambie). No se guardan imágenes base64 aquí
  // (portadaImg/logo van a Firebase Storage más adelante).
  function actualizarPerfil(cambios) {
    const u = auth.currentUser;
    if (!u) throw new Error('No hay sesión activa');
    return updateDoc(doc(db, 'usuarios', u.uid), cambios);
  }

  const logout = () => signOut(auth);
  const onSesion = (cb) => onAuthStateChanged(auth, cb);

  Object.assign(window.Socialice, {
    crearCuenta, login, loginGoogle, completarPerfilGoogle, actualizarPerfil,
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

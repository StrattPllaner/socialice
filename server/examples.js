/* =====================================================================
   SOCIALICE · Ejemplos de uso del núcleo de verificación de edad
   ---------------------------------------------------------------------
   BLUEPRINT (no está conectado a nada todavía). Muestra cómo aplicar
   asegurarEdadMinima() en los distintos puntos de creación de usuarios y
   cómo NO exponer la fecha de nacimiento en respuestas públicas.

   Todo depende de un solo núcleo: ./ageVerification.js
   ===================================================================== */

'use strict';

const { asegurarEdadMinima, EdadInsuficienteError } = require('./ageVerification');

/* ---------------------------------------------------------------------
   PRIVACIDAD · Minimización de datos (GDPR / protección de menores)
   - La fecha de nacimiento es un dato sensible: se guarda cifrada/segura,
     se usa solo para verificar edad y auditar, y NUNCA se devuelve en
     perfiles públicos ni en respuestas que no la necesiten.
   - Usa este saneador para todo lo que salga hacia otros usuarios.
   --------------------------------------------------------------------- */
function perfilPublico(usuario) {
  // Lista blanca: solo lo que es seguro exponer. (No incluye fechaNacimiento,
  // email, ni nada sensible.)
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    usuario: usuario.usuario,
    bio: usuario.bio,
    avatar: usuario.avatar,
    ciudad: usuario.ciudad,
    verificado: usuario.verificado,
  };
}

/* =====================================================================
   1) FIREBASE · Registro por Callable Function (formulario web)
   ===================================================================== */
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();
//
// exports.crearCuenta = functions.https.onCall(async (data, context) => {
//   // 'data.fechaNacimiento' viene del cliente como 'YYYY-MM-DD'.
//   let normalizada;
//   try {
//     ({ fechaNacimiento: normalizada } = asegurarEdadMinima(data.fechaNacimiento));
//   } catch (e) {
//     if (e instanceof EdadInsuficienteError) {
//       // 'permission-denied' se mapea a 403 en el cliente.
//       throw new functions.https.HttpsError('permission-denied', e.message, { code: e.code });
//     }
//     throw e;
//   }
//
//   const user = await admin.auth().createUser({ email: data.email, password: data.password });
//   await admin.firestore().doc(`usuarios/${user.uid}`).set({
//     nombre: data.nombre,
//     usuario: data.usuario,
//     bio: data.bio || '',
//     fechaNacimiento: normalizada,   // se guarda la FECHA, no un booleano
//     creado: admin.firestore.FieldValue.serverTimestamp(),
//   });
//   return { uid: user.uid };
// });

/* =====================================================================
   2) FIREBASE · Login social (Google/Apple) — blocking function
   Se ejecuta ANTES de crear el usuario en Auth. Si el proveedor no da la
   fecha, se rechaza y la app debe pedirla en un paso extra de onboarding.
   ===================================================================== */
// exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {
//   const fecha = user.customClaims?.fechaNacimiento;  // o desde tu flujo de onboarding
//   try {
//     asegurarEdadMinima(fecha);
//   } catch (e) {
//     throw new functions.auth.HttpsError('permission-denied', e.message);
//   }
// });

/* =====================================================================
   3) EXPRESS · Endpoint de registro genérico (stack no-Firebase)
   ===================================================================== */
function registrarExpress(db) {
  return async function handler(req, res) {
    try {
      // Se ignora cualquier 'edad'/'esMayor' del body: se recalcula acá.
      const { fechaNacimiento } = asegurarEdadMinima(req.body.fechaNacimiento);

      const usuario = await db.usuarios.create({
        email: req.body.email,
        // ...hash de contraseña, nombre, usuario, bio...
        fechaNacimiento,   // se guarda la FECHA, no un booleano
      });

      // La respuesta NO incluye la fecha de nacimiento.
      return res.status(201).json(perfilPublico(usuario));
    } catch (e) {
      if (e instanceof EdadInsuficienteError) {
        return res.status(403).json({ error: e.code, mensaje: e.message });
      }
      return res.status(400).json({ error: 'signup/invalid', mensaje: 'Datos de registro inválidos.' });
    }
  };
}

/* =====================================================================
   4) IMPORTACIONES / SEEDS / ADMIN
   El mismo chequeo, sin excepciones: si una fila no pasa, se descarta.
   ===================================================================== */
function importarUsuarios(filas) {
  const aceptados = [];
  const rechazados = [];
  for (const fila of filas) {
    try {
      const { fechaNacimiento } = asegurarEdadMinima(fila.fechaNacimiento);
      aceptados.push({ ...fila, fechaNacimiento });
    } catch (e) {
      rechazados.push({ fila, motivo: e.message });
    }
  }
  return { aceptados, rechazados };
}

module.exports = { perfilPublico, registrarExpress, importarUsuarios };

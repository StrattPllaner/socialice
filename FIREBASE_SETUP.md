# Conectar Socialice con Firebase

Todo el código ya está listo. La app funciona en **modo mock** hasta que pegues
tu `firebaseConfig`; en cuanto lo pegues, el registro y el login pasan a ser reales.

## Paso 1 — Consola (solo tú puedes hacerlo)

En https://console.firebase.google.com

1. **Crear un proyecto** (ej. `socialice`).
2. **Build → Authentication → Get started → Sign-in method:**
   - Activar **Email/Password**.
   - Activar **Google** (elige un correo de soporte).
   - *(Apple es opcional y requiere cuenta de Apple Developer de pago.)*
3. **Build → Firestore Database → Create database** → modo **producción** → elige región.
4. **⚙️ Project settings → General → Your apps → Web (`</>`)**: registra la app
   (sin Hosting por ahora) y **copia el objeto `firebaseConfig`**.

## Paso 2 — Pegar tus claves (30 seg)

Abre `js/firebase-init.js` y reemplaza el bloque `firebaseConfig` (los `TU_...`)
por el que copiaste. Eso es todo lo que necesita el cliente. *(Esas claves no son
secretas: van en el cliente por diseño; lo que protege los datos son las reglas.)*

## Paso 3 — Publicar las reglas de seguridad (importante)

Las reglas (`firestore.rules`) son las que **de verdad** bloquean a menores de 18
y hacen privada la fecha de nacimiento. Dos formas de subirlas:

- **Rápida:** copia el contenido de `firestore.rules` en la consola
  (**Firestore → Rules → Publish**).
- **Con CLI** (necesita instalar Node + `npm i -g firebase-tools`):
  ```bash
  firebase login
  firebase use TU_PROYECTO          # el project id real
  firebase deploy --only firestore:rules
  ```

## Paso 4 (opcional) — Desplegar la app en Firebase Hosting

Ya está el `firebase.json`. Con la CLI:
```bash
firebase deploy --only hosting
```
También puedes seguir en tu hosting actual: el cliente funciona igual.

---

## Qué quedó conectado

- **Registro** (`reg3Submit`): crea usuario en Auth + documento en `usuarios/{uid}`
  con la **fecha** (no un booleano). Las reglas rechazan a menores → error 403.
- **Login** (`loginSubmit`) y **Google** (`entrarGoogle`): reales cuando hay config.
- **Privacidad:** `usuarios/{uid}` solo lo lee su dueño → nadie ve la fecha de otro.

## Pendientes (siguiente iteración, no bloquean el 18+)

- **Onboarding de Google:** un usuario nuevo por Google todavía no tiene fecha de
  nacimiento; hoy se le pide que use el registro normal. Falta una pantalla que le
  pida la fecha y cree su documento.
- **Migrar datos** (eventos, amigos, perfiles públicos) de `js/data.js` a Firestore.
- **Corte de edad exacto al día:** las reglas usan una aproximación en ms (ver nota
  en `firestore.rules`). Para exactitud usa una Cloud Function con el núcleo ya
  escrito en `server/ageVerification.js` (requiere plan Blaze).

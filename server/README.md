# Verificación de edad (18+) — lado servidor

> **Estado:** BLUEPRINT. Socialice hoy es una PWA estática sin backend
> (`js/data.js` es mock). Estos archivos son la referencia lista para conectar
> cuando exista el servidor (el código apunta a Firebase).

## Archivos

| Archivo | Qué es |
|---|---|
| `ageVerification.js` | **Núcleo compartido**, agnóstico de framework. La única fuente de verdad de la edad. |
| `examples.js` | Cómo usar el núcleo en Firebase, Express, login social e importaciones + saneador de perfil público. |

## Reglas que implementa (partes 2 y 3 del requerimiento)

1. **Nunca confiar en el cliente.** Se ignora cualquier `edad`/`esMayorDeEdad`
   que venga en la petición: la edad se **recalcula** siempre desde la fecha de
   nacimiento con `edadEnAnios()`.
2. **Rechazo claro (403).** `asegurarEdadMinima()` lanza `EdadInsuficienteError`
   (`status: 403`, `code: 'age/under-minimum'`) para menores o fechas inválidas.
3. **Se guarda la FECHA, no un booleano.** Así se puede auditar y recalcular la
   edad en el futuro (el 17 vuelto 18, cumpleaños, etc.).
4. **Un solo punto de verdad.** El mismo `asegurarEdadMinima()` se llama en
   registro web, login social (`beforeCreate`), importaciones y admin.
5. **Privacidad / minimización (GDPR).** `perfilPublico()` es una lista blanca:
   la fecha de nacimiento **nunca** sale en respuestas públicas ni en nada que
   no la necesite.

## Cómo conectarlo (Firebase)

1. `firebase init functions` en la raíz del repo.
2. Copia `ageVerification.js` a `functions/` y descomenta el bloque 1 de
   `examples.js` en tu `functions/index.js`.
3. En el cliente, cuando exista el backend, reemplaza el `entrarApp()` mock de
   `reg3Submit` (en `js/app.js`) por una llamada a la Callable `crearCuenta`,
   enviando `DATA.usuario.fechaNacimiento` (ya se captura y guarda ahí).

## Contrato cliente ↔ servidor

- El cliente envía `fechaNacimiento` como string **`'YYYY-MM-DD'`** (es justo lo
  que produce el `<input type="date" id="regNacimiento">`).
- El servidor responde **403** con `{ error: 'age/under-minimum', mensaje }` si es
  menor de 18 o la fecha es inválida.

/* =====================================================================
   SOCIALICE · Verificación de edad (18+) — NÚCLEO COMPARTIDO (servidor)
   ---------------------------------------------------------------------
   Regla del negocio: Socialice es SOLO para mayores de 18.

   Este módulo es agnóstico del framework (Firebase, Express, etc.).
   Debe usarse en TODOS los puntos donde se crea un usuario:
     - registro por formulario web
     - login social (Google / Apple)
     - importaciones / seeds / panel de admin

   Principio clave: el servidor NUNCA confía en un "esMayorDeEdad" ni en
   una "edad" que venga del cliente. Siempre recalcula la edad a partir de
   la FECHA DE NACIMIENTO. El cliente solo manda la fecha; el backend decide.
   ===================================================================== */

'use strict';

const EDAD_MINIMA = 18;

/**
 * Edad exacta en años a partir de una fecha ISO 'YYYY-MM-DD'.
 * @param {string} fechaISO  Fecha de nacimiento en formato 'YYYY-MM-DD'.
 * @param {Date}   [ahora]   Fecha de referencia (por defecto, hoy). Útil en tests.
 * @returns {number|null}    Edad en años, o null si la fecha no es válida.
 */
function edadEnAnios(fechaISO, ahora = new Date()) {
  // Validación estricta de formato: 'YYYY-MM-DD' (nada de timestamps ni texto).
  if (typeof fechaISO !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) return null;

  const [y, m, d] = fechaISO.split('-').map(Number);
  const nac = new Date(Date.UTC(y, m - 1, d));
  // Rechaza fechas "normalizadas" por el Date (ej. 2000-02-31 -> marzo).
  if (nac.getUTCFullYear() !== y || nac.getUTCMonth() !== m - 1 || nac.getUTCDate() !== d) {
    return null;
  }
  // Rechaza fechas en el futuro.
  if (nac.getTime() > ahora.getTime()) return null;

  let edad = ahora.getUTCFullYear() - y;
  const mm = ahora.getUTCMonth() - (m - 1);
  if (mm < 0 || (mm === 0 && ahora.getUTCDate() < d)) edad--;
  return edad;
}

/**
 * ¿La fecha de nacimiento corresponde a alguien de 18+ ?
 * @param {string} fechaISO
 * @returns {boolean}
 */
function esMayorDeEdad(fechaISO) {
  const edad = edadEnAnios(fechaISO);
  return edad !== null && edad >= EDAD_MINIMA;
}

/**
 * Error tipado para rechazar registros de menores (mapea a HTTP 403).
 */
class EdadInsuficienteError extends Error {
  constructor(mensaje = 'Debes tener al menos 18 años para usar Socialice.') {
    super(mensaje);
    this.name = 'EdadInsuficienteError';
    this.code = 'age/under-minimum';
    this.status = 403;
  }
}

/**
 * Puerta única para crear usuarios. Llama esto en CADA punto de alta.
 * Lanza EdadInsuficienteError (403) si la fecha es inválida o es menor de 18.
 * Devuelve la fecha normalizada para guardarla en la base de datos.
 * @param {string} fechaNacimiento  'YYYY-MM-DD' recibida del cliente.
 * @returns {{ fechaNacimiento: string }}
 */
function asegurarEdadMinima(fechaNacimiento) {
  if (!esMayorDeEdad(fechaNacimiento)) {
    throw new EdadInsuficienteError(
      edadEnAnios(fechaNacimiento) === null
        ? 'Fecha de nacimiento inválida.'
        : 'Debes tener al menos 18 años para usar Socialice.'
    );
  }
  return { fechaNacimiento };
}

module.exports = {
  EDAD_MINIMA,
  edadEnAnios,
  esMayorDeEdad,
  asegurarEdadMinima,
  EdadInsuficienteError,
};

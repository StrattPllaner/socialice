/* =====================================================================
   SOCIALICE · Lógica de la app
   ---------------------------------------------------------------------
   Aquí va lo que "hace funcionar" la app: cambiar de pantalla, pintar
   las tarjetas, la navegación inferior, el registro por pasos...
   Lo iremos construyendo paso a paso (ahora mismo está casi vacío).
   ===================================================================== */

// --- Cambiar de pantalla -------------------------------------------
// Recibe el nombre de una pantalla (ej: 'home') y la muestra,
// ocultando las demás. Lo usaremos en la nav inferior y en el registro.
function irA(nombre) {
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('is-active', s.dataset.name === nombre);
  });
  // Guardamos en el <body> qué pantalla está activa (para el CSS)
  document.body.dataset.screen = nombre;
  // Subimos arriba del todo al cambiar de pantalla
  window.scrollTo({ top: 0 });
}

// --- Moverse dentro del splash (bienvenida / login / registro) ------
// Muestra una de las "sub-pantallas" del splash por su nombre.
function splashIr(pagina) {
  document.querySelectorAll('#screen-splash .splash-page').forEach((p) => {
    p.classList.toggle('is-shown', p.dataset.page === pagina);
  });
  window.scrollTo({ top: 0 });
}

// --- Arranque -------------------------------------------------------
// Cuando la página termina de cargar, ponemos en marcha la app.
document.addEventListener('DOMContentLoaded', () => {
  // De momento no hay nada que pintar. En los próximos pasos aquí
  // llamaremos a las funciones que dibujan cada pantalla.
  console.log('Socialice listo ✨');
});

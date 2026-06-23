/* =====================================================================
   SOCIALICE · Datos de ejemplo (mock)
   ---------------------------------------------------------------------
   Por ahora la app NO usa internet ni base de datos: lee de aquí.
   Más adelante, cuando conectemos Firebase, reemplazaremos este
   archivo por datos reales SIN tener que tocar el resto de la app.
   ===================================================================== */

const DATA = {

  // El usuario con la sesión abierta (se completa al registrarse/entrar).
  // 'rol' puede ser 'organizador' o 'asistente'.
  usuario: {
    nombre: 'Andrea Ríos',
    usuario: '@andrea',
    bio: 'Las mejores fiestas de la ciudad 🎉',
    avatar: '🦄',
    rol: 'organizador',
    stats: { eventos: 8, asistentes: 1240, seguidores: 357 }
  },

  // Las fiestas que se muestran en el feed de Inicio.
  // 'cat' sirve para filtrar con los chips de arriba.
  eventos: [
    {
      id: 'e1',
      nombre: 'Neon Nights',
      fecha: 'Vie 27 jun · 9:00 pm',
      lugar: 'Terraza Skyline',
      organizador: 'Andrea Ríos',
      emoji: '🌃',
      grad: 'linear-gradient(135deg, #8b5cf6, #f43f5e)',
      precio: '$250',
      asistentes: 184,
      cat: ['semana', 'populares', 'cerca']
    },
    {
      id: 'e2',
      nombre: 'Glow Party',
      fecha: 'Sáb 28 jun · 10:00 pm',
      lugar: 'Club Aurora',
      organizador: 'Pulse Crew',
      emoji: '✨',
      grad: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
      precio: '$300',
      asistentes: 320,
      cat: ['semana', 'populares']
    },
    {
      id: 'e3',
      nombre: 'Rooftop Sunset',
      fecha: 'Dom 29 jun · 6:00 pm',
      lugar: 'Hotel Mirage',
      organizador: 'Andrea Ríos',
      emoji: '🌅',
      grad: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
      precio: 'Gratis',
      asistentes: 95,
      cat: ['semana', 'cerca']
    },
    {
      id: 'e4',
      nombre: 'Bass Drop',
      fecha: 'Vie 4 jul · 11:00 pm',
      lugar: 'Underground 21',
      organizador: 'Pulse Crew',
      emoji: '🔊',
      grad: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
      precio: '$280',
      asistentes: 210,
      cat: ['populares']
    }
  ],

  // El evento que se muestra grande arriba ("destacado").
  destacadoId: 'e1',

  // Los chips de categoría del feed.
  categorias: [
    { id: 'todos',     texto: 'Todos' },
    { id: 'semana',    texto: 'Esta semana' },
    { id: 'cerca',     texto: 'Cerca de mí' },
    { id: 'populares', texto: 'Populares' }
  ]
};

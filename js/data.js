/* =====================================================================
   SOCIALICE · Datos de ejemplo (mock)
   ---------------------------------------------------------------------
   Por ahora la app NO usa internet ni base de datos: lee de aquí.
   Más adelante, cuando conectemos Firebase, reemplazaremos este
   archivo por datos reales SIN tener que tocar el resto de la app.
   ===================================================================== */

const DATA = {

  // Usuario con la sesión abierta.
  // 'rol' = 'organizador' | 'asistente'  ·  'privado' = perfil privado.
  usuario: {
    nombre: 'Andrea Ríos',
    usuario: '@andrea',
    bio: 'Coleccionando noches inolvidables ✨',
    avatar: '🦄',
    color: 'linear-gradient(135deg,#8b5cf6,#f43f5e)',
    rol: 'organizador',
    privado: false,
    stats: { eventos: 8, asistentes: 1240, seguidores: 357, amigos: 24, fueA: 36 }
  },

  // Fiestas del feed.
  eventos: [
    { id:'e1', nombre:'Neon Nights',     fecha:'Vie 27 jun · 9:00 pm', lugar:'Terraza Skyline',  ciudad:'Polanco',     organizador:'Andrea Ríos', emoji:'🌃', grad:'linear-gradient(135deg,#7c3aed,#db2777)', precio:'$250',  asistentes:184, cat:['semana','populares','cerca'] },
    { id:'e2', nombre:'Glow Party',      fecha:'Sáb 28 jun · 10:00 pm',lugar:'Club Aurora',      ciudad:'Roma Norte',  organizador:'Pulse Crew',  emoji:'✨', grad:'linear-gradient(135deg,#0ea5e9,#7c3aed)', precio:'$300',  asistentes:320, cat:['semana','populares'] },
    { id:'e3', nombre:'Rooftop Sunset',  fecha:'Dom 29 jun · 6:00 pm', lugar:'Hotel Mirage',     ciudad:'Condesa',     organizador:'Andrea Ríos', emoji:'🌇', grad:'linear-gradient(135deg,#f59e0b,#ef4444)', precio:'Gratis',asistentes:95,  cat:['semana','cerca'] },
    { id:'e4', nombre:'Bass Drop',       fecha:'Vie 4 jul · 11:00 pm', lugar:'Underground 21',   ciudad:'Centro',      organizador:'Pulse Crew',  emoji:'🔊', grad:'linear-gradient(135deg,#ec4899,#6366f1)', precio:'$280',  asistentes:210, cat:['populares'] }
  ],

  destacadoId: 'e1',

  categorias: [
    { id:'todos',     texto:'Todos' },
    { id:'semana',    texto:'Esta semana' },
    { id:'cerca',     texto:'Cerca de mí' },
    { id:'populares', texto:'Populares' }
  ],

  // Amigos del usuario (para la sección Amigos del asistente).
  // 'ahora' = fiesta en la que está justo ahora (o null).
  // 'fue'   = lista de fiestas a las que ya fue.
  // 'fotos' = fotos que subió de fiestas (usamos emoji como mock).
  amigos: [
    { nombre:'Mateo Lara',  usuario:'@mateo',  avatar:'🐺', color:'linear-gradient(135deg,#06b6d4,#3b82f6)', privado:false, ahora:'Neon Nights',  fue:['Glow Party','Bass Drop'],        fotos:['🌃','🍸','🪩'] },
    { nombre:'Sofía Mendez',usuario:'@sof',    avatar:'🌸', color:'linear-gradient(135deg,#ec4899,#f43f5e)', privado:false, ahora:null,           fue:['Rooftop Sunset','Glow Party'],   fotos:['🌇','💃'] },
    { nombre:'Diego Cruz',  usuario:'@diegoc', avatar:'🎧', color:'linear-gradient(135deg,#8b5cf6,#06b6d4)', privado:true,  ahora:null,           fue:[],                                fotos:[] },
    { nombre:'Valeria Ortiz',usuario:'@valee', avatar:'🦋', color:'linear-gradient(135deg,#f59e0b,#ec4899)', privado:false, ahora:'Neon Nights',  fue:['Bass Drop'],                     fotos:['🪩','🎉','🥂','✨'] }
  ],

  // Sugerencias para "agregar amigos".
  sugerencias: [
    { nombre:'Camila Reyes', usuario:'@cami',   avatar:'🐱', color:'linear-gradient(135deg,#22d3ee,#818cf8)', enComun:3 },
    { nombre:'Tomás Vega',   usuario:'@tomv',   avatar:'🛹', color:'linear-gradient(135deg,#fb7185,#f59e0b)', enComun:1 },
    { nombre:'Renata Gil',   usuario:'@ren',    avatar:'🌙', color:'linear-gradient(135deg,#a78bfa,#f472b6)', enComun:5 }
  ]
};

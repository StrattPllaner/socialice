/* =====================================================================
   SOCIALICE · Datos de ejemplo (mock)
   ---------------------------------------------------------------------
   Por ahora la app NO usa internet ni base de datos: lee de aquí.
   Más adelante, con Firebase, esto se reemplaza por datos reales.
   ===================================================================== */

const DATA = {

  // Usuario con la sesión abierta.
  usuario: {
    nombre: 'Andrea Ríos',
    usuario: '@andrea',
    bio: 'Coleccionando noches inolvidables ✨',
    avatar: '🦄',
    logo: null,   // logo de la organizadora (imagen); si está, reemplaza al avatar
    color: 'linear-gradient(135deg,#8b5cf6,#f43f5e)',
    rol: 'organizador',
    privado: false,
    verificado: true,   // muestra la insignia ❄
    // Redes sociales y contacto (lo que el organizador quiera poner)
    redes: {
      whatsapp: '5215512345678',
      instagram: 'andrea.eventos',
      tiktok: 'andrea.eventos',
      web: ''
    },
    // Colaboradores (links a otros perfiles)
    colaboradores: [
      { nombre: 'Pulse Crew', usuario: '@pulsecrew', avatar: '🎛️', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
      { nombre: 'Mateo Lara', usuario: '@mateo',     avatar: '🐺', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }
    ],
    // Lista de seguidores (para "ver seguidores")
    seguidoresList: [
      { nombre: 'Sofía Mendez', usuario: '@sof',   avatar: '🌸', color: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
      { nombre: 'Diego Cruz',   usuario: '@diegoc', avatar: '🎧', color: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' },
      { nombre: 'Valeria Ortiz',usuario: '@valee',  avatar: '🦋', color: 'linear-gradient(135deg,#f59e0b,#ec4899)' },
      { nombre: 'Camila Reyes', usuario: '@cami',   avatar: '🐱', color: 'linear-gradient(135deg,#22d3ee,#818cf8)' },
      { nombre: 'Tomás Vega',   usuario: '@tomv',   avatar: '🛹', color: 'linear-gradient(135deg,#fb7185,#f59e0b)' }
    ],
    // Eventos pasados con fotos de lo que pasó
    eventosPasados: [
      { nombre: 'Midnight Bloom', fecha: 'May 2026', emoji: '🌙', grad: 'linear-gradient(135deg,#6366f1,#ec4899)', asistentes: 240, fotos: ['🪩','💃','🍸','🎉','🌙','✨'] },
      { nombre: 'Electric Garden', fecha: 'Abr 2026', emoji: '🌿', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', asistentes: 180, fotos: ['🌿','🕺','🥂','🎶'] },
      { nombre: 'Purple Haze', fecha: 'Mar 2026', emoji: '🟣', grad: 'linear-gradient(135deg,#8b5cf6,#d946ef)', asistentes: 310, fotos: ['🟣','🎇','💜','🪩','🍾'] }
    ],
    stats: { eventos: 8, asistentes: 1240, seguidores: 1840, amigos: 24, fueA: 36 }
  },

  // Fiestas. Campos: edad ('18+', solo mayores) y cuando ('hoy','semana','mes').
  eventos: [
    { id:'e1', nombre:'Neon Nights',    fecha:'Vie 27 jun · 9:00 pm', dia:27, lugar:'Terraza Skyline', ciudad:'Polanco',    edad:'18+', cuando:'semana', organizador:'Andrea Ríos', emoji:'🌃', grad:'linear-gradient(135deg,#7c3aed,#db2777)', precio:'$250',  asistentes:184, cat:['semana','populares','cerca'] },
    { id:'e2', nombre:'Glow Party',     fecha:'Sáb 28 jun · 10:00 pm',dia:28, lugar:'Club Aurora',     ciudad:'Roma Norte', edad:'18+', cuando:'semana', organizador:'Pulse Crew',  emoji:'✨', grad:'linear-gradient(135deg,#0ea5e9,#7c3aed)', precio:'$300',  asistentes:320, cat:['semana','populares'] },
    { id:'e3', nombre:'Rooftop Sunset', fecha:'Dom 29 jun · 6:00 pm', dia:29, lugar:'Hotel Mirage',    ciudad:'Condesa',    edad:'18+', cuando:'hoy',    organizador:'Andrea Ríos', emoji:'🌇', grad:'linear-gradient(135deg,#f59e0b,#ef4444)', precio:'Gratis',asistentes:95,  cat:['semana','cerca'], voy:true },
    { id:'e4', nombre:'Bass Drop',      fecha:'Vie 4 jul · 11:00 pm', dia:4,  lugar:'Underground 21',  ciudad:'Centro',     edad:'18+', cuando:'mes',    organizador:'Pulse Crew',  emoji:'🔊', grad:'linear-gradient(135deg,#ec4899,#6366f1)', precio:'$280',  asistentes:210, cat:['populares'], voy:true },
    { id:'e5', nombre:'Aurora Fest',    fecha:'Próximamente',         dia:null,lugar:'Por anunciar',    ciudad:'CDMX',       edad:'18+', cuando:'mes',    organizador:'Andrea Ríos', emoji:'🌌', grad:'linear-gradient(135deg,#6366f1,#22d3ee)', precio:'Pronto', asistentes:0, cat:['populares'], proximamente:true }
  ],

  destacadoId: 'e1',

  // Filtros del buscador
  categorias: [
    { id:'todos',     texto:'Todos' },
    { id:'semana',    texto:'Esta semana' },
    { id:'cerca',     texto:'Cerca de mí' },
    { id:'populares', texto:'Populares' }
  ],
  // Ciudades sugeridas (el usuario igual puede escribir cualquier otra)
  ciudades: ['Polanco', 'Roma Norte', 'Condesa', 'Centro'],
  cuandos: [
    { id:'todos',  texto:'Cualquier día' },
    { id:'hoy',    texto:'Hoy' },
    { id:'semana', texto:'Esta semana' },
    { id:'mes',    texto:'Este mes' }
  ],
  edades: ['Todas', '18+'],

  // Amigos. Nuevo: mejorAmigo (azul) y privado.
  // Los perfiles privados SOLO se ven si son mejores amigos.
  amigos: [
    { nombre:'Mateo Lara',   usuario:'@mateo',  avatar:'🐺', color:'linear-gradient(135deg,#06b6d4,#3b82f6)', privado:false, mejorAmigo:true,  ahora:'Neon Nights', fue:['Glow Party','Bass Drop'],      fotos:['🌃','🍸','🪩'] },
    { nombre:'Sofía Mendez', usuario:'@sof',    avatar:'🌸', color:'linear-gradient(135deg,#ec4899,#f43f5e)', privado:false, mejorAmigo:false, ahora:null,          fue:['Rooftop Sunset','Glow Party'], fotos:['🌇','💃'] },
    { nombre:'Diego Cruz',   usuario:'@diegoc', avatar:'🎧', color:'linear-gradient(135deg,#8b5cf6,#06b6d4)', privado:true,  mejorAmigo:false, ahora:'Bass Drop',   fue:['Bass Drop','Neon Nights'],     fotos:['🔊','🎶'] },
    { nombre:'Valeria Ortiz',usuario:'@valee',  avatar:'🦋', color:'linear-gradient(135deg,#f59e0b,#ec4899)', privado:false, mejorAmigo:true,  ahora:'Neon Nights', fue:['Bass Drop'],                   fotos:['🪩','🎉','🥂','✨'] }
  ],

  sugerencias: [
    { nombre:'Camila Reyes', usuario:'@cami', avatar:'🐱', color:'linear-gradient(135deg,#22d3ee,#818cf8)', enComun:3 },
    { nombre:'Tomás Vega',   usuario:'@tomv', avatar:'🛹', color:'linear-gradient(135deg,#fb7185,#f59e0b)', enComun:1 },
    { nombre:'Renata Gil',   usuario:'@ren',  avatar:'🌙', color:'linear-gradient(135deg,#a78bfa,#f472b6)', enComun:5 }
  ]
};

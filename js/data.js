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
    // Fecha de nacimiento (ISO). Dato PRIVADO: se usa solo para verificar 18+;
    // NO se muestra en el perfil público ni se manda en respuestas que no la
    // necesiten. Se guarda la fecha (no un booleano) para poder recalcular edad.
    fechaNacimiento: '1998-04-12',
    bio: 'Coleccionando noches inolvidables ✨',
    avatar: '🦄',
    logo: null,   // logo de la organizadora (imagen); si está, reemplaza al avatar
    color: 'linear-gradient(135deg,#2f7bff,#38bdf8)',
    nombreFont: 'classic',   // tipografía del nombre (ids de FONTS)
    portada: 'aurora',       // fondo del perfil (ids de PORTADAS); null = color
    portadaImg: null,        // foto propia de portada (si sube una)
    ciudad: 'Morelos',
    rol: 'organizador',
    privado: false,
    verificado: true,   // muestra la insignia ❄
    // Redes sociales: SOLO las que el usuario eligió vincular
    // (las vacías no aparecen en el perfil; se agregan en "Editar perfil")
    redes: {
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
      { nombre: 'Midnight Bloom', fecha: 'May 2026', emoji: '🌙', grad: 'linear-gradient(135deg,#6366f1,#22d3ee)', asistentes: 240, fotos: ['🪩','💃','🍸','🎉','🌙','✨'] },
      { nombre: 'Electric Garden', fecha: 'Abr 2026', emoji: '🌿', grad: 'linear-gradient(135deg,#22d3ee,#2563eb)', asistentes: 180, fotos: ['🌿','🕺','🥂','🎶'] },
      { nombre: 'Purple Haze', fecha: 'Mar 2026', emoji: '🟣', grad: 'linear-gradient(135deg,#2f7bff,#7dd3fc)', asistentes: 310, fotos: ['🟣','🎇','💜','🪩','🍾'] }
    ],
    stats: { eventos: 8, asistentes: 1240, seguidores: 1840, amigos: 24, fueA: 36 }
  },

  // Fiestas. Campos: edad ('18+', solo mayores) y cuando ('hoy','semana','mes').
  eventos: [
    { id:'e1', grupoId:'g1', fechaISO:'2026-07-10T21:00', nombre:'Neon Nights',    fecha:'Vie 10 jul · 9:00 pm', dia:10, lugar:'Terraza Skyline', ciudad:'Polanco',    edad:'18+', cuando:'semana', organizador:'Andrea Ríos', emoji:'🌃', grad:'linear-gradient(135deg,#2f7bff,#38bdf8)', precio:'$250',  asistentes:184, capacidad:200, dressCode:'Neón / negro', descripcion:'Terraza abierta, dos pisos, line-up de house y techno hasta el amanecer. Llega antes de las 10 para entrar sin fila.', cat:['semana','populares','cerca'] },
    { id:'e2', fechaISO:'2026-07-11T22:00', nombre:'Glow Party',     fecha:'Sáb 11 jul · 10:00 pm',dia:11, lugar:'Club Aurora',     ciudad:'Roma Norte', edad:'18+', cuando:'semana', organizador:'Pulse Crew',  emoji:'✨', grad:'linear-gradient(135deg,#0ea5e9,#2563eb)', precio:'$300',  asistentes:332, capacidad:350, cat:['semana','populares'] },
    { id:'e3', fechaISO:'2026-07-07T18:00', nombre:'Rooftop Sunset', fecha:'Hoy · 6:00 pm', dia:7, lugar:'Hotel Mirage',    ciudad:'Condesa',    edad:'18+', cuando:'hoy',    organizador:'Andrea Ríos', emoji:'🌇', grad:'linear-gradient(135deg,#38bdf8,#1d4ed8)', precio:'Gratis',asistentes:95,  capacidad:300, dressCode:'Casual chic', descripcion:'Atardecer en la terraza del Hotel Mirage con DJ set, cocteles de autor y la mejor vista de la ciudad.', cat:['semana','cerca'], voy:true },
    { id:'e4', fechaISO:'2026-07-17T23:00', nombre:'Bass Drop',      fecha:'Vie 17 jul · 11:00 pm', dia:17,  lugar:'Underground 21',  ciudad:'Centro',     edad:'18+', cuando:'mes',    organizador:'Pulse Crew',  emoji:'🔊', grad:'linear-gradient(135deg,#06b6d4,#3b82f6)', precio:'$280',  asistentes:210, capacidad:250, cat:['populares'], voy:true },
    { id:'e5', fechaISO:'', nombre:'Aurora Fest',    fecha:'Próximamente',         dia:null,lugar:'Por anunciar',    ciudad:'CDMX',       edad:'18+', cuando:'mes',    organizador:'Andrea Ríos', emoji:'🌌', grad:'linear-gradient(135deg,#6366f1,#22d3ee)', precio:'Pronto', asistentes:0, interesados:312, cat:['populares'], proximamente:true }
  ],

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

  // A quién SIGO (una vía, no hace falta que sea mutuo) y a quién BLOQUEÉ
  // (se le oculta de mi feed). Ambos reales vía Firestore cuando hay cuenta;
  // vacíos hasta entonces (ver aplicarSiguiendo/aplicarBloqueados en app.js).
  siguiendo: [],
  bloqueados: [],

  // Grupos: equipo de organizadores + COMUNIDAD que recibe su canal de
  // difusión (avisos/encuestas; la gente solo reacciona, no comenta)
  grupos: [
    {
      id: 'g1', nombre: 'La Crew', emoji: '🎪',
      color: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
      miembros: [
        { nombre: 'Andrea Ríos',  avatar: '🦄', color: 'linear-gradient(135deg,#2f7bff,#38bdf8)' },
        { nombre: 'Mateo Lara',   avatar: '🐺', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
        { nombre: 'Valeria Ortiz',avatar: '🦋', color: 'linear-gradient(135deg,#f59e0b,#ec4899)' }
      ],
      comunidad: 218, _unido: false,
      difusion: [
        { id: 'd1', tipo: 'aviso', texto: 'Ya casi anunciamos la próxima fiesta… 👀 atentos este viernes', fecha: 'hace 2 h', reacciones: { '🔥': 43, '👀': 18, '❤️': 9 }, mia: null },
        { id: 'd2', tipo: 'encuesta', texto: '¿Qué vibe quieren para la próxima?', fecha: 'ayer', reacciones: { '🎉': 12 }, mia: null, miVoto: null,
          opciones: [{ t: 'Neón total', votos: 84 }, { t: 'Rooftop chill', votos: 56 }, { t: 'Under / techno', votos: 71 }] }
      ]
    }
  ],

  sugerencias: [
    { nombre:'Camila Reyes', usuario:'@cami', avatar:'🐱', color:'linear-gradient(135deg,#22d3ee,#818cf8)', enComun:3 },
    { nombre:'Tomás Vega',   usuario:'@tomv', avatar:'🛹', color:'linear-gradient(135deg,#fb7185,#f59e0b)', enComun:1 },
    { nombre:'Renata Gil',   usuario:'@ren',  avatar:'🌙', color:'linear-gradient(135deg,#a78bfa,#f472b6)', enComun:5 }
  ],

  // Gente para las listas de invitados ("quién va")
  gente: [
    { nombre:'Mateo Lara',    avatar:'🐺', color:'linear-gradient(135deg,#06b6d4,#3b82f6)' },
    { nombre:'Sofía Mendez',  avatar:'🌸', color:'linear-gradient(135deg,#ec4899,#f43f5e)' },
    { nombre:'Valeria Ortiz', avatar:'🦋', color:'linear-gradient(135deg,#f59e0b,#ec4899)' },
    { nombre:'Diego Cruz',    avatar:'🎧', color:'linear-gradient(135deg,#8b5cf6,#06b6d4)' },
    { nombre:'Camila Reyes',  avatar:'🐱', color:'linear-gradient(135deg,#22d3ee,#818cf8)' },
    { nombre:'Tomás Vega',    avatar:'🛹', color:'linear-gradient(135deg,#fb7185,#f59e0b)' },
    { nombre:'Renata Gil',    avatar:'🌙', color:'linear-gradient(135deg,#a78bfa,#f472b6)' },
    { nombre:'Iker Solís',    avatar:'🦊', color:'linear-gradient(135deg,#0ea5e9,#6366f1)' },
    { nombre:'Lucía Paz',     avatar:'🐬', color:'linear-gradient(135deg,#22d3ee,#3b82f6)' },
    { nombre:'Bruno Díaz',    avatar:'🦁', color:'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { nombre:'Ana Torres',    avatar:'🦄', color:'linear-gradient(135deg,#a78bfa,#22d3ee)' },
    { nombre:'Pablo Marín',   avatar:'🐧', color:'linear-gradient(135deg,#38bdf8,#2563eb)' }
  ]
};

import Joi from 'joi';

/* --------------------------------------------------------
   SUBESQUEMAS
-------------------------------------------------------- */

// --- Coordinadores
const coordinatorSchema = Joi.object({
  user: Joi.string().allow(null),
  nombre: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  telefono: Joi.string().allow('', null),
  rol: Joi.string().valid('asistente').default('asistente'),
}).unknown(true);

// --- Transferencia
const transferSchema = Joi.object({
  tipo: Joi.string().valid('vuelo', 'bus', 'tren', 'barco', 'otro').required(),
  compania: Joi.string().allow('', null),
  salida: Joi.object({
    lugar: Joi.string().allow('', null),
    fecha: Joi.date().allow(null),
    hora: Joi.string().allow('', null),
  }).allow(null),
  llegada: Joi.object({
    lugar: Joi.string().allow('', null),
    fecha: Joi.date().allow(null),
    hora: Joi.string().allow('', null),
  }).allow(null),
  descripcion: Joi.string().allow('', null),
}).unknown(true);

// --- Gastronomía
const gastronomiaSchema = Joi.object({
  pension: Joi.string().valid(
    'sin comida',
    'desayuno',
    'media pension',
    'pension completa',
    'todo incluido'
  ).default('sin comida'),
  descripcion: Joi.string().allow('', null),
}).unknown(true);

// --- Hospedaje
const hospedajeSchema = Joi.object({
  nombre: Joi.string().allow('', null),
  categoria: Joi.string().valid(
    '1 estrella', '2 estrellas', '3 estrellas',
    '4 estrellas', '5 estrellas',
    'boutique', 'resort'
  ).allow(null),
  ubicacion: Joi.string().allow('', null),
  caracteristicas: Joi.array().items(Joi.string()).default([]),
  gastronomia: gastronomiaSchema.allow(null),
}).unknown(true);

// --- Actividades
const actividadSchema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string().allow('', null),
  duracion: Joi.string().allow('', null),
  incluido: Joi.boolean().default(true),
  precio: Joi.number().allow(null),
  fecha: Joi.date().allow(null),
  hora: Joi.string().allow('', null),
}).unknown(true);

// --- Destino
const destinoSchema = Joi.object({
  ciudad: Joi.string().required(),
  pais: Joi.string().required(),
  orden: Joi.number().required(),
  diasEstadia: Joi.number().required(),
  fechaInicio: Joi.date().allow(null),
  fechaFin: Joi.date().allow(null),
  descripcion: Joi.string().allow('', null),

  hospedaje: hospedajeSchema.allow(null),
  actividades: Joi.array().items(actividadSchema).default([]),

  trasladoSalida: transferSchema.allow(null),

  notas: Joi.string().allow('', null),
}).unknown(true);

// --- Imagen para Multer (se valida en controlador)
const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  path: Joi.string().allow('', null),
  descripcion: Joi.string().allow('', null)
}).unknown(true);

// --- Fechas Disponibles
const fechaDisponibleSchema = Joi.object({
  inicio: Joi.date().required(),
  fin: Joi.date().required(),
  cupos: Joi.number().min(0),
});


/* --------------------------------------------------------
   VALIDACIÓN PRINCIPAL DEL PAQUETE
-------------------------------------------------------- */

export const packageSchema = Joi.object({
  nombre: Joi.string().required(),
  slug: Joi.string().allow(null),

  descripcionCorta: Joi.string().max(200).allow('', null),
  descripcionDetallada: Joi.string().allow('', null),

  tipo: Joi.string().valid('nacional', 'internacional').required(),

  destinos: Joi.array().items(destinoSchema).default([]),

  incluyeGeneral: Joi.array().items(Joi.string()).default([]),
  noIncluyeGeneral: Joi.array().items(Joi.string()).default([]),

  coordinadores: Joi.array().items(coordinatorSchema).default([]),

  descuentoNinos: Joi.number().min(0).max(100).default(0),
  precioBase: Joi.number().required(),
  moneda: Joi.string().valid('ARS', 'USD', 'EUR').default('ARS'),
  montoSenia: Joi.number().required(),
  plazoPagoTotalDias: Joi.number().min(1).default(7),

  duracionTotal: Joi.number().default(0),

  imagenPrincipal: Joi.any(),  // Multer maneja esto
  imagenes: Joi.any(),

  etiquetas: Joi.array().items(
    Joi.string().valid(
      'oferta',
      'nuevo',
      'mas vendido',
      'recomendado',
      'exclusivo',
      'ultimo momento'
    )
  ).default([]),

  categoria: Joi.string().valid(
    'aventura', 'relax', 'cultural',
    'gastronomico', 'familiar', 'romantico', 'ejecutivo'
  ).allow(null),

  capacidadMinima: Joi.number().min(1).default(1),
  capacidadMaxima: Joi.number().allow(null),

  activo: Joi.boolean().default(true),
  visibleEnWeb: Joi.boolean().default(true),

  fechasDisponibles: Joi.array().items(fechaDisponibleSchema),

})
  .unknown(true);

import Joi from 'joi';

/* --------------------------------------------------------
   SUBESQUEMAS
-------------------------------------------------------- */

// --- Subesquema de Transferencia
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
  pension: Joi.string()
    .valid('sin comida', 'media pension', 'pension completa')
    .default('sin comida'),
  descripcion: Joi.string().allow('', null),
}).unknown(true);

// --- Hospedaje
const hospedajeSchema = Joi.object({
  nombre: Joi.string().allow('', null),
  categoria: Joi.string()
    .valid('1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas')
    .allow(null),
  ubicacion: Joi.string().allow('', null),
  caracteristicas: Joi.array().items(Joi.string()).default([]),
  gastronomia: gastronomiaSchema.allow(null),
}).unknown(true);

// --- Actividades
const actividadSchema = Joi.object({
  nombre: Joi.string().allow('', null),
  descripcion: Joi.string().allow('', null),
  duracion: Joi.string().allow('', null),
  incluido: Joi.boolean().default(true),
}).unknown(true);

// --- Destinos (ya no incluyen días)
const destinoSchema = Joi.object({
  ciudad: Joi.string().required(),
  pais: Joi.string().allow('', null),
  descripcion: Joi.string().allow('', null),
  actividades: Joi.array().items(actividadSchema).default([]),
  hospedaje: hospedajeSchema.allow(null),
}).unknown(true);

// --- Imagen (url + path)
const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  path: Joi.string().required(),
}).unknown(true);


/* --------------------------------------------------------
   VALIDACIÓN PRINCIPAL DEL PAQUETE
   (Solo estructura base — “plantilla”)
-------------------------------------------------------- */

export const packageSchema = Joi.object({
  nombre: Joi.string().required(),
  descripcionCorta: Joi.string().max(200).allow('', null),
  descripcionDetallada: Joi.string().allow('', null),
  descripcion: Joi.string().allow('', null),

  tipo: Joi.string().valid('nacional', 'internacional').required(),

  destinos: Joi.array().items(destinoSchema).default([]),

  traslado: Joi.array().items(transferSchema).default([]),

  hospedaje: hospedajeSchema.allow(null),

  actividades: Joi.array().items(actividadSchema).default([]),

  coordinadores: Joi.array().items(Joi.object().unknown(true)).default([]),

  descuentoNinos: Joi.number().min(0).default(0),
  precioBase: Joi.number().required(),
  moneda: Joi.string().default('ARS'),
  montoSenia: Joi.number().required(),
  plazoPagoTotalDias: Joi.number().default(7),

  // ❌ FECHAS YA NO VAN EN EL PAQUETE
  fechaInicio: Joi.any().forbidden(),
  fechaFin: Joi.any().forbidden(),
  fechas: Joi.any().forbidden(),

  // Imágenes → procesadas por Multer luego
  imagenPrincipal: Joi.any().allow(null),
  imagenes: Joi.any(),

  etiquetas: Joi.array()
    .items(
      Joi.string().valid(
        'oferta',
        'nuevo',
        'mas vendido',
        'recomendado',
        'exclusivo'
      )
    )
    .default([]),

  activo: Joi.boolean().default(true),
  visibleEnWeb: Joi.boolean().default(true),
})
.unknown(true);

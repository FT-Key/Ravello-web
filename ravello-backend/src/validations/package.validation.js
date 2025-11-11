import Joi from 'joi';

// Subesquema de Transferencia
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
});

// Subesquema Gastronomía
const gastronomiaSchema = Joi.object({
  pension: Joi.string().valid('sin comida', 'media pension', 'pension completa').default('sin comida'),
  descripcion: Joi.string().allow('', null),
});

// Subesquema Hospedaje
const hospedajeSchema = Joi.object({
  nombre: Joi.string().allow('', null),
  categoria: Joi.string().valid('1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas').allow(null),
  ubicacion: Joi.string().allow('', null),
  caracteristicas: Joi.array().items(Joi.string()).default([]),
  gastronomia: gastronomiaSchema,
});

// Subesquema Actividad
const actividadSchema = Joi.object({
  nombre: Joi.string().allow('', null),
  descripcion: Joi.string().allow('', null),
  duracion: Joi.string().allow('', null),
  incluido: Joi.boolean().default(true),
});

// Subesquema Destino
const destinoSchema = Joi.object({
  ciudad: Joi.string().required(),
  pais: Joi.string().allow('', null),
  diasEstadia: Joi.number().allow(null),
  descripcion: Joi.string().allow('', null),
  actividades: Joi.array().items(actividadSchema).default([]),
  hospedaje: hospedajeSchema,
});

// Esquema principal
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
  coordinadores: Joi.array().items(Joi.object()).default([]), // Podés mejorar el schema si coordinadores tiene campos específicos
  descuentoNinos: Joi.number().min(0).default(0),
  precioBase: Joi.number().required(),
  moneda: Joi.string().default('ARS'),
  montoSenia: Joi.number().required(),
  plazoPagoTotalDias: Joi.number().default(7),
  fechas: Joi.object({
    salida: Joi.date().allow(null),
    regreso: Joi.date().allow(null),
  }).default({}),
  imagenPrincipal: Joi.string().required(),
  imagenes: Joi.array().items(Joi.string()).default([]),
  etiquetas: Joi.array().items(Joi.string().valid('oferta', 'nuevo', 'mas vendido', 'recomendado', 'exclusivo')).default([]),
  activo: Joi.boolean().default(true),
  visibleEnWeb: Joi.boolean().default(true),
});

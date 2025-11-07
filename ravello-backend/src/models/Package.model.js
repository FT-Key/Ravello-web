import mongoose from 'mongoose';
import coordinatorSubSchema from './CoordinatorSubSchema.js';

// --- Subesquema de traslado
const transferSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['vuelo', 'bus', 'tren', 'barco', 'otro'], required: true },
  compania: String,
  salida: { lugar: String, fecha: Date, hora: String },
  llegada: { lugar: String, fecha: Date, hora: String },
  descripcion: String
});

// --- Subesquema de gastronomía
const gastronomiaSchema = new mongoose.Schema({
  pension: {
    type: String,
    enum: ['sin comida', 'media pension', 'pension completa'],
    default: 'sin comida'
  },
  descripcion: String
});

// --- Subesquema de hospedaje
const hospedajeSchema = new mongoose.Schema({
  nombre: String,
  categoria: {
    type: String,
    enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas']
  },
  ubicacion: String,
  caracteristicas: [String],
  gastronomia: gastronomiaSchema
});

// --- Subesquema de actividad
const actividadSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  duracion: String,
  incluido: { type: Boolean, default: true }
});

// --- Nuevo subesquema de destino
const destinoSchema = new mongoose.Schema({
  ciudad: { type: String, required: true },
  pais: { type: String },
  diasEstadia: { type: Number }, // Ej: 3 días en Roma
  descripcion: String,
  actividades: [actividadSchema], // actividades específicas del destino
  hospedaje: hospedajeSchema // hospedaje particular en esa ciudad
});

// --- Esquema principal de paquete
const packageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    // ✨ Nuevo campo para texto corto (para cards, listados, etc.)
    descripcionCorta: {
      type: String,
      maxlength: 200, // opcional, limita el texto
      default: ''
    },

    // ✨ Nuevo campo para descripción detallada (para la vista del producto)
    descripcionDetallada: {
      type: String,
      default: ''
    },
    descripcion: String,
    tipo: { type: String, enum: ['nacional', 'internacional'], required: true },

    // ✅ Nuevo campo para múltiples destinos
    destinos: [destinoSchema],

    // Si el paquete incluye traslados generales (entre destinos, por ejemplo)
    traslado: [transferSchema],

    // Hospedaje general (si no hay uno por destino)
    hospedaje: hospedajeSchema,

    // Actividades generales (no ligadas a un destino en particular)
    actividades: [actividadSchema],

    coordinadores: [coordinatorSubSchema],

    descuentoNinos: { type: Number, default: 0 },
    precioBase: { type: Number, required: true },
    moneda: { type: String, default: 'ARS' },
    montoSenia: { type: Number, required: true },
    plazoPagoTotalDias: { type: Number, default: 7 },

    fechas: {
      salida: Date,
      regreso: Date
    },

    imagenPrincipal: { type: String, required: true },
    imagenes: [String],

    publicado: { type: Boolean, default: true },

    etiquetas: [
      {
        type: String,
        enum: ['oferta', 'nuevo', 'mas vendido', 'recomendado', 'exclusivo']
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Package', packageSchema);

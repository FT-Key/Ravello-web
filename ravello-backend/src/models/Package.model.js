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

// --- Subesquema de destino
const destinoSchema = new mongoose.Schema({
  ciudad: { type: String, required: true },
  pais: { type: String },
  diasEstadia: { type: Number }, 
  descripcion: String,
  actividades: [actividadSchema],
  hospedaje: hospedajeSchema
});

// --- Esquema principal de paquete
const packageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },

    descripcionCorta: {
      type: String,
      maxlength: 200,
      default: ''
    },

    descripcionDetallada: {
      type: String,
      default: ''
    },

    descripcion: String,
    tipo: { type: String, enum: ['nacional', 'internacional'], required: true },

    destinos: [destinoSchema],

    traslado: [transferSchema],

    hospedaje: hospedajeSchema,

    actividades: [actividadSchema],

    coordinadores: [coordinatorSubSchema],

    descuentoNinos: { type: Number, default: 0 },
    precioBase: { type: Number, required: true },
    moneda: { type: String, default: 'ARS' },
    montoSenia: { type: Number, required: true },
    plazoPagoTotalDias: { type: Number, default: 7 },

    // ✨ Duración total del itinerario (calculado automáticamente)
    duracionTotal: { type: Number, default: 0 },

    imagenPrincipal: {
      url: { type: String, required: true },
      path: { type: String }
    },

    imagenes: [
      {
        url: String,
        path: String
      }
    ],

    etiquetas: [
      {
        type: String,
        enum: ['oferta', 'nuevo', 'mas vendido', 'recomendado', 'exclusivo']
      }
    ],

    activo: { type: Boolean, default: true },
    visibleEnWeb: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// ============================================================
// 🟩 Middleware: Calcula duración total según destinos
// ============================================================
packageSchema.pre('save', function (next) {
  const total = this.destinos?.reduce(
    (acc, dest) => acc + (dest.diasEstadia || 0),
    0
  );
  this.duracionTotal = total || 0;
  next();
});

export default mongoose.model('Package', packageSchema);

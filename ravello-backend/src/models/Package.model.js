import mongoose from 'mongoose';
import coordinatorSubSchema from './CoordinatorSubSchema.js';

const transferSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['vuelo', 'bus', 'tren', 'barco', 'otro'], required: true },
  compania: String,
  salida: { lugar: String, fecha: Date, hora: String },
  llegada: { lugar: String, fecha: Date, hora: String },
  descripcion: String
});

const gastronomiaSchema = new mongoose.Schema({
  pension: {
    type: String,
    enum: ['sin comida', 'media pension', 'pension completa'],
    default: 'sin comida'
  },
  descripcion: String // Ejemplo: "Desayuno continental: café, leche, tostadas, mermelada..."
});

const hospedajeSchema = new mongoose.Schema({
  nombre: String,
  categoria: {
    type: String,
    enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas']
  },
  ubicacion: String,
  caracteristicas: [String], // Ej: ["Piscina", "WiFi", "Gimnasio"]
  gastronomia: gastronomiaSchema
});

const actividadSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  duracion: String,
  incluido: { type: Boolean, default: true }
});

const packageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,
    tipo: { type: String, enum: ['nacional', 'internacional'], required: true },

    traslado: [transferSchema],
    hospedaje: hospedajeSchema,
    actividades: [actividadSchema],

    // 👇 Coordinadores: puede tener referencias a usuarios o datos manuales
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

    imagenPrincipal: { type: String, required: true }, // portada / thumbnail
    imagenes: [String], // galería adicional

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

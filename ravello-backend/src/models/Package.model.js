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
    enum: ['sin comida', 'desayuno', 'media pension', 'pension completa', 'todo incluido'],
    default: 'sin comida'
  },
  descripcion: String
});

// --- Subesquema de hospedaje
const hospedajeSchema = new mongoose.Schema({
  nombre: String,
  categoria: {
    type: String,
    enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas', 'boutique', 'resort']
  },
  ubicacion: String,
  caracteristicas: [String],
  gastronomia: gastronomiaSchema
});

// --- Subesquema de actividad
const actividadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  duracion: String,
  incluido: { type: Boolean, default: true },
  precio: { type: Number }, // Por si es actividad opcional con costo adicional
  fecha: Date, // Fecha específica si aplica
  hora: String
});

// --- Subesquema de destino (AQUÍ VA TODO LO ESPECÍFICO DEL DESTINO)
const destinoSchema = new mongoose.Schema({
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  orden: { type: Number, required: true }, // Para ordenar el itinerario
  diasEstadia: { type: Number, required: true }, 
  fechaInicio: Date, // Opcional: si tiene fechas fijas
  fechaFin: Date,
  descripcion: String,
  
  // Hospedaje ESPECÍFICO de este destino
  hospedaje: hospedajeSchema,
  
  // Actividades ESPECÍFICAS de este destino
  actividades: [actividadSchema],
  
  // Traslado DESDE este destino hacia el siguiente (o llegada si es el primero)
  trasladoSalida: transferSchema,
  
  notas: String // Notas importantes del destino
});

// --- Esquema principal de paquete
const packageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true }, // Para URLs amigables

    descripcionCorta: {
      type: String,
      maxlength: 200,
      default: '',
      trim: true
    },

    descripcionDetallada: {
      type: String,
      default: '',
      trim: true
    },

    // ELIMINADO: descripcion redundante, usa descripcionDetallada
    
    tipo: { type: String, enum: ['nacional', 'internacional'], required: true },

    // ITINERARIO: La secuencia de destinos
    destinos: [destinoSchema],

    // ELIMINADO: traslado a nivel paquete (ahora está en cada destino)
    // ELIMINADO: hospedaje a nivel paquete (ahora está en cada destino)
    // ELIMINADO: actividades a nivel paquete (ahora están en cada destino)

    // Incluidos generales del paquete (ej: "Seguro de viaje", "Asistencia 24/7")
    incluyeGeneral: [String],
    
    // No incluidos generales (ej: "Vuelos internos", "Propinas")
    noIncluyeGeneral: [String],

    // Coordinadores del paquete
    coordinadores: [coordinatorSubSchema],

    // PRECIOS
    descuentoNinos: { type: Number, default: 0, min: 0, max: 100 },
    precioBase: { type: Number, required: true, min: 0 },
    moneda: { type: String, enum: ['ARS', 'USD', 'EUR'], default: 'ARS' },
    montoSenia: { type: Number, required: true, min: 0 },
    plazoPagoTotalDias: { type: Number, default: 7, min: 1 },

    // Duración total (calculada automáticamente)
    duracionTotal: { type: Number, default: 0 },

    // IMÁGENES
    imagenPrincipal: {
      url: { type: String, required: true },
      path: { type: String }
    },

    imagenes: [
      {
        url: { type: String, required: true },
        path: String,
        descripcion: String // Alt text para SEO
      }
    ],

    // METADATOS
    etiquetas: [
      {
        type: String,
        enum: ['oferta', 'nuevo', 'mas vendido', 'recomendado', 'exclusivo', 'ultimo momento']
      }
    ],

    categoria: {
      type: String,
      enum: ['aventura', 'relax', 'cultural', 'gastronomico', 'familiar', 'romantico', 'ejecutivo']
    },

    // Capacidad del grupo
    capacidadMinima: { type: Number, default: 1 },
    capacidadMaxima: { type: Number },

    // Disponibilidad
    activo: { type: Boolean, default: true },
    visibleEnWeb: { type: Boolean, default: true },
    
    // Fechas de disponibilidad (si aplica)
    fechasDisponibles: [{
      inicio: Date,
      fin: Date,
      cupos: Number
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============================================================
// MIDDLEWARES
// ============================================================

// Calcular duración total antes de guardar
packageSchema.pre('save', function (next) {
  const total = this.destinos?.reduce(
    (acc, dest) => acc + (dest.diasEstadia || 0),
    0
  );
  this.duracionTotal = total || 0;
  next();
});

// Generar slug automáticamente
packageSchema.pre('save', function (next) {
  if (!this.slug && this.nombre) {
    this.slug = this.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^\w\s-]/g, '') // Quitar caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .trim();
  }
  next();
});

// ============================================================
// ÍNDICES
// ============================================================
packageSchema.index({ nombre: 'text', descripcionCorta: 'text', descripcionDetallada: 'text' });
packageSchema.index({ tipo: 1, activo: 1, visibleEnWeb: 1 });
packageSchema.index({ precioBase: 1 });
packageSchema.index({ etiquetas: 1 });

export default mongoose.model('Package', packageSchema);
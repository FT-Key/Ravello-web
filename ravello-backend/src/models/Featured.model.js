// models/Featured.js
import mongoose from 'mongoose';

const featuredSchema = new mongoose.Schema(
  {
    tituloSeccion: {
      type: String,
      default: 'Destinos destacados'
    },
    descripcion: {
      type: String,
      default: ''
    },
    items: [
      {
        package: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Package',
          required: true
        },
        orden: {
          type: Number,
          default: 0
        },
        etiqueta: {
          type: String
        }
      }
    ],
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Featured', featuredSchema);

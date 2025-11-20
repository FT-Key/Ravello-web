import mongoose from 'mongoose';

const coordinatorSubSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // opcional
    nombre: String,
    email: String,
    telefono: String,
    rol: { type: String, default: 'asistente' }
  },
  { _id: false } // evita crear un _id extra por cada coordinador
);

export default coordinatorSubSchema;

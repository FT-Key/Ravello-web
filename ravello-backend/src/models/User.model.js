import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'editor', 'cliente'], default: 'admin' },
    activo: { type: Boolean, default: true },
    esPrincipal: { type: Boolean, default: false } // protege al admin principal
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.compararPassword = async function (passwordIngresada) {
  try {
    return await argon2.verify(this.password, passwordIngresada);
  } catch (err) {
    return false;
  }
};

export default mongoose.model('User', userSchema);

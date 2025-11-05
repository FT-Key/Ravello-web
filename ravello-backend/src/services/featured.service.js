// services/featuredService.js
import { Featured } from '../models/index.js';

export const getActiveFeatured = async () => {
  return await Featured.findOne({ activo: true })
    .populate({
      path: 'items.package',
      model: 'Package', // Asegura que usa el modelo correcto
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo' // solo lo necesario
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const getAllFeatured = async () => {
  return await Featured.find().populate('items.package').sort({ createdAt: -1 }).lean();
};

export const createFeatured = async (data) => {
  const featured = new Featured(data);
  return await featured.save();
};

export const updateFeatured = async (id, data) => {
  return await Featured.findByIdAndUpdate(id, data, { new: true })
    .populate('items.package')
    .lean();
};

export const deleteFeatured = async (id) => {
  return await Featured.findByIdAndDelete(id);
};

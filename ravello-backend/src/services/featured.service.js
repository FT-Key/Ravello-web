// services/featured.service.js
import { Featured } from '../models/index.js';

export const getActiveFeatured = async ({ 
  filters = {}, 
  sort = '-createdAt', 
  pagination = null 
} = {}) => {
  let query = Featured.findOne({ activo: true, ...filters })
    .populate({
      path: 'items.package',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .sort(sort);

  // Solo aplicar skip/limit si hay paginación
  if (pagination) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const featured = await query.lean();
  return featured;
};

export const getAllFeatured = async ({ 
  filters = {}, 
  sort = '-createdAt', 
  pagination = null 
} = {}) => {
  let query = Featured.find(filters)
    .populate({
      path: 'items.package',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .sort(sort);

  // Solo aplicar skip/limit si hay paginación
  if (pagination) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const featured = await query.lean();
  return featured;
};

export const createFeatured = async (data) => {
  const featured = new Featured(data);
  return await featured.save();
};

export const updateFeatured = async (id, data) => {
  return await Featured.findByIdAndUpdate(id, data, { new: true })
    .populate({
      path: 'items.package',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .lean();
};

export const deleteFeatured = async (id) => {
  return await Featured.findByIdAndDelete(id);
};
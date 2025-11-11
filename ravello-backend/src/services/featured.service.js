import { Featured } from '../models/index.js';

export const getActiveFeatured = async ({ filters = {}, sort = '-createdAt', pagination = { page: 1, limit: 12, skip: 0 } } = {}) => {
  const { limit, skip } = pagination;

  const featured = await Featured.findOne({ activo: true, ...filters })
    .populate({
      path: 'items.package',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return featured;
};

export const getAllFeatured = async ({ filters = {}, sort = '-createdAt', pagination = { page: 1, limit: 12, skip: 0 } } = {}) => {
  const { limit, skip } = pagination;

  const featured = await Featured.find(filters)
    .populate({
      path: 'items.package',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

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

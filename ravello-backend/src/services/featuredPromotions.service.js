import mongoose from 'mongoose';
import { FeaturedPromotion, Package } from '../models/index.js';

export const getActive = async ({ filters = {}, sort = '-createdAt', pagination = { page: 1, limit: 12, skip: 0 } } = {}) => {
  const { limit, skip } = pagination;

  const promo = await FeaturedPromotion.findOne({ activo: true, ...filters })
    .populate({
      path: 'packages',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas',
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return promo;
};

export const createOrReplace = async ({ packages, titulo, descripcion }) => {
  if (!packages || packages.length !== 2) {
    throw new Error('Debes seleccionar exactamente 2 paquetes.');
  }

  const objectIds = packages.map((id) => {
    try {
      return mongoose.Types.ObjectId.createFromHexString(id.toString());
    } catch (e) {
      throw new Error(`El ID ${id} no es válido.`);
    }
  });

  // Verificar que los paquetes existan
  const existing = await Package.find({ _id: { $in: objectIds } });
  if (existing.length !== 2) {
    throw new Error('Uno o más paquetes seleccionados no existen.');
  }

  // Buscar si ya existe un FeaturedPromotion
  let current = await FeaturedPromotion.findOne();

  if (current) {
    current.packages = objectIds;
    current.titulo = titulo;
    current.descripcion = descripcion;
    current.activo = true;
    await current.save();
  } else {
    current = await FeaturedPromotion.create({
      packages: objectIds,
      titulo,
      descripcion,
      activo: true,
    });
  }

  return await current.populate('packages');
};

export const deleteById = async (id) => {
  return await FeaturedPromotion.findByIdAndDelete(id);
};

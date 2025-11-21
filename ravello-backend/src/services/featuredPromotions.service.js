import mongoose from 'mongoose';
import { FeaturedPromotion, Package } from '../models/index.js';

/* ============================================================
   🟦 GET ACTIVE (NO USA PAGINACIÓN)
   Porque solo existe una promoción destacada activa
============================================================ */
export const getActive = async ({
  filters = {},
  sort = { createdAt: -1 }
} = {}) => {

  const promo = await FeaturedPromotion.findOne({ activo: true, ...filters })
    .populate({
      path: 'packages',
      model: 'Package',
      select: 'nombre descripcion precioBase imagenPrincipal fechas.tipo etiquetas'
    })
    .sort(sort)
    .lean();

  return promo;
};

/* ============================================================
   🟩 CREATE OR REPLACE
============================================================ */
export const createOrReplace = async ({ packages, titulo, descripcion }) => {
  if (!packages || packages.length !== 2) {
    throw new Error('Debes seleccionar exactamente 2 paquetes.');
  }

  const objectIds = packages.map((id) => {
    try {
      return mongoose.Types.ObjectId.createFromHexString(id.toString());
    } catch {
      throw new Error(`El ID ${id} no es válido.`);
    }
  });

  // Verificación de existencia de paquetes
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

/* ============================================================
   🟥 DELETE BY ID
============================================================ */
export const deleteById = async (id) => {
  return await FeaturedPromotion.findByIdAndDelete(id);
};

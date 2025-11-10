import mongoose from "mongoose";
import { FeaturedPromotion, Package } from "../models/index.js";

// Obtener promoción activa
export const getActive = async () => {
  return await FeaturedPromotion.findOne({ activo: true }).populate('packages').lean();
}

// Crear nueva promoción destacada (desactiva las anteriores)
export const createOrReplace = async ({ packages, titulo, descripcion }) => {
  console.log("🟢 [Service] Datos recibidos:", { packages, titulo, descripcion });

  if (!packages || packages.length !== 2) {
    throw new Error("Debes seleccionar exactamente 2 paquetes.");
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
    throw new Error("Uno o más paquetes seleccionados no existen.");
  }

  // Buscar si ya existe un FeaturedPromotion
  let current = await FeaturedPromotion.findOne();

  if (current) {
    console.log("♻️ [Service] Actualizando promoción existente:", current._id);
    current.packages = objectIds;
    current.titulo = titulo;
    current.descripcion = descripcion;
    current.activo = true;
    await current.save();
  } else {
    console.log("✨ [Service] Creando nueva promoción destacada...");
    current = await FeaturedPromotion.create({
      packages: objectIds,
      titulo,
      descripcion,
      activo: true,
    });
  }

  const populated = await current.populate("packages");
  console.log("🎯 [Service] Promoción final poblada:", populated);
  return populated;
};

// Eliminar promoción por ID
export const deleteById = async (id) => {
  return await FeaturedPromotion.findByIdAndDelete(id);
}

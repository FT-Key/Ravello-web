import { Offer } from "../models/index.js";
import mongoose from "mongoose";

export const getAllOffers = async ({
  page,
  limit,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  filters = {},
}) => {
  const query = {};

  // 🔎 Búsqueda textual
  if (search) {
    query.$or = [
      { titulo: { $regex: search, $options: "i" } },
      { descripcion: { $regex: search, $options: "i" } },
    ];
  }

  // 🧩 Filtros booleanos
  if (filters.activo !== undefined)
    query.activo = filters.activo === "true";
  if (filters.destacada !== undefined)
    query.destacada = filters.destacada === "true";

  // Ordenamiento
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  // ==============================
  // 🟢 SIN PAGINACIÓN → traer todo
  // ==============================
  if (!page || !limit) {
    const data = await Offer.find(query)
      .populate("package")
      .sort(sort);

    return {
      data,
      pagination: {
        total: data.length,
        page: null,
        limit: null,
        totalPages: null,
      },
    };
  }

  // ==============================
  // 🔵 CON PAGINACIÓN
  // ==============================
  const _page = Number(page);
  const _limit = Number(limit);
  const skip = (_page - 1) * _limit;

  const [data, total] = await Promise.all([
    Offer.find(query)
      .populate("package")
      .sort(sort)
      .skip(skip)
      .limit(_limit),
    Offer.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page: _page,
      limit: _limit,
      totalPages: Math.ceil(total / _limit),
    },
  };
};

// === OFERTAS ACTIVAS SIN CAMBIOS ===
export const getActiveOffers = async () => {
  const today = new Date();
  return await Offer.find({
    activo: true,
    fechaInicio: { $lte: today },
    fechaFin: { $gte: today },
  }).populate("package");
};

// === OBTENER POR ID ===
export const getOfferById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findById(id).populate("package");
};

// === CREAR ===
export const createOffer = async (data) => {
  const offer = new Offer(data);
  return await offer.save();
};

// === ACTUALIZAR ===
export const updateOffer = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findByIdAndUpdate(id, data, { new: true });
};

// === ELIMINAR ===
export const deleteOffer = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findByIdAndDelete(id);
};

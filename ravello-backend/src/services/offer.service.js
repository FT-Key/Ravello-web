import { Offer } from "../models/index.js";
import mongoose from "mongoose";

export const getAllOffers = async ({
  page = 1,
  limit = 10,
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

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [data, total] = await Promise.all([
    Offer.find(query)
      .populate("package")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Offer.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getActiveOffers = async () => {
  const today = new Date();
  return await Offer.find({
    activo: true,
    fechaInicio: { $lte: today },
    fechaFin: { $gte: today },
  }).populate("package");
};

export const getOfferById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findById(id).populate("package");
};

export const createOffer = async (data) => {
  const offer = new Offer(data);
  return await offer.save();
};

export const updateOffer = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOffer = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Offer.findByIdAndDelete(id);
};

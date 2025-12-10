import { Review } from "../models/index.js";

// -------------------------------------------------------------
// GET ALL - con búsqueda y paginación
// -------------------------------------------------------------
export const getAll = async (queryOptions, searchFilter, pagination) => {
  const allowedRawFilters = ["paquete", "estadoModeracion", "tipo"];

  const rawFilters = Object.fromEntries(
    Object.entries(queryOptions.raw).filter(([key]) =>
      allowedRawFilters.includes(key)
    )
  );

  const query = {
    ...queryOptions.filters,
    ...rawFilters,
    ...searchFilter,
  };

  const total = await Review.countDocuments(query);

  let mongoQuery = Review.find(query)
    .populate("paquete", "nombre")
    .sort(queryOptions.sort);

  if (pagination) {
    mongoQuery = mongoQuery
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  const items = await mongoQuery;

  return {
    total,
    page: pagination?.page || null,
    limit: pagination?.limit || null,
    items,
  };
};


// -------------------------------------------------------------
// GET BY ID
// -------------------------------------------------------------
export const getById = async (id) => {
  const review = await Review.findById(id).populate("paquete", "nombre");
  if (!review) throw new Error("Reseña no encontrada");
  return review;
};

// -------------------------------------------------------------
// CREATE
// -------------------------------------------------------------
export const create = async (data) => {
  const review = new Review(data);
  return await review.save();
};

// -------------------------------------------------------------
// UPDATE
// -------------------------------------------------------------
export const update = async (id, data) => {
  const review = await Review.findByIdAndUpdate(id, data, { new: true });
  if (!review) throw new Error("Reseña no encontrada");
  return review;
};

// -------------------------------------------------------------
// DELETE
// -------------------------------------------------------------
export const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new Error("Reseña no encontrada");
  return review;
};

// -------------------------------------------------------------
// MODERAR
// -------------------------------------------------------------
export const moderar = async (id, estado) => {
  if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
    throw new Error("Estado de moderación inválido");
  }

  const review = await Review.findById(id);
  if (!review) throw new Error("Reseña no encontrada");

  review.estadoModeracion = estado;
  await review.save();
  return review;
};
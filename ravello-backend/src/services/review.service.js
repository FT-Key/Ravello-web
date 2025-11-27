import { Review } from "../models/index.js";

// -------------------------------------------------------------
// GET ALL - con búsqueda y paginación
// -------------------------------------------------------------
export const getAll = async (queryOptions, searchFilter, pagination) => {
  const query = {
    ...queryOptions.filters,
    ...searchFilter,
  };

  console.log("🔍 Query getAll reviews:", JSON.stringify(query, null, 2));

  try {
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

    console.log(`✅ Reseñas encontradas: ${items.length} de ${total} total`);

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    };
  } catch (error) {
    console.error("❌ Error en getAll reviews:", error);
    throw new Error(`Error buscando reseñas: ${error.message}`);
  }
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
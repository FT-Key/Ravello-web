import { User } from "../models/index.js";
import argon2 from "argon2";

// -------------------------------------------------------------
// GET ALL - con búsqueda y paginación
// -------------------------------------------------------------
export const getAll = async (queryOptions, searchFilter, pagination) => {
  const query = {
    ...queryOptions.filters,
    ...searchFilter,
  };

  console.log("🔍 Query getAll users:", JSON.stringify(query, null, 2));

  try {
    const total = await User.countDocuments(query);

    let mongoQuery = User.find(query)
      .select("-password")
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const items = await mongoQuery;

    console.log(`✅ Usuarios encontrados: ${items.length} de ${total} total`);

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    };
  } catch (error) {
    console.error("❌ Error en getAll users:", error);
    throw new Error(`Error buscando usuarios: ${error.message}`);
  }
};

// -------------------------------------------------------------
// GET BY ID
// -------------------------------------------------------------
export const getById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

// -------------------------------------------------------------
// CREATE
// -------------------------------------------------------------
export const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

// -------------------------------------------------------------
// UPDATE
// -------------------------------------------------------------
export const update = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuario no encontrado");

  // Hash password si se está actualizando
  if (data.password) {
    data.password = await argon2.hash(data.password);
  }

  Object.assign(user, data);
  await user.save();

  return user.toObject({ getters: true, virtuals: false });
};

// -------------------------------------------------------------
// DELETE
// -------------------------------------------------------------
export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuario no encontrado");
  
  if (user.esPrincipal) {
    throw new Error("No se puede eliminar el usuario principal.");
  }

  await user.deleteOne();
  return user;
};
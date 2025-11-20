import { User } from "../models/index.js";
import argon2 from "argon2";

// === LISTAR TODOS LOS USUARIOS ===
export const getAllUsers = async (filter = {}, options = {}) => {
  const { search, page = 1, limit = 10 } = options;
  const query = {};

  if (filter.rol) query.rol = filter.rol;
  if (filter.activo !== undefined) query.activo = filter.activo;

  if (search) {
    query.$or = [
      { nombre: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const data = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { total, page, limit, data };
};

// === OBTENER USUARIO POR ID ===
export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// === CREAR NUEVO USUARIO ===
export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

// === ACTUALIZAR USUARIO ===
export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) return null;

  if (data.password) {
    data.password = await argon2.hash(data.password);
  }

  Object.assign(user, data);
  await user.save();

  return user.toObject({ getters: true, virtuals: false });
};

// === ELIMINAR USUARIO ===
export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;
  if (user.esPrincipal)
    throw new Error("No se puede eliminar el usuario principal.");

  await user.deleteOne();
  return user;
};

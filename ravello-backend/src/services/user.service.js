import { User } from "../models/index.js";

// === LISTAR TODOS LOS USUARIOS ===
export const getAllUsers = async () => {
  return await User.find().select("-password");
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
  return await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

// === ELIMINAR USUARIO ===
export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

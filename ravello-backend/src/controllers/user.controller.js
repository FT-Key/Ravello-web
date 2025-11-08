import { userService } from "../services/index.js";

// === OBTENER TODOS LOS USUARIOS ===
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === OBTENER UN USUARIO POR ID ===
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === CREAR USUARIO ===
export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === ACTUALIZAR USUARIO ===
export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === ELIMINAR USUARIO ===
export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

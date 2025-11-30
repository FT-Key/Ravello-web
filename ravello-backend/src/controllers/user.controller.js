import * as userService from "../services/user.service.js";

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await userService.getAll(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("❌ Error en getUsers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const data = await userService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  try {
    const data = await userService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const data = await userService.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
import { authService } from "../services/index.js";

// ⚠️ AGREGAR meService aquí
const { loginService, registerService, meService } = authService;

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);

  } catch (error) {
    console.error("Error loginController:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};

export const registerController = async (req, res) => {
  try {
    const result = await registerService(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error("Error registerController:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};

export const meController = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token requerido" });
    }

    const result = await meService(token);

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.json(result);

  } catch (error) {
    console.error("Error meController:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token requerido" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "Usuario no encontrado" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

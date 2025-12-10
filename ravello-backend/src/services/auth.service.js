// services/authService.js
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import argon2 from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";
const JWT_EXPIRES = "7d";

export const generarToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// LOGIN
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: "Credenciales inválidas" };
  }

  if (!user.activo) {
    return { success: false, message: "El usuario está deshabilitado" };
  }

  const passwordCorrecta = await argon2.verify(user.password, password);

  if (!passwordCorrecta) {
    return { success: false, message: "Credenciales inválidas" };
  }

  const token = generarToken(user._id);

  return {
    success: true,
    token,
    user: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }
  };
};

// REGISTRO
export const registerService = async ({ nombre, email, password, rol }) => {
  const existe = await User.findOne({ email });
  if (existe) {
    return { success: false, message: "El email ya está registrado" };
  }

  const nuevo = new User({
    nombre,
    email,
    password,
    rol: rol || "cliente"
  });

  await nuevo.save();

  const token = generarToken(nuevo._id);

  return {
    success: true,
    token,
    user: {
      id: nuevo._id,
      nombre: nuevo.nombre,
      email: nuevo.email,
      rol: nuevo.rol
    }
  };
};

export const meService = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.activo) {
      return { success: false, message: "Usuario no válido o deshabilitado" };
    }

    return {
      success: true,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    };

  } catch (error) {
    console.error("Error en meService:", error);
    return { success: false, message: "Token inválido o expirado" };
  }
};
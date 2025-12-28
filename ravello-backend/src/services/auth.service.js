// services/authService.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/index.js";
import argon2 from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// ============================================
// 🔑 GENERAR TOKEN JWT
// ============================================
export const generarToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// ============================================
// 🔐 LOGIN
// ============================================
export const loginService = async ({ email, password }) => {
  try {
    // 1. Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return { 
        success: false, 
        message: "Credenciales inválidas" 
      };
    }

    // 2. Verificar si está activo
    if (!user.activo) {
      return { 
        success: false, 
        message: "Usuario deshabilitado. Contacta al administrador." 
      };
    }

    // 3. Verificar si fue eliminado (soft delete)
    if (user.eliminado) {
      return { 
        success: false, 
        message: "Usuario no encontrado" 
      };
    }

    // 4. Verificar contraseña
    const passwordCorrecta = await argon2.verify(user.password, password);
    
    if (!passwordCorrecta) {
      // Incrementar intentos fallidos
      user.intentosLoginFallidos = (user.intentosLoginFallidos || 0) + 1;
      
      // Bloquear después de 5 intentos fallidos
      if (user.intentosLoginFallidos >= 5) {
        user.bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        await user.save();
        
        return {
          success: false,
          message: "Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos."
        };
      }
      
      await user.save();
      
      return { 
        success: false, 
        message: "Credenciales inválidas" 
      };
    }

    // 5. Verificar si está bloqueado
    if (user.bloqueadoHasta && user.bloqueadoHasta > new Date()) {
      const minutosRestantes = Math.ceil((user.bloqueadoHasta - new Date()) / 60000);
      return {
        success: false,
        message: `Cuenta bloqueada. Intenta en ${minutosRestantes} minutos.`
      };
    }

    // 6. Login exitoso - resetear intentos fallidos
    user.intentosLoginFallidos = 0;
    user.bloqueadoHasta = null;
    user.ultimoAcceso = new Date();
    await user.save();

    // 7. Generar token
    const token = generarToken(user._id);

    return {
      success: true,
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        emailVerificado: user.emailVerificado,
        perfilCompleto: user.perfilCompleto,
        camposRequeridos: user.camposRequeridos
      }
    };
  } catch (error) {
    console.error("❌ Error en loginService:", error);
    throw error;
  }
};

// ============================================
// 📝 REGISTRO
// ============================================
export const registerService = async (userData) => {
  try {
    const { email, password, rol, ...restoData } = userData;

    // 1. Verificar si el email ya existe
    const existe = await User.findOne({ email: email.toLowerCase() });
    
    if (existe) {
      return { 
        success: false, 
        message: "El email ya está registrado" 
      };
    }

    // 2. Crear nuevo usuario
    const nuevoUser = new User({
      email: email.toLowerCase(),
      password,
      rol: rol || "cliente",
      ...restoData
    });

    await nuevoUser.save();

    // 3. Generar token
    const token = generarToken(nuevoUser._id);

    return {
      success: true,
      token,
      user: {
        id: nuevoUser._id,
        nombre: nuevoUser.nombre,
        apellido: nuevoUser.apellido,
        email: nuevoUser.email,
        rol: nuevoUser.rol,
        emailVerificado: nuevoUser.emailVerificado,
        perfilCompleto: nuevoUser.perfilCompleto,
        camposRequeridos: nuevoUser.camposRequeridos
      },
      message: "Usuario registrado exitosamente"
    };
  } catch (error) {
    console.error("❌ Error en registerService:", error);
    throw error;
  }
};

// ============================================
// 🔐 CAMBIAR CONTRASEÑA
// ============================================
export const changePasswordService = async (userId, { passwordActual, passwordNueva }) => {
  try {
    // 1. Buscar usuario
    const user = await User.findById(userId);
    
    if (!user) {
      return { 
        success: false, 
        message: "Usuario no encontrado" 
      };
    }

    // 2. Verificar contraseña actual
    const passwordCorrecta = await argon2.verify(user.password, passwordActual);
    
    if (!passwordCorrecta) {
      return { 
        success: false, 
        message: "La contraseña actual es incorrecta" 
      };
    }

    // 3. Actualizar contraseña (el middleware pre-save hace el hash)
    user.password = passwordNueva;
    await user.save();

    return {
      success: true,
      message: "Contraseña actualizada exitosamente"
    };
  } catch (error) {
    console.error("❌ Error en changePasswordService:", error);
    throw error;
  }
};

// ============================================
// 📧 RECUPERAR CONTRASEÑA - Generar token
// ============================================
export const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Por seguridad, no revelamos si el email existe o no
    if (!user) {
      console.log(`⚠️ Intento de recuperación para email inexistente: ${email}`);
      return { success: true };
    }

    // Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    await user.save();

    // TODO: Enviar email con el token
    // Por ahora solo lo logueamos (en producción, usar nodemailer o similar)
    console.log("🔐 Token de reseteo generado:", resetToken);
    console.log("📧 Enviar email a:", user.email);
    console.log("🔗 Link de reseteo:", `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

    return {
      success: true,
      // ⚠️ SOLO PARA DESARROLLO - Quitar en producción
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
    };
  } catch (error) {
    console.error("❌ Error en forgotPasswordService:", error);
    throw error;
  }
};

// ============================================
// 🔄 RESETEAR CONTRASEÑA
// ============================================
export const resetPasswordService = async (token, newPassword) => {
  try {
    // 1. Hashear el token recibido
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2. Buscar usuario con token válido
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return {
        success: false,
        message: "Token inválido o expirado"
      };
    }

    // 3. Actualizar contraseña
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return {
      success: true,
      message: "Contraseña restablecida exitosamente"
    };
  } catch (error) {
    console.error("❌ Error en resetPasswordService:", error);
    throw error;
  }
};
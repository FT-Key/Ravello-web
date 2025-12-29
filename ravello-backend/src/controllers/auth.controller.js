// controllers/authController.js
import { authService } from "../services/index.js";

const {
  loginService,
  registerService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService
} = authService;

// ============================================
// 🔑 LOGIN
// ============================================
export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error("❌ Error en loginController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// ============================================
// 📝 REGISTRO
// ============================================
export const registerController = async (req, res) => {
  try {
    const result = await registerService(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error("❌ Error en registerController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// ============================================
// 👤 ME (Persistencia - Datos del usuario autenticado)
// ============================================
export const meController = async (req, res) => {
  try {
    // ✅ El authMiddleware ya adjuntó req.user
    // Ya no necesitamos extraer el token manualmente ni llamar a un servicio
    
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        rol: req.user.rol,
        emailVerificado: req.user.emailVerificado,
        perfilCompleto: req.user.perfilCompleto,
        camposRequeridos: req.user.camposRequeridos,
        activo: req.user.activo
      }
    });
  } catch (error) {
    console.error("❌ Error en meController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// ============================================
// 🔐 CAMBIAR CONTRASEÑA
// ============================================
export const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService(
      req.user._id, 
      req.body
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error("❌ Error en changePasswordController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// ============================================
// 📧 RECUPERAR CONTRASEÑA - Solicitar token
// ============================================
export const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    
    // Siempre retornamos éxito para no revelar si el email existe
    return res.json({
      success: true,
      message: "Si el correo existe, recibirás instrucciones para recuperar tu contraseña"
    });
  } catch (error) {
    console.error("❌ Error en forgotPasswordController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};

// ============================================
// 🔄 RESETEAR CONTRASEÑA con token
// ============================================
export const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await resetPasswordService(token, password);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error("❌ Error en resetPasswordController:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
};
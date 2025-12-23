// middlewares/roleMiddleware.js

/**
 * Middleware para verificar roles de usuario
 * Acepta tanto argumentos individuales como arrays
 * 
 * @example
 * requireRole('admin')
 * requireRole('admin', 'editor')
 * requireRole(['admin', 'editor'])
 */
export const requireRole = (...rolesPermitidos) => {
  // Si el primer argumento es un array, usarlo directamente
  if (Array.isArray(rolesPermitidos[0])) {
    rolesPermitidos = rolesPermitidos[0];
  }

  return (req, res, next) => {
    // Verificar que req.user existe (authMiddleware debe ejecutarse antes)
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: "Error interno: req.user no existe. Falta authMiddleware."
      });
    }

    // Verificar que el usuario tiene uno de los roles permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        message: "Acceso denegado. No tienes permisos suficientes.",
        rolRequerido: rolesPermitidos,
        rolActual: req.user.rol
      });
    }

    next();
  };
};
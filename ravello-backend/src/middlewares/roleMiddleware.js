// middlewares/roleMiddleware.js
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: "Error interno: req.user no existe. Falta authMiddleware."
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};

// middlewares/protegerAdminPrincipal.js
import { User } from "../models/index.js";

export const protegerAdminPrincipal = async (req, res, next) => {
  const usuario = await User.findById(req.params.id);

  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (usuario.esPrincipal) {
    return res
      .status(403)
      .json({ message: "No se puede modificar ni eliminar al administrador principal" });
  }

  next();
};

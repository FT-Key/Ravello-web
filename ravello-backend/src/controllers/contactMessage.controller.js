import { contactService } from "../services/index.js";

/** 📨 Crear un nuevo mensaje y enviar correos */
export const createMessage = async (req, res, next) => {
  try {
    const { nombre, email, telefono, mensaje, asunto } = req.body;

    if (!nombre || !email || !mensaje) {
      return res
        .status(400)
        .json({ error: "Nombre, email y mensaje son obligatorios" });
    }

    const result = await contactService.createMessage(
      { nombre, email, telefono, mensaje, asunto },
      { ip: req.ip, userAgent: req.headers["user-agent"] }
    );

    res.status(201).json({
      success: true,
      message: "Mensaje recibido correctamente",
      data: result.message,
      emailStatus: result.emailStatus,
    });
  } catch (err) {
    console.error("❌ Error en createMessage:", err);
    next(err);
  }
};

/** 📬 Obtener mensajes (con paginación + búsqueda + filtros) */
export const getMessages = async (req, res, next) => {
  try {
    const filter = {
      ...req.queryOptions.filters,
      ...req.searchFilter,
    };

    const options = {
      ...req.pagination,
      sort: req.queryOptions.sort,
    };

    const result = await contactService.getAllMessages(filter, options);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al obtener mensajes:", err);
    next(err);
  }
};

/** 🔍 Obtener un mensaje por ID */
export const getMessage = async (req, res, next) => {
  try {
    const message = await contactService.getMessageById(req.params.id);
    if (!message)
      return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

/** ✅ Marcar mensaje como leído */
export const markAsRead = async (req, res, next) => {
  try {
    const updated = await contactService.markAsRead(req.params.id);
    if (!updated)
      return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json({
      success: true,
      message: "Mensaje marcado como leído",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/** 🗑️ Eliminar mensaje */
export const deleteMessage = async (req, res, next) => {
  try {
    await contactService.deleteMessage(req.params.id);
    res.json({ success: true, message: "Mensaje eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

import { contactService } from "../services/index.js";

/** Crear un nuevo mensaje de contacto */
export const createMessage = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje, asunto } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: "Nombre, email y mensaje son obligatorios" });
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
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

/** Obtener todos los mensajes */
export const getMessages = async (req, res) => {
  try {
    const messages = await contactService.getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

/** Obtener un mensaje por ID */
export const getMessage = async (req, res) => {
  try {
    const message = await contactService.getMessageById(req.params.id);
    if (!message) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
};

/** Marcar como leído */
export const markAsRead = async (req, res) => {
  try {
    const updated = await contactService.markAsRead(req.params.id);
    if (!updated) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json({ success: true, message: "Mensaje marcado como leído", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
};

/** Eliminar mensaje */
export const deleteMessage = async (req, res) => {
  try {
    await contactService.deleteMessage(req.params.id);
    res.json({ success: true, message: "Mensaje eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
};

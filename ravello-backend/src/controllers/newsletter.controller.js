import { newsletterService } from "../services/index.js";

/** GET /api/newsletter - Obtener suscriptores con paginación */
export async function getAll(req, res) {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    const data = await newsletterService.getAllSubscribers(queryOptions, searchFilter, pagination);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error("❌ Error en getAll:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/** POST /api/newsletter - Crear suscriptor */
export async function create(req, res) {
  try {
    const { email } = req.body;
    const result = await newsletterService.createSubscriber(email);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    console.error("❌ Error en create:", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

/** POST /api/newsletter/unsubscribe - Desuscribir por email */
export async function unsubscribe(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email requerido" });
    }

    const result = await newsletterService.unsubscribeByEmail(email);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("❌ Error en unsubscribe:", err);
    res.status(404).json({ success: false, message: err.message });
  }
}

/** PATCH /api/newsletter/:id/status - Cambiar estado activo/inactivo */
export async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const result = await newsletterService.toggleSubscriberStatus(id, active);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("❌ Error en toggleStatus:", err);
    res.status(404).json({ success: false, message: err.message });
  }
}

/** DELETE /api/newsletter/:id - Eliminar suscriptor */
export async function remove(req, res) {
  try {
    await newsletterService.deleteSubscriber(req.params.id);
    res.json({ success: true, message: "Suscriptor eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en remove:", err);
    res.status(404).json({ success: false, message: err.message });
  }
}
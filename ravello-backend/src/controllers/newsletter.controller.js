import { newsletterService } from "../services/index.js";

/** GET /api/newsletter */
export async function getAll(req, res) {
  try {
    const subscribers = await newsletterService.getAllSubscribers();
    res.json(subscribers);
  } catch (err) {
    console.error("❌ Error en getAll:", err);
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/newsletter */
export async function create(req, res) {
  try {
    const { email } = req.body;
    const result = await newsletterService.createSubscriber(email);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error en create:", err);
    res.status(400).json({ error: err.message });
  }
}

/** POST /api/newsletter/unsubscribe */
export async function unsubscribe(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const result = await newsletterService.unsubscribeByEmail(email);
    res.json(result);
  } catch (err) {
    console.error("❌ Error en unsubscribe:", err);
    res.status(500).json({ error: err.message });
  }
}

/** PATCH /api/newsletter/:id/status */
export async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const result = await newsletterService.toggleSubscriberStatus(id, active);
    res.json(result);
  } catch (err) {
    console.error("❌ Error en toggleStatus:", err);
    res.status(500).json({ error: err.message });
  }
}

/** DELETE /api/newsletter/:id */
export async function remove(req, res) {
  try {
    await newsletterService.deleteSubscriber(req.params.id);
    res.json({ message: "Suscriptor eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en remove:", err);
    res.status(500).json({ error: err.message });
  }
}

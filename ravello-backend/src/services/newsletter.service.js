import { Newsletter } from "../models/index.js";
import transporter from "../config/email.js";

export async function sendConfirmationEmail(email) {
  const baseUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: Arial; padding:24px; background:#f9f9f9; border-radius:8px;">
      <h2 style="color:#007bff;">¡Gracias por suscribirte!</h2>
      <p>Recibirás nuestras promociones y novedades.</p>
      <a href="${unsubscribeUrl}" style="display:inline-block; background:#dc3545; color:white; padding:10px 20px; border-radius:6px;">Cancelar suscripción</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ravello Viajes" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmación de suscripción",
    html,
  });
}

/** =========================================
 * 🟢 NUEVA PAGINACIÓN UNIFICADA
 * ========================================== */
export async function getAllSubscribers({ page, limit, sort = "-createdAt", filters = {} } = {}) {

  // ----------------------------------------
  // 🔵 SIN paginación → traer todos
  // ----------------------------------------
  if (!page || !limit) {
    const items = await Newsletter.find(filters).sort(sort);

    return {
      items,
      pagination: {
        total: items.length,
        page: null,
        limit: null,
        totalPages: null,
      },
    };
  }

  // ----------------------------------------
  // 🟢 CON paginación
  // ----------------------------------------
  const _page = Number(page);
  const _limit = Number(limit);
  const skip = (_page - 1) * _limit;

  const [items, total] = await Promise.all([
    Newsletter.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(_limit),

    Newsletter.countDocuments(filters),
  ]);

  return {
    items,
    pagination: {
      total,
      page: _page,
      limit: _limit,
      totalPages: Math.ceil(total / _limit),
    },
  };
}

/** Crear suscriptor */
export async function createSubscriber(email) {
  const existing = await Newsletter.findOne({ email });

  if (existing) {
    if (existing.active) {
      return { message: "Ya estás suscrito", subscriber: existing };
    }

    existing.active = true;
    await existing.save();
    await sendConfirmationEmail(email);

    return { message: "Suscripción reactivada", subscriber: existing };
  }

  const newSubscriber = new Newsletter({ email });
  await newSubscriber.save();
  await sendConfirmationEmail(email);

  return { message: "Suscripción creada", subscriber: newSubscriber };
}

/** Eliminar suscriptor */
export async function deleteSubscriber(id) {
  return await Newsletter.findByIdAndDelete(id);
}

/** Desuscribir por email */
export async function unsubscribeByEmail(email) {
  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) throw new Error("Suscriptor no encontrado.");

  subscriber.active = false;
  await subscriber.save();

  return { message: "Suscripción cancelada", email };
}

/** Cambiar estado activo/inactivo */
export async function toggleSubscriberStatus(id, active) {
  const subscriber = await Newsletter.findById(id);
  if (!subscriber) throw new Error("Suscriptor no encontrado.");

  subscriber.active = active;
  await subscriber.save();

  return {
    message: `Suscriptor ${active ? "activado" : "desactivado"}`,
    subscriber,
  };
}

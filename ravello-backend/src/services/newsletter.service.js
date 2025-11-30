import { Newsletter } from "../models/index.js";
import transporter from "../config/email.js";

/** Enviar email de confirmación */
export async function sendConfirmationEmail(email) {
  const baseUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: Arial; padding:24px; background:#f9f9f9; border-radius:8px;">
      <h2 style="color:#007bff;">¡Gracias por suscribirte!</h2>
      <p>Recibirás nuestras promociones y novedades.</p>
      <a href="${unsubscribeUrl}" style="display:inline-block; background:#dc3545; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; margin-top:16px;">Cancelar suscripción</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ravello Viajes" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmación de suscripción",
    html,
  });
}

/** 
 * Obtener todos los suscriptores con paginación y filtros
 * Parámetros consistentes con otros servicios
 */
export async function getAllSubscribers(queryOptions, searchFilter, pagination) {
  const query = {
    ...queryOptions.filters,
    ...searchFilter,
  };

  console.log("🔍 Query getAllSubscribers:", JSON.stringify(query, null, 2));

  try {
    const total = await Newsletter.countDocuments(query);

    let mongoQuery = Newsletter.find(query)
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const items = await mongoQuery;

    console.log(`✅ Suscriptores encontrados: ${items.length} de ${total} total`);

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    };
  } catch (error) {
    console.error("❌ Error en getAllSubscribers:", error);
    throw new Error(`Error buscando suscriptores: ${error.message}`);
  }
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
    
    try {
      await sendConfirmationEmail(email);
    } catch (err) {
      console.warn("⚠️ No se pudo enviar email de confirmación:", err.message);
    }

    return { message: "Suscripción reactivada", subscriber: existing };
  }

  const newSubscriber = new Newsletter({ email });
  await newSubscriber.save();
  
  try {
    await sendConfirmationEmail(email);
  } catch (err) {
    console.warn("⚠️ No se pudo enviar email de confirmación:", err.message);
  }

  return { message: "Suscripción creada", subscriber: newSubscriber };
}

/** Eliminar suscriptor */
export async function deleteSubscriber(id) {
  const subscriber = await Newsletter.findById(id);
  if (!subscriber) throw new Error("Suscriptor no encontrado");
  
  await subscriber.deleteOne();
  return subscriber;
}

/** Desuscribir por email */
export async function unsubscribeByEmail(email) {
  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) throw new Error("Suscriptor no encontrado");

  subscriber.active = false;
  await subscriber.save();

  return { message: "Suscripción cancelada", email };
}

/** Cambiar estado activo/inactivo */
export async function toggleSubscriberStatus(id, active) {
  const subscriber = await Newsletter.findById(id);
  if (!subscriber) throw new Error("Suscriptor no encontrado");

  subscriber.active = active;
  await subscriber.save();

  return {
    message: `Suscriptor ${active ? "activado" : "desactivado"}`,
    subscriber,
  };
}
import { Newsletter } from "../models/index.js";
import transporter from "../config/email.js";

/** Enviar correo de confirmación */
export async function sendConfirmationEmail(email) {
  console.log("📨 [newsletter.service] Enviando correo de bienvenida a:", email);

  // Asegurarse de que la URL no duplique barras
  const baseUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; border-radius: 8px;">
      <h2 style="color:#007bff; margin-bottom: 12px;">¡Gracias por suscribirte a nuestro boletín!</h2>
      <p style="color:#333;">Te enviaremos nuestras mejores promociones y novedades.</p>
      <p style="color:#555; font-size: 14px;">
        Si en algún momento deseás dejar de recibir correos, podés darte de baja haciendo clic en el siguiente botón:
      </p>
      <a href="${unsubscribeUrl}" 
         style="display:inline-block; background:#dc3545; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">
         Cancelar suscripción
      </a>
      <p style="color:#777; font-size:12px; margin-top:16px;">
        Podés volver a suscribirte en cualquier momento desde nuestro sitio web.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Ravello Viajes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirmación de suscripción - Ravello Viajes",
      html,
    });
    console.log("✅ Correo de bienvenida enviado correctamente a:", email);
  } catch (error) {
    console.error("❌ Error al enviar correo de bienvenida:", error);
  }
}

/** Obtener todos los suscriptores */
export async function getAllSubscribers() {
  console.log("🟢 [newsletter.service] getAllSubscribers()");
  return await Newsletter.find().sort({ createdAt: -1 });
}

/** Crear un nuevo suscriptor */
export async function createSubscriber(email) {
  console.log("🟢 [newsletter.service] createSubscriber()", email);

  const existing = await Newsletter.findOne({ email });

  if (existing) {
    if (existing.active) {
      console.log("⚠️ Email ya suscrito:", email);
      return { message: "Ya estás suscrito a la newsletter", subscriber: existing };
    }

    existing.active = true;
    await existing.save();
    await sendConfirmationEmail(email);
    return { message: "Suscripción reactivada con éxito", subscriber: existing };
  }

  const newSubscriber = new Newsletter({ email });
  await newSubscriber.save();
  await sendConfirmationEmail(email);

  return { message: "Suscripción creada con éxito", subscriber: newSubscriber };
}

/** Eliminar suscriptor */
export async function deleteSubscriber(id) {
  console.log("🟢 [newsletter.service] deleteSubscriber()", id);
  return await Newsletter.findByIdAndDelete(id);
}

/** Desuscribir por email */
export async function unsubscribeByEmail(email) {
  console.log("🟠 [newsletter.service] unsubscribeByEmail()", email);

  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) throw new Error("Suscriptor no encontrado.");

  subscriber.active = false;
  await subscriber.save();

  return { message: "Has cancelado tu suscripción correctamente.", email };
}

/** Cambiar estado activo/inactivo de un suscriptor */
export async function toggleSubscriberStatus(id, active) {
  console.log("🟣 [newsletter.service] toggleSubscriberStatus()", id, active);

  const subscriber = await Newsletter.findById(id);
  if (!subscriber) throw new Error("Suscriptor no encontrado.");

  subscriber.active = active;
  await subscriber.save();

  return { message: `Suscriptor ${active ? "activado" : "desactivado"} correctamente.`, subscriber };
}

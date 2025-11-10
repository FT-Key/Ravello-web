import { ContactMessage } from "../models/index.js";
import transporter from "../config/email.js";

/** Crear un nuevo mensaje y enviar emails */
export async function createMessage(data, meta = {}) {
  // 1️⃣ Guardar en base de datos
  const message = await ContactMessage.create({
    ...data,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  let emailStatus = {
    admin: "No enviado",
    user: "No enviado",
  };

  // 2️⃣ Enviar correo de notificación al admin
  try {
    await transporter.sendMail({
      from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `📩 Nuevo mensaje: ${data.asunto || "Consulta general"}`,
      text: `
Nuevo mensaje recibido:

🧑 Nombre: ${data.nombre}
📧 Email: ${data.email}
📞 Teléfono: ${data.telefono || "No especificado"}
📝 Mensaje:
${data.mensaje}

🌐 IP: ${meta.ip || "Desconocida"}
🖥️ User-Agent: ${meta.userAgent || "N/A"}

Recibido el: ${new Date().toLocaleString()}
      `,
    });
    emailStatus.admin = "Enviado correctamente";
  } catch (err) {
    console.warn("⚠️ No se pudo enviar el correo al admin:", err.message);
    emailStatus.admin = "Error al enviar";
  }

  // 3️⃣ Enviar correo de confirmación al usuario
  try {
    await transporter.sendMail({
      from: `"Soporte ${process.env.SITE_NAME || "Ravello Web"}" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `✅ Hemos recibido tu consulta`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 16px; line-height: 1.5;">
          <h2 style="color: #0066cc;">¡Hola ${data.nombre}!</h2>
          <p>Gracias por contactarte con <strong>${process.env.SITE_NAME || "nuestro sitio web"}</strong>.</p>
          <p>Hemos recibido tu consulta con el asunto <strong>"${data.asunto || "Consulta general"}"</strong> y te responderemos a la brevedad.</p>
          <p style="margin-top: 16px;">Tu mensaje:</p>
          <blockquote style="border-left: 3px solid #0066cc; padding-left: 8px; color: #555;">
            ${data.mensaje}
          </blockquote>
          <p style="margin-top: 16px;">Saludos cordiales,<br>El equipo de ${process.env.SITE_NAME || "Ravello Web"}.</p>
        </div>
      `,
    });
    emailStatus.user = "Enviado correctamente";
  } catch (err) {
    console.warn("⚠️ No se pudo enviar el correo al usuario:", err.message);
    emailStatus.user = "Error al enviar";
  }

  // 4️⃣ Retornar resultado al controlador
  return { message, emailStatus };
}

/** Obtener todos los mensajes */
export async function getAllMessages() {
  return await ContactMessage.find().sort({ createdAt: -1 });
}

/** Obtener mensaje por ID */
export async function getMessageById(id) {
  return await ContactMessage.findById(id);
}

/** Marcar mensaje como leído */
export async function markAsRead(id) {
  return await ContactMessage.findByIdAndUpdate(id, { leido: true }, { new: true });
}

/** Eliminar mensaje */
export async function deleteMessage(id) {
  return await ContactMessage.findByIdAndDelete(id);
}

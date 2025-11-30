import transporter from "../config/email.js";
import { ContactMessage } from "../models/index.js";

/** Crear un nuevo mensaje y enviar emails */
export async function createMessage(data, meta = {}) {
  const message = await ContactMessage.create({
    ...data,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  let emailStatus = {
    admin: "No enviado",
    user: "No enviado",
  };

  // 📧 Correo al administrador
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

  // 📬 Correo al usuario
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

  return { message, emailStatus };
}

/** 
 * Obtener mensajes con filtros y paginación 
 * Parámetros consistentes con user.service y package.service
 */
export async function getAllMessages(queryOptions, searchFilter, pagination) {
  const query = {
    ...queryOptions.filters,
    ...searchFilter,
  };

  console.log("🔍 Query getAllMessages:", JSON.stringify(query, null, 2));

  try {
    const total = await ContactMessage.countDocuments(query);

    let mongoQuery = ContactMessage.find(query)
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const items = await mongoQuery;

    console.log(`✅ Mensajes encontrados: ${items.length} de ${total} total`);

    return {
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    };
  } catch (error) {
    console.error("❌ Error en getAllMessages:", error);
    throw new Error(`Error buscando mensajes: ${error.message}`);
  }
}

/** Obtener uno por ID */
export async function getMessageById(id) {
  const message = await ContactMessage.findById(id);
  if (!message) throw new Error("Mensaje no encontrado");
  return message;
}

/** Marcar mensaje como leído */
export async function markAsRead(id) {
  const message = await ContactMessage.findById(id);
  if (!message) throw new Error("Mensaje no encontrado");
  
  message.leido = true;
  await message.save();
  
  return message;
}

/** Eliminar mensaje */
export async function deleteMessage(id) {
  const message = await ContactMessage.findById(id);
  if (!message) throw new Error("Mensaje no encontrado");
  
  await message.deleteOne();
  return message;
}
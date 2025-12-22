// services/email.service.js
import transporter from "../config/email.js";

/**
 * Servicio centralizado para envío de emails
 * Basado en contact.service.js pero reutilizable para todo el sistema
 */

/**
 * Enviar email genérico
 * @param {Object} options - Opciones del email
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.template - Nombre del template a usar
 * @param {Object} options.data - Datos para el template
 * @param {string} options.from - (Opcional) Remitente personalizado
 */
export async function sendEmail({ to, subject, template, data, from }) {
  try {
    const htmlContent = generarHTMLPorTemplate(template, data);
    
    await transporter.sendMail({
      from: from || `"${process.env.SITE_NAME || "Ravello Viajes"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email enviado correctamente a ${to} - Template: ${template}`);
    return { success: true, message: "Email enviado correctamente" };

  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);
    throw new Error(`Error enviando email: ${error.message}`);
  }
}

/**
 * Enviar email a administrador
 * @param {Object} options - Opciones del email
 */
export async function sendAdminEmail({ subject, message, data }) {
  try {
    await transporter.sendMail({
      from: `"Sistema ${process.env.SITE_NAME || "Ravello Viajes"}" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              ${subject}
            </h2>
            <div style="margin-top: 20px; color: #555; line-height: 1.6;">
              ${message}
            </div>
            ${data ? `
              <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 3px solid #0066cc;">
                <pre style="margin: 0; white-space: pre-wrap; font-size: 13px;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            ` : ''}
            <p style="margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
              Fecha: ${new Date().toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Email de notificación enviado al administrador`);
    return { success: true };

  } catch (error) {
    console.error("❌ Error enviando email al admin:", error.message);
    // No lanzamos error para no romper el flujo principal
    return { success: false, error: error.message };
  }
}

/**
 * Generar HTML según el template solicitado
 */
function generarHTMLPorTemplate(template, data) {
  const templates = {
    // Template para confirmación de pago
    'pago-confirmado': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0;">✅ Pago Confirmado</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>
          
          <p style="color: #555; line-height: 1.6;">
            Hemos recibido tu pago correctamente. A continuación los detalles:
          </p>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Pago:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroPago}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Monto Pagado:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #28a745; font-size: 18px;">
                  ${data.moneda} ${parseFloat(data.montoPagado).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              ${data.metodoPago ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Método de Pago:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333;">${data.metodoPago}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;">Fecha:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.fechaPago}</td>
              </tr>
              <tr style="border-top: 2px solid #ddd;">
                <td style="padding: 12px 0 0 0; color: #666; font-weight: bold;">Saldo Pendiente:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-weight: bold; color: ${data.montoPendiente > 0 ? '#ff9800' : '#28a745'}; font-size: 18px;">
                  ${data.moneda} ${parseFloat(data.montoPendiente).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </table>
          </div>

          ${data.montoPendiente > 0 ? `
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Recordatorio:</strong> Aún tienes un saldo pendiente. Te contactaremos para coordinar el próximo pago.
              </p>
            </div>
          ` : `
            <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #155724;">
                <strong>🎉 ¡Felicitaciones!</strong> Has completado el pago total de tu reserva.
              </p>
            </div>
          `}

          <p style="color: #555; line-height: 1.6; margin-top: 25px;">
            Si tienes alguna consulta, no dudes en contactarnos.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    `,

    // Template para pago rechazado
    'pago-rechazado': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin: 0;">❌ Pago Rechazado</h1>
          </div>

          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>

          <div style="background: #f8d7da; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #721c24; font-weight: bold;">
              Lamentablemente tu pago no pudo ser procesado.
            </p>
            <p style="margin: 0; color: #721c24;">
              <strong>Motivo:</strong> ${data.motivo || "No especificado"}
            </p>
          </div>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Monto Intentado:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                  ${data.montoPago.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #d1ecf1; padding: 20px; border-left: 4px solid #0c5460; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #0c5460; font-weight: bold;">
              💡 ¿Qué puedes hacer?
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #0c5460;">
              <li>Verificar los fondos disponibles</li>
              <li>Verificar los datos de tu tarjeta</li>
              <li>Intentar con otro método de pago</li>
              <li>Contactarnos para asistencia</li>
            </ul>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Puedes intentar realizar el pago nuevamente desde tu panel de reservas o contactarnos para ayudarte.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>
      </div>
    `,

    // Template para reembolso
    'reembolso-confirmado': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0;">🔄 Reembolso Procesado</h1>
          </div>

          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>

          <p style="color: #555; line-height: 1.6;">
            Te informamos que hemos procesado un reembolso en tu reserva:
          </p>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Pago:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroPago}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Monto Reembolsado:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0066cc; font-size: 18px;">
                  ${data.moneda} ${parseFloat(data.montoReembolsado).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              ${data.motivo ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;">Motivo:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333;">${data.motivo}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #d1ecf1; padding: 15px; border-left: 4px solid #0c5460; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0c5460;">
              <strong>ℹ️ Importante:</strong> El reembolso puede tardar entre 5 y 10 días hábiles en reflejarse según tu entidad bancaria.
            </p>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Si tienes alguna consulta sobre este reembolso, no dudes en contactarnos.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>
      </div>
    `,
  };

  // Si el template existe, retornarlo, sino template genérico
  return templates[template] || generarTemplateGenerico(data);
}

/**
 * Template genérico cuando no hay uno específico
 */
function generarTemplateGenerico(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #0066cc;">Notificación de ${process.env.SITE_NAME || "Ravello Viajes"}</h2>
        <div style="margin: 20px 0; color: #555; line-height: 1.6;">
          ${data.message || "Has recibido una notificación de nuestro sistema."}
        </div>
        <p style="margin-top: 30px; color: #333;">
          Saludos cordiales,<br>
          <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
        </p>
      </div>
    </div>
  `;
}
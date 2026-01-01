// services/email.service.js
import transporter from "../config/email.js";

/**
 * Servicio centralizado para envío de emails
 * Respeta las variables de entorno para habilitar/deshabilitar envíos
 */

/**
 * Verifica si el envío de emails está habilitado
 */
function isEmailEnabled() {
  // Si existe ENABLE_EMAILS, usarla (tiene prioridad)
  if (process.env.ENABLE_EMAILS !== undefined) {
    return process.env.ENABLE_EMAILS === 'true';
  }
  
  // Si no existe, usar el entorno (solo en producción por defecto)
  return process.env.NODE_ENV === 'production';
}

/**
 * Registra el email en consola sin enviarlo (modo desarrollo/deshabilitado)
 */
function logEmailInConsole({ to, subject, template, data }) {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 [EMAIL SIMULADO - NO ENVIADO]');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📨 Para:      ${to}`);
  console.log(`📝 Asunto:    ${subject}`);
  console.log(`🎨 Template:  ${template}`);
  console.log(`🌍 Entorno:   ${process.env.NODE_ENV}`);
  console.log(`⚙️  Habilitado: ${isEmailEnabled()}`);
  console.log('');
  console.log('📦 Datos del email:');
  console.log(JSON.stringify(data, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

/**
 * Envía un email utilizando un template predefinido
 * @param {Object} options - Opciones del email
 * @param {string} options.to - Email del destinatario
 * @param {string} options.subject - Asunto del email
 * @param {string} options.template - Nombre del template a usar
 * @param {Object} options.data - Datos para el template
 * @param {string} [options.from] - Email del remitente (opcional)
 */
export async function sendEmail({ to, subject, template, data, from }) {
  try {
    // Verificar si el envío de emails está habilitado
    if (!isEmailEnabled()) {
      logEmailInConsole({ to, subject, template, data });
      console.log('ℹ️  Email NO enviado (emails deshabilitados)');
      console.log('💡 Tip: Para habilitar emails, configura ENABLE_EMAILS=true en .env');
      console.log('');
      
      // Retornar éxito simulado
      return { 
        success: true, 
        message: "Email simulado (no enviado - emails deshabilitados)",
        simulated: true 
      };
    }

    // Generar el HTML del template
    const htmlContent = generarHTMLPorTemplate(template, data);
    
    // Enviar el email real
    const info = await transporter.sendMail({
      from: from || `"${process.env.SITE_NAME || "Ravello Viajes"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email enviado correctamente a ${to} - Template: ${template} - ID: ${info.messageId}`);
    return { 
      success: true, 
      message: "Email enviado correctamente",
      messageId: info.messageId,
      simulated: false 
    };

  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);
    
    // No lanzar error si los emails están deshabilitados
    if (!isEmailEnabled()) {
      return { 
        success: true, 
        message: "Email simulado (error capturado pero emails deshabilitados)",
        simulated: true,
        error: error.message
      };
    }
    
    throw new Error(`Error enviando email: ${error.message}`);
  }
}

/**
 * Envía un email de notificación al administrador
 * @param {Object} options - Opciones del email
 * @param {string} options.subject - Asunto del email
 * @param {string} options.message - Mensaje del email
 * @param {Object} [options.data] - Datos adicionales (opcional)
 */
export async function sendAdminEmail({ subject, message, data }) {
  try {
    // Verificar si el envío de emails está habilitado
    if (!isEmailEnabled()) {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 [EMAIL ADMIN SIMULADO - NO ENVIADO]');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📨 Para:      Admin (${process.env.ADMIN_EMAIL || process.env.EMAIL_USER})`);
      console.log(`📝 Asunto:    🔔 ${subject}`);
      console.log(`💬 Mensaje:   ${message}`);
      console.log('');
      if (data) {
        console.log('📦 Datos adicionales:');
        console.log(JSON.stringify(data, null, 2));
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      return { success: true, simulated: true };
    }

    // Enviar el email real al admin
    const info = await transporter.sendMail({
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

    console.log(`✅ Email de notificación enviado al administrador - ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, simulated: false };

  } catch (error) {
    console.error("❌ Error enviando email al admin:", error.message);
    
    // No lanzar error si los emails están deshabilitados
    if (!isEmailEnabled()) {
      return { 
        success: true, 
        simulated: true,
        error: error.message
      };
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Envía un email personalizado (sin template)
 * @param {Object} options - Opciones del email
 */
export async function sendCustomEmail({ to, subject, html, text, from }) {
  try {
    if (!isEmailEnabled()) {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 [EMAIL PERSONALIZADO SIMULADO - NO ENVIADO]');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📨 Para:      ${to}`);
      console.log(`📝 Asunto:    ${subject}`);
      console.log(`📄 Contenido: ${text || 'HTML personalizado'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      return { 
        success: true, 
        message: "Email simulado",
        simulated: true 
      };
    }

    const info = await transporter.sendMail({
      from: from || `"${process.env.SITE_NAME || "Ravello Viajes"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    });

    console.log(`✅ Email personalizado enviado a ${to} - ID: ${info.messageId}`);
    return { 
      success: true, 
      messageId: info.messageId,
      simulated: false 
    };

  } catch (error) {
    console.error(`❌ Error enviando email personalizado:`, error.message);
    
    if (!isEmailEnabled()) {
      return { 
        success: true, 
        simulated: true,
        error: error.message
      };
    }
    
    throw new Error(`Error enviando email: ${error.message}`);
  }
}

function generarHTMLPorTemplate(template, data) {
  const templates = {
    // ⬇️ TEMPLATE: Reserva creada
    'reserva-creada': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin: 0;">🎉 Reserva Creada Exitosamente</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>
          
          <p style="color: #555; line-height: 1.6;">
            ¡Gracias por confiar en nosotros! Tu reserva ha sido creada correctamente. A continuación los detalles:
          </p>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0066cc; font-size: 18px;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Paquete:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.paquete}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Fecha de Salida:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.fechaSalida}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Pasajeros:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.cantidadPasajeros}</td>
              </tr>
              <tr style="border-top: 2px solid #ddd;">
                <td style="padding: 12px 0 0 0; color: #666; font-weight: bold;">Monto Total:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-weight: bold; color: #0066cc; font-size: 20px;">
                  ${data.moneda} $${parseFloat(data.montoTotal || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </table>
          </div>

          ${data.planCuotas && data.planCuotas.tipo !== 'contado' ? `
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold;">
                💳 Plan de Cuotas: ${data.planCuotas.cantidadCuotas} cuotas
              </p>
              <p style="margin: 0; color: #856404; font-size: 14px;">
                Te contactaremos para coordinar los pagos según el plan acordado.
              </p>
            </div>
          ` : ''}

          <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #155724;">
              <strong>✅ Próximos pasos:</strong>
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; color: #155724;">
              <li>Recibirás un email con el link de pago</li>
              <li>Una vez confirmado el pago, te enviaremos todos los detalles del viaje</li>
              <li>Puedes contactarnos en cualquier momento para consultas</li>
            </ul>
          </div>

          <p style="color: #555; line-height: 1.6; margin-top: 25px;">
            Guarda este email como comprobante de tu reserva. Si tienes alguna consulta, no dudes en contactarnos.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          <p>N° de Reserva: ${data.numeroReserva}</p>
        </div>
      </div>
    `,

    // ⬇️ TEMPLATE: Reserva confirmada
    'reserva-confirmada': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #28a745; margin: 0;">✅ Reserva Confirmada</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>
          
          <p style="color: #555; line-height: 1.6;">
            ¡Excelentes noticias! Tu reserva ha sido confirmada oficialmente.
          </p>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0066cc;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Paquete:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.paquete}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Fecha de Salida:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.fechaSalida}</td>
              </tr>
            </table>
          </div>

          <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #155724;">
              <strong>🎉 ¡Todo listo!</strong> Tu plaza está asegurada. Te estaremos contactando próximamente con más detalles sobre tu viaje.
            </p>
          </div>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>
      </div>
    `,

    // ⬇️ TEMPLATE: Reserva cancelada
    'reserva-cancelada': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin: 0;">❌ Reserva Cancelada</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>
          
          <p style="color: #555; line-height: 1.6;">
            Tu reserva ha sido cancelada según lo solicitado.
          </p>

          <div style="background: #f8d7da; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Paquete:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.paquete}</td>
              </tr>
              ${data.motivo ? `
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;">Motivo:</td>
                  <td style="padding: 8px 0; text-align: right; color: #333;">${data.motivo}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Si cambiaste de opinión o deseas hacer una nueva reserva, estaremos encantados de ayudarte.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>
      </div>
    `,

    // ⬇️ TEMPLATE: Cuota vencida
    'cuota-vencida': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff9800; margin: 0;">⚠️ Cuota Vencida</h1>
          </div>
          
          <p style="font-size: 16px; color: #333;">Hola <strong>${data.nombreCliente}</strong>,</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0 0 10px 0; color: #856404; font-weight: bold;">
              Te recordamos que tienes una cuota vencida en tu reserva.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #666;">N° de Reserva:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">${data.numeroReserva}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Paquete:</td>
                <td style="padding: 8px 0; text-align: right; color: #333;">${data.paquete}</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Por favor, contáctanos a la brevedad para regularizar tu situación y mantener activa tu reserva.
          </p>

          <p style="margin-top: 30px; color: #333;">
            Saludos cordiales,<br>
            <strong>El equipo de ${process.env.SITE_NAME || "Ravello Viajes"}</strong>
          </p>
        </div>
      </div>
    `,
  };

  return templates[template] || generarTemplateGenerico(data);
}

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
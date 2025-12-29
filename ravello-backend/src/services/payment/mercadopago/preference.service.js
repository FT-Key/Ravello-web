// ============================================
// 5. services/payment/mercadopago/preference.service.js
// ============================================
import { Preference } from 'mercadopago';
import { mpClient } from './client.js';

export class PreferenceService {
  static buildPreferenceBody(reserva, montoPago, tipoPago, numeroCuota, numeroPago) {
    console.log('🔧 Construyendo preferencia MP:', {
      reservaId: reserva._id,
      montoPago,
      tipoPago,
      numeroPago
    });

    const cuotaText = numeroCuota ? ` - Cuota ${numeroCuota}/${reserva.planCuotas?.cantidadCuotas || ''}` : '';
    const tipoText = tipoPago === 'senia' ? 'Seña' :
      tipoPago === 'cuota' ? 'Cuota' :
        tipoPago === 'saldo' ? 'Saldo' : 'Pago';

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

    const body = {
      items: [
        {
          id: reserva.paquete._id.toString(),
          title: `${reserva.paquete.nombre}${cuotaText}`,
          description: `${tipoText} - Reserva ${reserva.numeroReserva}`,
          quantity: 1,
          unit_price: montoPago,
          currency_id: reserva.moneda || 'ARS'
        }
      ],
      payer: {
        name: reserva.datosContacto?.nombre,
        surname: reserva.datosContacto?.apellido,
        email: reserva.datosContacto?.email,
        phone: { 
          number: reserva.datosContacto?.telefono 
        },
        identification: {
          type: reserva.datosContacto?.tipoDocumento === 'DNI' ? 'DNI' : 'PASSPORT',
          number: reserva.datosContacto?.documento
        }
      },
      /* back_urls: {
        success: `${frontendUrl}/reservas/${reserva.numeroReserva}/pago-exitoso`,
        failure: `${frontendUrl}/reservas/${reserva.numeroReserva}/pago-fallido`,
        pending: `${frontendUrl}/reservas/${reserva.numeroReserva}/pago-pendiente`
      }, */
      //auto_return: 'approved',
      external_reference: numeroPago,
      statement_descriptor: process.env.MP_STATEMENT_DESCRIPTOR || 'RAVELLO VIAJES',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      metadata: {
        reserva_id: reserva._id.toString(),
        user_id: reserva.usuario?.toString(),
        tipo_pago: tipoPago,
        numero_cuota: numeroCuota
      }
    };

    // ⬅️ Solo agregar notification_url si NO es localhost
    const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
    
    if (!isLocalhost) {
      body.notification_url = `${backendUrl}/api/webhooks/mercadopago`;
      console.log('✅ notification_url agregada:', body.notification_url);
    } else {
      console.log('⚠️ notification_url omitida (entorno local)');
      console.log('ℹ️ Los webhooks no funcionarán en desarrollo local');
    }

    console.log('📦 Preferencia construida:', JSON.stringify(body, null, 2));

    return body;
  }

  static async create(body) {
    console.log('💳 Creando preferencia en MercadoPago');
    
    const preference = new Preference(mpClient);

    try {
      const result = await preference.create({ body });

      console.log('✅ Preferencia creada exitosamente:', {
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point
      });

      return result;
    } catch (error) {
      console.error('❌ Error al crear preferencia MP:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error cause:', JSON.stringify(error.cause, null, 2));
      throw error;
    }
  }

  // ⬅️ MÉTODO ELIMINADO: updatePaymentWithPreference
  // Ya no se necesita porque el Payment se crea con mercadopago incluido
}
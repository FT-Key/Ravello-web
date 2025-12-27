// ============================================
// 5. services/payment/mercadopago/preference.service.js
// ============================================
import { Preference } from 'mercadopago';
import { mpClient } from './client.js';

export class PreferenceService {
  static buildPreferenceBody(reserva, montoPago, tipoPago, numeroCuota, numeroPago) {
    const cuotaText = numeroCuota ? ` - Cuota ${numeroCuota}/${reserva.planCuotas.cantidadCuotas}` : '';
    const tipoText = tipoPago === 'senia' ? 'Seña' :
      tipoPago === 'cuota' ? 'Cuota' :
        tipoPago === 'saldo' ? 'Saldo' : 'Pago';
        
    console.log({
      items: [
        {
          id: reserva.paquete._id.toString(),
          title: `${reserva.paquete.nombre}${cuotaText}`,
          description: `${tipoText} - Reserva ${reserva.numeroReserva}`,
          quantity: 1,
          unit_price: montoPago,
          currency_id: reserva.moneda
        }
      ],
      payer: {
        name: reserva.datosContacto.nombre,
        surname: reserva.datosContacto.apellido,
        email: reserva.datosContacto.email,
        phone: { number: reserva.datosContacto.telefono },
        identification: {
          type: reserva.datosContacto.tipoDocumento === 'DNI' ? 'DNI' : 'PASSPORT',
          number: reserva.datosContacto.documento
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-pendiente`
      },
      external_reference: numeroPago,
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'RAVELLO VIAJES',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    })

    return {
      items: [
        {
          id: reserva.paquete._id.toString(),
          title: `${reserva.paquete.nombre}${cuotaText}`,
          description: `${tipoText} - Reserva ${reserva.numeroReserva}`,
          quantity: 1,
          unit_price: montoPago,
          currency_id: reserva.moneda
        }
      ],
      payer: {
        name: reserva.datosContacto.nombre,
        surname: reserva.datosContacto.apellido,
        email: reserva.datosContacto.email,
        phone: { number: reserva.datosContacto.telefono },
        identification: {
          type: reserva.datosContacto.tipoDocumento === 'DNI' ? 'DNI' : 'PASSPORT',
          number: reserva.datosContacto.documento
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/reservas/${reserva.numeroReserva}/pago-pendiente`
      },
      external_reference: numeroPago,
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'RAVELLO VIAJES',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };
  }

  static async create(body) {
    const preference = new Preference(mpClient);
    return await preference.create({ body });
  }

  static updatePaymentWithPreference(pago, result, body) {
    pago.mercadopago.preferenceId = result.id;
    pago.mercadopago.externalReference = pago.numeroPago;
    pago.mercadopago.backUrls = body.back_urls;
  }
}
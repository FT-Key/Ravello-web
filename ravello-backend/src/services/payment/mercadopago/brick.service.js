// ============================================
// 6. services/payment/mercadopago/brick.service.js
// ============================================
import { Payment as MPPayment } from 'mercadopago';
import { mpClient } from './client.js';

export class BrickService {
  static buildPaymentBody(reserva, montoPago, paymentData, numeroPago) {
    console.log("🔧 Construyendo body para MP Brick:", {
      reservaId: reserva._id,
      montoPago,
      numeroPago
    });

    const body = {
      transaction_amount: montoPago,
      token: paymentData.token,
      description: `${reserva.paquete.nombre} - Reserva ${reserva.numeroReserva}`,
      installments: paymentData.installments || 1,
      payment_method_id: paymentData.payment_method_id,
      issuer_id: paymentData.issuer_id,
      payer: {
        email: paymentData.payer.email,
        identification: {
          type: paymentData.payer.identification.type,
          number: paymentData.payer.identification.number
        }
      },
      statement_descriptor: 'RAVELLO VIAJES',
      external_reference: numeroPago,
      metadata: {
        reserva_id: reserva._id.toString(),
        user_id: reserva.usuario.toString(),
        tipo_pago: reserva.tipoPago || 'brick'
      }
    };

    // ⬅️ VALIDACIÓN: Solo agregar notification_url si NO es localhost
    const backendUrl = process.env.BACKEND_URL;
    const isLocalhost = !backendUrl ||
      backendUrl.includes('localhost') ||
      backendUrl.includes('127.0.0.1');

    if (!isLocalhost) {
      body.notification_url = `${backendUrl}/api/payments/webhook/mercadopago`;
      console.log('✅ notification_url agregada:', body.notification_url);
    } else {
      console.log('⚠️ notification_url omitida (entorno local)');
      console.log('ℹ️ Los webhooks no funcionarán en desarrollo local');
    }

    console.log("📦 Body final:", JSON.stringify(body, null, 2));

    return body;
  }

  static async processPayment(body) {
    console.log("💳 Procesando pago en MercadoPago");
    console.log("📦 Body que se enviará:", JSON.stringify(body, null, 2));

    // ⬅️ DEBUGGING DE CREDENCIALES
    console.log("🔑 ===== DEBUGGING DE CREDENCIALES =====");
    console.log("🔑 MERCADOPAGO_ACCESS_TOKEN:", process.env.MERCADOPAGO_ACCESS_TOKEN);
    console.log("🔑 Primeros 20 chars:", process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20));
    console.log("🔑 Empieza con TEST-?", process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-'));
    console.log("🔑 Empieza con APP_USR-?", process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR-'));
    console.log("🔑 mpClient config:", mpClient);
    console.log("🔑 ======================================");

    const mpPayment = new MPPayment(mpClient);

    try {
      // ⬅️ AGREGAR IDEMPOTENCY KEY
      const idempotencyKey = `${body.external_reference}-${Date.now()}`;
      console.log("🔑 Idempotency Key:", idempotencyKey);

      const payment = await mpPayment.create({
        body,
        requestOptions: {
          idempotencyKey: idempotencyKey
        }
      });

      console.log("✅ Pago creado exitosamente:", {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail
      });

      return payment;
    } catch (error) {
      console.error("❌ Error al procesar pago en MP:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error cause:", JSON.stringify(error.cause, null, 2));
      console.error("❌ Error status:", error.status);
      throw error;
    }
  }
  static updatePaymentWithResponse(pago, payment) {
    pago.mercadopago.paymentId = payment.id;
    pago.mercadopago.status = payment.status;
    pago.mercadopago.statusDetail = payment.status_detail;
    pago.mercadopago.paymentTypeId = payment.payment_type_id;
    pago.mercadopago.paymentMethodId = payment.payment_method_id;
    pago.mercadopago.installments = payment.installments;
    pago.mercadopago.transactionAmount = payment.transaction_amount;
    pago.mercadopago.netReceivedAmount = payment.transaction_details?.net_received_amount;
    pago.mercadopago.totalPaidAmount = payment.transaction_details?.total_paid_amount;
    pago.mercadopago.dateCreated = payment.date_created;
    pago.mercadopago.dateApproved = payment.date_approved;
    pago.mercadopago.externalReference = pago.numeroPago;

    if (payment.payer) {
      pago.mercadopago.payer = {
        id: payment.payer.id,
        email: payment.payer.email,
        identification: payment.payer.identification
      };
    }
  }

  static determinePaymentState(paymentStatus) {
    const statusMap = {
      'approved': 'aprobado',
      'pending': 'en_revision',
      'in_process': 'en_revision',
      'rejected': 'rechazado'
    };

    return statusMap[paymentStatus] || 'pendiente';
  }
}
// controllers/payment.controller.js
import { paymentService } from '../services/index.js';

// ============================================
// CREAR PREFERENCIA DE MERCADOPAGO
// ============================================
export const crearPreferenciaMercadoPago = async (req, res) => {
  try {
    const { reservaId, monto, tipoPago, numeroCuota } = req.body;
    const userId = req.user?._id;

    const resultado = await paymentService.crearPreferenciaMercadoPago(
      reservaId,
      monto,
      tipoPago,
      numeroCuota,
      userId
    );

    res.status(201).json({
      success: true,
      message: 'Preferencia de pago creada exitosamente',
      data: resultado
    });

  } catch (error) {
    console.error('Error en crearPreferenciaMercadoPago:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// WEBHOOK DE MERCADOPAGO
// ============================================
export const webhookMercadoPago = async (req, res) => {
  try {
    console.log('📥 Webhook recibido:', JSON.stringify(req.body, null, 2));
    console.log('📋 Query params:', req.query);

    // MercadoPago envía los datos en query params
    const webhookData = {
      type: req.query.type || req.body.type,
      data: {
        id: req.query['data.id'] || req.body.data?.id
      }
    };

    if (!webhookData.data.id) {
      console.log('❌ Webhook sin ID de pago');
      return res.status(400).json({
        success: false,
        message: 'ID de pago no encontrado en webhook'
      });
    }

    await paymentService.procesarWebhookMercadoPago(webhookData);

    // Responder 200 OK inmediatamente para que MP no reintente
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Error en webhook MP:', error);
    
    // Aún así responder 200 para evitar reintentos innecesarios
    res.status(200).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// REGISTRAR PAGO PRESENCIAL
// ============================================
export const registrarPagoPresencial = async (req, res) => {
  try {
    const userId = req.user._id;
    const pago = await paymentService.registrarPagoPresencial(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Pago presencial registrado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en registrarPagoPresencial:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER PAGOS DE UNA RESERVA
// ============================================
export const obtenerPagosPorReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const pagos = await paymentService.obtenerPagosPorReserva(reservaId);

    res.json({
      success: true,
      data: pagos
    });

  } catch (error) {
    console.error('Error en obtenerPagosPorReserva:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER PAGO POR ID
// ============================================
export const obtenerPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await paymentService.obtenerPagoPorId(id);

    res.json({
      success: true,
      data: pago
    });

  } catch (error) {
    console.error('Error en obtenerPagoPorId:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// OBTENER TODOS LOS PAGOS (con filtros y paginación)
// ============================================
export const obtenerTodosPagos = async (req, res) => {
  try {
    const { queryOptions, searchFilter, pagination } = req;
    
    const allowedFilters = ['estado', 'metodoPago', 'reserva'];
    const filters = Object.fromEntries(
      Object.entries(queryOptions.raw).filter(([key]) => allowedFilters.includes(key))
    );

    const query = {
      ...queryOptions.filters,
      ...filters,
      ...searchFilter
    };

    const total = await Payment.countDocuments(query);

    let mongoQuery = Payment.find(query)
      .populate('reserva', 'numeroReserva datosContacto')
      .populate('usuarioRegistro', 'nombre email')
      .sort(queryOptions.sort);

    if (pagination) {
      mongoQuery = mongoQuery
        .skip(pagination.skip)
        .limit(pagination.limit);
    }

    const items = await mongoQuery;

    res.json({
      success: true,
      total,
      page: pagination?.page || null,
      limit: pagination?.limit || null,
      items
    });

  } catch (error) {
    console.error('Error en obtenerTodosPagos:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// CANCELAR PAGO
// ============================================
export const cancelarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const userId = req.user._id;

    const pago = await paymentService.cancelarPago(id, motivo, userId);

    res.json({
      success: true,
      message: 'Pago cancelado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en cancelarPago:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// PROCESAR REEMBOLSO
// ============================================
export const procesarReembolso = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoReembolso, motivo } = req.body;
    const userId = req.user._id;

    const pago = await paymentService.procesarReembolso(id, montoReembolso, motivo, userId);

    res.json({
      success: true,
      message: 'Reembolso procesado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en procesarReembolso:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// VERIFICAR ESTADO DE PAGO (para frontend)
// ============================================
export const verificarEstadoPago = async (req, res) => {
  try {
    const { numeroPago } = req.params;
    
    const pago = await Payment.findOne({ numeroPago })
      .populate('reserva', 'numeroReserva montoPendiente montoPagado estado');

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        numeroPago: pago.numeroPago,
        estado: pago.estado,
        monto: pago.monto,
        moneda: pago.moneda,
        metodoPago: pago.metodoPago,
        fechaCreacion: pago.createdAt,
        reserva: {
          numero: pago.reserva.numeroReserva,
          estado: pago.reserva.estado,
          montoPagado: pago.reserva.montoPagado,
          montoPendiente: pago.reserva.montoPendiente
        }
      }
    });

  } catch (error) {
    console.error('Error en verificarEstadoPago:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
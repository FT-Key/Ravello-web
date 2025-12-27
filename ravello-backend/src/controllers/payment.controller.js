// controllers/payment.controller.js
import { paymentService } from '../services/index.js';
import { Payment, Booking } from '../models/index.js';

// ============================================
// HELPER: EXTRAER METADATA DE SEGURIDAD
// ============================================
function extraerMetadata(req) {
  return {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
    referer: req.headers.referer,
    acceptLanguage: req.headers['accept-language']
  };
}

// ============================================
// CREAR PREFERENCIA DE MERCADOPAGO
// ============================================
export async function crearPreferenciaMercadoPagoController(req, res) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Debe iniciar sesión para realizar un pago'
      });
    }

    const { reservaId, montoPago, tipoPago, numeroCuota } = req.body;

    // Validaciones básicas
    if (!reservaId || !montoPago || !tipoPago) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: reservaId, montoPago, tipoPago'
      });
    }

    if (montoPago <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a cero'
      });
    }

    const metadata = extraerMetadata(req);

    const resultado = await paymentService.crearPreferenciaMercadoPago(
      reservaId,
      montoPago,
      tipoPago,
      numeroCuota,
      userId,
      metadata
    );

    return res.json({
      success: true,
      message: 'Preferencia de pago creada exitosamente',
      data: resultado
    });

  } catch (error) {
    console.error('Error en crearPreferenciaMercadoPagoController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al crear la preferencia de pago'
    });
  }
}

// ============================================
// CREAR PAGO CON BRICKS
// ============================================
export async function crearPagoBrickController(req, res) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Debe iniciar sesión para realizar un pago'
      });
    }

    const { reservaId, montoPago, tipoPago, numeroCuota, paymentData } = req.body;

    // Validaciones básicas
    if (!reservaId || !montoPago || !tipoPago || !paymentData) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    if (montoPago <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a cero'
      });
    }

    const metadata = extraerMetadata(req);

    const resultado = await paymentService.crearPagoBrick(
      reservaId,
      montoPago,
      tipoPago,
      numeroCuota,
      paymentData,
      userId,
      metadata
    );

    return res.json({
      success: true,
      message: 'Pago procesado exitosamente',
      data: resultado
    });

  } catch (error) {
    console.error('Error en crearPagoBrickController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar el pago'
    });
  }
}

// ============================================
// WEBHOOK DE MERCADOPAGO
// ============================================
export async function webhookMercadoPagoController(req, res) {
  try {
    console.log('📨 Webhook recibido de MercadoPago:', req.body);

    // Validar webhook (opcional pero recomendado)
    const esValido = paymentService.validarWebhook(req.headers, req.body);
    
    if (!esValido) {
      console.warn('⚠️ Webhook inválido recibido');
    }

    const resultado = await paymentService.procesarWebhookMercadoPago(req.body);

    // Siempre responder 200 OK a MercadoPago
    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Error en webhookMercadoPagoController:', error);

    // Aún así responder 200 para que MP no reintente indefinidamente
    return res.status(200).json({
      success: false,
      message: 'Error procesando webhook'
    });
  }
}

// ============================================
// VERIFICAR ESTADO DE PAGO
// ============================================
export async function verificarEstadoPagoController(req, res) {
  try {
    const { numeroPago } = req.params;

    const pago = await paymentService.obtenerPagoPorNumero(numeroPago);

    return res.json({
      success: true,
      data: {
        numeroPago: pago.numeroPago,
        estado: pago.estado,
        monto: pago.monto,
        moneda: pago.moneda,
        metodoPago: pago.metodoPago,
        reserva: {
          numero: pago.reserva.numeroReserva,
          estado: pago.reserva.estado
        },
        fechaRegistro: pago.fechaRegistro
      }
    });

  } catch (error) {
    console.error('Error en verificarEstadoPagoController:', error);

    return res.status(404).json({
      success: false,
      message: error.message || 'Pago no encontrado'
    });
  }
}

// ============================================
// REGISTRAR PAGO PRESENCIAL
// ============================================
export async function registrarPagoPresencialController(req, res) {
  try {
    const userId = req.user._id;

    const pago = await paymentService.registrarPagoPresencial(req.body, userId);

    return res.status(201).json({
      success: true,
      message: 'Pago presencial registrado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en registrarPagoPresencialController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al registrar el pago presencial'
    });
  }
}

// ============================================
// OBTENER PAGOS POR RESERVA
// ============================================
export async function obtenerPagosPorReservaController(req, res) {
  try {
    const { reservaId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.rol;

    // Verificar que la reserva pertenezca al usuario (o sea admin)
    const reserva = await Booking.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    if (reserva.usuario.toString() !== userId.toString() && userRole !== 'admin' && userRole !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver los pagos de esta reserva'
      });
    }

    const pagos = await paymentService.obtenerPagosPorReserva(reservaId);

    return res.json({
      success: true,
      data: pagos
    });

  } catch (error) {
    console.error('Error en obtenerPagosPorReservaController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos'
    });
  }
}

// ============================================
// OBTENER TODOS LOS PAGOS (ADMIN)
// ============================================
export async function obtenerTodosPagosController(req, res) {
  try {
    const { filters, pagination } = req;

    const pagos = await Payment.find(filters || {})
      .populate('reserva', 'numeroReserva estado')
      .populate('usuarioRegistro', 'nombre email')
      .limit(pagination?.limit || 50)
      .skip(pagination?.skip || 0)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filters || {});

    return res.json({
      success: true,
      data: pagos,
      pagination: {
        total,
        page: pagination?.page || 1,
        limit: pagination?.limit || 50,
        totalPages: Math.ceil(total / (pagination?.limit || 50))
      }
    });

  } catch (error) {
    console.error('Error en obtenerTodosPagosController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos'
    });
  }
}

// ============================================
// OBTENER PAGO POR ID
// ============================================
export async function obtenerPagoPorIdController(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.rol;

    const pago = await paymentService.obtenerPagoPorId(id);

    // Verificar permisos
    const reserva = await Booking.findById(pago.reserva);
    if (reserva.usuario.toString() !== userId.toString() && userRole !== 'admin' && userRole !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver este pago'
      });
    }

    return res.json({
      success: true,
      data: pago
    });

  } catch (error) {
    console.error('Error en obtenerPagoPorIdController:', error);

    return res.status(404).json({
      success: false,
      message: error.message || 'Pago no encontrado'
    });
  }
}

// ============================================
// CANCELAR PAGO
// ============================================
export async function cancelarPagoController(req, res) {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const userId = req.user._id;

    if (!motivo) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un motivo de cancelación'
      });
    }

    const pago = await paymentService.cancelarPago(id, motivo, userId);

    return res.json({
      success: true,
      message: 'Pago cancelado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en cancelarPagoController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al cancelar el pago'
    });
  }
}

// ============================================
// PROCESAR REEMBOLSO
// ============================================
export async function procesarReembolsoController(req, res) {
  try {
    const { id } = req.params;
    const { montoReembolso, motivo } = req.body;
    const userId = req.user._id;

    if (!montoReembolso || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar monto y motivo del reembolso'
      });
    }

    if (montoReembolso <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto del reembolso debe ser mayor a cero'
      });
    }

    const pago = await paymentService.procesarReembolso(id, montoReembolso, motivo, userId);

    return res.json({
      success: true,
      message: 'Reembolso procesado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error en procesarReembolsoController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar el reembolso'
    });
  }
}

// ============================================
// GENERAR COMPROBANTE PRESENCIAL
// ============================================
export async function generarComprobanteController(req, res) {
  try {
    const { id } = req.params;

    const comprobante = await paymentService.generarComprobante(id);

    return res.json({
      success: true,
      data: comprobante
    });

  } catch (error) {
    console.error('Error en generarComprobanteController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al generar comprobante'
    });
  }
}

// ============================================
// VERIFICAR ESTADO EN MERCADOPAGO
// ============================================
export async function verificarEstadoMPController(req, res) {
  try {
    const { id } = req.params;

    const estado = await paymentService.verificarEstadoPagoMP(id);

    return res.json({
      success: true,
      data: estado
    });

  } catch (error) {
    console.error('Error en verificarEstadoMPController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al verificar estado en MercadoPago'
    });
  }
}

// ============================================
// REENVIAR NOTIFICACIÓN
// ============================================
export async function reenviarNotificacionController(req, res) {
  try {
    const { id } = req.params;

    const resultado = await paymentService.reenviarNotificacion(id);

    return res.json({
      success: true,
      message: resultado.message
    });

  } catch (error) {
    console.error('Error en reenviarNotificacionController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al reenviar notificación'
    });
  }
}

// ============================================
// OBTENER ESTADÍSTICAS DE PAGOS
// ============================================
export async function obtenerEstadisticasController(req, res) {
  try {
    const filtros = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
      estado: req.query.estado,
      metodoPago: req.query.metodoPago
    };

    const estadisticas = await paymentService.obtenerEstadisticas(filtros);

    return res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error('Error en obtenerEstadisticasController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
}

// ============================================
// LISTAR PAGOS PRESENCIALES
// ============================================
export async function listarPagosPresencialesController(req, res) {
  try {
    const filtros = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
      metodoPago: req.query.metodoPago,
      usuarioRecibio: req.query.usuarioRecibio,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };

    const pagos = await paymentService.listarPagosPresenciales(filtros);

    return res.json({
      success: true,
      data: pagos
    });

  } catch (error) {
    console.error('Error en listarPagosPresencialesController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al listar pagos presenciales'
    });
  }
}

// ============================================
// LISTAR REEMBOLSOS
// ============================================
export async function listarReembolsosController(req, res) {
  try {
    const filtros = {
      fechaDesde: req.query.fechaDesde,
      fechaHasta: req.query.fechaHasta,
      usuarioAutorizo: req.query.usuarioAutorizo,
      metodoPago: req.query.metodoPago,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };

    const reembolsos = await paymentService.listarReembolsos(filtros);

    return res.json({
      success: true,
      data: reembolsos
    });

  } catch (error) {
    console.error('Error en listarReembolsosController:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al listar reembolsos'
    });
  }
}

// ============================================
// REINTENTAR WEBHOOK
// ============================================
export async function reintentarWebhookController(req, res) {
  try {
    const { id } = req.params;

    const resultado = await paymentService.reintentarWebhook(id);

    return res.json({
      success: true,
      message: resultado.message
    });

  } catch (error) {
    console.error('Error en reintentarWebhookController:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al reintentar webhook'
    });
  }
}

// Exportar todo junto
export default {
  crearPreferenciaMercadoPago: crearPreferenciaMercadoPagoController,
  crearPagoBrick: crearPagoBrickController,
  webhookMercadoPago: webhookMercadoPagoController,
  verificarEstadoPago: verificarEstadoPagoController,
  registrarPagoPresencial: registrarPagoPresencialController,
  obtenerPagosPorReserva: obtenerPagosPorReservaController,
  obtenerTodosPagos: obtenerTodosPagosController,
  obtenerPagoPorId: obtenerPagoPorIdController,
  cancelarPago: cancelarPagoController,
  procesarReembolso: procesarReembolsoController,
  generarComprobante: generarComprobanteController,
  verificarEstadoMP: verificarEstadoMPController,
  reenviarNotificacion: reenviarNotificacionController,
  obtenerEstadisticas: obtenerEstadisticasController,
  listarPagosPresenciales: listarPagosPresencialesController,
  listarReembolsos: listarReembolsosController,
  reintentarWebhook: reintentarWebhookController
};
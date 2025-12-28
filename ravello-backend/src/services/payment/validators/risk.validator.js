// ============================================
// 3. services/payment/validators/risk.validator.js
// ============================================
import { AuditLog } from '../../../models/index.js';
import { analizarRiesgo, extraerInfoDispositivo } from '../../../utils/security.utils.js';

export class RiskValidator {
  static async analyze(data) {
    const riesgo = analizarRiesgo(data);
    const infoDispositivo = extraerInfoDispositivo(data.metadata.userAgent);

    return { riesgo, infoDispositivo };
  }

  static async checkRiskLevel(riesgo, userId, reservaId, montoPago, session) {
    if (riesgo.score > 85) {
      await AuditLog.create([{
        usuario: userId,
        accion: 'pago_rechazado_riesgo',
        entidad: { tipo: 'Payment' },
        descripcion: `Pago rechazado por alto riesgo: ${riesgo.motivo}`,
        nivel: 'critical',
        metadata: { riesgo, reservaId, montoPago }
      }], { session });

      throw new Error('No se pudo procesar el pago. Por favor contacte al servicio al cliente.');
    }
  }
}
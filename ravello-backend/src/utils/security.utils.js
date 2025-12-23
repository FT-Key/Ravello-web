// utils/security.utils.js
import { UAParser } from 'ua-parser-js';

// ============================================
// ANALIZAR RIESGO DE FRAUDE
// ============================================
export function analizarRiesgo(params) {
  const {
    usuario,
    reserva,
    email,
    ip,
    userAgent,
    monto,
    tipoPago
  } = params;

  let score = 0;
  let motivos = [];

  // ============================================
  // 1. VALIDAR USUARIO
  // ============================================
  if (!usuario) {
    score += 40;
    motivos.push('Usuario no autenticado');
  } else {
    // Usuario nuevo (menos de 24 horas)
    const tiempoUsuario = Date.now() - new Date(usuario.createdAt).getTime();
    if (tiempoUsuario < 24 * 60 * 60 * 1000) {
      score += 20;
      motivos.push('Usuario muy reciente (< 24h)');
    }

    // Usuario sin nombre completo
    if (!usuario.nombre || usuario.nombre.length < 3) {
      score += 10;
      motivos.push('Datos de usuario incompletos');
    }
  }

  // ============================================
  // 2. VALIDAR EMAIL
  // ============================================
  if (email) {
    // Email desechable o temporal
    const dominiosTemporales = [
      'tempmail', 'guerrillamail', '10minutemail', 'throwaway',
      'mailinator', 'yopmail', 'trashmail', 'sharklasers'
    ];

    const dominio = email.split('@')[1]?.toLowerCase();
    if (dominiosTemporales.some(temp => dominio?.includes(temp))) {
      score += 30;
      motivos.push('Email temporal o desechable');
    }

    // Email sospechoso (muchos números o caracteres random)
    const parteLocal = email.split('@')[0];
    const numeroDeNumeros = (parteLocal.match(/\d/g) || []).length;
    if (numeroDeNumeros > 5) {
      score += 15;
      motivos.push('Email con patrón sospechoso');
    }
  }

  // ============================================
  // 3. VALIDAR MONTO
  // ============================================
  if (monto) {
    // Monto muy alto para primera compra
    if (monto > 100000 && (!usuario || usuario.rol === 'cliente')) {
      score += 25;
      motivos.push('Monto inusualmente alto para primer pago');
    }

    // Monto exacto en números redondos (posible prueba)
    if (monto % 10000 === 0 && monto < 50000) {
      score += 10;
      motivos.push('Monto en valor redondo sospechoso');
    }
  }

  // ============================================
  // 4. VALIDAR IP Y DISPOSITIVO
  // ============================================
  if (ip) {
    // IPs sospechosas (VPN conocidas, Tor, proxies)
    const ipsRiesgosas = [
      '185.220', '185.165', '199.249', // Tor
      '51.15', '51.79', '51.195' // VPNs comunes
    ];

    if (ipsRiesgosas.some(prefix => ip.startsWith(prefix))) {
      score += 20;
      motivos.push('IP de red anónima (VPN/Tor)');
    }

    // IP localhost o privada
    if (ip === '127.0.0.1' || ip.startsWith('192.168') || ip.startsWith('10.')) {
      score += 15;
      motivos.push('IP privada o localhost');
    }
  }

  if (userAgent) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    // Navegador desconocido o bot
    if (!browser.name || browser.name.includes('bot')) {
      score += 20;
      motivos.push('Navegador no identificado o bot');
    }

    // OS desconocido
    if (!os.name) {
      score += 10;
      motivos.push('Sistema operativo no identificado');
    }

    // User agent muy corto (posible falsificación)
    if (userAgent.length < 50) {
      score += 15;
      motivos.push('User agent sospechosamente corto');
    }
  }

  // ============================================
  // 5. VALIDAR VELOCIDAD DE ACCIÓN
  // ============================================
  if (reserva && usuario) {
    // Reserva creada muy rápido después de registro
    const tiempoEntreRegistroYReserva = new Date(reserva.createdAt) - new Date(usuario.createdAt);
    if (tiempoEntreRegistroYReserva < 2 * 60 * 1000) { // < 2 minutos
      score += 15;
      motivos.push('Reserva inmediata tras registro (< 2 min)');
    }
  }

  // ============================================
  // 6. TIPO DE PAGO
  // ============================================
  if (tipoPago === 'total' && monto > 50000) {
    score += 10;
    motivos.push('Pago total de monto alto sin cuotas');
  }

  // ============================================
  // NORMALIZAR SCORE (0-100)
  // ============================================
  score = Math.min(score, 100);

  return {
    score,
    nivel: score < 30 ? 'bajo' : score < 60 ? 'medio' : score < 85 ? 'alto' : 'crítico',
    motivo: motivos.join('; '),
    detalles: motivos
  };
}

// ============================================
// EXTRAER INFO DEL DISPOSITIVO
// ============================================
export function extraerInfoDispositivo(userAgent) {
  if (!userAgent) {
    return {
      navegador: 'Desconocido',
      sistemaOperativo: 'Desconocido',
      dispositivo: 'Desconocido'
    };
  }

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    navegador: browser.name ? `${browser.name} ${browser.version || ''}`.trim() : 'Desconocido',
    sistemaOperativo: os.name ? `${os.name} ${os.version || ''}`.trim() : 'Desconocido',
    dispositivo: device.type || device.model || 'Desktop'
  };
}

// ============================================
// VALIDAR EMAIL (helper adicional)
// ============================================
export function esEmailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ============================================
// DETECTAR PAÍS POR IP (básico)
// ============================================
export function detectarPaisPorIP(ip) {
  // Implementación básica - en producción usar un servicio como ipapi.co
  if (!ip) return 'Desconocido';

  // IPs argentinas conocidas (ejemplo)
  if (ip.startsWith('200.') || ip.startsWith('190.')) {
    return 'Argentina';
  }

  return 'Desconocido';
}
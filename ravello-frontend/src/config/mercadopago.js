// config/mercadopago.js

/**
 * Configuración de MercadoPago para el frontend
 * 
 * IMPORTANTE: 
 * - Agregar en .env: VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key
 * - Para Bricks, el SDK se carga dinámicamente desde CDN
 */

/**
 * Obtener la public key de MercadoPago
 */
export const getMercadoPagoPublicKey = () => {
  return import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
};

/**
 * Verificar si MercadoPago está configurado
 */
export const isMercadoPagoConfigured = () => {
  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  return !!publicKey && publicKey !== 'undefined' && publicKey !== '';
};

/**
 * Obtener la configuración para Bricks
 */
export const getBricksConfig = () => {
  return {
    publicKey: getMercadoPagoPublicKey(),
    locale: 'es-AR'
  };
};

/**
 * URL del SDK de MercadoPago (para Bricks)
 */
export const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

export default {
  getMercadoPagoPublicKey,
  isMercadoPagoConfigured,
  getBricksConfig,
  MP_SDK_URL
};
// config/mercadopago.js

/**
 * Configuración de MercadoPago para el frontend
 * 
 * IMPORTANTE: 
 * - Para modo normal: VITE_MERCADOPAGO_PUBLIC_KEY
 * - Para Bricks en test: VITE_MERCADOPAGO_PUBLIC_KEY_BRICKS + VITE_BRICKS_TEST=true
 * - El SDK de Bricks se carga dinámicamente desde CDN
 */

/**
 * Determinar si usar credenciales de Bricks
 */
const useBricksCredentials = () => {
  return import.meta.env.VITE_BRICKS_TEST === 'true';
};

/**
 * Obtener la public key de MercadoPago
 */
export const getMercadoPagoPublicKey = () => {
  const isBricksMode = useBricksCredentials();
  
  const publicKey = isBricksMode
    ? import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY_BRICKS
    : import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  
  // ⬅️ VALIDACIÓN: Verificar formato según el modo
  if (isBricksMode && publicKey && !publicKey.startsWith('TEST-')) {
    console.warn("⚠️ ADVERTENCIA: Usando BRICKS_TEST=true pero la public key no empieza con TEST-");
    console.warn("⚠️ Los Bricks requieren credenciales de prueba (TEST-)");
  }
  
  if (!isBricksMode && publicKey && !publicKey.startsWith('APP_USR-')) {
    console.warn("⚠️ ADVERTENCIA: La public key no empieza con APP_USR-");
    console.warn("⚠️ Verifica que estés usando la Public Key correcta");
  }
  
  return publicKey;
};

/**
 * Verificar si MercadoPago está configurado
 */
export const isMercadoPagoConfigured = () => {
  const publicKey = getMercadoPagoPublicKey();
  const isConfigured = !!publicKey && publicKey !== 'undefined' && publicKey !== '';
  
  if (!isConfigured) {
    const missingVar = useBricksCredentials()
      ? 'VITE_MERCADOPAGO_PUBLIC_KEY_BRICKS'
      : 'VITE_MERCADOPAGO_PUBLIC_KEY';
    console.error(`❌ ERROR: Variable de entorno ${missingVar} no configurada`);
  }
  
  return isConfigured;
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
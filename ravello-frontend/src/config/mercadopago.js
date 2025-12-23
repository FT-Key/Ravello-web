// config/mercadopago.js
import { MercadoPagoConfig } from '@mercadopago/sdk-react';

/**
 * Configuración del SDK de MercadoPago para React
 * 
 * IMPORTANTE: 
 * - Instalar: npm install @mercadopago/sdk-react
 * - Agregar en .env: VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key
 */

export const mercadoPagoConfig = new MercadoPagoConfig({
  publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
  locale: 'es-AR',
});

/**
 * Obtener la public key (útil para validaciones)
 */
export const getMercadoPagoPublicKey = () => {
  return import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
};

/**
 * Verificar si MercadoPago está configurado
 */
export const isMercadoPagoConfigured = () => {
  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  return !!publicKey && publicKey !== 'undefined';
};

export default mercadoPagoConfig;
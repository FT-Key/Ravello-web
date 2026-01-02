// services/payment/mercadopago/client.js

import { MercadoPagoConfig } from 'mercadopago';

console.log("🔧 Inicializando cliente de MercadoPago");

// ⬅️ DETERMINAR QUÉ CREDENCIAL USAR
const useBricksCredentials = process.env.BRICKS_TEST === 'true';
const accessToken = useBricksCredentials 
  ? process.env.MERCADOPAGO_ACCESS_TOKEN_BRICKS 
  : process.env.MERCADOPAGO_ACCESS_TOKEN;

// ⬅️ VALIDACIÓN: Verificar que exista el token necesario
if (!accessToken) {
  const missingVar = useBricksCredentials 
    ? 'MERCADOPAGO_ACCESS_TOKEN_BRICKS' 
    : 'MERCADOPAGO_ACCESS_TOKEN';
  console.error(`❌ ERROR: Variable de entorno ${missingVar} no configurada`);
  throw new Error(`Falta configurar ${missingVar} en las variables de entorno`);
}

// ⬅️ VALIDACIÓN: Verificar formato del token
if (useBricksCredentials && !accessToken.startsWith('TEST-')) {
  console.warn("⚠️ ADVERTENCIA: Usando BRICKS_TEST=true pero el token no empieza con TEST-");
  console.warn("⚠️ Esto puede causar errores. Los Bricks requieren credenciales TEST-");
}

if (!useBricksCredentials && !accessToken.startsWith('APP_USR-')) {
  console.warn("⚠️ ADVERTENCIA: El token no empieza con APP_USR-");
  console.warn("⚠️ Verifica que estés usando el Access Token correcto");
}

console.log("🔑 ==========================================");

export const mpClient = new MercadoPagoConfig({
  accessToken: accessToken,
  options: {
    timeout: 5000
  }
});

console.log("✅ Cliente de MercadoPago inicializado correctamente");
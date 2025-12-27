// services/payment/mercadopago/client.js

import { MercadoPagoConfig } from 'mercadopago';

console.log("🔧 Inicializando cliente de MercadoPago");
console.log("🔑 Access Token:", process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20) + '...');
console.log("🔑 Es TEST?:", process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-'));
console.log("🔑 Es APP_USR?:", process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR-'));

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000
  }
});

console.log("✅ Cliente de MercadoPago inicializado");
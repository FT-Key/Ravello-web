// ============================================
// server.js - Mejorado con logs
// ============================================
import http from "http";
import { app } from "./app.js";
import { config } from "./config/env.js";

export const startServer = async () => {
  const server = http.createServer(app);

  const PORT = config.port || 5000;
  const HOST = '0.0.0.0'; // ⬅️ Importante para hosting

  server.listen(PORT, HOST, () => {
    console.log('');
    console.log('='.repeat(50));
    console.log('🚀 RAVELLO VIAJES - Backend Server');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
    console.log(`💳 MercadoPago: ${config.mercadopago?.accessToken ? 'Configurado' : 'NO configurado'}`);
    console.log(`🧪 MP Mode: ${config.mercadopago?.accessToken?.startsWith('TEST-') ? 'TEST (Sandbox)' : 'PRODUCTION'}`);
    console.log('='.repeat(50));
    console.log('');
  });

  // ⬅️ Manejo de errores del servidor
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Puerto ${PORT} ya está en uso`);
      process.exit(1);
    } else {
      console.error('❌ Error del servidor:', error);
      process.exit(1);
    }
  });

  // ⬅️ Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('📴 SIGINT recibido. Cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  });
};
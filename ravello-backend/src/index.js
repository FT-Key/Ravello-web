import { startServer } from "./server.js";
import { connectDB } from "./config/db.js";

// Capturar errores no manejados antes de bootstrap
process.on('unhandledRejection', (reason, promise) => {
  console.error('');
  console.error('❌ Unhandled Rejection:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  console.error('');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('');
  console.error('❌ Uncaught Exception:', error);
  console.error('');
  process.exit(1);
});

async function bootstrap() {
  try {
    console.log('🔄 Iniciando Ravello Viajes API...\n');
    
    // 1. Conectar a MongoDB
    console.log('🔄 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ MongoDB conectado\n');
    
    // 2. Iniciar servidor HTTP
    await startServer();
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ ERROR AL INICIALIZAR LA APLICACIÓN');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    console.error('='.repeat(60));
    console.error('');
    process.exit(1);
  }
}

bootstrap();
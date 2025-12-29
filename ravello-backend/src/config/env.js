import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Servidor
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Base de datos
  db_uri: process.env.DB_URI || "mongodb://localhost:27017/ravello",
  
  // JWT
  jwt_secret: process.env.JWT_SECRET || "supersecretkey",
  
  // URLs
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  
  // Email
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 465,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    contactEmail: process.env.CONTACT_EMAIL,
  },
  
  // Firebase
  firebase: {
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  
  // MercadoPago
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  },
  
  // Site
  siteName: process.env.SITE_NAME || "Ravello Viajes",
};

// Validación de variables críticas
const validateConfig = () => {
  const warnings = [];
  const errors = [];
  
  // Errores críticos (impiden que la app funcione)
  if (!config.db_uri) {
    errors.push("DB_URI no está configurado");
  }
  
  if (!config.jwt_secret || config.jwt_secret === "supersecretkey") {
    warnings.push("JWT_SECRET usando valor por defecto (inseguro en producción)");
  }
  
  // Advertencias (la app funciona pero con limitaciones)
  if (!config.mercadopago.accessToken) {
    warnings.push("MERCADOPAGO_ACCESS_TOKEN no configurado - Los pagos no funcionarán");
  }
  
  if (!config.email.user || !config.email.pass) {
    warnings.push("Email no configurado - Los correos no se enviarán");
  }
  
  if (!config.firebase.serviceAccount) {
    warnings.push("Firebase no configurado - La carga de imágenes puede fallar");
  }
  
  // Mostrar errores
  if (errors.length > 0) {
    console.error("\n❌ ERRORES DE CONFIGURACIÓN:");
    errors.forEach(err => console.error(`   - ${err}`));
    throw new Error("Configuración inválida");
  }
  
  // Mostrar advertencias
  if (warnings.length > 0) {
    console.warn("\n⚠️  ADVERTENCIAS DE CONFIGURACIÓN:");
    warnings.forEach(warn => console.warn(`   - ${warn}`));
  }
  
  // Mostrar configuración en desarrollo
  if (config.nodeEnv === "development") {
    console.log("\n📋 CONFIGURACIÓN ACTUAL:");
    console.log(`   🌍 Entorno: ${config.nodeEnv}`);
    console.log(`   🔌 Puerto: ${config.port}`);
    console.log(`   🗄️  Base de datos: ${config.db_uri}`);
    console.log(`   🔗 Frontend: ${config.frontendUrl}`);
    console.log(`   🔗 Backend: ${config.backendUrl}`);
    console.log(`   💳 MercadoPago: ${config.mercadopago.accessToken ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (config.mercadopago.accessToken) {
      const isTest = config.mercadopago.accessToken.startsWith('TEST-');
      console.log(`   🧪 MP Modo: ${isTest ? 'TEST (Sandbox)' : 'PRODUCCIÓN (REAL)'}`);
    }
    
    console.log(`   📧 Email: ${config.email.user ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   🔥 Firebase: ${config.firebase.serviceAccount ? '✅ Configurado' : '❌ No configurado'}`);
    console.log("");
  }
};

// Ejecutar validación al importar
validateConfig();

export default config;
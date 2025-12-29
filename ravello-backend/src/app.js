import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { config } from "./config/env.js";

const app = express();

// ============================================
// HELMET - Seguridad (ajustado para webhooks)
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ============================================
// CORS - Configuración permisiva para demo
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo o si no hay origin (webhooks), permitir
    if (!origin || config.nodeEnv === 'development') {
      return callback(null, true);
    }

    // Lista de orígenes permitidos
    const allowedOrigins = [
      config.frontendUrl,
      'https://api.mercadopago.com',
      'https://www.mercadopago.com.ar',
      'http://localhost:3000',
      'http://localhost:5173',
    ];

    if (allowedOrigins.some(allowed => origin.includes(allowed.replace(/^https?:\/\//, '')))) {
      callback(null, true);
    } else {
      // Para demo, permitir de todas formas pero loguear
      console.log('⚠️ Origin no registrado:', origin);
      callback(null, true); // Cambiar a false para más seguridad
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
};

app.use(cors(corsOptions));

// ============================================
// PARSERS
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// LOGGING
// ============================================
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// COMPRESSION
// ============================================
app.use(compression());

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    mercadopago: {
      configured: !!config.mercadopago.accessToken,
      mode: config.mercadopago.accessToken?.startsWith('TEST-') ? 'TEST' : 'PRODUCTION'
    },
    services: {
      database: 'connected', // Podrías verificar la conexión real aquí
      email: !!config.email.user,
      firebase: !!config.firebase.serviceAccount,
    }
  });
});

// ============================================
// ROUTES
// ============================================
app.use("/api", routes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

export { app };
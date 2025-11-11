// middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas solicitudes desde esta IP, inténtalo más tarde."
});

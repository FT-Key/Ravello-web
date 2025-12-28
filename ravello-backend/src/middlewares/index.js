// middlewares/index.js
import { paginationMiddleware } from './pagination.js';
import { queryMiddleware } from './query.js';
import { searchMiddleware } from './search.js';
import { validateRequest } from './validateRequest.js';
import { errorHandler } from './errorHandler.js';
import { uploadPackageImages } from './upload.js';
import { parseJSONBody } from './parseJSONBody.js';
import { authMiddleware } from './authMiddleware.js';
import { requireRole } from './roleMiddleware.js';

// Exportamos con alias para mantener compatibilidad
export {
  // Middlewares generales
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  validateRequest,
  errorHandler,
  uploadPackageImages,
  parseJSONBody,

  // Auth middlewares
  authMiddleware,
  authMiddleware as authenticate, // Alias para compatibilidad
  requireRole,
  requireRole as authorize, // Alias para compatibilidad
};
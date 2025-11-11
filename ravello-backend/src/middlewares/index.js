import { paginationMiddleware } from './pagination.js';
import { queryMiddleware } from './query.js';
import { searchMiddleware } from './search.js';
import { validateRequest } from './validateRequest.js';
import { errorHandler } from './errorHandler.js';

// Exportamos todo desde un solo lugar
export {
  paginationMiddleware,
  queryMiddleware,
  searchMiddleware,
  validateRequest,
  errorHandler
};

// middlewares/pagination.js
export const paginationMiddleware = (req, res, next) => {
  const page =
    parseInt(req.query.page || req.query["pagination[page]"]);
  const limit =
    parseInt(req.query.limit || req.query["pagination[limit]"]);

  // Si NO se mandó paginación → no aplicar límites
  if (!page && !limit) {
    req.pagination = null;
    return next();
  }

  const finalPage = page || 1;
  const finalLimit = limit || 12; // aquí solo aplica 12 si mandaron "page" sin "limit"
  const skip = (finalPage - 1) * finalLimit;

  req.pagination = { page: finalPage, limit: finalLimit, skip };
  next();
};

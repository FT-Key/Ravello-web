export const paginationMiddleware = (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10; // <= valor razonable por defecto

  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};

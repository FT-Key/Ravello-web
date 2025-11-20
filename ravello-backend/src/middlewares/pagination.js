// middlewares/pagination.js
export const paginationMiddleware = (req, res, next) => {
  const page =
    parseInt(req.query.page || req.query["pagination[page]"]) || 1;
  const limit =
    parseInt(req.query.limit || req.query["pagination[limit]"]) || 12;
  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};

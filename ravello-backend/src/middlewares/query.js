// middleware/query.js
export const queryMiddleware = (req, res, next) => {
  const { sort, filters, ...rest } = req.query;

  req.queryOptions = {
    sort: sort || '-createdAt',
    filters: filters ? JSON.parse(filters) : {},
    raw: rest,
  };

  next();
};

// middleware/search.js
export const searchMiddleware = (req, res, next) => {
  const { search, searchFields } = req.query;

  if (search && searchFields) {
    const fields = searchFields.split(',');
    req.searchFilter = {
      $or: fields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }))
    };
  } else {
    req.searchFilter = {};
  }

  next();
};

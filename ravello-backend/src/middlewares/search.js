// middleware/search.js
export const searchMiddleware = (req, res, next) => {
  const { search, searchFields } = req.query;

  if (search && searchFields) {
    const fields = searchFields.split(',').map(f => f.trim());
    
    req.searchFilter = {
      $or: fields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }))
    };
    
    // 🔥 Log para debugging
    console.log('🔍 Search middleware:', {
      search,
      fields,
      filter: req.searchFilter
    });
  } else {
    req.searchFilter = {};
  }

  next();
};
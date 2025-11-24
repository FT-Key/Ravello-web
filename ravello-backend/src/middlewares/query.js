// middleware/query.js
export const queryMiddleware = (req, res, next) => {
  try {
    const { sort, filters, ...rest } = req.query;

    // 🔥 Parsear sort de forma segura
    let parsedSort = { createdAt: -1 }; // default descendente
    if (sort) {
      if (typeof sort === 'string') {
        // Si viene como "-createdAt" o "createdAt"
        if (sort.startsWith('-')) {
          const field = sort.substring(1);
          parsedSort = { [field]: -1 };
        } else {
          parsedSort = { [sort]: 1 };
        }
      } else if (typeof sort === 'object') {
        parsedSort = sort;
      }
    }

    // 🔥 Parsear filters de forma segura
    let parsedFilters = {};
    if (filters) {
      try {
        parsedFilters = typeof filters === "string" 
          ? JSON.parse(filters) 
          : filters;
        
        // 🔥 Limpiar filtros vacíos o null
        Object.keys(parsedFilters).forEach(key => {
          if (parsedFilters[key] === null || 
              parsedFilters[key] === undefined || 
              parsedFilters[key] === "") {
            delete parsedFilters[key];
          }
        });
      } catch (err) {
        console.error("❌ Error parseando filters:", err);
        console.error("❌ Filters recibidos:", filters);
        return res.status(400).json({ 
          success: false, 
          message: "Formato de filtros inválido" 
        });
      }
    }

    req.queryOptions = {
      sort: parsedSort,
      filters: parsedFilters,
      raw: rest,
    };

    console.log("🔍 queryMiddleware:", {
      sort: parsedSort,
      filters: parsedFilters,
    });

    next();
  } catch (error) {
    console.error("❌ Error en queryMiddleware:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error procesando query parameters" 
    });
  }
};
export function parseJSONBody(req, res, next) {
  console.log("🔹 parseJSONBody start");
  if (!req.body) return next();

  const jsonFields = [
    "destinos",
    "traslado",
    "fechas",
    "hospedaje",
    "actividades",
    "coordinadores",
    "imagenes",
    "removePaths",
    "etiquetas"
  ];

  jsonFields.forEach((field) => {
    if (req.body[field]) {
      try {
        if (typeof req.body[field] === "string") {
          req.body[field] = JSON.parse(req.body[field]);
        }
      } catch (err) {
        console.warn(`⚠️ No se pudo parsear ${field} como JSON`, err);
      }
    }
  });

  console.log("🔹 parseJSONBody end", req.body);
  next();
}

export function parseJSONBody(req, res, next) {
  console.log("🔹 parseJSONBody start");

  if (!req.body) {
    console.log("⚠️ req.body está vacío");
    return next();
  }

  // Campos que vienen como JSON stringificado desde el frontend
  const jsonFields = [
    "destinos",              // Array de objetos (itinerario completo)
    "coordinadores",         // Array de objetos (coordinadores del paquete)
    "incluyeGeneral",        // Array de strings (servicios incluidos)
    "noIncluyeGeneral",      // Array de strings (servicios no incluidos)
    "etiquetas",             // Array de strings (tags del paquete)
    "fechasDisponibles",     // Array de objetos (fechas con cupos)
    "imagenes",              // Array de objetos (imágenes adicionales)
    "removePaths"            // Array de strings (rutas a eliminar en updates)
  ];

  console.log("📥 BODY ANTES DE PARSEAR:", JSON.stringify(req.body, null, 2));

  jsonFields.forEach((field) => {
    if (req.body[field]) {
      try {
        // Solo parsear si es un string
        if (typeof req.body[field] === "string") {
          const parsed = JSON.parse(req.body[field]);
          req.body[field] = parsed;
          console.log(`✅ ${field} parseado correctamente:`, parsed);
        } else {
          console.log(`ℹ️ ${field} ya es un objeto/array, no requiere parsing`);
        }
      } catch (err) {
        console.error(`❌ Error parseando ${field}:`, err.message);
        console.error(`   Valor recibido:`, req.body[field]);
        // Dejar el valor original si falla el parsing
      }
    }
  });

  console.log("📥 BODY DESPUÉS DE PARSEAR:", JSON.stringify(req.body, null, 2));
  console.log("🔹 parseJSONBody end");

  next();
}
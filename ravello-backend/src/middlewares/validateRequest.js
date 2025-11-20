// middleware/validateRequest.js
export const validateRequest = (schema) => (req, res, next) => {
  console.log("🟦 VALIDACIÓN ACTIVADA");
  console.log("📥 BODY RECIBIDO:", JSON.stringify(req.body, null, 2));

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    convert: true
  });

  if (error) {
    console.log("❌ ERROR DE VALIDACIÓN DETECTADO:");
    error.details.forEach((d, i) => {
      console.log(
        `   ${i + 1}) PATH: ${d.path.join('.')} | TYPE: ${d.type} | MESSAGE: ${d.message}`
      );
    });

    const errors = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Validación fallida",
      errors
    });
  }

  console.log("✅ VALIDACIÓN CORRECTA ✔️");
  console.log("📤 VALOR VALIDADO:", JSON.stringify(value, null, 2));

  next();
};

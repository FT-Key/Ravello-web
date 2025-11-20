// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
};

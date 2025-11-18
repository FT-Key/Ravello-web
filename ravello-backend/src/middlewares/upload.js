// middlewares/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMemory = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024 // 6MB
  }
});

// 👇 Middleware específico para los paquetes
export const uploadPackageImages = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024
  }
}).fields([
  { name: "imagenPrincipal", maxCount: 1 }, // 👈 esta es la que te falta
  { name: "imagenes", maxCount: 10 },       // si tenés más imágenes
]);

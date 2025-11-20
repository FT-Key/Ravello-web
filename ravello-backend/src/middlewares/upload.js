import multer from "multer";

const storage = multer.memoryStorage();

export const uploadPackageImages = (req, res, next) => {
  const upload = multer({
    storage,
    limits: { fileSize: 6 * 1024 * 1024 } // 6MB
  }).fields([
    { name: "imagenPrincipal", maxCount: 1 },
    { name: "imagenes", maxCount: 10 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Error en uploadPackageImages:", err);
      return res.status(400).json({ error: err.message });
    }
    console.log("✅ uploadPackageImages OK");
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);
    next();
  });
};

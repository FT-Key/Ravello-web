import { bucket } from "../config/firebaseAdmin.js";

export const uploadBufferToFirebase = async (fileBuffer, originalname, mimetype, folder = "packages") => {
  const timestamp = Date.now();
  const safeName = originalname.replace(/\s+/g, "_");
  const filePath = `${folder}/${timestamp}-${safeName}`;
  const file = bucket.file(filePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimetype,
    },
    public: false, // no público directo, usaremos signedUrl
  });

  // Generar URL pública temporal / de larga duración
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2030", // o la fecha que prefieras
  });

  return { url, path: filePath };
};

export const deleteFileFromFirebase = async (filePath) => {
  if (!filePath) return;
  try {
    const file = bucket.file(filePath);
    await file.delete({ ignoreNotFound: true });
  } catch (err) {
    console.error("Error borrando archivo en Firebase:", err);
    // no rompas el flujo; logueamos y seguimos
  }
};

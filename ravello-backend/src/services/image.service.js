// services/image.service.js
import { uploadBufferToFirebase, deleteFileFromFirebase } from "../utils/firebaseStorage.js";

export const imageService = {
  async upload(file, folder) {
    return uploadBufferToFirebase(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder
    );
  },

  async delete(path) {
    return deleteFileFromFirebase(path);
  },

  async deletePaths(paths) {
    return Promise.all(paths.map((p) => deleteFileFromFirebase(p)));
  },

  async rollback(uploads) {
    return Promise.all(uploads.map((u) => deleteFileFromFirebase(u.path)));
  },
};

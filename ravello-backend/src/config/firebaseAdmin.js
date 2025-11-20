// config/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";

// 🔹 Carga las variables del archivo .env
dotenv.config();

// 🔹 Valida que la variable exista
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("❌ Falta la variable FIREBASE_SERVICE_ACCOUNT en .env");
}

// 🔹 Parsea el JSON del service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 🔹 Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // ej: "mi-proyecto.appspot.com"
});

// 🔹 Exporta el bucket para subir/borrar archivos
export const bucket = admin.storage().bucket();

export default admin;

import dotenv from "dotenv";
import nodemailer from "nodemailer";

// 🟢 Cargar variables de entorno
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true, // Gmail usa SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🧠 Diagnóstico en consola
console.log("📧 Config email:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS existe:", !!process.env.EMAIL_PASS);

transporter.verify((err) => {
  if (err) console.error("❌ Error de conexión con SMTP:", err);
  else console.log("✅ Servidor de correo listo para enviar mensajes");
});

export default transporter;

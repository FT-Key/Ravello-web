import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Review, Package } from "../models/index.js";

dotenv.config();

const reviewsData = [
  {
    nombre: "Mariana Ríos",
    calificacion: 5,
    comentario:
      "Todo excelente, muy buena atención y organización. Lo recomiendo sin dudar.",
    tipo: "empresa",
  },
  {
    nombre: "Carlos Fernández",
    calificacion: 4,
    comentario: "El viaje estuvo genial, aunque el hotel podría mejorar un poco.",
    tipo: "paquete",
  },
  {
    nombre: "Lucía Martínez",
    calificacion: 5,
    comentario: "Increíble experiencia, superó mis expectativas.",
    tipo: "paquete",
  },
  {
    nombre: "Pedro González",
    calificacion: 3,
    comentario: "En general bien, pero la comida del hotel no fue la mejor.",
    tipo: "empresa",
  },
  {
    nombre: "Ana López",
    calificacion: 5,
    comentario:
      "El mejor viaje de mi vida, excelente organización y acompañamiento.",
    tipo: "paquete",
  },
];

const seedReviews = async () => {
  try {
    await connectDB();
    console.log("✅ Conectado a MongoDB");

    console.log("🧹 Eliminando reseñas previas...");
    await Review.deleteMany();

    // Verificamos si hay paquetes para vincular reseñas tipo 'paquete'
    const paquetes = await Package.find();
    console.log(`📦 Paquetes encontrados: ${paquetes.length}`);

    const reviewsToInsert = reviewsData.map((r) => {
      if (r.tipo === "paquete" && paquetes.length > 0) {
        const randomPkg = paquetes[Math.floor(Math.random() * paquetes.length)];
        return { ...r, paquete: randomPkg._id };
      }
      return r;
    });

    console.log("✍️ Creando reseñas iniciales...");
    const createdReviews = await Review.insertMany(reviewsToInsert);

    console.log(`✅ ${createdReviews.length} reseñas insertadas correctamente.`);
    console.log("🎉 Seed de reseñas completado.");

    process.exit();
  } catch (error) {
    console.error("❌ Error durante el seed de reseñas:", error);
    process.exit(1);
  }
};

seedReviews();

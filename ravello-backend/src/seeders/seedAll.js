import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Package, Featured } from "../models/index.js";

dotenv.config();

const destinations = [
  { image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', destination: 'Santorini', country: 'Grecia', price: 850000, rating: 4.9, featured: true },
  { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', destination: 'París', country: 'Francia', price: 920000, rating: 4.8, featured: false },
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', destination: 'Alpes Suizos', country: 'Suiza', price: 1100000, rating: 5.0, featured: true },
  { image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', destination: 'Bariloche', country: 'Argentina', price: 380000, rating: 4.7, featured: false },
  { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', destination: 'Dubai', country: 'Emiratos Árabes', price: 1250000, rating: 4.9, featured: true },
  { image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600', destination: 'Bangkok', country: 'Tailandia', price: 780000, rating: 4.6, featured: false },
  { image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=600', destination: 'Tokio', country: 'Japón', price: 1050000, rating: 4.8, featured: true },
  { image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600', destination: 'Sídney', country: 'Australia', price: 1350000, rating: 4.7, featured: false },
  { image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600', destination: 'Islandia', country: 'Islandia', price: 1180000, rating: 5.0, featured: true },
  { image: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=600', destination: 'Cancún', country: 'México', price: 680000, rating: 4.5, featured: false },
  { image: 'https://images.unsplash.com/photo-1529180684069-84467e0fefc0?w=600', destination: 'Bali', country: 'Indonesia', price: 720000, rating: 4.8, featured: true },
  { image: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?w=600', destination: 'Machu Picchu', country: 'Perú', price: 550000, rating: 4.9, featured: false },
  { image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600', destination: 'Praga', country: 'República Checa', price: 650000, rating: 4.6, featured: false },
  { image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600', destination: 'Maldivas', country: 'Maldivas', price: 1450000, rating: 5.0, featured: true },
  { image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600', destination: 'Roma', country: 'Italia', price: 890000, rating: 4.7, featured: false },
  { image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600', destination: 'Nueva York', country: 'Estados Unidos', price: 1200000, rating: 4.8, featured: true }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log("🗑️  Eliminando datos previos...");
    await Package.deleteMany();
    await Featured.deleteMany();

    console.log("📦 Cargando paquetes...");

    const paquetes = await Promise.all(
      destinations.map((d) =>
        Package.create({
          nombre: `Viaje a ${d.destination}`,
          descripcion: `Explorá ${d.destination}, uno de los destinos más hermosos de ${d.country}.`,
          tipo: d.country === "Argentina" ? "nacional" : "internacional",
          traslado: [
            {
              tipo: "vuelo",
              compania: "AirTour",
              salida: {
                lugar: "Buenos Aires",
                fecha: new Date("2025-12-01"),
                hora: "09:00",
              },
              llegada: {
                lugar: d.destination,
                fecha: new Date("2025-12-01"),
                hora: "18:00",
              },
              descripcion: "Vuelo directo con equipaje incluido.",
            },
          ],
          hospedaje: {
            nombre: `Hotel ${d.destination}`,
            categoria: "4 estrellas",
            ubicacion: `Centro de ${d.destination}`,
            caracteristicas: ["WiFi", "Piscina", "Desayuno incluido"],
            gastronomia: {
              pension: "media pension",
              descripcion: "Desayuno buffet y cena incluida.",
            },
          },
          actividades: [
            {
              nombre: `Tour por ${d.destination}`,
              descripcion: `Excursión guiada por los principales puntos turísticos de ${d.destination}.`,
              duracion: "Medio día",
              incluido: true,
            },
          ],
          coordinadores: [
            {
              nombre: "Equipo de Coordinadores",
              telefono: "+54 9 11 5555-0000",
              email: "info@turismo.com",
            },
          ],
          descuentoNinos: 10,
          precioBase: d.price,
          moneda: "ARS",
          montoSenia: d.price * 0.2,
          plazoPagoTotalDias: 10,
          fechas: {
            salida: new Date("2025-12-01"),
            regreso: new Date("2025-12-07"),
          },
          imagenPrincipal: d.image,
          imagenes: [d.image],
          publicado: true,
        })
      )
    );

    console.log(`✅ ${paquetes.length} paquetes insertados`);

    const destacados = paquetes
      .filter((p, i) => destinations[i].featured)
      .map((p, i) => ({
        package: p._id,
        orden: i + 1,
        etiqueta: "Destacado",
      }));

    await Featured.create({
      tituloSeccion: "Destinos Destacados ✨",
      descripcion:
        "Una selección especial de los destinos más populares y valorados por nuestros viajeros.",
      items: destacados,
      activo: true,
    });

    console.log("🌟 Sección de destacados creada exitosamente.");
    console.log("🎉 Seed completado.");
    process.exit();
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedData();

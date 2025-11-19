import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Package, PackageDate, Featured, Offer } from "../models/index.js";

dotenv.config();

// ------------------------------
// HELPERS
// ------------------------------
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Genera al menos 3 fechas por paquete
const generatePackageDates = (packageId, precioBase) => {
  const numFechas = randomInt(3, 6); // Entre 3 y 6 fechas
  const base = new Date("2025-12-01");
  
  return Array.from({ length: numFechas }).map((_, i) => {
    const salida = new Date(base);
    salida.setDate(salida.getDate() + i * 15);
    
    // Variación del precio base (±20%)
    const variacion = randomInt(-20, 20) / 100;
    const precioFinal = Math.round(precioBase * (1 + variacion));
    
    return {
      package: packageId,
      salida,
      // regreso se calculará automáticamente con el middleware
      precioFinal,
      moneda: "ARS",
      cuposTotales: randomInt(20, 50),
      cuposDisponibles: randomInt(10, 40),
      estado: "disponible"
    };
  });
};

// Genera entre 1 y 4 destinos por paquete
const generateDestinos = (d) => {
  const count = randomInt(1, 4);
  const destinos = [];
  
  // Primer destino siempre es el principal
  destinos.push({
    ciudad: d.destination,
    pais: d.country,
    diasEstadia: randomInt(3, 7),
    descripcion: d.descripcionCorta,
    actividades: [
      {
        nombre: `Tour por ${d.destination}`,
        descripcion: `Excursión guiada por los principales puntos turísticos.`,
        duracion: "Medio día",
        incluido: true
      }
    ],
    hospedaje: {
      nombre: `Hotel ${d.destination}`,
      categoria: ["3 estrellas", "4 estrellas", "5 estrellas"][randomInt(0, 2)],
      ubicacion: `Centro de ${d.destination}`,
      caracteristicas: ["WiFi", "Piscina", "Desayuno incluido"],
      gastronomia: {
        pension: ["media pension", "pension completa"][randomInt(0, 1)],
        descripcion: "Desayuno buffet y cena incluida."
      }
    }
  });
  
  // Destinos adicionales si corresponde
  const ciudadesAdicionales = {
    "Grecia": ["Atenas", "Mykonos", "Creta"],
    "Francia": ["Lyon", "Niza", "Burdeos"],
    "Suiza": ["Zúrich", "Ginebra", "Lucerna"],
    "Italia": ["Florencia", "Venecia", "Milán"],
    "Japón": ["Kioto", "Osaka", "Hiroshima"],
    "Tailandia": ["Phuket", "Chiang Mai", "Krabi"]
  };
  
  if (count > 1 && ciudadesAdicionales[d.country]) {
    const ciudades = ciudadesAdicionales[d.country];
    for (let i = 1; i < count && i < ciudades.length + 1; i++) {
      destinos.push({
        ciudad: ciudades[i - 1],
        pais: d.country,
        diasEstadia: randomInt(2, 4),
        descripcion: `Explorá ${ciudades[i - 1]} y sus maravillas.`,
        actividades: [
          {
            nombre: `Excursión en ${ciudades[i - 1]}`,
            descripcion: "Visita guiada a los puntos de interés.",
            duracion: "Día completo",
            incluido: true
          }
        ]
      });
    }
  }
  
  return destinos;
};

// ------------------------------
// DESTINOS BASE
// ------------------------------
const destinations = [
  {
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600",
    destination: "Santorini",
    country: "Grecia",
    price: 850000,
    rating: 4.9,
    featured: true,
    descripcionCorta: "Disfrutá del atardecer más famoso del mundo en Santorini.",
  },
  {
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    destination: "París",
    country: "Francia",
    price: 920000,
    rating: 4.8,
    featured: false,
    descripcionCorta: "Romance, arte y gastronomía en la ciudad del amor.",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    destination: "Alpes Suizos",
    country: "Suiza",
    price: 1100000,
    rating: 5.0,
    featured: true,
    descripcionCorta: "Paisajes nevados y pueblos de cuento entre las montañas suizas.",
  },
  {
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600",
    destination: "Bariloche",
    country: "Argentina",
    price: 380000,
    rating: 4.7,
    featured: false,
    descripcionCorta: "Lagos, montañas y chocolate en el corazón de la Patagonia.",
  },
  {
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    destination: "Dubai",
    country: "Emiratos Árabes",
    price: 1250000,
    rating: 4.9,
    featured: true,
    descripcionCorta: "Lujo y modernidad en el desierto de Emiratos Árabes.",
  },
  {
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600",
    destination: "Bangkok",
    country: "Tailandia",
    price: 780000,
    rating: 4.6,
    featured: false,
    descripcionCorta: "Templos dorados y vibrante vida nocturna en la capital tailandesa.",
  },
  {
    image: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=600",
    destination: "Tokio",
    country: "Japón",
    price: 1050000,
    rating: 4.8,
    featured: true,
    descripcionCorta: "Tradición y tecnología en una ciudad que nunca duerme.",
  },
  {
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600",
    destination: "Sídney",
    country: "Australia",
    price: 1350000,
    rating: 4.7,
    featured: false,
    descripcionCorta: "Playas, surf y la icónica Ópera de Sídney te esperan.",
  },
  {
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
    destination: "Islandia",
    country: "Islandia",
    price: 1180000,
    rating: 5.0,
    featured: true,
    descripcionCorta: "Auroras boreales, glaciares y cascadas de otro planeta.",
  },
  {
    image: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=600",
    destination: "Cancún",
    country: "México",
    price: 680000,
    rating: 4.5,
    featured: false,
    descripcionCorta: "Playas paradisíacas y diversión sin límites en el Caribe mexicano.",
  },
  {
    image: "https://images.unsplash.com/photo-1529180684069-84467e0fefc0?w=600",
    destination: "Bali",
    country: "Indonesia",
    price: 720000,
    rating: 4.8,
    featured: true,
    descripcionCorta: "Templos, playas y cultura en la isla de los dioses.",
  },
  {
    image: "https://images.unsplash.com/photo-1543716091-a840c05249ec?w=600",
    destination: "Machu Picchu",
    country: "Perú",
    price: 550000,
    rating: 4.9,
    featured: false,
    descripcionCorta: "Explorá las ruinas incas más famosas del mundo.",
  },
  {
    image: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600",
    destination: "Praga",
    country: "República Checa",
    price: 650000,
    rating: 4.6,
    featured: false,
    descripcionCorta: "Calles medievales y castillos en una joya europea.",
  },
  {
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600",
    destination: "Maldivas",
    country: "Maldivas",
    price: 1450000,
    rating: 5.0,
    featured: true,
    descripcionCorta: "Relax total en un paraíso de arenas blancas y aguas turquesa.",
  },
  {
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
    destination: "Roma",
    country: "Italia",
    price: 890000,
    rating: 4.7,
    featured: false,
    descripcionCorta: "Historia, arte y gastronomía en la Ciudad Eterna.",
  },
  {
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600",
    destination: "Europa Clásica",
    country: "Múltiples destinos",
    price: 1350000,
    rating: 4.9,
    featured: true,
    descripcionCorta: "Recorré las principales capitales europeas en un solo viaje.",
  },
];

// ------------------------------
// SEEDER PRINCIPAL
// ------------------------------
const seedData = async () => {
  try {
    await connectDB();

    console.log("🗑️  Eliminando datos previos...");
    await Package.deleteMany();
    await PackageDate.deleteMany();
    await Featured.deleteMany();
    await Offer.deleteMany();

    console.log("📦 Creando paquetes...");

    const paquetes = [];

    // Crear paquetes
    for (const d of destinations) {
      const destinos = generateDestinos(d);
      
      const pkg = await Package.create({
        nombre: `Viaje a ${d.destination}`,
        descripcion: `Explorá ${d.destination}, uno de los destinos más atractivos de ${d.country}.`,
        descripcionCorta: d.descripcionCorta,
        descripcionDetallada: `Descubrí todo lo que ${d.destination} tiene para ofrecerte en este paquete completo que incluye traslados, hospedaje y actividades exclusivas.`,
        tipo: d.country === "Argentina" ? "nacional" : "internacional",

        destinos,

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

        // Hospedaje general (también está en cada destino)
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

        // Actividades generales
        actividades: [
          {
            nombre: `City Tour en ${d.destination}`,
            descripcion: `Recorrido guiado por los principales puntos turísticos.`,
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

        descuentoNinos: randomInt(10, 20),
        precioBase: d.price,
        moneda: "ARS",
        montoSenia: Math.round(d.price * 0.2),
        plazoPagoTotalDias: randomInt(7, 15),

        // duracionTotal se calculará automáticamente con el middleware

        imagenPrincipal: { url: d.image, path: "" },
        imagenes: [
          { url: d.image, path: "" }
        ],

        etiquetas: (() => {
          const tags = [];
          if (randomInt(0, 1) === 1) tags.push("nuevo");
          if (d.price < 700000) tags.push("oferta");
          if (d.rating >= 4.8) tags.push("recomendado");
          return tags;
        })(),

        activo: true,
        visibleEnWeb: true
      });

      paquetes.push(pkg);

      // Generar fechas para este paquete
      const fechas = generatePackageDates(pkg._id, pkg.precioBase);
      await PackageDate.insertMany(fechas);
      
      console.log(`✅ Paquete creado: ${pkg.nombre} (${destinos.length} destinos, ${fechas.length} fechas)`);
    }

    console.log(`\n🎉 ${paquetes.length} paquetes creados exitosamente`);

    // ------------------------------
    // FEATURED
    // ------------------------------
    console.log("\n⭐ Creando sección de destacados...");
    
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

    console.log(`✅ ${destacados.length} paquetes destacados`);

    // ------------------------------
    // OFERTAS
    // ------------------------------
    console.log("\n💥 Creando ofertas especiales...");

    const europa = paquetes.find((p) => p.nombre.includes("Europa Clásica"));
    const cancun = paquetes.find((p) => p.nombre.includes("Cancún"));
    const bali = paquetes.find((p) => p.nombre.includes("Bali"));

    const ofertas = [];

    if (europa) {
      ofertas.push({
        titulo: "Europa Clásica - 30% OFF",
        descripcion:
          "Recorré múltiples ciudades europeas con un 30% de descuento.",
        package: europa._id,
        tipoDescuento: "porcentaje",
        valorDescuento: 30,
        fechaInicio: new Date("2025-11-01"),
        fechaFin: new Date("2025-12-31"),
        destacada: true,
        activo: true,
      });
    }

    if (cancun) {
      ofertas.push({
        titulo: "Caribe Todo Incluido - 25% OFF",
        descripcion: "Viví el sol y el mar con todo incluido en Cancún.",
        package: cancun._id,
        tipoDescuento: "porcentaje",
        valorDescuento: 25,
        fechaInicio: new Date("2025-11-10"),
        fechaFin: new Date("2026-01-15"),
        destacada: true,
        activo: true,
      });
    }

    if (bali) {
      ofertas.push({
        titulo: "Bali Relax - 20% OFF",
        descripcion: "Desconectá del mundo en los templos y playas de Bali.",
        package: bali._id,
        tipoDescuento: "porcentaje",
        valorDescuento: 20,
        fechaInicio: new Date("2025-11-05"),
        fechaFin: new Date("2025-12-31"),
        destacada: false,
        activo: true,
      });
    }

    if (ofertas.length > 0) {
      await Offer.insertMany(ofertas);
      console.log(`✅ ${ofertas.length} ofertas creadas`);
    }

    console.log("\n🎊 ¡Seeder completado exitosamente!");
    console.log("=" .repeat(50));
    
    process.exit();
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedData();
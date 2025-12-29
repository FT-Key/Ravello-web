import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Package, PackageDate, Featured, Offer, FeaturedPromotion, Review } from "../models/index.js";

dotenv.config();

// ------------------------------
// HELPERS
// ------------------------------
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Genera al menos 3 fechas por paquete
const generatePackageDates = (packageId, precioBase) => {
  const numFechas = randomInt(3, 6);
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
      precioFinal,
      moneda: "ARS",
      cuposTotales: randomInt(20, 50),
      cuposDisponibles: randomInt(10, 40),
      estado: "disponible"
    };
  });
};

// Genera reviews para un paquete
const generateReviews = (packageId, packageName) => {
  const nombres = [
    "María Soledad García",
    "Juan Pablo Rodríguez",
    "Ana Carolina Martínez",
    "Diego Alejandro López",
    "Sofía Fernández",
    "Martín González",
    "Laura Beatriz Sánchez",
    "Pablo Andrés Torres",
    "Valentina Romero",
    "Facundo Castro"
  ];
  
  const comentariosPositivos = [
    `Increíble experiencia en ${packageName}. Todo estuvo perfecto, desde el hospedaje hasta las excursiones. ¡Súper recomendado!`,
    `El viaje superó todas mis expectativas. La organización fue impecable y los guías muy profesionales.`,
    `Una experiencia inolvidable. Los destinos son hermosos y todo estuvo muy bien coordinado.`,
    `Excelente paquete, muy completo. El hotel era espectacular y las actividades muy entretenidas.`,
    `Lo pasamos genial. Todo estuvo muy bien organizado y el coordinador siempre estuvo disponible para ayudarnos.`
  ];
  
  const comentariosMedios = [
    `Buen viaje en general, aunque el hotel podría mejorar un poco. Las excursiones estuvieron muy buenas.`,
    `La experiencia fue buena, pero esperaba un poco más de variedad en las comidas.`,
    `Todo bien organizado, aunque algunos traslados se demoraron más de lo esperado.`
  ];
  
  const numReviews = randomInt(2, 5);
  const reviews = [];
  
  for (let i = 0; i < numReviews; i++) {
    const rating = randomInt(3, 5);
    const comentarios = rating >= 4 ? comentariosPositivos : comentariosMedios;
    
    reviews.push({
      nombre: nombres[randomInt(0, nombres.length - 1)],
      calificacion: rating,
      comentario: comentarios[randomInt(0, comentarios.length - 1)],
      paquete: packageId,
      tipo: "paquete",
      estadoModeracion: "aprobada"
    });
  }
  
  return reviews;
};

// Genera reviews generales de la empresa
const generateCompanyReviews = () => {
  return [
    {
      nombre: "Roberto Sánchez",
      calificacion: 5,
      comentario: "Excelente agencia, muy profesionales. He viajado varias veces con ellos y siempre todo perfecto.",
      tipo: "empresa",
      estadoModeracion: "aprobada"
    },
    {
      nombre: "Claudia Morales",
      calificacion: 5,
      comentario: "La mejor agencia de turismo. Atención personalizada y precios muy competitivos.",
      tipo: "empresa",
      estadoModeracion: "aprobada"
    },
    {
      nombre: "Hernán Gutiérrez",
      calificacion: 4,
      comentario: "Muy buena experiencia. El equipo de coordinadores siempre atento a nuestras consultas.",
      tipo: "empresa",
      estadoModeracion: "aprobada"
    },
    {
      nombre: "Patricia Luna",
      calificacion: 5,
      comentario: "Recomendadísimos. Organizan todo de maravilla y siempre están disponibles para cualquier consulta.",
      tipo: "empresa",
      estadoModeracion: "aprobada"
    },
    {
      nombre: "Sebastián Vega",
      calificacion: 5,
      comentario: "Viajé en familia y todo salió perfecto. Excelente relación calidad-precio.",
      tipo: "empresa",
      estadoModeracion: "aprobada"
    }
  ];
};

// Genera destinos completos con toda la info
const generateDestinos = (d) => {
  const destinos = [];
  
  destinos.push({
    ciudad: d.destination,
    pais: d.country,
    orden: 1,
    diasEstadia: d.diasPrimero || randomInt(3, 7),
    fechaInicio: new Date("2025-12-01"),
    descripcion: d.descripcionCorta,
    
    hospedaje: {
      nombre: d.hotel || `Hotel ${d.destination}`,
      categoria: d.categoria || ["3 estrellas", "4 estrellas", "5 estrellas"][randomInt(0, 2)],
      ubicacion: `Centro de ${d.destination}`,
      caracteristicas: ["WiFi gratuito", "Piscina", "Gimnasio", "Desayuno buffet"],
      gastronomia: {
        pension: d.pension || "media pension",
        descripcion: "Desayuno buffet y cena incluida con opciones internacionales."
      }
    },
    
    actividades: [
      {
        nombre: `City Tour ${d.destination}`,
        descripcion: `Recorrido guiado por los principales puntos turísticos de ${d.destination}.`,
        duracion: "Medio día",
        incluido: true,
        fecha: new Date("2025-12-02"),
        hora: "09:00"
      },
      {
        nombre: d.actividadExtra || "Excursión especial",
        descripcion: "Experiencia única en el destino.",
        duracion: "Día completo",
        incluido: true,
        fecha: new Date("2025-12-03"),
        hora: "08:00"
      }
    ],
    
    trasladoSalida: {
      tipo: "vuelo",
      compania: "AirTour Plus",
      salida: {
        lugar: "Buenos Aires - Ezeiza",
        fecha: new Date("2025-12-01"),
        hora: "09:00"
      },
      llegada: {
        lugar: d.aeropuerto || d.destination,
        fecha: new Date("2025-12-01"),
        hora: "18:00"
      },
      descripcion: "Vuelo directo con equipaje de 23kg incluido."
    },
    
    notas: d.notasDestino || "Documentación necesaria: pasaporte vigente."
  });
  
  const destinosAdicionales = {
    "Grecia": [
      { ciudad: "Atenas", dias: 3, hotel: "Hotel Acropolis View", actividad: "Visita a la Acrópolis" },
      { ciudad: "Mykonos", dias: 2, hotel: "Mykonos Bay Resort", actividad: "Tour por playas paradisíacas" }
    ],
    "Francia": [
      { ciudad: "Lyon", dias: 2, hotel: "Lyon City Hotel", actividad: "Tour gastronómico" },
      { ciudad: "Niza", dias: 2, hotel: "Riviera Palace", actividad: "Paseo por la Costa Azul" }
    ],
    "Italia": [
      { ciudad: "Florencia", dias: 3, hotel: "Renaissance Florence", actividad: "Galería Uffizi" },
      { ciudad: "Venecia", dias: 2, hotel: "Venetian Palace", actividad: "Paseo en góndola" }
    ],
    "Japón": [
      { ciudad: "Kioto", dias: 3, hotel: "Kyoto Traditional Inn", actividad: "Templos y jardines zen" },
      { ciudad: "Osaka", dias: 2, hotel: "Osaka Modern Hotel", actividad: "Tour gastronómico nocturno" }
    ],
    "Tailandia": [
      { ciudad: "Chiang Mai", dias: 3, hotel: "Mountain View Resort", actividad: "Santuario de elefantes" },
      { ciudad: "Phuket", dias: 2, hotel: "Beach Paradise Resort", actividad: "Isla Phi Phi" }
    ]
  };
  
  if (d.multiDestino && destinosAdicionales[d.country]) {
    const extras = destinosAdicionales[d.country];
    extras.forEach((extra, idx) => {
      destinos.push({
        ciudad: extra.ciudad,
        pais: d.country,
        orden: idx + 2,
        diasEstadia: extra.dias,
        descripcion: `Explorá ${extra.ciudad} y sus principales atractivos.`,
        
        hospedaje: {
          nombre: extra.hotel,
          categoria: "4 estrellas",
          ubicacion: `Centro de ${extra.ciudad}`,
          caracteristicas: ["WiFi", "Desayuno incluido", "Aire acondicionado"],
          gastronomia: {
            pension: "desayuno",
            descripcion: "Desayuno continental."
          }
        },
        
        actividades: [
          {
            nombre: extra.actividad,
            descripcion: `Experiencia inolvidable en ${extra.ciudad}.`,
            duracion: "Medio día",
            incluido: true
          }
        ],
        
        trasladoSalida: {
          tipo: "bus",
          compania: "Comfort Travel",
          salida: {
            lugar: destinos[idx].ciudad,
            hora: "08:00"
          },
          llegada: {
            lugar: extra.ciudad,
            hora: "14:00"
          },
          descripcion: "Traslado terrestre con guía."
        }
      });
    });
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
    multiDestino: true,
    diasPrimero: 5,
    hotel: "Sunset View Santorini",
    categoria: "5 estrellas",
    pension: "pension completa",
    aeropuerto: "Santorini Airport",
    actividadExtra: "Crucero al atardecer",
    notasDestino: "Visado no requerido para argentinos. Temporada alta en verano.",
    descripcionCorta: "Disfrutá del atardecer más famoso del mundo en Santorini.",
  },
  {
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    destination: "París",
    country: "Francia",
    price: 920000,
    rating: 4.8,
    featured: false,
    multiDestino: true,
    diasPrimero: 4,
    hotel: "Le Royal Paris",
    categoria: "4 estrellas",
    pension: "media pension",
    aeropuerto: "Charles de Gaulle",
    actividadExtra: "Torre Eiffel y Louvre",
    descripcionCorta: "Romance, arte y gastronomía en la ciudad del amor.",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    destination: "Alpes Suizos",
    country: "Suiza",
    price: 1100000,
    rating: 5.0,
    featured: true,
    diasPrimero: 6,
    hotel: "Alpine Luxury Resort",
    categoria: "5 estrellas",
    pension: "pension completa",
    aeropuerto: "Zúrich Airport",
    actividadExtra: "Esquí y spa de montaña",
    descripcionCorta: "Paisajes nevados y pueblos de cuento entre las montañas suizas.",
  },
  {
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600",
    destination: "Bariloche",
    country: "Argentina",
    price: 380000,
    rating: 4.7,
    featured: false,
    diasPrimero: 5,
    hotel: "Llao Llao Resort",
    categoria: "5 estrellas",
    pension: "media pension",
    actividadExtra: "Circuito Chico y chocolates",
    descripcionCorta: "Lagos, montañas y chocolate en el corazón de la Patagonia.",
  },
  {
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    destination: "Dubai",
    country: "Emiratos Árabes",
    price: 1250000,
    rating: 4.9,
    featured: true,
    diasPrimero: 5,
    hotel: "Burj Al Arab",
    categoria: "5 estrellas",
    pension: "todo incluido",
    aeropuerto: "Dubai International",
    actividadExtra: "Safari por el desierto",
    descripcionCorta: "Lujo y modernidad en el desierto de Emiratos Árabes.",
  },
  {
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600",
    destination: "Bangkok",
    country: "Tailandia",
    price: 780000,
    rating: 4.6,
    featured: false,
    multiDestino: true,
    diasPrimero: 4,
    hotel: "Bangkok Palace Hotel",
    categoria: "4 estrellas",
    pension: "desayuno",
    aeropuerto: "Suvarnabhumi Airport",
    actividadExtra: "Templos y mercados flotantes",
    descripcionCorta: "Templos dorados y vibrante vida nocturna en la capital tailandesa.",
  },
  {
    image: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=600",
    destination: "Tokio",
    country: "Japón",
    price: 1050000,
    rating: 4.8,
    featured: true,
    multiDestino: true,
    diasPrimero: 5,
    hotel: "Tokyo Imperial Hotel",
    categoria: "5 estrellas",
    pension: "desayuno",
    aeropuerto: "Narita International",
    actividadExtra: "Shibuya y Monte Fuji",
    descripcionCorta: "Tradición y tecnología en una ciudad que nunca duerme.",
  },
  {
    image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600",
    destination: "Sídney",
    country: "Australia",
    price: 1350000,
    rating: 4.7,
    featured: false,
    diasPrimero: 6,
    hotel: "Sydney Harbour Hotel",
    categoria: "5 estrellas",
    pension: "media pension",
    aeropuerto: "Sydney Kingsford Smith",
    actividadExtra: "Ópera y Bondi Beach",
    descripcionCorta: "Playas, surf y la icónica Ópera de Sídney te esperan.",
  },
  {
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
    destination: "Islandia",
    country: "Islandia",
    price: 1180000,
    rating: 5.0,
    featured: true,
    diasPrimero: 7,
    hotel: "Reykjavik Northern Lights Inn",
    categoria: "4 estrellas",
    pension: "media pension",
    aeropuerto: "Keflavík International",
    actividadExtra: "Auroras boreales y Blue Lagoon",
    descripcionCorta: "Auroras boreales, glaciares y cascadas de otro planeta.",
  },
  {
    image: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=600",
    destination: "Cancún",
    country: "México",
    price: 680000,
    rating: 4.5,
    featured: false,
    diasPrimero: 5,
    hotel: "Cancún All Inclusive Resort",
    categoria: "4 estrellas",
    pension: "todo incluido",
    aeropuerto: "Cancún International",
    actividadExtra: "Chichén Itzá y cenotes",
    descripcionCorta: "Playas paradisíacas y diversión sin límites en el Caribe mexicano.",
  },
  {
    image: "https://images.unsplash.com/photo-1529180684069-84467e0fefc0?w=600",
    destination: "Bali",
    country: "Indonesia",
    price: 720000,
    rating: 4.8,
    featured: true,
    diasPrimero: 6,
    hotel: "Bali Paradise Resort",
    categoria: "5 estrellas",
    pension: "pension completa",
    aeropuerto: "Ngurah Rai International",
    actividadExtra: "Templo Tanah Lot y Ubud",
    descripcionCorta: "Templos, playas y cultura en la isla de los dioses.",
  },
  {
    image: "https://images.unsplash.com/photo-1543716091-a840c05249ec?w=600",
    destination: "Machu Picchu",
    country: "Perú",
    price: 550000,
    rating: 4.9,
    featured: false,
    diasPrimero: 4,
    hotel: "Cusco Heritage Hotel",
    categoria: "4 estrellas",
    pension: "media pension",
    aeropuerto: "Alejandro Velasco Astete",
    actividadExtra: "Machu Picchu y Valle Sagrado",
    descripcionCorta: "Explorá las ruinas incas más famosas del mundo.",
  },
  {
    image: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600",
    destination: "Praga",
    country: "República Checa",
    price: 650000,
    rating: 4.6,
    featured: false,
    diasPrimero: 4,
    hotel: "Prague Castle View",
    categoria: "4 estrellas",
    pension: "desayuno",
    aeropuerto: "Václav Havel Airport",
    actividadExtra: "Castillo y Puente de Carlos",
    descripcionCorta: "Calles medievales y castillos en una joya europea.",
  },
  {
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600",
    destination: "Maldivas",
    country: "Maldivas",
    price: 1450000,
    rating: 5.0,
    featured: true,
    diasPrimero: 7,
    hotel: "Maldives Overwater Villas",
    categoria: "5 estrellas",
    pension: "todo incluido",
    aeropuerto: "Velana International",
    actividadExtra: "Snorkel y spa de lujo",
    descripcionCorta: "Relax total en un paraíso de arenas blancas y aguas turquesa.",
  },
  {
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
    destination: "Roma",
    country: "Italia",
    price: 890000,
    rating: 4.7,
    featured: false,
    multiDestino: true,
    diasPrimero: 4,
    hotel: "Roman Imperial Hotel",
    categoria: "4 estrellas",
    pension: "desayuno",
    aeropuerto: "Leonardo da Vinci–Fiumicino",
    actividadExtra: "Coliseo y Vaticano",
    descripcionCorta: "Historia, arte y gastronomía en la Ciudad Eterna.",
  },
  {
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600",
    destination: "Europa Clásica",
    country: "Múltiples destinos",
    price: 1350000,
    rating: 4.9,
    featured: true,
    multiDestino: true,
    diasPrimero: 5,
    hotel: "European Tour Hotels",
    categoria: "4 estrellas",
    pension: "media pension",
    aeropuerto: "Varios aeropuertos",
    actividadExtra: "Tour por capitales europeas",
    descripcionCorta: "Recorré las principales capitales europeas en un solo viaje.",
  },
  // PAQUETES DE PRUEBA
  {
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600",
    destination: "Test City Express",
    country: "Argentina",
    price: 5,
    rating: 5.0,
    featured: false,
    diasPrimero: 1,
    hotel: "Test Hotel",
    categoria: "3 estrellas",
    pension: "sin comida",
    actividadExtra: "City tour rápido",
    descripcionCorta: "Paquete de prueba para testing de pagos - $5 ARS",
  },
  {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
    destination: "Test Weekend",
    country: "Argentina",
    price: 10,
    rating: 4.5,
    featured: false,
    diasPrimero: 2,
    hotel: "Test Inn",
    categoria: "2 estrellas",
    pension: "desayuno",
    actividadExtra: "Actividad de prueba",
    descripcionCorta: "Paquete de prueba para testing de pagos - $10 ARS",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    destination: "Test Premium",
    country: "Argentina",
    price: 50,
    rating: 4.8,
    featured: false,
    diasPrimero: 3,
    hotel: "Test Premium Hotel",
    categoria: "4 estrellas",
    pension: "media pension",
    actividadExtra: "Tours varios",
    descripcionCorta: "Paquete de prueba premium para testing - $50 ARS",
  }
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
    await FeaturedPromotion.deleteMany();
    await Review.deleteMany();

    console.log("📦 Creando paquetes...");

    const paquetes = [];
    const todasLasReviews = [];

    // Crear paquetes
    for (const d of destinations) {
      const destinos = generateDestinos(d);
      
      const pkg = await Package.create({
        nombre: `Viaje a ${d.destination}`,
        slug: `viaje-a-${d.destination.toLowerCase().replace(/\s+/g, '-')}`,
        descripcionCorta: d.descripcionCorta,
        descripcionDetallada: `Descubrí todo lo que ${d.destination} tiene para ofrecerte en este paquete completo que incluye traslados, hospedaje de calidad y actividades exclusivas. Viví una experiencia inolvidable con todo organizado para que solo te preocupes por disfrutar.`,
        tipo: d.country === "Argentina" ? "nacional" : "internacional",

        destinos,

        incluyeGeneral: [
          "Asistencia al viajero",
          "Coordinador de viaje 24/7",
          "Kit de viajero",
          "Traslados aeropuerto-hotel-aeropuerto",
          "Seguro de cancelación"
        ],

        noIncluyeGeneral: [
          "Gastos personales",
          "Propinas",
          "Bebidas alcohólicas",
          "Excursiones opcionales no especificadas",
          "Documentación (pasaporte, visa si aplica)"
        ],

        coordinadores: [
          {
            nombre: "Equipo de Coordinadores",
            telefono: "+54 9 381 555-0000",
            email: "info@turismoargentina.com",
            rol: "coordinador"
          }
        ],

        descuentoNinos: randomInt(10, 25),
        precioBase: d.price,
        moneda: "ARS",
        montoSenia: Math.round(d.price * 0.3),
        plazoPagoTotalDias: randomInt(10, 20),

        imagenPrincipal: { url: d.image, path: "" },
        imagenes: [
          { url: d.image, path: "", descripcion: `Vista principal de ${d.destination}` },
          { url: d.image, path: "", descripcion: `Atractivo turístico de ${d.destination}` }
        ],

        etiquetas: (() => {
          const tags = [];
          if (d.price <= 20) tags.push("oferta");
          if (d.price < 700000 && d.price > 100) tags.push("oferta");
          if (d.rating >= 4.8) tags.push("mas vendido");
          if (d.rating === 5.0) tags.push("exclusivo");
          if (randomInt(0, 2) === 1) tags.push("recomendado");
          if (d.featured && tags.length < 2) tags.push("nuevo");
          return tags;
        })(),

        categoria: (() => {
          if (d.destination.includes("Bariloche") || d.destination.includes("Alpes")) return "aventura";
          if (d.destination.includes("Maldivas") || d.destination.includes("Bali")) return "relax";
          if (d.destination.includes("Roma") || d.destination.includes("Praga")) return "cultural";
          if (d.destination.includes("París") || d.destination.includes("Santorini")) return "romantico";
          return "familiar";
        })(),

        capacidadMinima: 2,
        capacidadMaxima: randomInt(15, 40),
        activo: true,
        visibleEnWeb: true,

        fechasDisponibles: [
          {
            inicio: new Date("2025-12-01"),
            fin: new Date("2026-03-31"),
            cupos: randomInt(20, 50)
          }
        ]
      });

      paquetes.push(pkg);

      // Generar fechas
      const fechas = generatePackageDates(pkg._id, pkg.precioBase);
      await PackageDate.insertMany(fechas);
      
      // Generar reviews para este paquete (solo si no es de prueba)
      if (d.price > 100) {
        const reviews = generateReviews(pkg._id, d.destination);
        todasLasReviews.push(...reviews);
      }
      
      console.log(`✅ ${pkg.nombre} | ${destinos.length} destinos | ${fechas.length} fechas | ${pkg.duracionTotal} días | $${pkg.precioBase}`);
    }

    console.log(`\n🎉 ${paquetes.length} paquetes creados`);

    // ------------------------------
    // REVIEWS
    // ------------------------------
    console.log("\n⭐ Creando reviews...");
    
    // Agregar reviews de empresa
    const companyReviews = generateCompanyReviews();
    todasLasReviews.push(...companyReviews);
    
    await Review.insertMany(todasLasReviews);
    console.log(`✅ ${todasLasReviews.length} reviews creadas (${companyReviews.length} de empresa, ${todasLasReviews.length - companyReviews.length} de paquetes)`);

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
      tituloSeccion: "Destinos Destacados",
      descripcion: "Una selección especial de los destinos más populares y valorados por nuestros viajeros.",
      items: destacados,
      activo: true,
    });

    console.log(`✅ ${destacados.length} paquetes destacados`);

    // ------------------------------
    // FEATURED PROMOTIONS (exactamente 2)
    // ------------------------------
    console.log("\n🎁 Creando promociones destacadas...");
    
    const bali = paquetes.find((p) => p.nombre.includes("Bali"));
    const cancun = paquetes.find((p) => p.nombre.includes("Cancún"));
    
    if (bali && cancun) {
      await FeaturedPromotion.create({
        titulo: "Ofertas imperdibles",
        descripcion: "Aprovechá estas promociones exclusivas con descuentos increíbles",
        packages: [bali._id, cancun._id],
        activo: true
      });
      console.log(`✅ 2 promociones destacadas creadas`);
    }

    // ------------------------------
    // OFERTAS
    // ------------------------------
    console.log("\n💥 Creando ofertas especiales...");

    const europa = paquetes.find((p) => p.nombre.includes("Europa Clásica"));
    const bariloche = paquetes.find((p) => p.nombre.includes("Bariloche"));

    const ofertas = [];

    if (europa) {
      ofertas.push({
        titulo: "Europa Clásica - 30% OFF",
        descripcion: "Recorré múltiples ciudades europeas con un 30% de descuento.",
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

    if (bariloche) {
      ofertas.push({
        titulo: "Bariloche Invierno - 15% OFF",
        descripcion: "Disfrutá de la nieve patagónica con descuento especial.",
        package: bariloche._id,
        tipoDescuento: "porcentaje",
        valorDescuento: 15,
        fechaInicio: new Date("2025-11-01"),
        fechaFin: new Date("2026-02-28"),
        destacada: false,
        activo: true,
      });
    }

    if (ofertas.length > 0) {
      await Offer.insertMany(ofertas);
      console.log(`✅ ${ofertas.length} ofertas creadas`);
    }

    console.log("\n📊 RESUMEN COMPLETO:");
    console.log("=" .repeat(60));
    console.log(`✓ Paquetes totales: ${paquetes.length}`);
    console.log(`✓ Paquetes reales: ${paquetes.length - 3}`);
    console.log(`✓ Paquetes de prueba: 3 ($5, $10, $50)`);
    console.log(`✓ Reviews totales: ${todasLasReviews.length}`);
    console.log(`✓ Reviews de empresa: ${companyReviews.length}`);
    console.log(`✓ Reviews de paquetes: ${todasLasReviews.length - companyReviews.length}`);
    console.log(`✓ Paquetes destacados: ${destacados.length}`);
    console.log(`✓ Promociones destacadas: 2`);
    console.log(`✓ Ofertas activas: ${ofertas.length}`);
    console.log("=" .repeat(60));
    console.log("\n🎊 ¡Seeder completado exitosamente!");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
};

seedData()
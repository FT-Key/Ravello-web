import React from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Plane,
  Mountain,
  Umbrella,
  Building,
  Heart,
  Users,
} from "lucide-react";
import "./home.css";
import FeaturedDestinations from "../../components/Home/FeaturedDestinations";
import PromotionsSection from "../../components/Home/PromotionsSection";
import TestimonialsSection from "../../components/Home/TestimonialsSection"; // 👈 Nuevo import

// ==================== HERO SECTION ====================
const HeroSection = () => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-600 to-blue-700 hero-bg" />
      <div className="absolute inset-0 bg-black opacity-30" />

      <div
        className="relative z-10 text-center text-white py-20 px-4 max-w-6xl mx-auto"
        data-aos="fade-up"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Viajá donde siempre soñaste
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Paquetes exclusivos, precios increíbles, atención personalizada
        </p>

        <div
          className="max-w-2xl mx-auto bg-white rounded-full shadow-2xl p-2 flex items-center"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <input
            type="text"
            placeholder="¿A dónde querés viajar?"
            className="flex-1 px-6 py-3 text-gray-800 outline-none rounded-l-full"
          />
          <button className="bg-primary-red rounded-full px-8 py-3 font-semibold text-white border-0 flex items-center transition-transform hover:scale-105">
            <Search className="mr-2" size={20} />
            Buscar
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
};

// ==================== EXPERIENCES SECTION ====================
const ExperiencesSection = () => {
  const experiences = [
    {
      icon: Umbrella,
      title: "Playas paradisíacas",
      description: "Arena blanca, agua cristalina",
      bgClass: "icon-bg-cyan",
      colorClass: "text-secondary-cyan",
    },
    {
      icon: Mountain,
      title: "Aventura y trekking",
      description: "Montañas y naturaleza extrema",
      bgClass: "icon-bg-blue",
      colorClass: "text-primary-blue",
    },
    {
      icon: Building,
      title: "Cultura e historia",
      description: "Ciudades con siglos de arte",
      bgClass: "icon-bg-red",
      colorClass: "text-primary-red",
    },
    {
      icon: Heart,
      title: "Relax y bienestar",
      description: "Spas y retiros de lujo",
      bgClass: "icon-bg-green",
      colorClass: "text-green-600",
    },
  ];

  return (
    <section className="py-20 bg-background-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Experiencias únicas
          </h2>
          <p className="text-lg text-light">
            Elegí el tipo de viaje perfecto para vos
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-aos="zoom-in-up"
        >
          {experiences.map((exp, idx) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="text-center p-6 rounded-3xl h-full bg-white experience-card cursor-pointer hover:shadow-xl"
              >
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${exp.bgClass}`}
                >
                  <IconComponent size={40} className={exp.colorClass} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark">
                  {exp.title}
                </h3>
                <p className="text-light">{exp.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==================== WHY RAVELLO ====================
const WhyRavello = () => {
  const features = [
    {
      icon: Users,
      title: "Asesoramiento personalizado",
      description: "Expertos en viajes te ayudan en cada paso",
    },
    {
      icon: DollarSign,
      title: "Mejores precios garantizados",
      description:
        "Encontrás algo más barato? Te devolvemos la diferencia",
    },
    {
      icon: Clock,
      title: "Atención 24/7",
      description: "Soporte en cualquier momento de tu viaje",
    },
    {
      icon: Plane,
      title: "+100 destinos internacionales",
      description: "Los mejores lugares del mundo al alcance",
    },
  ];

  return (
    <section className="py-20 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 text-white" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Por qué elegir Ravello?
          </h2>
          <p className="text-lg opacity-90">
            Tu próxima aventura merece el mejor servicio
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          data-aos="zoom-in-up"
        >
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="text-center text-white"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-white">
                  <IconComponent size={40} className="text-primary-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==================== NEWSLETTER ====================
const NewsletterSection = () => (
  <section className="py-20 bg-secondary-sand">
    <div className="max-w-7xl mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center" data-aos="zoom-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
          Recibí nuestras mejores ofertas
        </h2>
        <p className="text-lg mb-8 text-light">
          Suscribite y no te pierdas ninguna promoción exclusiva
        </p>

        <div
          className="bg-white rounded-full shadow-xl p-2 flex items-center max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-1 px-6 py-3 outline-none rounded-l-full text-dark"
          />
          <button className="bg-primary-red rounded-full px-8 py-3 font-semibold text-white border-0 transition-transform hover:scale-105">
            Suscribirse
          </button>
        </div>

        <p className="text-sm mt-4 text-light">
          No spam. Solo las mejores ofertas para tu próximo viaje.
        </p>
      </div>
    </div>
  </section>
);

// ==================== MAIN HOME COMPONENT ====================
export default function Home() {
  return (
    <div className="bg-background-white">
      <HeroSection />
      <FeaturedDestinations />
      <PromotionsSection />
      <ExperiencesSection />
      <WhyRavello />
      <TestimonialsSection /> {/* 👈 Usa ahora el componente dinámico */}
      <NewsletterSection />
    </div>
  );
}

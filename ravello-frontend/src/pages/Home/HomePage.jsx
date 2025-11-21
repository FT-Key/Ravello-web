import React from "react";
import {
  DollarSign,
  Clock,
  Plane,
  Mountain,
  Umbrella,
  Building,
  Heart,
  Users,
} from "lucide-react";
import "./home.css";
import HeroSection from "../../components/Home/HeroSection";
import FeaturedDestinations from "../../components/Home/FeaturedDestinations";
import PromotionsSection from "../../components/Home/PromotionsSection";
import TestimonialsSection from "../../components/Home/TestimonialsSection";
import NewsletterSection from "../../components/Home/NewsletterSection";

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
      description: "Encontrás algo más barato? Te devolvemos la diferencia",
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

// ==================== MAIN HOME COMPONENT ====================
export default function Home() {
  return (
    <div className="bg-background-white">
      <HeroSection />
      <FeaturedDestinations />
      <PromotionsSection />
      <ExperiencesSection />
      <WhyRavello />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
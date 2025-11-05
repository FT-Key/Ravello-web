import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import './home.css';

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

// ==================== DESTINATION CARD ====================
const DestinationCard = ({ image, destination, country, price, rating, featured, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div data-aos="zoom-in" data-aos-delay={delay} data-aos-once="true">
      <div
        className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 h-full bg-white ${isHovered ? '-translate-y-2 shadow-2xl' : 'translate-y-0'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden h-64">
          <div
            className={`w-full h-full bg-cover bg-center transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
            style={{ backgroundImage: `url(${image})` }}
          />

          {featured && (
            <div className="absolute top-4 right-4 bg-primary-red px-3 py-1 rounded-full text-white text-sm font-semibold">
              ¡Oferta!
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
            <div className="flex items-center text-white text-sm">
              <Star size={16} fill="gold" color="gold" className="mr-1" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-dark">{destination}</h3>
          <p className="text-sm flex items-center text-light">
            <MapPin size={14} className="mr-1" />
            {country}
          </p>
          <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between">
            <div>
              <p className="text-sm mb-1 text-light">Desde</p>
              <p className="text-2xl font-bold text-primary-blue">
                ${price.toLocaleString()}
              </p>
            </div>
            <button className="bg-primary-blue rounded-full px-6 py-2 font-semibold border-0 text-white transition-transform hover:scale-105">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== FEATURED DESTINATIONS ====================
const FeaturedDestinations = () => {
  const destinations = [
    { image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600', destination: 'Santorini', country: 'Grecia', price: 850000, rating: 4.9, featured: true },
    { image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', destination: 'París', country: 'Francia', price: 920000, rating: 4.8, featured: false },
    { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', destination: 'Alpes Suizos', country: 'Suiza', price: 1100000, rating: 5.0, featured: true },
    { image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', destination: 'Bariloche', country: 'Argentina', price: 380000, rating: 4.7, featured: false },
    { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', destination: 'Dubai', country: 'Emiratos Árabes', price: 1250000, rating: 4.9, featured: true },
    { image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600', destination: 'Bangkok', country: 'Tailandia', price: 780000, rating: 4.6, featured: false }
  ];

  return (
    <section className="py-20 bg-background-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Destinos destacados
          </h2>
          <p className="text-lg text-light">
            Los lugares más increíbles te esperan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <DestinationCard key={idx} {...dest} delay={idx * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PROMOTIONS SECTION ====================
const PromotionsSection = () => (
  <section className="py-20 bg-secondary-sand">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
          Ofertas imperdibles
        </h2>
        <p className="text-lg text-light">
          Aprovechá los mejores precios de temporada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-aos="fade-right" data-aos-delay="100">
          <div
            className="rounded-3xl overflow-hidden shadow-xl relative h-80"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <div className="bg-primary-red inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 w-fit">
                30% OFF
              </div>
              <h3 className="text-3xl font-bold mb-2">Caribe Todo Incluido</h3>
              <p className="text-lg mb-4">Últimos cupos disponibles</p>
              <button className="w-fit rounded-full px-6 py-2 font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 transition-all">
                Ver oferta
              </button>
            </div>
          </div>
        </div>

        <div data-aos="fade-left" data-aos-delay="200">
          <div
            className="rounded-3xl overflow-hidden shadow-xl relative h-80"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <div className="bg-state-warning inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 w-fit">
                ¡Nueva ruta!
              </div>
              <h3 className="text-3xl font-bold mb-2">Europa Clásica</h3>
              <p className="text-lg mb-4">5 ciudades, 12 días</p>
              <button className="w-fit rounded-full px-6 py-2 font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 transition-all">
                Conocer más
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==================== EXPERIENCES SECTION ====================
const ExperiencesSection = () => {
  const experiences = [
    { icon: Umbrella, title: 'Playas paradisíacas', description: 'Arena blanca, agua cristalina', bgClass: 'icon-bg-cyan', colorClass: 'text-secondary-cyan' },
    { icon: Mountain, title: 'Aventura y trekking', description: 'Montañas y naturaleza extrema', bgClass: 'icon-bg-blue', colorClass: 'text-primary-blue' },
    { icon: Building, title: 'Cultura e historia', description: 'Ciudades con siglos de arte', bgClass: 'icon-bg-red', colorClass: 'text-primary-red' },
    { icon: Heart, title: 'Relax y bienestar', description: 'Spas y retiros de lujo', bgClass: 'icon-bg-green', colorClass: 'text-green-600' }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="zoom-in-up">
          {experiences.map((exp, idx) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="text-center p-6 rounded-3xl h-full bg-white experience-card cursor-pointer hover:shadow-xl"
              >
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${exp.bgClass}`}>
                  <IconComponent size={40} className={exp.colorClass} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark">{exp.title}</h3>
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
    { icon: Users, title: 'Asesoramiento personalizado', description: 'Expertos en viajes te ayudan en cada paso' },
    { icon: DollarSign, title: 'Mejores precios garantizados', description: 'Encontrás algo más barato? Te devolvemos la diferencia' },
    { icon: Clock, title: 'Atención 24/7', description: 'Soporte en cualquier momento de tu viaje' },
    { icon: Plane, title: '+100 destinos internacionales', description: 'Los mejores lugares del mundo al alcance' }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="zoom-in-up">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 150} className="text-center text-white">
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

// ==================== TESTIMONIALS ====================
const TestimonialsSection = () => {
  const testimonials = [
    { name: 'María González', location: 'Buenos Aires', text: 'Increíble experiencia en Grecia. Todo superó nuestras expectativas, la atención fue impecable.', rating: 5, avatar: 'MG' },
    { name: 'Carlos Ramírez', location: 'Córdoba', text: 'Viajamos a Europa con Ravello y fue perfecto. Los precios son realmente competitivos.', rating: 5, avatar: 'CR' },
    { name: 'Laura Fernández', location: 'Mendoza', text: 'Excelente servicio, nos asesoraron en todo momento. Ya estamos planeando el próximo viaje!', rating: 5, avatar: 'LF' }
  ];

  return (
    <section className="py-20 bg-background-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-lg text-light">
            Miles de clientes satisfechos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 200}
              className="rounded-2xl shadow-lg p-6 h-full bg-background-light"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 bg-primary-blue">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-dark">{test.name}</h4>
                  <p className="text-sm text-light">{test.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="gold" color="gold" />
                ))}
              </div>

              <p className="text-light">"{test.text}"</p>
            </div>
          ))}
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
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}

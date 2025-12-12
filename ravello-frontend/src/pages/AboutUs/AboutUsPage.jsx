import React, { useState } from "react";

export default function AboutUsPage() {
  const [activeFounder, setActiveFounder] = useState(0);

  const founders = [
    {
      name: "Isabella Montes",
      role: "CEO & Fundadora",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      story: "Con más de 15 años de experiencia en la industria del turismo, Isabella fundó Ravello con la visión de transformar la manera en que las personas planifican sus viajes."
    },
    {
      name: "Marco Valenti",
      role: "Director de Operaciones",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      story: "Marco aporta su experiencia en logística y tecnología para crear experiencias de viaje sin fricciones, optimizando cada detalle del proceso."
    },
    {
      name: "Sofia Restrepo",
      role: "Directora Creativa",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      story: "Sofia diseña cada experiencia con pasión artística, convirtiendo itinerarios en aventuras memorables que conectan a las personas con destinos únicos."
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--color-primary-blue) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-primary-blue) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Hero Section con glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Decorative circles */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--color-primary-blue)' }}></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--color-secondary-cyan)' }}></div>

        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/50 shadow-2xl">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
              style={{ backgroundColor: 'var(--color-secondary-sand)' }}>
              <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--color-primary-blue)' }}>
                Desde 2018
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              style={{ color: 'var(--color-text-dark)' }}>
              Ravello:<br />
              <span style={{ color: 'var(--color-primary-blue)' }}>Administramos</span>
              <br />
              <span style={{ color: 'var(--color-primary-red)' }}>Buenos momentos.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8"
              style={{ color: 'var(--color-text-light)' }}>
              Somos más que una agencia de viajes. Somos arquitectos de experiencias,
              diseñadores de momentos inolvidables y tu aliado perfecto para convertir
              sueños en itinerarios reales.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section - Layout envolvente */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-light-fade"></div>

        <div className="max-w-7xl mx-auto relative">
          {/* Left flowing shape */}
          <div className="absolute -left-32 top-0 w-96 h-full rounded-r-full opacity-30 hidden lg:block"
            style={{ background: `linear-gradient(90deg, var(--color-secondary-sand), transparent)` }}>
          </div>

          {/* Right flowing shape */}
          <div className="absolute -right-32 top-40 w-96 h-96 rounded-l-full opacity-20 hidden lg:block"
            style={{ background: `linear-gradient(-90deg, var(--color-secondary-cyan), transparent)` }}>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--color-primary-blue)' }}>
                Nuestra Historia
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                <p>
                  Todo comenzó en 2018, cuando tres apasionados del viaje se encontraron en una pequeña
                  cafetería de Buenos Aires. Isabella, Marco y Sofia compartían una frustración común:
                  planificar viajes era complicado, fragmentado y consumía demasiado tiempo.
                </p>
                <p>
                  Inspirados por la belleza de Ravello, aquel pintoresco pueblo italiano donde se conocieron
                  durante un congreso de turismo, decidieron crear algo diferente. Una plataforma que no solo
                  vendiera paquetes turísticos, sino que reimaginara completamente la experiencia de planificar
                  aventuras.
                </p>
                <p>
                  Lo que comenzó como un proyecto con cinco clientes en el primer mes, se transformó en una
                  comunidad de más de 50,000 viajeros que confían en nosotros para diseñar sus escapadas
                  perfectas. Desde retiros románticos en las Maldivas hasta expediciones de aventura en la
                  Patagonia, hemos convertido cada viaje en una historia única.
                </p>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=800&fit=crop"
                  alt="Equipo Ravello"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl -z-10"
                style={{ backgroundColor: 'var(--color-primary-red)', opacity: 0.3 }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Cards envolventes */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20"
            style={{ color: 'var(--color-primary-blue)' }}>
            Lo que nos define
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "✈️",
                title: "Personalización Total",
                desc: "Cada viajero es único. Diseñamos experiencias a medida que se adaptan a tus gustos, presupuesto y sueños."
              },
              {
                icon: "⚡",
                title: "Eficiencia Inteligente",
                desc: "Nuestra tecnología optimiza vuelos, hoteles y actividades para darte la mejor relación calidad-precio."
              },
              {
                icon: "💙",
                title: "Pasión por el Detalle",
                desc: "Desde el primer contacto hasta tu regreso a casa, cuidamos cada momento de tu aventura."
              }
            ].map((value, idx) => (
              <div key={idx} className="group relative">
                {/* Flowing background */}
                <div className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, var(--color-secondary-sand), var(--color-secondary-cyan))`,
                    filter: 'blur(20px)'
                  }}></div>

                <div className="relative backdrop-blur-sm bg-white/80 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 
                              transform group-hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{value.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--color-primary-blue)' }}>
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-light)' }}>
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section - Interactive */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-sand-fade"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 md:mb-6"
            style={{ color: 'var(--color-primary-blue)' }}>
            Conoce a nuestros fundadores
          </h2>
          <p className="text-center text-base sm:text-lg md:text-xl mb-10 sm:mb-12 md:mb-16 px-4" style={{ color: 'var(--color-text-light)' }}>
            Las mentes detrás de cada experiencia inolvidable
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            {founders.map((founder, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFounder(idx)}
                className={`relative group transition-all duration-300 ${activeFounder === idx ? 'scale-105' : 'scale-100 opacity-60 hover:opacity-100'
                  }`}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 transition-opacity duration-300 ${activeFounder === idx
                    ? 'bg-gradient-to-t from-blue-900/90 to-transparent'
                    : 'bg-gradient-to-t from-black/60 to-transparent'
                    }`}></div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{founder.name}</h3>
                    <p className="text-xs sm:text-sm opacity-90">{founder.role}</p>
                  </div>

                  {activeFounder === idx && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: 'var(--color-primary-red)' }}></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Founder story card */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/50 shadow-2xl max-w-4xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-center"
              style={{ color: 'var(--color-text-dark)' }}>
              {founders[activeFounder].story}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {[
              { number: "50K+", label: "Viajeros Felices" },
              { number: "127", label: "Destinos" },
              { number: "98%", label: "Satisfacción" },
              { number: "24/7", label: "Soporte" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-block relative">
                  <div className="absolute inset-0 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ backgroundColor: idx % 2 === 0 ? 'var(--color-primary-blue)' : 'var(--color-primary-red)' }}>
                  </div>
                  <div className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3"
                    style={{ color: idx % 2 === 0 ? 'var(--color-primary-blue)' : 'var(--color-primary-red)' }}>
                    {stat.number}
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-lg font-medium px-2" style={{ color: 'var(--color-text-light)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 border border-white/50 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 md:mb-6" style={{ color: 'var(--color-primary-blue)' }}>
              Tu próxima aventura comienza aquí
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-9 md:mb-10 px-2" style={{ color: 'var(--color-text-light)' }}>
              Déjanos diseñar el viaje perfecto para ti. Sin complicaciones, sin estrés, solo experiencias increíbles.
            </p>
            <a
              href="/paquetes"
              className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full text-white text-sm sm:text-base md:text-lg font-semibold 
             transform hover:scale-105 transition-transform duration-300 shadow-xl"
              style={{ backgroundColor: 'var(--color-primary-red)' }}>
              Planifica tu viaje →
            </a>

          </div>
        </div>
      </section>
    </div>
  );
}
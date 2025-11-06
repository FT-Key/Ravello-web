// components/Home/PromotionsSection.jsx
import React from "react";

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
              backgroundImage:
                "url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800)",
              backgroundSize: "cover",
              backgroundPosition: "center",
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
              backgroundImage:
                "url(https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800)",
              backgroundSize: "cover",
              backgroundPosition: "center",
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

export default PromotionsSection;

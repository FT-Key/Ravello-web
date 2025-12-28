import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";

const PackageCarousel = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' o 'prev'

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await clientAxios.get("/packages/promotions", {
          params: {
            page: 1,
            limit: 12,
            sort: "-createdAt",
            search: "",
            searchFields: "nombre,descripcion",
          },
        });
        setPromos(response.data.items || []);
      } catch (error) {
        console.error("❌ Error al cargar promociones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promos.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, promos.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % promos.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const getCardStyle = (index) => {
    const position = (index - currentIndex + promos.length) % promos.length;
    
    if (position === 0) {
      // Card principal (al frente)
      if (isAnimating && direction === 'prev') {
        // Animación de salida hacia la derecha con rotación
        return {
          transform: 'translateX(200px) translateY(-30px) scale(0.8) rotateZ(15deg)',
          opacity: 0,
          zIndex: 60,
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        };
      }
      return {
        transform: 'translateX(0) translateY(0) scale(1) rotateZ(0deg)',
        opacity: 1,
        zIndex: 50,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === 1) {
      // Segunda card
      return {
        transform: 'translateX(60px) translateY(10px) scale(0.95) rotateZ(2deg)',
        opacity: 0.7,
        zIndex: 40,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === 2) {
      // Tercera card
      return {
        transform: 'translateX(100px) translateY(20px) scale(0.9) rotateZ(4deg)',
        opacity: 0.4,
        zIndex: 30,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 1 && isAnimating && direction === 'prev') {
      // Card que viene desde atrás en dirección prev
      return {
        transform: 'translateX(-100px) translateY(-20px) scale(0.85) rotateZ(-10deg)',
        opacity: 0,
        zIndex: 45,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else {
      // Cards ocultas
      return {
        transform: 'translateX(140px) translateY(30px) scale(0.85) rotateZ(6deg)',
        opacity: 0,
        zIndex: 20,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    }
  };

  if (loading) {
    return <p className="text-center py-8">Cargando promociones...</p>;
  }

  if (!promos.length) return null;

  return (
    <div className="mb-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Promociones Destacadas
        </h2>
        
        <div className="relative flex items-center justify-center min-h-[500px]">
          {/* Contenedor de cards apiladas */}
          <div className="relative w-full max-w-md h-[450px]">
            {promos.map((promo, index) => {
              const style = getCardStyle(index);
              const position = (index - currentIndex + promos.length) % promos.length;
              
              return (
                <div
                  key={promo._id}
                  className="absolute top-0 left-0 w-full"
                  style={style}
                >
                  <div 
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    onClick={position === 0 ? handleNext : undefined}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={promo.imagenPrincipal?.url}
                        alt={promo.nombre}
                        className="w-full h-64 object-cover"
                      />
                      {promo.oferta && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg">
                          {promo.oferta.split('-')[0].trim()}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2">
                        {promo.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {promo.descripcionCorta}
                      </p>
                      {promo.oferta && (
                        <p className="text-blue-600 font-semibold">{promo.oferta}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones de navegación */}
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-8">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setDirection(index > currentIndex ? 'next' : 'prev');
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 700);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-blue-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageCarousel;
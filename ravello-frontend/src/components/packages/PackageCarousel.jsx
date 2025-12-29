import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";

const PackageCarousel = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

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
        // Animación hacia la derecha con rotación 3D
        return {
          transform: 'translateX(300px) translateZ(-100px) rotateY(-25deg) scale(0.85)',
          opacity: 0,
          zIndex: 60,
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        };
      }
      return {
        transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 50,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === 1) {
      // Segunda card - hacia la derecha con efecto 3D
      return {
        transform: 'translateX(220px) translateZ(-150px) rotateY(-35deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 40,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === 2) {
      // Tercera card - más hacia la derecha
      return {
        transform: 'translateX(350px) translateZ(-250px) rotateY(-45deg) scale(0.75)',
        opacity: 0.35,
        zIndex: 30,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 1 && isAnimating && direction === 'prev') {
      // Card que viene desde la izquierda en dirección prev
      return {
        transform: 'translateX(-300px) translateZ(-100px) rotateY(25deg) scale(0.85)',
        opacity: 0,
        zIndex: 45,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 1) {
      // Última card (lado izquierdo)
      return {
        transform: 'translateX(-220px) translateZ(-150px) rotateY(35deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 40,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 2) {
      // Penúltima card
      return {
        transform: 'translateX(-350px) translateZ(-250px) rotateY(45deg) scale(0.75)',
        opacity: 0.35,
        zIndex: 30,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else {
      // Cards ocultas
      return {
        transform: 'translateX(450px) translateZ(-300px) rotateY(-50deg) scale(0.7)',
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
    <div className="mb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center">
          Promociones Destacadas
        </h2>
        
        <div className="relative flex items-center justify-center min-h-[450px] sm:min-h-[550px] lg:min-h-[650px]">
          {/* Contenedor 3D con perspectiva */}
          <div 
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-2xl h-[420px] sm:h-[520px] lg:h-[600px]"
            style={{ 
              perspective: '2000px',
              perspectiveOrigin: 'center center'
            }}
          >
            {promos.map((promo, index) => {
              const style = getCardStyle(index);
              const position = (index - currentIndex + promos.length) % promos.length;
              
              return (
                <div
                  key={promo._id}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
                  style={{
                    ...style,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div 
                    className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    onClick={position === 0 ? handleNext : undefined}
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                      <img
                        src={promo.imagenPrincipal?.url}
                        alt={promo.nombre}
                        className="w-full h-full object-cover"
                      />
                      {promo.oferta && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-600 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-lg">
                          {promo.oferta.split('-')[0].trim()}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">
                        {promo.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 line-clamp-2">
                        {promo.descripcionCorta}
                      </p>
                      {promo.oferta && (
                        <p className="text-sm sm:text-base lg:text-lg text-blue-600 font-semibold">
                          {promo.oferta}
                        </p>
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
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-gray-50 text-gray-800 p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-gray-50 text-gray-800 p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8 lg:mt-10">
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
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 sm:w-8 bg-blue-600' 
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
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
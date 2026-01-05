import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";

const PackageCarousel = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

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
    }, 5000); // Aumentado a 5s para dar más tiempo a interactuar

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

  const handleViewDetails = (packageId) => {
    navigate(`/paquetes/${packageId}`);
  };

  const getCardStyle = (index) => {
    const position = (index - currentIndex + promos.length) % promos.length;
    
    if (position === 0) {
      // Card principal (al frente)
      if (isAnimating && direction === 'prev') {
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
      return {
        transform: 'translateX(220px) translateZ(-150px) rotateY(-35deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 40,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === 2) {
      return {
        transform: 'translateX(350px) translateZ(-250px) rotateY(-45deg) scale(0.75)',
        opacity: 0.35,
        zIndex: 30,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 1 && isAnimating && direction === 'prev') {
      return {
        transform: 'translateX(-300px) translateZ(-100px) rotateY(25deg) scale(0.85)',
        opacity: 0,
        zIndex: 45,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 1) {
      return {
        transform: 'translateX(-220px) translateZ(-150px) rotateY(35deg) scale(0.88)',
        opacity: 0.65,
        zIndex: 40,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else if (position === promos.length - 2) {
      return {
        transform: 'translateX(-350px) translateZ(-250px) rotateY(45deg) scale(0.75)',
        opacity: 0.35,
        zIndex: 30,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    } else {
      return {
        transform: 'translateX(450px) translateZ(-300px) rotateY(-50deg) scale(0.7)',
        opacity: 0,
        zIndex: 20,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
              const isMainCard = position === 0;
              const isHovered = hoveredCard === index;
              
              return (
                <div
                  key={promo._id}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
                  style={{
                    ...style,
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => isMainCard && setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Imagen con overlay en hover */}
                    <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden group">
                      <img
                        src={promo.imagenPrincipal?.url}
                        alt={promo.nombre}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isMainCard && isHovered ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      
                      {/* Overlay oscuro en hover */}
                      <div 
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                          isMainCard && isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                      />

                      {/* Badge de oferta */}
                      {promo.oferta && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#E33D35] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-lg">
                          {promo.oferta.split('-')[0].trim()}
                        </div>
                      )}

                      {/* Botón "Ver Detalles" que aparece en hover - SOLO en card principal */}
                      {isMainCard && (
                        <div 
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(promo._id);
                            }}
                            className="bg-white text-[#1C77B7] px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-[#1C77B7] hover:text-white transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          >
                            <span className="text-sm sm:text-base">Ver Detalles</span>
                            <svg 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Información del paquete */}
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-[#333333]">
                        {promo.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-[#666666] mb-3 line-clamp-2">
                        {promo.descripcionCorta}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {promo.oferta && (
                          <p className="text-sm sm:text-base lg:text-lg text-[#1C77B7] font-semibold">
                            {promo.oferta}
                          </p>
                        )}
                        
                        {/* Botón secundario en la parte inferior - SOLO en card principal */}
                        {isMainCard && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(promo._id);
                            }}
                            className="text-[#1C77B7] hover:text-[#E33D35] font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors duration-200 group"
                          >
                            <span>Más info</span>
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </button>
                        )}
                      </div>
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
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-[#1C77B7] text-gray-800 hover:text-white p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-[#1C77B7] text-gray-800 hover:text-white p-2 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
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
                  ? 'w-6 sm:w-8 bg-[#1C77B7]' 
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-[#34B0D9]'
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
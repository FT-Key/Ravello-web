import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";

export default function PromotionsSection() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await clientAxios.get("/featured-promotions");

        const packages = data?.packages ?? [];

        if (packages.length === 0) {
          console.warn("[PromotionsSection] No hay promociones destacadas.");
          setPromos([]);
        } else {
          const processed = packages.map((pkg) => {
            const etiquetas = pkg.etiquetas || [];
            let etiquetasFinales = [];

            if (etiquetas.includes("Más vendido"))
              etiquetasFinales.push("Más vendido");

            const otras = etiquetas.filter((e) => e !== "Más vendido");
            if (otras.length > 0) {
              const random = otras[Math.floor(Math.random() * otras.length)];
              etiquetasFinales.push(random);
            }

            return { ...pkg, etiquetas: etiquetasFinales };
          });

          setPromos(processed);
        }

      } catch (err) {
        console.error("[PromotionsSection] ❌ Error al cargar promociones:", err);
        setPromos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index) => {
    // Solo permitir hover si no está en transición
    if (!isTransitioning) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setHoveredIndex(index);
      setIsTransitioning(true);
    }
  };

  const handleMouseLeave = () => {
    // Mantener el efecto por 500ms después de quitar el mouse
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      // Esperar a que termine la transición antes de permitir otro hover
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700); // Duración de la transición
    }, 500);
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <p className="text-gray-500">Cargando promociones...</p>
      </section>
    );
  }

  if (promos.length === 0) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
          Ofertas imperdibles
        </h2>
        <p className="text-lg text-gray-600">Próximamente ✨</p>
      </section>
    );
  }

  const getBadgeInfo = (tag) => {
    if (!tag) return null;

    switch (tag.toLowerCase()) {
      case "más vendido":
      case "mas vendido":
        return { label: "🔥 Más vendido", color: "bg-orange-500" };
      case "nuevo":
        return { label: "¡Nueva ruta!", color: "bg-yellow-500" };
      case "recomendado":
        return { label: "Recomendado", color: "bg-blue-600" };
      case "exclusivo":
        return { label: "Exclusivo", color: "bg-purple-600" };
      case "oferta":
        return { label: "¡OFERTA!", color: "bg-red-600" };
      default:
        return { label: tag, color: "bg-gray-600" };
    }
  };

  return (
    <section className="py-24 bg-sand-fade overflow-hidden relative">
      {/* Formas decorativas de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
           style={{ background: 'var(--color-primary-blue)' }}></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
           style={{ background: 'var(--color-secondary-cyan)' }}></div>
      
      {/* Líneas decorativas */}
      <div className="absolute top-20 right-10 w-64 h-1 opacity-20 transform rotate-45"
           style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary-red), transparent)' }}></div>
      <div className="absolute bottom-40 left-20 w-80 h-1 opacity-20 transform -rotate-12"
           style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary-blue), transparent)' }}></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header sin AOS */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 rounded-full mb-6"
               style={{ backgroundColor: 'var(--color-secondary-sand)', border: '2px solid var(--color-primary-blue)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary-blue)' }}>
              ✨ DESTACADOS DE LA TEMPORADA
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary-blue">
            Ofertas imperdibles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprovechá los mejores precios de temporada y viví experiencias inolvidables
          </p>
        </div>

        {/* Grid de promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:gap-8 gap-6 items-stretch">
          {promos.map((pkg, i) => {
            const badge = getBadgeInfo(pkg.etiquetas?.[0]);
            const isHovered = hoveredIndex === i;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <div
                key={pkg._id || pkg.id}
                className="cursor-pointer transition-all duration-700 ease-in-out lg:flex-1"
                style={{
                  flex: window.innerWidth >= 1024 ? (isHovered ? '1' : isOtherHovered ? '0' : '1') : 'none',
                  opacity: window.innerWidth >= 1024 ? (isOtherHovered ? 0 : 1) : 1,
                  transform: window.innerWidth >= 1024 ? (isOtherHovered ? 'scale(0.8)' : 'scale(1)') : 'scale(1)',
                  pointerEvents: window.innerWidth >= 1024 ? (isOtherHovered ? 'none' : 'auto') : 'auto',
                }}
                onMouseEnter={() => window.innerWidth >= 1024 && handleMouseEnter(i)}
                onMouseLeave={() => window.innerWidth >= 1024 && handleMouseLeave()}
                onClick={() => navigate(`/paquetes/${pkg._id || pkg.id}`)}
              >
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out group ${
                  isHovered && window.innerWidth >= 1024 ? 'shadow-[0_20px_80px_rgba(28,119,183,0.4)]' : ''
                }`}
                style={{
                  height: window.innerWidth >= 1024 ? (isHovered ? '550px' : '380px') : '400px'
                }}>
                  {/* Imagen de fondo */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      backgroundImage: `url(${pkg.imagenPrincipal?.url})`,
                    }}
                  />

                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isHovered && window.innerWidth >= 1024
                      ? 'bg-gradient-to-r from-black/85 via-black/70 to-black/50' 
                      : 'bg-gradient-to-t from-black/80 via-black/50 to-transparent'
                  }`} />

                  {/* Efecto de brillo en hover */}
                  {isHovered && window.innerWidth >= 1024 && (
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2.5s infinite'
                      }}
                    />
                  )}

                  {/* Contenido */}
                  <div className={`relative z-10 h-full p-6 md:p-8 lg:p-10 text-white transition-all duration-700 ease-in-out ${
                    isHovered && window.innerWidth >= 1024
                      ? 'flex flex-col lg:flex-row lg:items-center lg:justify-between' 
                      : 'flex flex-col justify-end'
                  }`}>
                    <div className={`transition-all duration-700 ease-in-out ${
                      isHovered && window.innerWidth >= 1024 ? 'lg:max-w-2xl' : 'w-full'
                    }`}>
                      {/* Badge */}
                      {badge && (
                        <div className={`${badge.color} inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg transition-all duration-500`}>
                          {badge.label}
                        </div>
                      )}

                      {/* Título */}
                      <h3 className={`font-bold mb-3 transition-all duration-700 ease-in-out ${
                        isHovered && window.innerWidth >= 1024 ? 'text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'
                      }`}>
                        {pkg.nombre}
                      </h3>

                      {/* Descripción corta */}
                      <p className={`text-base md:text-lg mb-4 transition-all duration-700 ease-in-out ${
                        isHovered && window.innerWidth >= 1024 ? 'lg:text-xl' : ''
                      }`}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: isHovered && window.innerWidth >= 1024 ? 2 : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {pkg.descripcionCorta}
                      </p>

                      {/* Descripción detallada (solo en hover en desktop) */}
                      {isHovered && window.innerWidth >= 1024 && pkg.descripcionDetallada && (
                        <p className="text-sm md:text-base text-gray-200 mb-4 overflow-hidden"
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 3,
                             WebkitBoxOrient: 'vertical',
                             animation: 'fadeInUp 0.6s ease-out'
                           }}>
                          {pkg.descripcionDetallada}
                        </p>
                      )}

                      {/* Detalles adicionales en hover */}
                      {isHovered && window.innerWidth >= 1024 && (
                        <div className="flex flex-wrap gap-3 md:gap-4 mb-6" 
                             style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
                          {pkg.duracionTotal > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full text-sm md:text-base">
                              <span>📅</span>
                              <span className="font-semibold">{pkg.duracionTotal} días</span>
                            </div>
                          )}
                          {pkg.destinos && pkg.destinos.length > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full text-sm md:text-base">
                              <span>📍</span>
                              <span className="font-semibold">
                                {pkg.destinos.slice(0, 2).map(d => d.ciudad).join(', ')}
                                {pkg.destinos.length > 2 && ` +${pkg.destinos.length - 2}`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Botón CTA */}
                      <button className={`rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold border-2 transition-all duration-300 ${
                        isHovered && window.innerWidth >= 1024
                          ? 'bg-primary-red border-primary-red text-white hover:bg-red-700 hover:border-red-700 shadow-xl'
                          : 'border-white bg-transparent text-white hover:bg-white hover:text-blue-900'
                      }`}>
                        {isHovered && window.innerWidth >= 1024 ? 'Ver todos los detalles →' : 'Ver detalle'}
                      </button>
                    </div>

                    {/* Precio (visible en hover en desktop) */}
                    {isHovered && window.innerWidth >= 1024 && (
                      <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0" 
                           style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 md:p-6 border border-white/30 min-w-[180px] md:min-w-[200px]">
                          <p className="text-xs md:text-sm text-gray-300 mb-1">Desde</p>
                          <p className="text-3xl md:text-4xl font-bold mb-2">
                            {pkg.moneda} ${pkg.precioBase?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Indicador de expansión (solo en desktop) */}
                  {!isHovered && window.innerWidth >= 1024 && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </section>
  );
}
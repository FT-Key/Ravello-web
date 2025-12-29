import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";
import "./PromotionsSection.css";

export default function PromotionsSection() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

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

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <p className="text-gray-500 no-select">Cargando promociones...</p>
      </section>
    );
  }

  if (promos.length === 0) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4 no-select">
          Ofertas imperdibles
        </h2>
        <p className="text-lg text-gray-600 no-select">Próximamente ✨</p>
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
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--color-primary-blue)" }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--color-secondary-cyan)" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div
            className="inline-block px-6 py-2 rounded-full mb-6 no-select"
            style={{
              backgroundColor: "var(--color-secondary-sand)",
              border: "2px solid var(--color-primary-blue)"
            }}
          >
            <span
              className="text-sm font-bold no-select"
              style={{ color: "var(--color-primary-blue)" }}
            >
              ✨ DESTACADOS DE LA TEMPORADA
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4 no-select"
            style={{ color: "var(--color-primary-blue)" }}>
            Ofertas imperdibles
          </h2>

          <p className="text-xl max-w-2xl mx-auto no-select"
            style={{ color: "var(--color-text-light)" }}>
            Aprovechá los mejores precios de temporada y viví experiencias
            inolvidables
          </p>
        </div>

        <div className="flex flex-col gap-16 relative">
          {promos.map((pkg, i) => {
            const badge = getBadgeInfo(pkg.etiquetas?.[0]);
            const isHovered = hoveredIndex === i;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={pkg._id || pkg.id}
                className="relative w-full"
                style={{ zIndex: 10 }}
              >
                {/* Figura decorativa de fondo - Sale desde el borde de la sección */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: 0,
                    bottom: 0,
                    [isLeft ? "left" : "right"]: "calc(-50vw + 50%)",
                    width: "70%",
                    background: i === 0
                      ? "linear-gradient(90deg, rgba(28,119,183,0.5), rgba(28,119,183,0.3), rgba(28,119,183,0.1), transparent)"
                      : "linear-gradient(270deg, rgba(227,61,53,0.5), rgba(227,61,53,0.3), rgba(227,61,53,0.1), transparent)",
                    clipPath: isLeft
                      ? "polygon(0 5%, 90% 12%, 85% 95%, 0 88%)"
                      : "polygon(10% 5%, 100% 12%, 100% 88%, 15% 95%)",
                    transition: "all 0.4s ease",
                    opacity: isHovered ? 1 : 0.7,
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    zIndex: -1
                  }}
                />

                {/* Card posicionada según el lado */}
                <div
                  className={`relative ${isLeft ? "ml-0 mr-auto" : "ml-auto mr-0"}`}
                  style={{ maxWidth: "900px" }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave()}
                  onClick={() => navigate(`/paquetes/${pkg._id || pkg.id}`)}
                >
                  <div
                    className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ease-out cursor-pointer ${
                      isHovered ? "shadow-2xl" : ""
                    }`}
                    style={{ height: "450px" }}
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out ${
                        isHovered ? "scale-105" : "scale-100"
                      }`}
                      style={{
                        backgroundImage: `url(${pkg.imagenPrincipal?.url})`
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

                    <div className="relative z-10 h-full p-8 text-white flex flex-col justify-between">
                      <div>
                        {badge && (
                          <div
                            className={`${badge.color} inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg no-select`}
                          >
                            {badge.label}
                          </div>
                        )}

                        <h3 className="text-4xl md:text-5xl font-bold mb-4 no-select">
                          {pkg.nombre}
                        </h3>

                        <p className="text-lg md:text-xl mb-6 max-w-2xl no-select opacity-90">
                          {pkg.descripcionCorta}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6">
                          {pkg.duracionTotal > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full no-select">
                              <span>📅</span>
                              <span className="font-semibold">
                                {pkg.duracionTotal} días
                              </span>
                            </div>
                          )}

                          {pkg.destinos && pkg.destinos.length > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full no-select">
                              <span>📍</span>
                              <span className="font-semibold">
                                {pkg.destinos
                                  .slice(0, 2)
                                  .map((d) => d.ciudad)
                                  .join(", ")}
                                {pkg.destinos.length > 2 &&
                                  ` +${pkg.destinos.length - 2}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between flex-wrap gap-4">
                        <button
                          className={`rounded-full px-8 py-3 font-bold transition-all duration-300 no-select ${
                            isHovered
                              ? "text-white shadow-xl"
                              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                          }`}
                          style={isHovered ? {
                            backgroundColor: "var(--color-primary-red)"
                          } : {}}
                        >
                          Ver detalles
                        </button>

                        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/30 min-w-[200px] text-right no-select">
                          <p className="text-sm text-gray-300 mb-1">Desde</p>
                          <p className="text-3xl md:text-4xl font-bold">
                            {pkg.moneda} ${pkg.precioBase?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
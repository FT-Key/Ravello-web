import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";

export default function PromotionsSection() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await clientAxios.get("/featured-promotions");

        // Validación segura
        const packages = data?.packages ?? [];

        if (packages.length === 0) {
          console.warn("[PromotionsSection] No hay promociones destacadas.");
          setPromos([]); // deja la sección como "próximamente"
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
        setPromos([]); // previene crash del render
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // 🔹 Mientras carga, mostramos un espacio vacío elegante
  if (loading) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <p className="text-gray-500">Cargando promociones...</p>
      </section>
    );
  }

  // 🔹 Si no hay promos → mostramos "PRÓXIMAMENTE"
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
    <section className="py-20 bg-secondary-sand">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Ofertas imperdibles
          </h2>
          <p className="text-lg text-gray-600">
            Aprovechá los mejores precios de temporada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((pkg, i) => {
            const badge = getBadgeInfo(pkg.etiquetas?.[0]);

            return (
              <div
                key={pkg._id || pkg.id}
                data-aos={i === 0 ? "fade-right" : "fade-left"}
                className="cursor-pointer"
                onClick={() => navigate(`/packages/${pkg._id || pkg.id}`)}
              >
                <div
                  className="rounded-3xl overflow-hidden shadow-xl relative h-80"
                  style={{
                    backgroundImage: `url(${pkg.imagenPrincipal})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                    {badge && (
                      <div
                        className={`${badge.color} inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 w-fit`}
                      >
                        {badge.label}
                      </div>
                    )}
                    <h3 className="text-3xl font-bold mb-2">{pkg.nombre}</h3>
                    <p className="text-lg mb-4">{pkg.descripcionCorta}</p>
                    <button className="w-fit rounded-full px-6 py-2 font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 transition-all">
                      Ver detalle
                    </button>
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

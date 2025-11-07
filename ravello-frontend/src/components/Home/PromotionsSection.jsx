import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PromotionsSection = () => {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/packages/promotions");
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();

        // Siempre incluir “Más vendido” y, si hay otra etiqueta, elegir una al azar.
        const processed = data.map(pkg => {
          const etiquetas = pkg.etiquetas || [];
          let etiquetasFinales = [];

          // Prioridad a “Más vendido”
          if (etiquetas.includes("Más vendido")) {
            etiquetasFinales.push("Más vendido");
          }

          // Si hay más de una etiqueta, elegir otra aleatoria distinta
          const otras = etiquetas.filter(e => e !== "Más vendido");
          if (otras.length > 0) {
            const random = otras[Math.floor(Math.random() * otras.length)];
            etiquetasFinales.push(random);
          }

          return { ...pkg, etiquetas: etiquetasFinales };
        });

        setPromos(processed);
      } catch (err) {
        console.error("Error al cargar promociones:", err);
        setError("No se pudieron cargar las promociones.");
      }
    };

    fetchPromotions();
  }, []);

  if (error) {
    return (
      <section className="py-20 bg-secondary-sand text-center">
        <p className="text-gray-600">{error}</p>
      </section>
    );
  }

  if (promos.length === 0) return null;

  // 🎯 Función para obtener el badge según la etiqueta
  const getBadgeInfo = (tag) => {
    if (!tag) return null;

    switch (tag.toLowerCase()) {
      case "más vendido":
      case "mas vendido":
        return { label: "🔥 Más vendido", color: "bg-orange-500" };
      case "nuevo":
        return { label: "¡Nueva ruta!", color: "bg-state-warning" };
      case "recomendado":
        return { label: "Recomendado", color: "bg-blue-600" };
      case "exclusivo":
        return { label: "Exclusivo", color: "bg-purple-600" };
      case "oferta":
        return { label: "¡OFERTA!", color: "bg-primary-red" };
      default:
        return { label: tag, color: "bg-gray-600" };
    }
  };

  // 🎨 Lógica para elegir etiquetas distintas entre las 2 primeras promos
  const getDisplayedTags = () => {
    if (promos.length < 2) return promos;

    const [first, second, ...rest] = promos;
    const firstTags = first.etiquetas || [];
    const secondTags = second.etiquetas || [];

    // Elegimos una etiqueta aleatoria de la primera
    const tag1 = firstTags.length
      ? firstTags[Math.floor(Math.random() * firstTags.length)]
      : null;

    let tag2 = null;

    if (secondTags.length > 1) {
      // Buscar una etiqueta distinta a la primera
      const diferentes = secondTags.filter(t => t !== tag1);
      if (diferentes.length > 0) {
        tag2 = diferentes[Math.floor(Math.random() * diferentes.length)];
      } else {
        tag2 = secondTags[0]; // todas iguales, usamos la misma
      }
    } else {
      tag2 = secondTags[0] || null;
    }

    // devolvemos nuevos paquetes con la etiqueta seleccionada
    return [
      { ...first, etiquetaSeleccionada: tag1 },
      { ...second, etiquetaSeleccionada: tag2 },
      ...rest
    ];
  };

  const promosToShow = getDisplayedTags();

  return (
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
          {promosToShow.map((pkg, i) => {
            const badge = getBadgeInfo(pkg.etiquetaSeleccionada);

            return (
              <div
                key={pkg.id}
                data-aos={i === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={100 * (i + 1)}
                className="cursor-pointer"
                onClick={() => navigate(`/packages/${pkg.id}`)}
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
};

export default PromotionsSection;

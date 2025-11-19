import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";
import DestinationCard from "./DestinationCard";

const FeaturedDestinations = () => {
  const [featuredSection, setFeaturedSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await clientAxios.get("/featured/active");

        if (data && data.items) {
          data.items.sort((a, b) => a.orden - b.orden);
        }

        setFeaturedSection(data);
      } catch (error) {
        console.error("Error al cargar destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background-white text-center">
        <p className="text-lg text-light">Cargando destinos destacados...</p>
      </section>
    );
  }

  if (!featuredSection || !featuredSection.items?.length) {
    return (
      <section className="py-20 bg-background-white text-center">
        <p className="text-lg text-light">
          No hay destinos destacados disponibles en este momento.
        </p>
      </section>
    );
  }

  const { tituloSeccion, descripcion, items } = featuredSection;

  return (
    <section className="py-20 bg-background-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            {tituloSeccion || "Destinos destacados"}
          </h2>
          {descripcion && <p className="text-lg text-light">{descripcion}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map(({ package: pkg }, idx) => {
            if (!pkg) return null;

            return (
              <DestinationCard
                key={pkg._id}
                id={pkg._id}   // ← agregado
                image={pkg.imagenPrincipal?.url}
                destination={pkg.nombre}
                country={pkg.tipo === "internacional" ? "Internacional" : "Nacional"}
                price={pkg.precioBase}
                rating={5}
                etiquetas={pkg.etiquetas || []}
                delay={idx * 100}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;

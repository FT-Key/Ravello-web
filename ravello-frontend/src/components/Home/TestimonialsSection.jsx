import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import Pagination from "../common/Pagination";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const itemsPerPage = 3;

  const fetchReviews = async (page = 1) => {
    try {
      const { data } = await clientAxios.get("/reviews", {
        params: {
          tipo: "empresa",
          estadoModeracion: "aprobada",
          page,
          limit: itemsPerPage,
        },
      });

      setReviews(data.items || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchReviews(page);
  };

  const avatarColors = [
    "bg-primary-blue",
    "bg-secondary-cyan",
    "bg-primary-red",
  ];

  return (
    <section className="py-20 bg-background-light relative overflow-hidden no-select">
      {/* Decorative subtle background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary-sand rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary-cyan/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block mb-4">
            <span className="text-primary-blue text-sm font-semibold tracking-wide uppercase">
              Testimonios
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-dark">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-lg text-light max-w-2xl mx-auto">
            Experiencias reales de clientes que confiaron en nosotros para vivir aventuras inolvidables
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-8 bg-background-white rounded-2xl shadow-lg">
              <Star size={48} className="mx-auto mb-4 text-border-subtle" />
              <p className="text-light font-medium">
                Aún no hay reseñas disponibles
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {reviews.map((r, idx) => (
                <div
                  key={r._id || idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                  className="group relative bg-background-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 opacity-5">
                      <Quote size={64} className="text-primary-blue" />
                    </div>

                    {/* Avatar and info */}
                    <div className="flex items-center mb-6 relative z-10">
                      <div
                        className={`w-14 h-14 rounded-full ${avatarColors[idx % 3]} flex items-center justify-center text-white text-lg font-semibold mr-4 shadow-md flex-shrink-0`}
                      >
                        {r.iniciales ||
                          (r.nombre ? r.nombre[0].toUpperCase() : "?")}
                      </div>

                      <div className="overflow-hidden flex-1 min-w-0">
                        <h4 className="font-bold text-dark text-base truncate">
                          {r.nombre}
                        </h4>

                        {r.paquete && (
                          <p className="text-sm text-light flex items-center mt-1">
                            <span className="w-1.5 h-1.5 bg-secondary-cyan rounded-full mr-2 flex-shrink-0"></span>
                            <span className="truncate">Paquete turístico</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`transition-all duration-300 ${
                            i < (r.calificacion || 0)
                              ? "fill-state-warning text-state-warning"
                              : "text-border-subtle"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-light leading-relaxed flex-grow relative z-10 text-sm break-words overflow-hidden">
                      <span className="line-clamp-6">"{r.comentario}"</span>
                    </p>

                    {/* Decorative bottom accent */}
                    <div className={`h-1 w-12 ${avatarColors[idx % 3]} rounded-full mt-6 transition-all duration-500`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
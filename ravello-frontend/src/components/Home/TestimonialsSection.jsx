import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
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

  return (
    <section className="py-20 bg-background-white no-select">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue no-select">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-lg text-light no-select">
            Miles de clientes satisfechos
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 no-select">
            Aún no hay reseñas disponibles.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r, idx) => (
                <div
                  key={r._id || idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                  className="rounded-2xl shadow-lg p-6 h-full bg-background-light no-select"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 bg-primary-blue no-select">
                      {r.iniciales ||
                        (r.nombre ? r.nombre[0].toUpperCase() : "?")}
                    </div>

                    <div>
                      <h4 className="font-bold mb-1 text-dark no-select">
                        {r.nombre}
                      </h4>

                      {r.paquete && (
                        <p className="text-sm text-light italic no-select">
                          Reseña sobre paquete
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex mb-3 no-select">
                    {[...Array(r.calificacion || 0)].map((_, i) => (
                      <Star key={i} size={18} fill="gold" color="gold" />
                    ))}
                  </div>

                  <p className="text-light no-select">"{r.comentario}"</p>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}

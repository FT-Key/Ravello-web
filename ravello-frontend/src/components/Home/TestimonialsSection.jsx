import React, { useEffect, useState, useMemo } from "react";
import { Star } from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import Pagination from "../common/Pagination";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Solo traemos reseñas aprobadas de tipo empresa
        const { data } = await clientAxios.get(
          "/reviews?tipo=empresa&estadoModeracion=aprobada"
        );
        setReviews(data);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      }
    };
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reviews.slice(start, start + itemsPerPage);
  }, [reviews, currentPage]);

  return (
    <section className="py-20 bg-background-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-blue">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-lg text-light">Miles de clientes satisfechos</p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            Aún no hay reseñas disponibles.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedReviews.map((r, idx) => (
                <div
                  key={r._id || idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                  className="rounded-2xl shadow-lg p-6 h-full bg-background-light"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 bg-primary-blue">
                      {r.iniciales || (r.nombre ? r.nombre[0].toUpperCase() : "?")}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-dark">{r.nombre}</h4>
                      {r.paquete && (
                        <p className="text-sm text-light italic">
                          Reseña sobre paquete
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(r.calificacion || 0)].map((_, i) => (
                      <Star key={i} size={18} fill="gold" color="gold" />
                    ))}
                  </div>

                  <p className="text-light">"{r.comentario}"</p>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
}

import React from "react";
import { Star, User } from "lucide-react";

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-light">Cargando opiniones...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-light">
          Aún no hay opiniones. ¡Sé el primero en compartir tu experiencia!
        </p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="p-4 bg-background-light rounded-xl border border-border-subtle hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {/* Avatar con iniciales */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-lg">
                {review.iniciales || review.nombre?.substring(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-dark">{review.nombre}</h4>
                  <p className="text-xs text-light">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                {renderStars(review.calificacion)}
              </div>

              {review.comentario && (
                <p className="text-sm text-light leading-relaxed">
                  {review.comentario}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Importar el ícono que faltaba
import { MessageSquare } from "lucide-react";

export default ReviewList;
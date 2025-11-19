import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  Utensils,
  Car,
  Camera,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";
import api from "../../api/axiosConfig";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewList from "../../components/reviews/ReviewList";

export default function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({ avg: 0, total: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/packages/${id}`);
        setPkg(response.data);
        setSelectedImage(0); // siempre comienza mostrando la principal
      } catch (err) {
        console.error("❌ Error al cargar el paquete:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await api.get("/reviews", {
          params: {
            paquete: id,
            estadoModeracion: "aprobada",
            limit: 10,
          },
        });

        const reviewItems = response.data.items || [];
        setReviews(reviewItems);

        if (reviewItems.length > 0) {
          const total = reviewItems.length;
          const sum = reviewItems.reduce((acc, r) => acc + r.calificacion, 0);
          const avg = (sum / total).toFixed(1);
          setReviewStats({ avg: parseFloat(avg), total });
        }
      } catch (err) {
        console.error("❌ Error al cargar reseñas:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-light">Cargando paquete...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Paquete no encontrado</h2>
          <Link to="/paquetes" className="text-primary-blue hover:underline">
            Volver a paquetes
          </Link>
        </div>
      </div>
    );
  }

  const renderEtiqueta = (etiqueta) => {
    const styles = {
      oferta: "bg-red-500 text-white",
      nuevo: "bg-green-500 text-white",
      "mas vendido": "bg-blue-500 text-white",
      recomendado: "bg-purple-500 text-white",
      exclusivo: "bg-yellow-500 text-dark",
    };

    return (
      <span
        key={etiqueta}
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${styles[etiqueta] || "bg-gray-500 text-white"
          }`}
      >
        {etiqueta}
      </span>
    );
  };

  // Lista de imágenes para thumbnails: principal primero
  const allImages = [
    pkg.imagenPrincipal,
    ...(pkg.imagenes || []).filter((img) => img.url !== pkg.imagenPrincipal?.url),
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header con breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/paquetes"
                className="flex items-center gap-2 text-light hover:text-primary-blue transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver a paquetes</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all ${isFavorite
                    ? "bg-red-50 text-red-500"
                    : "bg-background-light text-light hover:bg-gray-200"
                  }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button className="p-2 rounded-full bg-background-light text-light hover:bg-gray-200 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Galería de imágenes */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Imagen principal */}
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
              <img
                src={allImages[selectedImage]?.url || "/placeholder-package.jpg"}
                alt={pkg.nombre}
                className="w-full h-full object-cover"
              />

              {pkg.etiquetas && pkg.etiquetas.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {pkg.etiquetas.map(renderEtiqueta)}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-36 lg:h-60 rounded-xl overflow-hidden cursor-pointer transition-all ${selectedImage === idx
                      ? "ring-4 ring-primary-blue"
                      : "hover:opacity-80"
                    }`}
                >
                  <img
                    src={img.url}
                    alt={`${pkg.nombre} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* resto del componente queda igual ... */}
      </div>
    </div>
  );
}

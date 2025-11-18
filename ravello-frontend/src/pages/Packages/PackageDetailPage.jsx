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
        setSelectedImage(0);
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

        // Calcular estadísticas
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

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Opcional: recargar las reviews
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
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
          styles[etiqueta] || "bg-gray-500 text-white"
        }`}
      >
        {etiqueta}
      </span>
    );
  };

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
                className={`p-2 rounded-full transition-all ${
                  isFavorite
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
                src={pkg.imagenes?.[selectedImage] || "/placeholder-package.jpg"}
                alt={pkg.titulo}
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
              {pkg.imagenes?.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-36 lg:h-60 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedImage === idx
                      ? "ring-4 ring-primary-blue"
                      : "hover:opacity-80"
                  }`}
                >
                  <img src={img} alt={`${pkg.titulo} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título y descripción */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-dark mb-2">{pkg.titulo}</h1>
              <div className="flex items-center gap-4 text-light mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-primary-blue" />
                  <span className="text-sm">
                    {pkg.destinos?.map((d) => d.ciudad).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{reviewStats.avg || "Sin calificación"}</span>
                  <span className="text-sm">({reviewStats.total} {reviewStats.total === 1 ? 'opinión' : 'opiniones'})</span>
                </div>
              </div>
              <p className="text-light leading-relaxed">{pkg.descripcion}</p>
            </div>

            {/* Destinos */}
            {pkg.destinos && pkg.destinos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                  <MapPin className="text-primary-blue" />
                  Destinos incluidos
                </h2>
                <div className="space-y-4">
                  {pkg.destinos.map((destino, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 bg-background-light rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="bg-primary-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark mb-1">
                          {destino.ciudad}
                          {destino.pais && `, ${destino.pais}`}
                        </h3>
                        {destino.descripcion && (
                          <p className="text-sm text-light mb-2">{destino.descripcion}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-light">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{destino.diasEstadia} días</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hotel size={16} />
                            <span>{destino.nochesHospedaje} noches</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios incluidos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-dark mb-4">Servicios incluidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.serviciosIncluidos?.vuelo && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Vuelo incluido</p>
                      <p className="text-sm text-light">Ida y vuelta</p>
                    </div>
                  </div>
                )}
                {pkg.serviciosIncluidos?.hospedaje && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Hospedaje</p>
                      <p className="text-sm text-light">{pkg.serviciosIncluidos.tipoHospedaje || "Hotel"}</p>
                    </div>
                  </div>
                )}
                {pkg.serviciosIncluidos?.alimentacion && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Alimentación</p>
                      <p className="text-sm text-light">{pkg.serviciosIncluidos.regimenAlimenticio || "Incluida"}</p>
                    </div>
                  </div>
                )}
                {pkg.serviciosIncluidos?.traslados && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Traslados</p>
                      <p className="text-sm text-light">Aeropuerto - Hotel</p>
                    </div>
                  </div>
                )}
                {pkg.serviciosIncluidos?.tours && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Tours guiados</p>
                      <p className="text-sm text-light">Excursiones incluidas</p>
                    </div>
                  </div>
                )}
                {pkg.serviciosIncluidos?.seguro && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-dark">Seguro de viaje</p>
                      <p className="text-sm text-light">Cobertura completa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerario */}
            {pkg.itinerario && pkg.itinerario.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                  <Calendar className="text-primary-blue" />
                  Itinerario detallado
                </h2>
                <div className="space-y-4">
                  {pkg.itinerario.map((dia, idx) => (
                    <div key={idx} className="border-l-4 border-primary-blue pl-4 py-2">
                      <h3 className="font-semibold text-dark mb-1">
                        Día {dia.dia}: {dia.titulo}
                      </h3>
                      <p className="text-sm text-light">{dia.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opiniones */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
                  <MessageSquare className="text-primary-blue" />
                  Opiniones de viajeros
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold"
                >
                  {showReviewForm ? "Cancelar" : "Dejar opinión"}
                </button>
              </div>

              {/* Formulario de opinión */}
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm packageId={id} onSuccess={handleReviewSubmitted} />
                </div>
              )}

              {/* Lista de opiniones */}
              <ReviewList reviews={reviews} loading={reviewsLoading} />
            </div>
          </div>

          {/* Sidebar - Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-light mb-1">Precio por persona desde</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary-blue">
                    ${pkg.precioBase?.toLocaleString()}
                  </span>
                  <span className="text-light">ARS</span>
                </div>
              </div>

              {/* Información del paquete */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border-subtle">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <Clock size={16} />
                    <span>Duración</span>
                  </div>
                  <span className="font-semibold text-dark">
                    {pkg.destinos?.reduce((sum, d) => sum + (d.diasEstadia || 0), 0) || 0} días
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <Users size={16} />
                    <span>Tipo</span>
                  </div>
                  <span className="font-semibold text-dark capitalize">{pkg.tipo || "Internacional"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <Calendar size={16} />
                    <span>Disponibilidad</span>
                  </div>
                  <span className="font-semibold text-green-600">Disponible</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Link
                  to={`/contacto?paquete=${pkg._id}`}
                  className="w-full block text-center px-6 py-3 bg-primary-red text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                  Reservar ahora
                </Link>
                <Link
                  to={`/contacto?paquete=${pkg._id}&consulta=true`}
                  className="w-full block text-center px-6 py-3 border-2 border-primary-blue text-primary-blue font-semibold rounded-lg hover:bg-primary-blue hover:text-white transition-all"
                >
                  Consultar disponibilidad
                </Link>
              </div>

              {/* Contacto rápido */}
              <div className="mt-6 pt-6 border-t border-border-subtle">
                <p className="text-sm text-light mb-3 text-center">
                  ¿Necesitas ayuda? Contáctanos
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+5491123456789"
                    className="flex items-center justify-center gap-2 text-sm text-primary-blue hover:underline"
                  >
                    <Plane size={16} />
                    <span>+54 911 2345-6789</span>
                  </a>
                  <a
                    href="mailto:info@ravello.com"
                    className="flex items-center justify-center gap-2 text-sm text-primary-blue hover:underline"
                  >
                    <span>info@ravello.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
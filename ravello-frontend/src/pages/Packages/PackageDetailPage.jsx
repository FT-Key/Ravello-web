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
  AlertCircle,
} from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewList from "../../components/reviews/ReviewList";

export default function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [packageDates, setPackageDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datesLoading, setDatesLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({ avg: 0, total: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch del paquete
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await clientAxios.get(`/packages/${id}`);
        console.log("Paquete: ", response?.data);
        setPkg(response?.data?.data);
        setSelectedImage(0);
      } catch (err) {
        console.error("❌ Error al cargar el paquete:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // Fetch de las fechas disponibles
  useEffect(() => {
    const fetchPackageDates = async () => {
      try {
        setDatesLoading(true);
        const response = await clientAxios.get(`/package-dates/by-package/${id}`, {
          params: {
            estado: "disponible",
            sort: "salida:asc",
          },
        });

        console.log(response)
        
        const dates = response.data.items || response.data || [];
        setPackageDates(dates);
        
        // Seleccionar la primera fecha por defecto
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        console.error("❌ Error al cargar fechas:", err);
      } finally {
        setDatesLoading(false);
      }
    };

    if (id) fetchPackageDates();
  }, [id]);

  // Fetch de reseñas
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await clientAxios.get("/reviews", {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
          <h2 className="text-2xl font-bold text-dark mb-4">
            Paquete no encontrado
          </h2>
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

  // Lista de imágenes para thumbnails: principal primero
  const allImages = [
    pkg.imagenPrincipal,
    ...(pkg.imagenes || []).filter(
      (img) => img.url !== pkg.imagenPrincipal?.url
    ),
  ];

  console.log("AllImages: ", allImages)

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
                src={
                  allImages[selectedImage]?.url || "/placeholder-package.jpg"
                }
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
              {allImages.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-36 lg:h-60 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedImage === idx
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título y descripción */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-dark mb-2">
                {pkg.nombre}
              </h1>
              <div className="flex items-center gap-4 text-light mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={18} className="text-primary-blue" />
                  <span className="text-sm">
                    {pkg.destinos?.map((d) => d.ciudad).join(", ")}
                  </span>
                </div>
                {reviewStats.total > 0 && (
                  <div className="flex items-center gap-1">
                    <Star
                      size={18}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-sm font-semibold">
                      {reviewStats.avg}
                    </span>
                    <span className="text-sm">
                      ({reviewStats.total}{" "}
                      {reviewStats.total === 1 ? "opinión" : "opiniones"})
                    </span>
                  </div>
                )}
              </div>
              
              {pkg.descripcionCorta && (
                <p className="text-lg text-dark mb-3 font-medium">
                  {pkg.descripcionCorta}
                </p>
              )}
              
              {pkg.descripcion && (
                <p className="text-light leading-relaxed">{pkg.descripcion}</p>
              )}
              
              {pkg.descripcionDetallada && (
                <p className="text-light leading-relaxed mt-3">
                  {pkg.descripcionDetallada}
                </p>
              )}
            </div>

            {/* Destinos */}
            {pkg.destinos && pkg.destinos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                  <MapPin className="text-primary-blue" />
                  Destinos incluidos ({pkg.duracionTotal || 0} días totales)
                </h2>
                <div className="space-y-4">
                  {pkg.destinos.map((destino, idx) => (
                    <div
                      key={idx}
                      className="border border-border-subtle rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-dark text-lg mb-2">
                            {destino.ciudad}
                            {destino.pais && `, ${destino.pais}`}
                          </h3>
                          
                          {destino.descripcion && (
                            <p className="text-sm text-light mb-3">
                              {destino.descripcion}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-light mb-3">
                            <div className="flex items-center gap-1">
                              <Clock size={16} className="text-primary-blue" />
                              <span className="font-medium">
                                {destino.diasEstadia} días
                              </span>
                            </div>
                          </div>

                          {/* Hospedaje del destino */}
                          {destino.hospedaje && (
                            <div className="bg-background-light rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Hotel size={16} className="text-primary-blue" />
                                <h4 className="font-semibold text-dark text-sm">
                                  {destino.hospedaje.nombre}
                                </h4>
                              </div>
                              {destino.hospedaje.categoria && (
                                <p className="text-xs text-light mb-1">
                                  {destino.hospedaje.categoria}
                                </p>
                              )}
                              {destino.hospedaje.ubicacion && (
                                <p className="text-xs text-light mb-2">
                                  📍 {destino.hospedaje.ubicacion}
                                </p>
                              )}
                              {destino.hospedaje.caracteristicas &&
                                destino.hospedaje.caracteristicas.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {destino.hospedaje.caracteristicas.map(
                                      (c, i) => (
                                        <span
                                          key={i}
                                          className="text-xs bg-white px-2 py-1 rounded"
                                        >
                                          {c}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                              {destino.hospedaje.gastronomia && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="flex items-center gap-1 text-xs">
                                    <Utensils size={14} className="text-primary-blue" />
                                    <span className="font-medium capitalize">
                                      {destino.hospedaje.gastronomia.pension}
                                    </span>
                                  </div>
                                  {destino.hospedaje.gastronomia.descripcion && (
                                    <p className="text-xs text-light mt-1">
                                      {destino.hospedaje.gastronomia.descripcion}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actividades del destino */}
                          {destino.actividades &&
                            destino.actividades.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-semibold text-dark text-sm flex items-center gap-1">
                                  <Camera size={16} className="text-primary-blue" />
                                  Actividades
                                </h4>
                                {destino.actividades.map((act, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <CheckCircle
                                      size={16}
                                      className="text-green-600 flex-shrink-0 mt-0.5"
                                    />
                                    <div>
                                      <p className="font-medium text-dark">
                                        {act.nombre}
                                      </p>
                                      {act.descripcion && (
                                        <p className="text-xs text-light">
                                          {act.descripcion}
                                        </p>
                                      )}
                                      {act.duracion && (
                                        <p className="text-xs text-light">
                                          Duración: {act.duracion}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traslados */}
            {pkg.traslado && pkg.traslado.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                  <Plane className="text-primary-blue" />
                  Traslados
                </h2>
                <div className="space-y-3">
                  {pkg.traslado.map((t, idx) => (
                    <div
                      key={idx}
                      className="border border-border-subtle rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary-blue text-white rounded-lg px-3 py-1 text-sm font-semibold capitalize">
                          {t.tipo}
                        </div>
                        {t.compania && (
                          <span className="text-sm text-light">
                            {t.compania}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {t.salida && (
                          <div>
                            <p className="text-light mb-1">Salida</p>
                            <p className="font-medium text-dark">
                              {t.salida.lugar}
                            </p>
                            {t.salida.hora && (
                              <p className="text-xs text-light">{t.salida.hora}</p>
                            )}
                          </div>
                        )}
                        {t.llegada && (
                          <div>
                            <p className="text-light mb-1">Llegada</p>
                            <p className="font-medium text-dark">
                              {t.llegada.lugar}
                            </p>
                            {t.llegada.hora && (
                              <p className="text-xs text-light">
                                {t.llegada.hora}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {t.descripcion && (
                        <p className="text-sm text-light mt-2">{t.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actividades generales */}
            {pkg.actividades && pkg.actividades.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                  <Camera className="text-primary-blue" />
                  Actividades incluidas
                </h2>
                <div className="space-y-3">
                  {pkg.actividades.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-background-light rounded-lg"
                    >
                      <CheckCircle
                        className="text-green-600 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold text-dark mb-1">
                          {act.nombre}
                        </h3>
                        {act.descripcion && (
                          <p className="text-sm text-light mb-1">
                            {act.descripcion}
                          </p>
                        )}
                        {act.duracion && (
                          <p className="text-xs text-light">
                            Duración: {act.duracion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinadores */}
            {pkg.coordinadores && pkg.coordinadores.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  Coordinadores del viaje
                </h2>
                <div className="space-y-3">
                  {pkg.coordinadores.map((coord, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-background-light rounded-lg"
                    >
                      <Users
                        className="text-primary-blue flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold text-dark">
                          {coord.nombre}
                        </h3>
                        {coord.telefono && (
                          <p className="text-sm text-light">📞 {coord.telefono}</p>
                        )}
                        {coord.email && (
                          <p className="text-sm text-light">✉️ {coord.email}</p>
                        )}
                      </div>
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

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    packageId={id}
                    onSuccess={handleReviewSubmitted}
                  />
                </div>
              )}

              <ReviewList reviews={reviews} loading={reviewsLoading} />
            </div>
          </div>

          {/* Sidebar - Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-light mb-1">Precio desde</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary-blue">
                    ${pkg.precioBase?.toLocaleString()}
                  </span>
                  <span className="text-light">{pkg.moneda || "ARS"}</span>
                </div>
                {pkg.descuentoNinos > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {pkg.descuentoNinos}% descuento para niños
                  </p>
                )}
              </div>

              {/* Fechas disponibles */}
              {datesLoading ? (
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <p className="text-sm text-light">Cargando fechas...</p>
                </div>
              ) : packageDates.length > 0 ? (
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <label className="text-sm font-semibold text-dark mb-2 block">
                    Selecciona tu fecha de salida
                  </label>
                  <select
                    value={selectedDate?._id || ""}
                    onChange={(e) => {
                      const date = packageDates.find(
                        (d) => d._id === e.target.value
                      );
                      setSelectedDate(date);
                    }}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  >
                    {packageDates.map((date) => (
                      <option key={date._id} value={date._id}>
                        {formatDate(date.salida)} - {formatDate(date.regreso)}
                      </option>
                    ))}
                  </select>

                  {selectedDate && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-light">Precio final:</span>
                        <span className="font-bold text-primary-blue text-lg">
                          ${selectedDate.precioFinal?.toLocaleString()}{" "}
                          {selectedDate.moneda}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-light">Cupos disponibles:</span>
                        <span className="font-semibold text-dark">
                          {selectedDate.cuposDisponibles}
                        </span>
                      </div>
                      {selectedDate.cuposDisponibles < 5 && (
                        <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          <AlertCircle size={14} />
                          <span>¡Últimos {selectedDate.cuposDisponibles} cupos!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <div className="flex items-center gap-2 text-sm text-light bg-gray-50 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <span>No hay fechas disponibles en este momento</span>
                  </div>
                </div>
              )}

              {/* Información del paquete */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border-subtle">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <Clock size={16} />
                    <span>Duración</span>
                  </div>
                  <span className="font-semibold text-dark">
                    {pkg.duracionTotal || 0} días
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <MapPin size={16} />
                    <span>Tipo</span>
                  </div>
                  <span className="font-semibold text-dark capitalize">
                    {pkg.tipo || "Internacional"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-light">
                    <DollarSign size={16} />
                    <span>Seña</span>
                  </div>
                  <span className="font-semibold text-dark">
                    ${pkg.montoSenia?.toLocaleString()}
                  </span>
                </div>
                {pkg.plazoPagoTotalDias && (
                  <div className="text-xs text-light mt-2">
                    Plazo de pago total: {pkg.plazoPagoTotalDias} días antes de la salida
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Link
                  to={`/contacto?paquete=${pkg._id}${
                    selectedDate ? `&fecha=${selectedDate._id}` : ""
                  }`}
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
// pages/PackageDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import { useUserProfile } from "../../hooks/useUserProfile";
import PackageHeader from "../../components/packageDetail/PackageHeader.jsx";
import PackageGallery from "../../components/packageDetail/PackageGallery.jsx";
import PackageInfo from "../../components/packageDetail/PackageInfo.jsx";
import PackageItinerary from "../../components/packageDetail/PackageItinerary.jsx";
import PackageInclusions from "../../components/packageDetail/PackageInclusions.jsx";
import PackageCoordinators from "../../components/packageDetail/PackageCoordinators.jsx";
import PackageReviews from "../../components/packageDetail/PackageReviews.jsx";
import PackageBookingSidebar from "../../components/packageDetail/PackageBookingSidebar.jsx";
import CompleteProfileModal from "../../components/packageDetail/CompleteProfileModal.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import NotFound from "../../components/common/NotFound.jsx";
import { useBookingValidation } from "../../hooks/useBookingValidation";

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hook de perfil de usuario
  const { userProfile, loading: profileLoading, isAuthenticated, canBook, camposFaltantes, refreshProfile } = useUserProfile();

  // Hook de validación de reservas
  const { checking: checkingBooking, existingBooking, checkExistingBooking, clearExistingBooking } = useBookingValidation();

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
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Estado del modal de completar perfil
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

  // Fetch del paquete
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await clientAxios.get(`/packages/${id}`);
        setPkg(response?.data?.data);
        setSelectedImage(0);
      } catch (err) {
        console.error("❌ Error al cargar el paquete:", err);
        toast.error("No pudimos cargar el paquete. Por favor, intenta nuevamente.");
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

        const dates = response.data.items || response.data || [];
        setPackageDates(dates);

        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        console.error("❌ Error al cargar fechas:", err);
        toast.error("No pudimos cargar las fechas disponibles.");
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
        // No mostramos toast aquí porque las reseñas no son críticas
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // Manejar inicio del proceso de reserva
  const handleInitiateBooking = async (bookingData) => {
    // 1. Verificar autenticación
    if (!isAuthenticated) {
      toast.error('Necesitas iniciar sesión para hacer una reserva', {
        duration: 3000,
        icon: '🔒'
      });
      navigate('/login', {
        state: {
          from: `/paquetes/${id}`,
          message: 'Inicia sesión para continuar con tu reserva'
        }
      });
      return;
    }

    // 2. Verificar perfil completo
    if (!canBook) {
      setShowCompleteProfileModal(true);
      toast('Por favor completa tu perfil para continuar', {
        icon: '📋',
        duration: 3000
      });
      return;
    }

    // 3. Verificar si ya tiene una reserva activa para este paquete
    const toastId = toast.loading('Verificando disponibilidad...');

    try {
      const reserva = await checkExistingBooking(id);

      if (reserva) {
        toast.error(
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Ya tienes una reserva activa</p>
            <p className="text-sm">Reserva: {reserva.numeroReserva}</p>
            <p className="text-sm">Estado: {reserva.estado}</p>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                navigate('/mis-reservas');
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Ver mis reservas
            </button>
          </div>,
          {
            id: toastId,
            duration: 6000,
            icon: '⚠️'
          }
        );
        return;
      }

      toast.dismiss(toastId);

      // 4. Si todo está bien, proceder con el pago
      handlePayment(bookingData);

    } catch (error) {
      toast.error('Error al verificar reservas', { id: toastId });
    }
  };

  // Manejar proceso de pago (solo se ejecuta si el perfil está completo)
  const handlePayment = async (bookingData) => {
    if (!selectedDate) {
      toast.error("Selecciona una fecha de salida para continuar", {
        icon: '📅'
      });
      return;
    }

    const toastId = toast.loading('Procesando tu reserva...');

    try {
      setPaymentLoading(true);

      console.log("📦 Datos de reserva recibidos:", JSON.stringify(bookingData, null, 2));

      // 1. Crear la reserva
      console.log("📝 Creando reserva...");
      const bookingResponse = await clientAxios.post("/bookings", {
        paqueteId: bookingData.paqueteId,
        fechaSalidaId: bookingData.fechaSalidaId,
        cantidadPasajeros: bookingData.cantidadPasajeros
      });

      const reserva = bookingResponse.data.data;
      console.log("✅ Reserva creada:", reserva);

      toast.success('Reserva creada exitosamente', { id: toastId });

      // 2. Crear preferencia de pago en MercadoPago
      console.log("💳 Creando preferencia de pago...");
      const paymentResponse = await clientAxios.post("/payments/mercadopago/preference", {
        reservaId: reserva._id,
        montoPago: reserva.montoTotal,
        tipoPago: 'total',
      });

      const { initPoint } = paymentResponse.data.data;
      console.log("✅ Preferencia creada");

      // 3. Redirigir a MercadoPago
      console.log("🔄 Redirigiendo a MercadoPago...");
      toast.success('Redirigiendo a MercadoPago...', {
        id: toastId,
        duration: 2000
      });

      setTimeout(() => {
        window.location.href = initPoint;
      }, 500);

    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Respuesta del servidor:", error.response?.data);
      console.error("❌ Status:", error.response?.status);

      // Mensajes de error amigables según el tipo de error
      let errorMessage = "Hubo un problema al procesar tu reserva. Por favor, intenta nuevamente.";

      if (error.response?.status === 401) {
        errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      } else if (error.response?.status === 400) {
        errorMessage = "Algunos datos de la reserva son incorrectos. Verifica e intenta nuevamente.";
      } else if (error.response?.status === 404) {
        errorMessage = "El paquete o la fecha seleccionada ya no está disponible.";
      } else if (error.response?.status === 409) {
        errorMessage = "No hay suficientes cupos disponibles para esta fecha.";
      } else if (error.response?.data?.message) {
        // Si el backend envía un mensaje específico y es legible, úsalo
        const backendMsg = error.response.data.message;
        if (!backendMsg.includes('undefined') && !backendMsg.includes('null')) {
          errorMessage = backendMsg;
        }
      }

      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handler cuando el perfil se completa exitosamente
  const handleProfileCompleted = (updatedProfile) => {
    console.log('✅ Perfil completado:', updatedProfile);
    setShowCompleteProfileModal(false);
    refreshProfile();
    toast.success('¡Perfil completado! Ahora puedes continuar con tu reserva.', {
      icon: '✅',
      duration: 3000
    });
  };

  // Redirigir a página de contacto
  const handleContact = () => {
    navigate("/contacto", {
      state: {
        asunto: `Consulta sobre: ${pkg.nombre}`,
        paqueteId: id,
        fechaId: selectedDate?._id
      }
    });
  };

  if (loading || profileLoading) {
    return <LoadingSpinner message="Cargando paquete..." />;
  }

  if (!pkg) {
    return <NotFound message="Paquete no encontrado" linkText="Volver a paquetes" linkTo="/paquetes" />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <PackageHeader
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PackageGallery
          pkg={pkg}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PackageInfo pkg={pkg} reviewStats={reviewStats} />
            <PackageItinerary pkg={pkg} />
            <PackageInclusions pkg={pkg} />
            <PackageCoordinators pkg={pkg} />
            <PackageReviews packageId={id} reviews={reviews} reviewsLoading={reviewsLoading} />
          </div>

          <div className="lg:col-span-1">
            <PackageBookingSidebar
              pkg={pkg}
              packageDates={packageDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              datesLoading={datesLoading}
              onPayment={handleInitiateBooking}
              onContact={handleContact}
              paymentLoading={paymentLoading}
              isAuthenticated={isAuthenticated}
              canBook={canBook}
              existingBooking={existingBooking}
              checkingBooking={checkingBooking}
            />
          </div>
        </div>
      </div>

      {/* Modal para completar perfil */}
      <CompleteProfileModal
        isOpen={showCompleteProfileModal}
        onClose={() => setShowCompleteProfileModal(false)}
        onProfileCompleted={handleProfileCompleted}
        camposFaltantes={camposFaltantes}
        userProfile={userProfile}
      />
    </div>
  );
}
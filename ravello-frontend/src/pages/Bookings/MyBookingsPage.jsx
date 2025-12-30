// pages/Bookings/MyBookingsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MessageCircle,
  DollarSign
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("todas");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await clientAxios.get("/bookings/mis-reservas");
      const bookingsData = response.data.data || [];
      
      // Debug: ver qué datos estamos recibiendo
      console.log("📦 Bookings recibidas:", bookingsData);
      if (bookingsData.length > 0) {
        console.log("📅 Primera booking fechaSalida:", bookingsData[0].fechaSalida);
      }
      
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("No pudimos cargar tus reservas. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pendiente: {
        label: "Pendiente",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200"
      },
      confirmada: {
        label: "Confirmada",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200"
      },
      pagada_completa: {
        label: "Pagada",
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200"
      },
      en_proceso_pago: {
        label: "En Proceso",
        icon: CreditCard,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200"
      },
      vencida: {
        label: "Vencida",
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200"
      },
      cancelada: {
        label: "Cancelada",
        icon: XCircle,
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200"
      },
      completada: {
        label: "Completada",
        icon: CheckCircle,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200"
      }
    };
    return configs[status] || configs.pendiente;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) return "N/A";
      
      return dateObj.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "America/Argentina/Buenos_Aires"
      });
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "N/A";
    }
  };

  const formatCurrency = (amount, currency = "ARS") => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "todas") return true;
    if (statusFilter === "activas") {
      return ["pendiente", "confirmada", "en_proceso_pago", "pagada_completa"].includes(booking.estado);
    }
    return booking.estado === statusFilter;
  });

  const handleViewDetails = (bookingId) => {
    navigate(`/mis-reservas/${bookingId}`);
  };

  const handlePay = (booking) => {
    toast.success("Redirigiendo al sistema de pagos...");
    // Payment logic here
  };

  const handleCancel = async (bookingId) => {
    const confirmation = window.confirm(
      "¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer."
    );

    if (!confirmation) return;

    try {
      await clientAxios.patch(`/bookings/${bookingId}/cancelar`, {
        motivo: "Cancelación solicitada por el cliente"
      });

      toast.success("Reserva cancelada exitosamente");
      fetchBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error(error.response?.data?.message || "No pudimos cancelar la reserva");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tus reservas..." />;
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Mis Reservas
          </h1>
          <p className="text-text-light">
            Gestiona y consulta el estado de todas tus reservas
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "todas", label: "Todas" },
              { value: "activas", label: "Activas" },
              { value: "pendiente", label: "Pendientes" },
              { value: "confirmada", label: "Confirmadas" },
              { value: "pagada_completa", label: "Pagadas" },
              { value: "cancelada", label: "Canceladas" }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? "bg-primary-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              No tienes reservas
            </h3>
            <p className="text-text-light mb-6">
              {statusFilter === "todas"
                ? "Aún no has realizado ninguna reserva"
                : `No tienes reservas en estado: ${statusFilter}`}
            </p>
            <button
              onClick={() => navigate("/paquetes")}
              className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explorar Paquetes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.estado);
              const StatusIcon = statusConfig.icon;
              const totalPassengers = booking.cantidadPasajeros.adultos + (booking.cantidadPasajeros.ninos || 0);
              const paymentPercentage = (booking.montoPagado / booking.montoTotal) * 100;

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden border-l-4 ${statusConfig.border} hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-text-dark">
                            {booking.paquete?.nombre || "Paquete no disponible"}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-text-light font-mono">
                          Reserva: {booking.numeroReserva}
                        </p>
                      </div>

                      {/* Package Image */}
                      {booking.paquete?.imagenPrincipal?.url && (
                        <img
                          src={booking.paquete.imagenPrincipal.url}
                          alt={booking.paquete.nombre}
                          className="w-full lg:w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Trip Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary-blue mt-0.5" />
                        <div>
                          <p className="text-xs text-text-light mb-1">Fecha de salida</p>
                          <p className="text-sm font-semibold text-text-dark">
                            {booking.fechaSalida?.salida 
                              ? formatDate(booking.fechaSalida.salida)
                              : "Fecha no disponible"}
                          </p>
                          {booking.fechaSalida?.regreso && (
                            <p className="text-xs text-text-light">
                              Regreso: {formatDate(booking.fechaSalida.regreso)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary-blue mt-0.5" />
                        <div>
                          <p className="text-xs text-text-light mb-1">Pasajeros</p>
                          <p className="text-sm font-semibold text-text-dark">
                            {totalPassengers} {totalPassengers === 1 ? "pasajero" : "pasajeros"}
                          </p>
                          <p className="text-xs text-text-light">
                            {booking.cantidadPasajeros.adultos} adultos
                            {booking.cantidadPasajeros.ninos > 0 && `, ${booking.cantidadPasajeros.ninos} niños`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-primary-blue mt-0.5" />
                        <div>
                          <p className="text-xs text-text-light mb-1">Monto total</p>
                          <p className="text-sm font-semibold text-text-dark">
                            {formatCurrency(booking.montoTotal, booking.moneda)}
                          </p>
                          {booking.montoPendiente > 0 && (
                            <p className="text-xs text-red-600 font-medium">
                              Pendiente: {formatCurrency(booking.montoPendiente, booking.moneda)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Progress Bar */}
                    {booking.estado !== "cancelada" && booking.montoPagado > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-text-light mb-1">
                          <span>Progreso de pago</span>
                          <span>{Math.round(paymentPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${paymentPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(booking._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>

                      {booking.montoPendiente > 0 && 
                       ["pendiente", "confirmada", "en_proceso_pago"].includes(booking.estado) && (
                        <button
                          onClick={() => handlePay(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pagar Ahora
                        </button>
                      )}

                      {["pendiente", "confirmada"].includes(booking.estado) && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </button>
                      )}

                      <button
                        onClick={() => navigate("/contacto", { 
                          state: { 
                            asunto: `Consulta sobre reserva ${booking.numeroReserva}`,
                            reservaId: booking._id
                          }
                        })}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Consultar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// pages/Bookings/BookingDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import clientAxios from "../../api/axiosConfig";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  Download,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  DollarSign,
  AlertCircle,
  X
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import NotFound from "../../components/common/NotFound";
import PaymentMethodSelector from "../../components/payments/PaymentMethodSelector";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await clientAxios.get(`/bookings/${id}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error("Error loading booking:", error);
      toast.error("No pudimos cargar los detalles de la reserva");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatCurrency = (amount, currency = "ARS") => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pendiente: {
        label: "Pendiente de Pago",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200"
      },
      confirmada: {
        label: "Confirmada",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200"
      },
      pagada_completa: {
        label: "Pagada Completamente",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200"
      },
      en_proceso_pago: {
        label: "Pago en Proceso",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200"
      },
      vencida: {
        label: "Pago Vencido",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200"
      },
      cancelada: {
        label: "Cancelada",
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200"
      },
      completada: {
        label: "Viaje Completado",
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200"
      }
    };
    return configs[status] || configs.pendiente;
  };

  // Handler cuando el pago se completa exitosamente
  const handlePaymentSuccess = async (result) => {
    console.log("✅ Pago completado:", result);
    
    // Recargar los datos de la reserva
    await fetchBooking();
    
    // Cerrar modal
    setShowPaymentModal(false);
    
    toast.success('¡Pago registrado exitosamente!', {
      icon: '🎉',
      duration: 4000
    });
  };

  // Abrir modal de pago
  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles..." />;
  }

  if (!booking) {
    return <NotFound message="Reserva no encontrada" linkText="Volver a mis reservas" linkTo="/mis-reservas" />;
  }

  const statusConfig = getStatusConfig(booking.estado);
  const totalPassengers = booking.cantidadPasajeros.adultos + (booking.cantidadPasajeros.ninos || 0);
  const paymentPercentage = (booking.montoPagado / booking.montoTotal) * 100;
  
  // Determinar si se puede pagar
  const canPay = booking.montoPendiente > 0 && 
                 ["pendiente", "confirmada", "en_proceso_pago"].includes(booking.estado);

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/mis-reservas")}
          className="flex items-center gap-2 text-primary-blue hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Mis Reservas
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                {booking.paquete?.nombre}
              </h1>
              <p className="text-text-light mb-4">
                Número de reserva: <span className="font-mono font-semibold">{booking.numeroReserva}</span>
              </p>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                <CheckCircle className="w-4 h-4" />
                {statusConfig.label}
              </span>
            </div>

            {booking.paquete?.imagenPrincipal?.url && (
              <img
                src={booking.paquete.imagenPrincipal.url}
                alt={booking.paquete.nombre}
                className="w-full lg:w-48 h-48 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-blue" />
                Información del Viaje
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-light mb-1">Fecha de Salida</p>
                    <p className="font-semibold text-text-dark">
                      {formatDate(booking.fechaSalida?.salida)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light mb-1">Fecha de Regreso</p>
                    <p className="font-semibold text-text-dark">
                      {formatDate(booking.fechaSalida?.regreso)}
                    </p>
                  </div>
                </div>

                {booking.paquete?.destinos && booking.paquete.destinos.length > 0 && (
                  <div>
                    <p className="text-sm text-text-light mb-2">Destinos</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.paquete.destinos.map((destination, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          <MapPin className="w-3 h-3" />
                          {destination.ciudad}, {destination.pais}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-text-light mb-1">Duración</p>
                  <p className="font-semibold text-text-dark">
                    {booking.paquete?.duracionTotal} días
                  </p>
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-blue" />
                Pasajeros
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-text-light mb-1">Adultos</p>
                    <p className="text-2xl font-bold text-primary-blue">
                      {booking.cantidadPasajeros.adultos}
                    </p>
                  </div>
                  {booking.cantidadPasajeros.ninos > 0 && (
                    <div>
                      <p className="text-sm text-text-light mb-1">Niños</p>
                      <p className="text-2xl font-bold text-primary-blue">
                        {booking.cantidadPasajeros.ninos}
                      </p>
                    </div>
                  )}
                </div>

                {/* Main Contact */}
                <div>
                  <p className="text-sm font-semibold text-text-dark mb-2">Titular de la reserva</p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-text-dark">
                      {booking.datosContacto.nombre} {booking.datosContacto.apellido}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <Mail className="w-4 h-4" />
                      {booking.datosContacto.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <Phone className="w-4 h-4" />
                      {booking.datosContacto.telefono}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <FileText className="w-4 h-4" />
                      {booking.datosContacto.tipoDocumento}: {booking.datosContacto.documento}
                    </div>
                  </div>
                </div>

                {/* Additional Passengers */}
                {booking.pasajeros && booking.pasajeros.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-text-dark mb-2">Pasajeros adicionales</p>
                    <div className="space-y-2">
                      {booking.pasajeros.map((passenger, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-text-dark">
                            {passenger.nombre} {passenger.apellido}
                            {passenger.esMenor && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                Menor
                              </span>
                            )}
                          </p>
                          {passenger.numeroDocumento && (
                            <p className="text-sm text-text-light">
                              {passenger.tipoDocumento}: {passenger.numeroDocumento}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes and Requirements */}
            {(booking.notasCliente || booking.requisitosEspeciales) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-text-dark mb-4">
                  Notas y Requisitos Especiales
                </h2>

                {booking.notasCliente && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text-dark mb-2">Notas del cliente</p>
                    <p className="text-sm text-text-light bg-gray-50 p-3 rounded-lg">
                      {booking.notasCliente}
                    </p>
                  </div>
                )}

                {booking.requisitosEspeciales && (
                  <div>
                    <p className="text-sm font-semibold text-text-dark mb-2">Requisitos especiales</p>
                    <p className="text-sm text-text-light bg-gray-50 p-3 rounded-lg">
                      {booking.requisitosEspeciales}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary-blue" />
                Resumen de Pago
              </h2>

              <div className="space-y-4">
                <div className="pb-4 border-b space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Precio total</span>
                    <span className="font-semibold">{formatCurrency(booking.precioTotal, booking.moneda)}</span>
                  </div>
                  {booking.descuentoAplicado > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento aplicado</span>
                      <span>-{formatCurrency(booking.descuentoAplicado, booking.moneda)}</span>
                    </div>
                  )}
                </div>

                <div className="pb-4 border-b">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-text-dark">Monto Total</span>
                    <span className="font-bold text-xl text-primary-blue">
                      {formatCurrency(booking.montoTotal, booking.moneda)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Monto pagado</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(booking.montoPagado, booking.moneda)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Monto pendiente</span>
                    <span className={`font-semibold ${booking.montoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(booking.montoPendiente, booking.moneda)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-text-light mb-1">
                    <span>Progreso de pago</span>
                    <span>{Math.round(paymentPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${paymentPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Payment Deadline */}
                {booking.fechaLimitePagoTotal && booking.montoPendiente > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">Fecha límite de pago</p>
                        <p className="text-xs text-yellow-700">
                          {formatDate(booking.fechaLimitePagoTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {canPay && (
                  <button 
                    onClick={handleOpenPayment}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pagar Ahora
                  </button>
                )}

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Descargar Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Realizar Pago
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Resumen */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Detalle del pago</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p className="font-mono text-xs mb-2">Reserva #{booking.numeroReserva}</p>
                  <p className="font-medium">{booking.paquete?.nombre}</p>
                  <p className="font-semibold text-lg mt-2 pt-2 border-t border-blue-200">
                    Monto a pagar: {formatCurrency(booking.montoPendiente, booking.moneda)}
                  </p>
                </div>
              </div>

              {/* Selector de métodos de pago */}
              <PaymentMethodSelector
                reservaId={booking._id}
                reservaData={booking}
                montoPendiente={booking.montoPendiente}
                onPaymentSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentModal(false)}
                tipoPago="total"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
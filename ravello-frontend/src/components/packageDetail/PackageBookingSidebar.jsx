// ===================================================================
// components/packageDetail/PackageBookingSidebar.jsx
// ===================================================================
import React, { useState } from "react";
import { MessageCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PriceDisplay from "./sidebar/PriceDisplay";
import PassengerSelector from "./sidebar/PassengerSelector";
import DateSelector from "./sidebar/DateSelector";
import AuthAlerts from "./sidebar/AuthAlerts";
import PaymentButtons from "./sidebar/PaymentButtons";
import PackageDetails from "./sidebar/PackageDetails";
import BrickPaymentForm from "./sidebar/BrickPaymentForm";
import { getMercadoPagoPublicKey } from '../../config/mercadopago';

export default function PackageBookingSidebar({
  pkg,
  packageDates,
  selectedDate,
  setSelectedDate,
  datesLoading,
  onPayment,
  onContact,
  paymentLoading,
  isAuthenticated,
  canBook,
  mercadoPagoPublicKey
}) {
  const navigate = useNavigate();
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'checkout' | 'brick' | null
  const [showBrickModal, setShowBrickModal] = useState(false);
  const [reservaCreada, setReservaCreada] = useState(null); // ⬅️ NUEVO: Guardar reserva creada
  const [isCreatingBooking, setIsCreatingBooking] = useState(false); // ⬅️ NUEVO: Loading state

  // Calcular precio total
  const precioAdulto = selectedDate?.precioFinal || selectedDate?.precio || pkg.precioBase || 0;
  const precioNino = selectedDate?.precioNino || precioAdulto * 0.7;
  const precioTotal = (precioAdulto * adultos) + (precioNino * ninos);

  const handleReservar = async (method) => {
    // Validar fecha seleccionada
    if (!selectedDate) {
      alert("Por favor selecciona una fecha de salida");
      return;
    }

    // Validar cupos disponibles
    const totalPasajeros = adultos + ninos;
    if (totalPasajeros > selectedDate.cuposDisponibles) {
      alert(`Solo hay ${selectedDate.cuposDisponibles} cupos disponibles`);
      return;
    }

    // Preparar datos para enviar
    const bookingData = {
      paqueteId: pkg._id,
      fechaSalidaId: selectedDate._id,
      cantidadPasajeros: { adultos, ninos } // ⬅️ CORREGIDO: usar "cantidadPasajeros"
    };

    if (method === 'checkout') {
      // Checkout Pro: usar el handler del padre (PackageDetailPage)
      onPayment({ ...bookingData, paymentMethod: 'checkout' });
    } else if (method === 'brick') {
      // ⬅️ NUEVO FLUJO PARA BRICKS
      try {
        setIsCreatingBooking(true);

        // 1. CREAR LA RESERVA
        console.log("📝 Creando reserva...");
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Error al crear la reserva");
        }

        const result = await response.json();
        const reserva = result.data;

        console.log("✅ Reserva creada:", reserva);

        // 2. GUARDAR LA RESERVA Y MOSTRAR EL BRICK
        setReservaCreada(reserva);
        setShowBrickModal(true);

      } catch (error) {
        console.error("❌ Error al crear reserva:", error);
        alert(error.message || "Error al crear la reserva");
      } finally {
        setIsCreatingBooking(false);
      }
    }
  };

  const handleBrickSuccess = (result) => {
    console.log("✅ Pago exitoso:", result);
    setShowBrickModal(false);
    setReservaCreada(null);
    setPaymentMethod(null);
    
    // Redirigir a confirmación o mis reservas
    alert("¡Pago procesado exitosamente! Redirigiendo a tus reservas...");
    navigate("/mis-reservas");
  };

  const handleBrickError = (error) => {
    console.error("❌ Error en pago:", error);
    alert(error);
    // No cerramos el modal para que pueda reintentar
  };

  const handleBrickCancel = () => {
    const confirmar = window.confirm(
      "¿Deseas cancelar el pago? La reserva quedará pendiente de pago."
    );
    
    if (confirmar) {
      setShowBrickModal(false);
      setReservaCreada(null);
      setPaymentMethod(null);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', {
      state: {
        from: window.location.pathname,
        message: 'Inicia sesión para hacer tu reserva'
      }
    });
  };

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Precio */}
      <PriceDisplay
        precioTotal={precioTotal}
        moneda={selectedDate?.moneda || pkg.moneda || "ARS"}
        adultos={adultos}
        ninos={ninos}
      />

      {/* Selección de pasajeros */}
      <PassengerSelector
        adultos={adultos}
        setAdultos={setAdultos}
        ninos={ninos}
        setNinos={setNinos}
      />

      {/* Fechas disponibles */}
      <DateSelector
        packageDates={packageDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        datesLoading={datesLoading}
        precioAdulto={precioAdulto}
        precioNino={precioNino}
        ninos={ninos}
      />

      {/* Alertas de autenticación */}
      <AuthAlerts
        isAuthenticated={isAuthenticated}
        canBook={canBook}
      />

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón principal: Login o Seleccionar método de pago */}
        {!isAuthenticated ? (
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión para Reservar
          </button>
        ) : !paymentMethod ? (
          // Mostrar opciones de pago
          <PaymentButtons
            onSelectCheckout={() => setPaymentMethod('checkout')}
            onSelectBrick={() => setPaymentMethod('brick')}
            disabled={paymentLoading || !selectedDate || isCreatingBooking}
            canBook={canBook}
          />
        ) : (
          // Botón de confirmar según método seleccionado
          <div className="space-y-3">
            <button
              onClick={() => handleReservar(paymentMethod)}
              disabled={paymentLoading || !selectedDate || isCreatingBooking}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(paymentLoading || isCreatingBooking) ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isCreatingBooking ? 'Creando reserva...' : 'Procesando...'}
                </>
              ) : (
                <>
                  {paymentMethod === 'checkout' ? 'Ir a MercadoPago' : 'Continuar con el pago'}
                </>
              )}
            </button>
            
            <button
              onClick={() => setPaymentMethod(null)}
              disabled={isCreatingBooking}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
            >
              Cambiar método de pago
            </button>
          </div>
        )}

        {/* Botón Consultar */}
        <button
          onClick={onContact}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Hacer una Consulta
        </button>
      </div>

      {/* Información adicional */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 text-sm">
        <p className="text-green-800">✓ Pago seguro con MercadoPago</p>
        <p className="text-green-800">✓ Confirmación inmediata</p>
        {isAuthenticated && (
          <p className="text-green-700">ℹ️ Tus datos se toman de tu perfil</p>
        )}
        {pkg.montoSenia && (
          <p className="text-green-700">
            ℹ️ Seña: ${pkg.montoSenia.toLocaleString()}
          </p>
        )}
      </div>

      {/* Detalles del paquete */}
      <PackageDetails pkg={pkg} />

      {/* Modal de Brick Payment */}
      {showBrickModal && reservaCreada && (
        <BrickPaymentForm
          reservaId={reservaCreada._id}
          reservaData={reservaCreada}
          precioTotal={reservaCreada.montoTotal}
          onSuccess={handleBrickSuccess}
          onError={handleBrickError}
          onCancel={handleBrickCancel}
          publicKey={getMercadoPagoPublicKey()}
        />
      )}
    </div>
  );
}
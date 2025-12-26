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
  mercadoPagoPublicKey // Añadir esta prop
}) {
  const navigate = useNavigate();
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'checkout' | 'brick' | null
  const [showBrickModal, setShowBrickModal] = useState(false);

  // Calcular precio total
  const precioAdulto = selectedDate?.precioFinal || selectedDate?.precio || pkg.precioBase || 0;
  const precioNino = selectedDate?.precioNino || precioAdulto * 0.7;
  const precioTotal = (precioAdulto * adultos) + (precioNino * ninos);

  const handleReservar = (method) => {
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
      pasajeros: { adultos, ninos }
    };

    if (method === 'checkout') {
      // Checkout Pro: redirigir a MercadoPago
      onPayment({ ...bookingData, paymentMethod: 'checkout' });
    } else if (method === 'brick') {
      // Bricks: mostrar modal con formulario
      setShowBrickModal(true);
    }
  };

  const handleBrickSuccess = (result) => {
    setShowBrickModal(false);
    // Redirigir o mostrar mensaje de éxito
    navigate(`/booking-confirmation/${result.bookingId}`);
  };

  const handleBrickError = (error) => {
    alert(error);
  };

  const handleLoginRedirect = () => {
    navigate('/login', {
      state: {
        from: window.location.pathname,
        message: 'Inicia sesión para hacer tu reserva'
      }
    });
  };

  const bookingData = {
    paqueteId: pkg._id,
    fechaSalidaId: selectedDate?._id,
    pasajeros: { adultos, ninos }
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
            disabled={paymentLoading || !selectedDate}
            canBook={canBook}
          />
        ) : (
          // Botón de confirmar según método seleccionado
          <div className="space-y-3">
            <button
              onClick={() => handleReservar(paymentMethod)}
              disabled={paymentLoading || !selectedDate}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {paymentLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  {paymentMethod === 'checkout' ? 'Ir a MercadoPago' : 'Abrir Formulario de Pago'}
                </>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod(null)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
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
      {showBrickModal && (
        <BrickPaymentForm
          bookingData={bookingData}
          precioTotal={precioTotal}
          onSuccess={handleBrickSuccess}
          onError={handleBrickError}
          onCancel={() => setShowBrickModal(false)}
          publicKey={getMercadoPagoPublicKey()}
        />
      )}
    </div>
  );
}
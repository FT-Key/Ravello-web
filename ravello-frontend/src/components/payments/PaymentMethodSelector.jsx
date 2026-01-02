// components/payment/PaymentMethodSelector.jsx
import React from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import BrickPaymentForm from "../packageDetail/sidebar/BrickPaymentForm";
import { getMercadoPagoPublicKey } from "../../config/mercadopago";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";

/**
 * Componente reutilizable para seleccionar y procesar métodos de pago
 * Ahora usa el hook usePaymentMethods para centralizar la lógica
 */
export default function PaymentMethodSelector({
  reservaId,
  reservaData,
  montoPendiente,
  onPaymentSuccess,
  onCancel,
  tipoPago = "total",
  numeroCuota = null
}) {
  const {
    showBrickModal,
    reservaForPayment,
    processingCheckout,
    processCheckoutPro,
    initiateBrickPayment,
    handleBrickSuccess,
    handleBrickError,
    handleBrickCancel
  } = usePaymentMethods();

  // Manejar selección de Checkout Pro
  const handleSelectCheckout = () => {
    processCheckoutPro({
      reservaId,
      montoPago: montoPendiente,
      tipoPago,
      numeroCuota
    });
  };

  // Manejar selección de Bricks
  const handleSelectBrick = () => {
    initiateBrickPayment({
      reservaId,
      reservaData
    });
  };

  // Wrapper para el éxito del pago
  const onBrickSuccess = (result) => {
    handleBrickSuccess(result, {
      onSuccess: onPaymentSuccess,
      redirectTo: '/mis-reservas'
    });
  };

  // Wrapper para la cancelación
  const onBrickCancel = () => {
    handleBrickCancel({
      onCancel
    });
  };

  // Mostrar loading si está procesando
  if (processingCheckout) {
    return (
      <div className="text-center py-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-600">Preparando el pago...</p>
      </div>
    );
  }

  return (
    <>
      {/* Selector de métodos de pago */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">
          Selecciona tu método de pago
        </h3>

        {/* Opción: Checkout Pro (Redirect) */}
        <button
          onClick={handleSelectCheckout}
          disabled={processingCheckout}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Checkout Pro</p>
                <p className="text-sm text-gray-600">
                  Redirige a MercadoPago para completar el pago
                </p>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
              →
            </div>
          </div>
        </button>

        {/* Opción: Bricks (Inline) */}
        <button
          onClick={handleSelectBrick}
          disabled={processingCheckout}
          className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pago con Tarjeta</p>
                <p className="text-sm text-gray-600">
                  Paga directamente con tu tarjeta de crédito o débito
                </p>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-green-600 transition-colors">
              →
            </div>
          </div>
        </button>

        {/* Botón cancelar */}
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={processingCheckout}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Modal de Brick Payment */}
      {showBrickModal && reservaForPayment && (
        <BrickPaymentForm
          reservaId={reservaForPayment._id}
          reservaData={reservaForPayment}
          precioTotal={montoPendiente}
          onSuccess={onBrickSuccess}
          onError={handleBrickError}
          onCancel={onBrickCancel}
          publicKey={getMercadoPagoPublicKey()}
        />
      )}
    </>
  );
}
// ===================================================================
// components/packageDetail/sidebar/BrickPaymentForm.jsx
// ===================================================================

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const MP_SDK_URL = "https://sdk.mercadopago.com/js/v2";

export default function BrickPaymentForm({
  bookingData,
  precioTotal,
  onSuccess,
  onError,
  onCancel,
  publicKey
}) {
  const [isLoading, setIsLoading] = useState(true);
  const brickCreatedRef = useRef(false);
  const mpInstanceRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);


  // Al inicio del componente (después de línea 10):
  useEffect(() => {
    if (!publicKey) {
      onError("Configuración de MercadoPago no disponible");
      return;
    }

    if (brickCreatedRef.current) return;

    const loadSdk = () =>
      new Promise((resolve) => {
        if (window.MercadoPago) return resolve();

        const script = document.createElement("script");
        script.src = MP_SDK_URL;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    brickCreatedRef.current = true;

    loadSdk().then(() => {
      initializeBrick();
    });

    return () => {
      const container = document.getElementById("paymentBrick_container");
      if (container) container.innerHTML = "";
    };
  }, [publicKey]);

  const initializeBrick = async () => {
    try {
      const container = document.getElementById("paymentBrick_container");
      if (!container) return;

      container.innerHTML = "";

      if (!mpInstanceRef.current) {
        mpInstanceRef.current = new window.MercadoPago(publicKey, {
          locale: "es-AR",
        });
      }

      const bricksBuilder = mpInstanceRef.current.bricks();

      await bricksBuilder.create("payment", "paymentBrick_container", {
        initialization: {
          amount: precioTotal,
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            maxInstallments: 12,
          },
        },
        callbacks: {
          onReady: () => setIsLoading(false),

          onSubmit: async (formData) => {
            try {
              const response = await fetch("/api/payments/mercadopago/brick", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  reservaId: bookingData.paqueteId,
                  montoPago: precioTotal,
                  paymentData: formData,
                }),
              });

              const result = await response.json();

              result.success ? onSuccess(result) : onError(result.error);
            } catch {
              onError("Error al procesar el pago");
            }
          },

          onError: () => onError("Error en el formulario de pago"),
        },
      });
    } catch {
      onError("Error al cargar el formulario de pago");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Completar Pago
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Resumen de la reserva */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Resumen de tu reserva</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p>Adultos: {bookingData.pasajeros.adultos}</p>
              {bookingData.pasajeros.ninos > 0 && (
                <p>Niños: {bookingData.pasajeros.ninos}</p>
              )}
              <p className="font-semibold text-lg mt-2">
                Total: ${precioTotal.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando formulario de pago...</p>
              </div>
            </div>
          )}

          {/* Brick container */}
          <div id="paymentBrick_container"></div>

          {/* Seguridad */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Pago seguro procesado por MercadoPago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
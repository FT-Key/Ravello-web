// ===================================================================
// components/packageDetail/sidebar/BrickPaymentForm.jsx
// ===================================================================

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const MP_SDK_URL = "https://sdk.mercadopago.com/js/v2";

export default function BrickPaymentForm({
  reservaId,      // ⬅️ NUEVO: ID de la reserva ya creada
  reservaData,    // ⬅️ NUEVO: Datos completos de la reserva
  precioTotal,
  onSuccess,
  onError,
  onCancel,
  publicKey
}) {
  const [isLoading, setIsLoading] = useState(true);
  const brickCreatedRef = useRef(false);
  const mpInstanceRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useLayoutEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("main-navbar");
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    window.addEventListener("scroll", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      window.removeEventListener("scroll", updateNavbarHeight);
    };
  }, []);

  useEffect(() => {
    if (!publicKey) {
      onError("Configuración de MercadoPago no disponible");
      return;
    }

    if (!reservaId) {
      onError("No se especificó la reserva a pagar");
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
  }, [publicKey, reservaId]);

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
          payer: {
            email: reservaData?.datosContacto?.email || "",
          }
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            maxInstallments: 12,
          },
          visual: {
            style: {
              theme: "default"
            }
          }
        },
        callbacks: {
          onReady: () => {
            console.log("✅ Brick cargado correctamente");
            setIsLoading(false);
          },

          onSubmit: async (formData) => {
            console.log("📤 Procesando pago para reserva:", reservaId);
            console.log("📦 Datos del formulario:", formData);

            try {
              // ⬅️ CORRECCIÓN: Los datos vienen en formData.formData
              const paymentDetails = formData.formData;
              // ⬅️ AGREGAR ESTE LOG
              console.log("🔑 Token generado:", paymentDetails.token);
              console.log("🔑 Payment Method:", paymentDetails.payment_method_id);
              console.log("🔑 Issuer:", paymentDetails.issuer_id);

              if (!paymentDetails || !paymentDetails.token) {
                throw new Error("Datos de pago incompletos");
              }

              const payloadToSend = {
                reservaId: reservaId,
                montoPago: precioTotal,
                tipoPago: "total",
                numeroCuota: null,
                paymentData: {
                  token: paymentDetails.token,
                  issuer_id: paymentDetails.issuer_id,
                  payment_method_id: paymentDetails.payment_method_id,
                  transaction_amount: paymentDetails.transaction_amount,
                  installments: paymentDetails.installments,
                  payer: {
                    email: paymentDetails.payer?.email || reservaData?.datosContacto?.email || "",
                    identification: {
                      type: paymentDetails.payer?.identification?.type || "DNI",
                      number: paymentDetails.payer?.identification?.number || "",
                    },
                  },
                },
              };

              console.log("📦 Enviando pago al servidor...");

              const response = await fetch("/api/payments/mercadopago/brick", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payloadToSend),
              });

              const result = await response.json();

              console.log("📥 Respuesta del servidor:", result);

              if (result.success) {
                onSuccess(result);
              } else {
                onError(result.message || "Error al procesar el pago");
              }
            } catch (error) {
              console.error("❌ Error en la petición:", error);
              onError(error.message || "Error al procesar el pago. Por favor, intenta nuevamente.");
            }
          },

          onError: (error) => {
            console.error("❌ Error en el Brick:", error);
            onError("Error en el formulario de pago");
          },
        },
      });
    } catch (error) {
      console.error("❌ Error inicializando Brick:", error);
      onError("Error al cargar el formulario de pago");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 bg-black/50 z-40 flex items-center justify-center p-4"
      style={{ top: navbarHeight }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
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
              {reservaData?.numeroReserva && (
                <p className="font-mono text-xs mb-2">Reserva #{reservaData.numeroReserva}</p>
              )}
              {reservaData?.paquete?.nombre && (
                <p className="font-medium">{reservaData.paquete.nombre}</p>
              )}
              <p>Adultos: {reservaData?.pasajeros?.adultos || 0}</p>
              {reservaData?.pasajeros?.ninos > 0 && (
                <p>Niños: {reservaData.pasajeros.ninos}</p>
              )}
              <p className="font-semibold text-lg mt-2 pt-2 border-t border-blue-200">
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
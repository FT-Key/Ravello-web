import React from "react";
import { Link, useParams } from "react-router-dom";
import { XCircle, Home, RotateCcw, HelpCircle } from "lucide-react";

export default function PaymentFailurePage() {
  const { numeroReserva } = useParams();

  return (
    <div className="min-h-screen bg-background-light py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Ícono y título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pago Rechazado
            </h1>
            <p className="text-gray-600">
              Hubo un problema al procesar tu pago
            </p>
          </div>

          {/* Información */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-900 mb-2">
              ¿Qué pudo haber pasado?
            </h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Fondos insuficientes en tu cuenta</li>
              <li>• Datos de tarjeta incorrectos</li>
              <li>• Límite de compra excedido</li>
              <li>• Problemas de conexión durante el pago</li>
            </ul>
          </div>

          {/* Qué hacer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Verifica los datos de tu tarjeta</li>
              <li>✓ Asegúrate de tener fondos suficientes</li>
              <li>✓ Intenta con otro método de pago</li>
              <li>✓ Contacta a tu banco si el problema persiste</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {numeroReserva && (
              <Link
                to={`/reservas/${numeroReserva}`}
                className="w-full flex items-center justify-center gap-2 bg-primary-red text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Intentar nuevamente
              </Link>
            )}

            <Link
              to="/paquetes"
              className="w-full flex items-center justify-center gap-2 bg-primary-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Ver otros paquetes
            </Link>

            <Link
              to="/contacto"
              className="w-full flex items-center justify-center gap-2 border-2 border-primary-blue text-primary-blue py-3 rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
            >
              Contactar soporte
            </Link>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 text-gray-600 py-3 hover:text-gray-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-lg shadow p-6 text-center mt-6">
          <p className="text-gray-600 mb-4">
            ¿Necesitas ayuda? Estamos aquí para asistirte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+5491123456789"
              className="text-primary-blue hover:underline font-semibold"
            >
              📞 +54 911 2345-6789
            </a>
            <a
              href="mailto:info@ravello.com"
              className="text-primary-blue hover:underline font-semibold"
            >
              ✉️ info@ravello.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
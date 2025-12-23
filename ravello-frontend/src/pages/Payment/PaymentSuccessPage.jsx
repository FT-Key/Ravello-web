import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Download, Home, Mail } from "lucide-react";
import clientAxios from "../../api/axiosConfig";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function PaymentSuccessPage() {
  const { numeroReserva } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarPago = async () => {
      try {
        setLoading(true);
        
        // Buscar la reserva por número
        const response = await clientAxios.get(`/bookings/numero/${numeroReserva}`);
        setReserva(response.data.data);

      } catch (err) {
        console.error("Error verificando pago:", err);
        setError("No pudimos verificar el estado de tu pago. Por favor contacta con nosotros.");
      } finally {
        setLoading(false);
      }
    };

    if (numeroReserva) {
      // Esperar 2 segundos para que el webhook procese
      setTimeout(() => {
        verificarPago();
      }, 2000);
    }
  }, [numeroReserva]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <LoadingSpinner message="Verificando tu pago..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando Pago
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              to="/contacto"
              className="block w-full border-2 border-primary-blue text-primary-blue py-3 rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de éxito */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-600">
              Tu reserva ha sido confirmada correctamente
            </p>
          </div>

          {/* Detalles de la reserva */}
          {reserva && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles de tu reserva
              </h2>

              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de reserva:</span>
                  <span className="font-semibold text-gray-900">
                    {reserva.numeroReserva}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {reserva.estado === 'pagada_completa' ? 'Pagada' : 'Confirmada'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Monto pagado:</span>
                  <span className="font-semibold text-gray-900">
                    {reserva.moneda} ${reserva.montoPagado?.toLocaleString()}
                  </span>
                </div>

                {reserva.montoPendiente > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo pendiente:</span>
                    <span className="font-semibold text-orange-600">
                      {reserva.moneda} ${reserva.montoPendiente?.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Contacto:</span>
                  <span className="font-semibold text-gray-900">
                    {reserva.datosContacto?.email}
                  </span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Próximos pasos
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Recibirás un email de confirmación en breve</li>
                  <li>✓ Te contactaremos para coordinar los detalles</li>
                  <li>✓ Guarda tu número de reserva para futuras consultas</li>
                </ul>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="mt-8 space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-primary-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
            
            <Link
              to="/paquetes"
              className="w-full flex items-center justify-center gap-2 border-2 border-primary-blue text-primary-blue py-3 rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
            >
              Ver más paquetes
            </Link>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">
            ¿Tienes alguna pregunta sobre tu reserva?
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
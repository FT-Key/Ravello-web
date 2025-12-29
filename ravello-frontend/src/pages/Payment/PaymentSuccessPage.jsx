import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Home, Mail, Calendar, MapPin, Users, Package, CreditCard } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[var(--color-secondary-sand)] to-white">
        <LoadingSpinner message="Verificando tu pago..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[var(--color-secondary-sand)] to-white px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mail className="w-10 h-10 text-[var(--color-state-warning)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-dark)] mb-2">
              Verificando Pago
            </h1>
            <p className="text-[var(--color-text-light)]">{error}</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-[var(--color-primary-blue)] text-white py-3 rounded-lg hover:bg-[var(--color-secondary-cyan)] transition-colors font-semibold"
            >
              Volver al inicio
            </Link>
            <Link
              to="/contacto"
              className="block w-full border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] py-3 rounded-lg hover:bg-[var(--color-primary-blue)] hover:text-white transition-colors font-semibold"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[var(--color-secondary-sand)] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Animación de éxito */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--color-state-success)] mb-6 animate-bounce-once shadow-lg">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-dark)] mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-xl text-[var(--color-text-light)]">
            Tu reserva ha sido confirmada correctamente
          </p>
        </div>

        {/* Tarjeta principal de detalles */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 animate-slide-up">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Reserva #{numeroReserva}</h2>
                <p className="text-blue-100">Confirmación de pago</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Detalles de la reserva */}
          {reserva && (
            <div className="p-6">
              {/* Grid de información principal */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Paquete */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-100">
                  <MapPin className="w-5 h-5 text-[var(--color-primary-blue)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)] mb-1">Paquete</p>
                    <p className="font-semibold text-[var(--color-text-dark)]">
                      {reserva.paquete?.nombre || 'Paquete turístico'}
                    </p>
                  </div>
                </div>

                {/* Fecha de salida */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-100">
                  <Calendar className="w-5 h-5 text-[var(--color-primary-blue)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)] mb-1">Fecha de salida</p>
                    <p className="font-semibold text-[var(--color-text-dark)]">
                      {reserva.fechaSalida ? new Date(reserva.fechaSalida).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Por confirmar'}
                    </p>
                  </div>
                </div>

                {/* Pasajeros */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-100">
                  <Users className="w-5 h-5 text-[var(--color-primary-blue)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)] mb-1">Pasajeros</p>
                    <p className="font-semibold text-[var(--color-text-dark)]">
                      {reserva.cantidadPasajeros || 1} {reserva.cantidadPasajeros === 1 ? 'persona' : 'personas'}
                    </p>
                  </div>
                </div>

                {/* Contacto */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-100">
                  <Mail className="w-5 h-5 text-[var(--color-primary-blue)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)] mb-1">Contacto</p>
                    <p className="font-semibold text-[var(--color-text-dark)] break-all">
                      {reserva.datosContacto?.email || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de pago */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 mb-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-green-700" />
                  <h3 className="font-semibold text-green-900">Resumen de Pago</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800">Estado:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white shadow-sm">
                      {reserva.estado === 'pagada_completa' ? '✓ Pagada Completa' : '✓ Confirmada'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-green-200">
                    <span className="text-green-800 font-medium">Monto pagado:</span>
                    <span className="font-bold text-green-900 text-lg">
                      {reserva.moneda} ${reserva.montoPagado?.toLocaleString()}
                    </span>
                  </div>

                  {reserva.montoPendiente > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-green-200">
                      <span className="text-orange-700 font-medium">Saldo pendiente:</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {reserva.moneda} ${reserva.montoPendiente?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos pasos */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                <h3 className="font-semibold text-[var(--color-primary-blue)] mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Próximos pasos
                </h3>
                <ul className="space-y-2 text-[var(--color-text-dark)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-state-success)] mt-1 font-bold">✓</span>
                    <span>Recibirás un email de confirmación con todos los detalles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-state-success)] mt-1 font-bold">✓</span>
                    <span>Nuestro equipo te contactará para coordinar los detalles del viaje</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-state-success)] mt-1 font-bold">✓</span>
                    <span>Guarda tu número de reserva para futuras consultas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-state-success)] mt-1 font-bold">✓</span>
                    <span>Puedes ver y gestionar tu reserva desde tu perfil</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[var(--color-primary-blue)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-secondary-cyan)] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
          
          <Link
            to="/paquetes"
            className="flex items-center justify-center gap-2 border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] py-3 px-6 rounded-lg hover:bg-[var(--color-primary-blue)] hover:text-white transition-all duration-300 font-semibold"
          >
            <Package className="w-5 h-5" />
            Ver más paquetes
          </Link>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-[var(--color-text-light)] mb-4 text-lg">
            ¿Tienes alguna pregunta sobre tu reserva?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+5491123456789"
              className="flex items-center gap-2 text-[var(--color-primary-blue)] hover:text-[var(--color-secondary-cyan)] font-semibold transition-colors"
            >
              <span className="text-2xl">📞</span>
              <span>+54 911 2345-6789</span>
            </a>
            <span className="hidden sm:block text-[var(--color-border-subtle)]">|</span>
            <a
              href="mailto:info@ravello.com"
              className="flex items-center gap-2 text-[var(--color-primary-blue)] hover:text-[var(--color-secondary-cyan)] font-semibold transition-colors"
            >
              <span className="text-2xl">✉️</span>
              <span>info@ravello.com</span>
            </a>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="text-center mt-8">
          <p className="text-xl text-[var(--color-text-light)] font-medium">
            ¡Gracias por confiar en Ravello Viajes! 🌍✈️
          </p>
          <p className="text-sm text-[var(--color-text-light)] mt-2">
            Estamos emocionados de ser parte de tu próxima aventura
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(0.95);
          }
          75% {
            transform: scale(1.05);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, Mail, RefreshCw, Home, Phone, Calendar, MapPin, Users, Package } from 'lucide-react';
import clientAxios from '../../api/axiosConfig';

export default function PaymentPendingPage() {
  const { numeroReserva } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const response = await clientAxios.get(`/bookings/numero/${numeroReserva}`);
        setReserva(response.data.data);
      } catch (error) {
        console.error('Error al cargar reserva:', error);
      } finally {
        setLoading(false);
      }
    };

    if (numeroReserva) {
      fetchReserva();
    } else {
      setLoading(false);
    }
  }, [numeroReserva]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[var(--color-secondary-sand)] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[var(--color-secondary-sand)] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Animación de pendiente */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--color-state-warning)] mb-6 animate-pulse-slow shadow-lg">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-dark)] mb-2">
            Pago Pendiente
          </h1>
          <p className="text-xl text-[var(--color-text-light)]">
            Tu pago está siendo procesado
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 animate-slide-up">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[var(--color-state-warning)] to-yellow-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Reserva #{numeroReserva}</h2>
                <p className="text-yellow-100">Esperando confirmación de pago</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Estado del pago */}
            <div className="bg-yellow-50 border-l-4 border-[var(--color-state-warning)] rounded-lg p-5 mb-6">
              <h3 className="font-semibold text-[var(--color-state-warning)] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Estado del pago
              </h3>
              <p className="text-[var(--color-text-dark)] mb-4">
                Tu pago está en proceso de validación. Esto puede suceder cuando:
              </p>
              <ul className="space-y-2 text-[var(--color-text-dark)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-state-warning)] mt-1">•</span>
                  <span>Elegiste pagar en efectivo en puntos de pago (Rapipago, Pago Fácil, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-state-warning)] mt-1">•</span>
                  <span>El pago está siendo verificado por tu entidad bancaria</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-state-warning)] mt-1">•</span>
                  <span>Realizaste una transferencia bancaria que requiere confirmación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-state-warning)] mt-1">•</span>
                  <span>La transacción necesita aprobación adicional de seguridad</span>
                </li>
              </ul>
            </div>

            {/* Detalles de la reserva */}
            {reserva && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Paquete */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-transparent rounded-lg border border-yellow-100">
                    <MapPin className="w-5 h-5 text-[var(--color-state-warning)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-text-light)] mb-1">Paquete</p>
                      <p className="font-semibold text-[var(--color-text-dark)]">
                        {reserva.paquete?.nombre || 'Paquete turístico'}
                      </p>
                    </div>
                  </div>

                  {/* Fecha de salida */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-transparent rounded-lg border border-yellow-100">
                    <Calendar className="w-5 h-5 text-[var(--color-state-warning)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-text-light)] mb-1">Fecha de salida</p>
                      <p className="font-semibold text-[var(--color-text-dark)]">
                        {reserva.fechaSalida ? new Date(reserva.fechaSalida).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Por confirmar'}
                      </p>
                    </div>
                  </div>

                  {/* Pasajeros */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-transparent rounded-lg border border-yellow-100">
                    <Users className="w-5 h-5 text-[var(--color-state-warning)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-text-light)] mb-1">Pasajeros</p>
                      <p className="font-semibold text-[var(--color-text-dark)]">
                        {reserva.cantidadPasajeros || 1} {reserva.cantidadPasajeros === 1 ? 'persona' : 'personas'}
                      </p>
                    </div>
                  </div>

                  {/* Contacto */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-transparent rounded-lg border border-yellow-100">
                    <Mail className="w-5 h-5 text-[var(--color-state-warning)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--color-text-light)] mb-1">Contacto</p>
                      <p className="font-semibold text-[var(--color-text-dark)] break-all">
                        {reserva.datosContacto?.email || 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Timeline de proceso */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 mb-6 border border-gray-200">
              <h4 className="font-semibold text-[var(--color-text-dark)] mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-[var(--color-primary-blue)]" />
                Proceso de confirmación
              </h4>
              <div className="space-y-5">
                {/* Paso 1: Completado */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-state-success)] flex items-center justify-center shadow-md">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-[var(--color-text-dark)] mb-1">Pago iniciado</p>
                    <p className="text-sm text-[var(--color-text-light)]">Has completado el proceso de pago correctamente</p>
                  </div>
                </div>

                {/* Línea conectora */}
                <div className="ml-5 w-0.5 h-8 bg-gradient-to-b from-[var(--color-state-success)] to-[var(--color-state-warning)]"></div>

                {/* Paso 2: En proceso */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-state-warning)] flex items-center justify-center shadow-md animate-pulse">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-[var(--color-text-dark)] mb-1">En verificación</p>
                    <p className="text-sm text-[var(--color-text-light)]">Estamos procesando y validando tu pago</p>
                  </div>
                </div>

                {/* Línea conectora */}
                <div className="ml-5 w-0.5 h-8 bg-gradient-to-b from-[var(--color-state-warning)] to-gray-300"></div>

                {/* Paso 3: Pendiente */}
                <div className="flex items-start gap-4 opacity-60">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shadow">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-[var(--color-text-dark)] mb-1">Confirmación final</p>
                    <p className="text-sm text-[var(--color-text-light)]">Recibirás un email cuando se confirme tu pago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información sobre próximos pasos */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-[var(--color-primary-blue)] mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                ¿Qué sucede ahora?
              </h3>
              <ul className="space-y-2 text-[var(--color-text-dark)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-blue)] mt-1 font-bold">1.</span>
                  <span>Te notificaremos por email cuando se confirme tu pago (generalmente en <strong>24-48 horas</strong>)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-blue)] mt-1 font-bold">2.</span>
                  <span>Puedes verificar el estado de tu reserva en tu perfil en cualquier momento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-blue)] mt-1 font-bold">3.</span>
                  <span>Si el pago no se confirma en <strong>72 horas</strong>, te contactaremos automáticamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-blue)] mt-1 font-bold">4.</span>
                  <span>Para pagos en efectivo, debes completar el pago en el punto indicado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            to="/mi-perfil"
            className="flex items-center justify-center gap-2 bg-[var(--color-primary-blue)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-secondary-cyan)] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <RefreshCw className="w-5 h-5" />
            Ver mis reservas
          </Link>

          <Link
            to="/contacto"
            className="flex items-center justify-center gap-2 border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] py-3 px-6 rounded-lg hover:bg-[var(--color-primary-blue)] hover:text-white transition-all duration-300 font-semibold"
          >
            <Mail className="w-5 h-5" />
            Contactar soporte
          </Link>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-white border border-[var(--color-border-subtle)] text-[var(--color-text-dark)] py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold mb-6"
        >
          <Home className="w-5 h-5" />
          Volver al inicio
        </Link>

        {/* Información de contacto */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-[var(--color-text-light)] mb-4 text-lg font-medium">
            ¿Tienes dudas sobre tu pago pendiente?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+5491123456789"
              className="flex items-center gap-2 text-[var(--color-primary-blue)] hover:text-[var(--color-secondary-cyan)] font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>+54 911 2345-6789</span>
            </a>
            <span className="hidden sm:block text-[var(--color-border-subtle)]">|</span>
            <a
              href="mailto:info@ravello.com"
              className="flex items-center gap-2 text-[var(--color-primary-blue)] hover:text-[var(--color-secondary-cyan)] font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>info@ravello.com</span>
            </a>
          </div>
        </div>

        {/* Mensaje de tranquilidad */}
        <div className="mt-8 text-center">
          <p className="text-xl text-[var(--color-text-light)] font-medium mb-2">
            No te preocupes, tu reserva está guardada y segura 🔒
          </p>
          <p className="text-sm text-[var(--color-text-light)]">
            Estamos trabajando para confirmar tu pago lo antes posible
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

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
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

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
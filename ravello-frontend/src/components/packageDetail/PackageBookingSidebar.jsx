// components/packageDetail/PackageBookingSidebar.jsx
import React, { useState } from "react";
import { Clock, MapPin, Star, Users, AlertCircle, CreditCard, MessageCircle, Loader2, LogIn, UserCheck, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  canBook
}) {
  const navigate = useNavigate();
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Calcular precio total
  const precioAdulto = selectedDate?.precioFinal || selectedDate?.precio || pkg.precioBase || 0;
  const precioNino = selectedDate?.precioNino || precioAdulto * 0.7;
  const precioTotal = (precioAdulto * adultos) + (precioNino * ninos);

  const handleReservar = () => {
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

    // Preparar datos para enviar (SIN datos de contacto)
    const bookingData = {
      pasajeros: { adultos, ninos }
    };

    // Llamar al handler (que verificará auth y perfil)
    onPayment(bookingData);
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
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 select-none">
      {/* Precio */}
      <div className="mb-6">
        <p className="text-sm text-light mb-1">Precio total</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary-blue">
            ${precioTotal.toLocaleString()}
          </span>
          <span className="text-light">{selectedDate?.moneda || pkg.moneda || "ARS"}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {adultos} {adultos === 1 ? 'adulto' : 'adultos'}
          {ninos > 0 && ` + ${ninos} ${ninos === 1 ? 'niño' : 'niños'}`}
        </p>
      </div>

      {/* Selección de pasajeros */}
      <div className="mb-6 pb-6 border-b border-border-subtle">
        <label className="text-sm font-semibold text-dark mb-3 block flex items-center gap-2">
          <Users size={16} />
          Pasajeros
        </label>

        <div className="space-y-3">
          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Adultos</p>
              <p className="text-xs text-gray-500">13 años o más</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdultos(Math.max(1, adultos - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
                type="button"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{adultos}</span>
              <button
                onClick={() => setAdultos(adultos + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Niños</p>
              <p className="text-xs text-gray-500">0-12 años</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNinos(Math.max(0, ninos - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
                type="button"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{ninos}</span>
              <button
                onClick={() => setNinos(ninos + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fechas disponibles */}
      {datesLoading ? (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <p className="text-sm text-light">Cargando fechas...</p>
        </div>
      ) : packageDates.length > 0 ? (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <label className="text-sm font-semibold text-dark mb-2 block">
            Selecciona tu fecha de salida
          </label>
          <select
            value={selectedDate?._id || ""}
            onChange={(e) => {
              const date = packageDates.find((d) => d._id === e.target.value);
              setSelectedDate(date);
            }}
            className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            {packageDates.map((date) => (
              <option key={date._id} value={date._id}>
                {formatDate(date.salida)} - {formatDate(date.regreso)}
              </option>
            ))}
          </select>

          {selectedDate && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-light">Precio por adulto:</span>
                <span className="font-semibold text-dark">
                  ${precioAdulto.toLocaleString()} {selectedDate.moneda}
                </span>
              </div>
              {ninos > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-light">Precio por niño:</span>
                  <span className="font-semibold text-dark">
                    ${precioNino.toLocaleString()} {selectedDate.moneda}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-light">Cupos disponibles:</span>
                <span className="font-semibold text-dark">
                  {selectedDate.cuposDisponibles}
                </span>
              </div>
              {selectedDate.cuposDisponibles < 5 && (
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  <AlertCircle size={14} />
                  <span>¡Últimos {selectedDate.cuposDisponibles} cupos!</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-2 text-sm text-light bg-gray-50 p-3 rounded-lg">
            <AlertCircle size={16} />
            <span>No hay fechas disponibles en este momento</span>
          </div>
        </div>
      )}

      {/* ALERTA: Usuario no autenticado */}
      {!isAuthenticated && (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LogIn className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Inicia sesión para reservar
                </p>
                <p className="text-xs text-blue-700">
                  Necesitas una cuenta para hacer tu reserva
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA: Perfil incompleto */}
      {isAuthenticated && !canBook && (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">
                  Completa tu perfil
                </p>
                <p className="text-xs text-yellow-700">
                  Te pediremos completar algunos datos antes de continuar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN: Perfil completo */}
      {isAuthenticated && canBook && (
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <UserCheck className="text-green-600 flex-shrink-0" size={18} />
              <p className="text-sm text-green-700">
                Perfil completo - Listo para reservar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-3">
        {/* Botón principal: Login o Reservar */}
        {!isAuthenticated ? (
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-primary-blue hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión para Reservar
          </button>
        ) : (
          <button
            onClick={handleReservar}
            disabled={paymentLoading || !selectedDate || packageDates.length === 0}
            className="w-full bg-primary-red hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {canBook ? "Reservar y Pagar" : "Completar Perfil y Reservar"}
              </>
            )}
          </button>
        )}

        {/* Botón Consultar */}
        <button
          onClick={onContact}
          className="w-full bg-white hover:bg-gray-50 text-primary-blue font-semibold py-3 px-6 rounded-lg border-2 border-primary-blue transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Hacer una Consulta
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Pago seguro con MercadoPago
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Confirmación inmediata
          </p>
          {isAuthenticated && (
            <p className="flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              Tus datos se toman de tu perfil
            </p>
          )}
          {pkg.montoSenia && (
            <p className="flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              Seña: ${pkg.montoSenia.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Detalles del paquete */}
      <div className="mt-6 pt-6 border-t border-border-subtle space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-light">
            <Clock size={16} />
            <span>Duración</span>
          </div>
          <span className="font-semibold text-dark">
            {pkg.duracionTotal || 0} días
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-light">
            <MapPin size={16} />
            <span>Tipo</span>
          </div>
          <span className="font-semibold text-dark capitalize">
            {pkg.tipo || "Internacional"}
          </span>
        </div>

        {pkg.categoria && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-light">
              <Star size={16} />
              <span>Categoría</span>
            </div>
            <span className="font-semibold text-dark capitalize">
              {pkg.categoria}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
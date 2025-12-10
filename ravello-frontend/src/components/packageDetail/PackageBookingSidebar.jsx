import React from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Star, DollarSign, Users, Plane, AlertCircle } from "lucide-react";

export default function PackageBookingSidebar({ 
  pkg, 
  packageDates, 
  selectedDate, 
  setSelectedDate, 
  datesLoading 
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      {/* Precio */}
      <div className="mb-6">
        <p className="text-sm text-light mb-1">Precio desde</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary-blue">
            ${pkg.precioBase?.toLocaleString()}
          </span>
          <span className="text-light">{pkg.moneda || "ARS"}</span>
        </div>
        {pkg.descuentoNinos > 0 && (
          <p className="text-sm text-green-600 mt-2">
            {pkg.descuentoNinos}% descuento para niños
          </p>
        )}
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
                <span className="text-light">Precio final:</span>
                <span className="font-bold text-primary-blue text-lg">
                  ${selectedDate.precioFinal?.toLocaleString()} {selectedDate.moneda}
                </span>
              </div>
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

      {/* Información del paquete */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border-subtle">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-light">
            <Clock size={16} />
            <span>Duración</span>
          </div>
          <span className="font-semibold text-dark">
            {pkg.duracionTotal || 0} días
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-light">
            <MapPin size={16} />
            <span>Tipo</span>
          </div>
          <span className="font-semibold text-dark capitalize">
            {pkg.tipo || "Internacional"}
          </span>
        </div>
        
        {pkg.categoria && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-light">
              <Star size={16} />
              <span>Categoría</span>
            </div>
            <span className="font-semibold text-dark capitalize">
              {pkg.categoria}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-light">
            <DollarSign size={16} />
            <span>Seña</span>
          </div>
          <span className="font-semibold text-dark">
            ${pkg.montoSenia?.toLocaleString()}
          </span>
        </div>
        
        {pkg.plazoPagoTotalDias && (
          <div className="text-xs text-light mt-2 bg-blue-50 p-2 rounded">
            💡 Plazo de pago total: {pkg.plazoPagoTotalDias} días antes de la salida
          </div>
        )}
        
        {pkg.capacidadMinima && pkg.capacidadMaxima && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-light">
              <Users size={16} />
              <span>Grupo</span>
            </div>
            <span className="font-semibold text-dark">
              {pkg.capacidadMinima} - {pkg.capacidadMaxima} personas
            </span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        <Link
          to={`/contacto?paquete=${pkg._id}${
            selectedDate ? `&fecha=${selectedDate._id}` : ""
          }`}
          className="w-full block text-center px-6 py-3 bg-primary-red text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          Reservar ahora
        </Link>
        <Link
          to={`/contacto?paquete=${pkg._id}&consulta=true`}
          className="w-full block text-center px-6 py-3 border-2 border-primary-blue text-primary-blue font-semibold rounded-lg hover:bg-primary-blue hover:text-white transition-all"
        >
          Consultar disponibilidad
        </Link>
      </div>

      {/* Contacto rápido */}
      <div className="mt-6 pt-6 border-t border-border-subtle">
        <p className="text-sm text-light mb-3 text-center">
          ¿Necesitas ayuda? Contáctanos
        </p>
        <div className="space-y-2">
          <a
            href="tel:+5491123456789"
            className="flex items-center justify-center gap-2 text-sm text-primary-blue hover:underline"
          >
            <Plane size={16} />
            <span>+54 911 2345-6789</span>
          </a>
          <a
            href="mailto:info@ravello.com"
            className="flex items-center justify-center gap-2 text-sm text-primary-blue hover:underline"
          >
            <span>info@ravello.com</span>
          </a>
        </div>
      </div>

      {/* Próximas salidas */}
      {pkg.fechasDisponibles && pkg.fechasDisponibles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border-subtle">
          <h3 className="text-sm font-semibold text-dark mb-3">
            Próximas salidas disponibles
          </h3>
          <div className="space-y-2">
            {pkg.fechasDisponibles.slice(0, 3).map((fecha, idx) => (
              <div key={idx} className="text-xs bg-background-light p-2 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-light">{formatDate(fecha.inicio)}</span>
                  {fecha.cupos && (
                    <span className="font-semibold text-primary-blue">
                      {fecha.cupos} cupos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
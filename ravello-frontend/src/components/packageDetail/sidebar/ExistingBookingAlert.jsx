// components/packageDetail/ExistingBookingAlert.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExistingBookingAlert({ booking }) {
  const navigate = useNavigate();

  if (!booking) return null;

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-green-100 text-green-800',
      en_proceso_pago: 'bg-blue-100 text-blue-800',
      pagada: 'bg-emerald-100 text-emerald-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      en_proceso_pago: 'En proceso de pago',
      pagada: 'Pagada'
    };
    return textos[estado] || estado;
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">
            Ya tienes una reserva activa para este paquete
          </h4>
          
          <div className="space-y-1.5 text-sm text-yellow-800">
            <p>
              <span className="font-medium">Número de reserva:</span>{' '}
              <span className="font-mono">{booking.numeroReserva}</span>
            </p>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Estado:</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEstadoBadge(booking.estado)}`}>
                {getEstadoTexto(booking.estado)}
              </span>
            </div>
            
            {booking.montoTotal && (
              <p>
                <span className="font-medium">Monto total:</span>{' '}
                ${booking.montoTotal.toLocaleString()} {booking.moneda || 'ARS'}
              </p>
            )}

            {booking.montoPendiente > 0 && (
              <p>
                <span className="font-medium">Monto pendiente:</span>{' '}
                <span className="text-red-700 font-semibold">
                  ${booking.montoPendiente.toLocaleString()} {booking.moneda || 'ARS'}
                </span>
              </p>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-yellow-200">
            <p className="text-xs text-yellow-700 mb-2">
              No puedes crear una nueva reserva hasta que completes o canceles esta.
            </p>
            <button
              onClick={() => navigate('/mis-reservas')}
              className="inline-flex items-center text-sm font-medium text-yellow-900 hover:text-yellow-700 underline transition-colors"
            >
              Ver detalles de mi reserva →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
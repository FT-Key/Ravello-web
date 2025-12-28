// src/components/profile/tabs/StatsTab.jsx
import React from 'react';
import { 
  BarChart3, Calendar, CheckCircle, XCircle, 
  DollarSign, TrendingUp, Award, MapPin 
} from 'lucide-react';

export default function StatsTab({ user }) {
  const stats = user?.estadisticas || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const successRate = stats.totalReservas 
    ? Math.round((stats.reservasCompletadas / stats.totalReservas) * 100)
    : 0;

  const averageSpending = stats.reservasCompletadas 
    ? stats.totalGastado / stats.reservasCompletadas
    : 0;

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reservas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-blue">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-light font-medium mb-1">Total Reservas</p>
              <p className="text-3xl font-bold text-dark">{stats.totalReservas || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
        </div>

        {/* Reservas Completadas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-light font-medium mb-1">Completadas</p>
              <p className="text-3xl font-bold text-dark">{stats.reservasCompletadas || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Reservas Canceladas */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-light font-medium mb-1">Canceladas</p>
              <p className="text-3xl font-bold text-dark">{stats.reservasCanceladas || 0}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Total Gastado */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-secondary-cyan">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-light font-medium mb-1">Total Gastado</p>
              <p className="text-2xl font-bold text-dark">
                {formatCurrency(stats.totalGastado)}
              </p>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-secondary-cyan" />
            </div>
          </div>
        </div>
      </div>

      {/* Información Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Métricas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary-blue" />
            Métricas de Viaje
          </h3>

          <div className="space-y-4">
            {/* Tasa de Éxito */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark">Tasa de Éxito</span>
                <span className="text-sm font-bold text-primary-blue">{successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <p className="text-xs text-light mt-1">
                Porcentaje de reservas completadas exitosamente
              </p>
            </div>

            {/* Gasto Promedio */}
            <div className="pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark">Gasto Promedio por Viaje</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(averageSpending)}
                </span>
              </div>
              <p className="text-xs text-light">
                Basado en {stats.reservasCompletadas || 0} viajes completados
              </p>
            </div>

            {/* Última Reserva */}
            <div className="pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark">Última Reserva</span>
                <span className="text-sm font-semibold text-primary-blue">
                  {formatDate(stats.ultimaReserva)}
                </span>
              </div>
            </div>

            {/* Cliente Desde */}
            <div className="pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark">Cliente Desde</span>
                <span className="text-sm font-semibold text-primary-blue">
                  {formatDate(stats.clienteDesde)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Logros */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
            <Award size={20} className="text-primary-blue" />
            Logros y Beneficios
          </h3>

          <div className="space-y-3">
            {/* Logro: Primer Viaje */}
            <div className={`p-4 rounded-lg border-2 ${
              stats.totalReservas >= 1 
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-primary-blue' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${stats.totalReservas >= 1 ? 'grayscale-0' : 'grayscale'}`}>
                  ✈️
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">Primer Viaje</p>
                  <p className="text-xs text-light">Realiza tu primera reserva</p>
                </div>
                {stats.totalReservas >= 1 && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>
            </div>

            {/* Logro: Viajero Frecuente */}
            <div className={`p-4 rounded-lg border-2 ${
              stats.reservasCompletadas >= 3 
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${stats.reservasCompletadas >= 3 ? 'grayscale-0' : 'grayscale'}`}>
                  🌍
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">Viajero Frecuente</p>
                  <p className="text-xs text-light">Completa 3 viajes ({stats.reservasCompletadas || 0}/3)</p>
                </div>
                {stats.reservasCompletadas >= 3 && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>
            </div>

            {/* Logro: Explorador */}
            <div className={`p-4 rounded-lg border-2 ${
              stats.reservasCompletadas >= 5 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${stats.reservasCompletadas >= 5 ? 'grayscale-0' : 'grayscale'}`}>
                  🏆
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">Explorador</p>
                  <p className="text-xs text-light">Completa 5 viajes ({stats.reservasCompletadas || 0}/5)</p>
                </div>
                {stats.reservasCompletadas >= 5 && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>
            </div>

            {/* Logro: Aventurero VIP */}
            <div className={`p-4 rounded-lg border-2 ${
              stats.reservasCompletadas >= 10 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${stats.reservasCompletadas >= 10 ? 'grayscale-0' : 'grayscale'}`}>
                  👑
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark">Aventurero VIP</p>
                  <p className="text-xs text-light">Completa 10 viajes ({stats.reservasCompletadas || 0}/10)</p>
                </div>
                {stats.reservasCompletadas >= 10 && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>
            </div>
          </div>

          {/* Mensaje motivacional */}
          {stats.totalReservas === 0 && (
            <div className="mt-6 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] rounded-lg p-4 text-white">
              <p className="font-semibold mb-1">¡Empieza tu aventura!</p>
              <p className="text-sm opacity-90">
                Reserva tu primer viaje y comienza a desbloquear logros increíbles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje si no hay estadísticas */}
      {stats.totalReservas === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">
            Aún no tienes reservas
          </h3>
          <p className="text-light mb-6 max-w-md mx-auto">
            ¡Empieza tu aventura! Explora nuestros paquetes turísticos y descubre destinos increíbles
          </p>
          <a
            href="/paquetes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <TrendingUp size={18} />
            Ver Paquetes Disponibles
          </a>
        </div>
      )}
    </div>
  );
}
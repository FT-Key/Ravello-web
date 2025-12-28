// src/components/profile/ProfileHeader.jsx
import React from 'react';
import { User, CheckCircle, AlertTriangle, Calendar, Mail, Phone } from 'lucide-react';

export default function ProfileHeader({ user }) {
  const getInitials = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
    }
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getCompletionPercentage = () => {
    if (!user) return 0;
    const fields = ['nombre', 'apellido', 'telefono', 'documento', 'fechaNacimiento'];
    const completed = fields.filter(field => {
      if (field === 'documento') {
        return user.documento?.tipo && user.documento?.numero;
      }
      return !!user[field];
    });
    return Math.round((completed.length / fields.length) * 100);
  };

  const completion = getCompletionPercentage();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Banner superior con gradiente */}
      <div className="h-32 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] relative">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>

      <div className="px-6 pb-6 -mt-16 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-primary-red)] rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
              {getInitials()}
            </div>
            {user?.emailVerificado && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Info del usuario */}
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-1">
                  {user?.nombre} {user?.apellido}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-light">
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {user.email}
                    </span>
                  )}
                  {user?.telefono && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} />
                      {user.telefono}
                    </span>
                  )}
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white text-xs font-semibold rounded-full">
                    {user?.rol === 'admin' ? '👑 Admin' : user?.rol === 'editor' ? '✏️ Editor' : '👤 Cliente'}
                  </span>
                  
                  {user?.emailVerificado ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle size={12} />
                      Email Verificado
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Email sin verificar
                    </span>
                  )}

                  {user?.estadisticas?.clienteDesde && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Calendar size={12} />
                      Desde {new Date(user.estadisticas.clienteDesde).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Porcentaje de completitud */}
              <div className="bg-background-light rounded-xl p-4 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark">Perfil Completo</span>
                  <span className="text-lg font-bold text-primary-blue">{completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                {completion < 100 && (
                  <p className="text-xs text-light mt-2">
                    Completa tu perfil para poder hacer reservas
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
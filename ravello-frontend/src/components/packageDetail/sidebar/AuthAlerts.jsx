// ===================================================================
// components/packageDetail/sidebar/AuthAlerts.jsx
// ===================================================================

import React from "react";
import { AlertCircle, UserCheck, AlertTriangle } from "lucide-react";

export default function AuthAlerts({ isAuthenticated, canBook }) {
  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Inicia sesión para reservar</p>
            <p className="text-sm text-blue-700 mt-1">
              Necesitas una cuenta para hacer tu reserva
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!canBook) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Completa tu perfil</p>
            <p className="text-sm text-amber-700 mt-1">
              Te pediremos completar algunos datos antes de continuar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-green-900">Perfil completo - Listo para reservar</p>
        </div>
      </div>
    </div>
  );
}


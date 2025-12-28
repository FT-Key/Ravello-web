// src/components/profile/tabs/PreferencesTab.jsx
import React, { useState } from 'react';
import { Settings, Bell, Mail, MessageSquare, Globe, DollarSign, Save, Loader2, CheckCircle } from 'lucide-react';
import clientAxios from '../../../api/axiosConfig';

export default function PreferencesTab({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    newsletter: user?.preferencias?.newsletter ?? true,
    notificacionesEmail: user?.preferencias?.notificacionesEmail ?? true,
    notificacionesSMS: user?.preferencias?.notificacionesSMS ?? false,
    idioma: user?.preferencias?.idioma || 'es',
    monedaPreferida: user?.preferencias?.monedaPreferida || 'ARS'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await clientAxios.put('/users/me/perfil', {
        preferencias: formData
      });

      if (response.data.success) {
        setSuccess(true);
        onUpdate();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar preferencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
          <Settings size={24} className="text-primary-blue" />
          Preferencias
        </h2>
        <p className="text-light mt-2">
          Personaliza tu experiencia en Ravello
        </p>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-sm text-green-800 font-medium">
            ¡Preferencias actualizadas exitosamente!
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notificaciones */}
        <div>
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            <Bell size={20} className="text-primary-blue" />
            Notificaciones
          </h3>
          
          <div className="space-y-4">
            {/* Newsletter */}
            <div className="flex items-start justify-between p-4 bg-background-light rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={18} className="text-primary-blue" />
                  <span className="font-medium text-dark">Newsletter</span>
                </div>
                <p className="text-sm text-light">
                  Recibe ofertas exclusivas y noticias sobre destinos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>

            {/* Notificaciones Email */}
            <div className="flex items-start justify-between p-4 bg-background-light rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={18} className="text-primary-blue" />
                  <span className="font-medium text-dark">Notificaciones por Email</span>
                </div>
                <p className="text-sm text-light">
                  Actualizaciones sobre tus reservas y cambios importantes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData.notificacionesEmail}
                  onChange={(e) => setFormData({ ...formData, notificacionesEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>

            {/* Notificaciones SMS */}
            <div className="flex items-start justify-between p-4 bg-background-light rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={18} className="text-primary-blue" />
                  <span className="font-medium text-dark">Notificaciones por SMS</span>
                </div>
                <p className="text-sm text-light">
                  Alertas urgentes sobre tus reservas por mensaje de texto
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={formData.notificacionesSMS}
                  onChange={(e) => setFormData({ ...formData, notificacionesSMS: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Idioma y Moneda */}
        <div>
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary-blue" />
            Regional
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Idioma
              </label>
              <select
                value={formData.idioma}
                onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Moneda Preferida
              </label>
              <select
                value={formData.monedaPreferida}
                onChange={(e) => setFormData({ ...formData, monedaPreferida: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
              >
                <option value="ARS">🇦🇷 Peso Argentino (ARS)</option>
                <option value="USD">🇺🇸 Dólar (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Consejo:</strong> Mantén las notificaciones por email activadas para recibir 
            información importante sobre tus reservas y actualizaciones de vuelos.
          </p>
        </div>

        {/* Botón de guardar */}
        <div className="pt-4 border-t border-border-subtle">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando preferencias...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Preferencias
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
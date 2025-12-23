// components/packageDetail/CompleteProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, Loader2, CheckCircle } from 'lucide-react';
import clientAxios from '../../api/axiosConfig';

export default function CompleteProfileModal({ 
  isOpen, 
  onClose, 
  onProfileCompleted,
  camposFaltantes = [],
  userProfile = {}
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    documento: {
      tipo: 'DNI',
      numero: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-cargar datos existentes del usuario
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombre: userProfile.nombre || '',
        apellido: userProfile.apellido || '',
        telefono: userProfile.telefono || '',
        documento: {
          tipo: userProfile.documento?.tipo || 'DNI',
          numero: userProfile.documento?.numero || ''
        }
      });
    }
  }, [userProfile]);

  // Verificar si un campo está faltante
  const isCampoFaltante = (campo) => {
    return camposFaltantes.includes(campo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar solo los campos faltantes
    if (isCampoFaltante('nombre') && !formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (isCampoFaltante('apellido') && !formData.apellido.trim()) {
      setError('El apellido es requerido');
      return;
    }
    if (isCampoFaltante('telefono') && !formData.telefono.trim()) {
      setError('El teléfono es requerido');
      return;
    }
    if (isCampoFaltante('documento') && !formData.documento.numero.trim()) {
      setError('El número de documento es requerido');
      return;
    }

    try {
      setLoading(true);

      // Solo enviar campos que están faltantes
      const dataToUpdate = {};
      
      if (isCampoFaltante('nombre')) dataToUpdate.nombre = formData.nombre;
      if (isCampoFaltante('apellido')) dataToUpdate.apellido = formData.apellido;
      if (isCampoFaltante('telefono')) dataToUpdate.telefono = formData.telefono;
      if (isCampoFaltante('documento')) dataToUpdate.documento = formData.documento;

      console.log('📤 Enviando actualización:', dataToUpdate);

      const response = await clientAxios.put('/users/me/perfil', dataToUpdate);

      if (response.data.success) {
        console.log('✅ Perfil actualizado:', response.data);
        onProfileCompleted(response.data.data);
      }
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Si no hay campos faltantes, no mostrar el modal
  if (camposFaltantes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Completa tu perfil
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            Para continuar con tu reserva, necesitamos que completes los siguientes datos:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            {camposFaltantes.map((campo) => (
              <li key={campo} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                <span className="capitalize">
                  {campo === 'documento' ? 'Documento de identidad' : campo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre - Solo si falta */}
          {isCampoFaltante('nombre') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Nombre</p>
                <p className="text-sm text-green-700">{formData.nombre}</p>
              </div>
            </div>
          )}

          {/* Apellido - Solo si falta */}
          {isCampoFaltante('apellido') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Apellido</p>
                <p className="text-sm text-green-700">{formData.apellido}</p>
              </div>
            </div>
          )}

          {/* Teléfono - Solo si falta */}
          {isCampoFaltante('telefono') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="+54 11 1234-5678"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Incluye el código de área
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Teléfono</p>
                <p className="text-sm text-green-700">{formData.telefono}</p>
              </div>
            </div>
          )}

          {/* Documento - Solo si falta */}
          {isCampoFaltante('documento') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento de identidad *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.documento.tipo}
                  onChange={(e) => setFormData({
                    ...formData,
                    documento: { ...formData.documento, tipo: e.target.value }
                  })}
                  className="col-span-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIL">CUIL</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Otro">Otro</option>
                </select>
                <div className="col-span-2 relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.documento.numero}
                    onChange={(e) => setFormData({
                      ...formData,
                      documento: { ...formData.documento, numero: e.target.value }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Número"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sin puntos ni guiones
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Documento</p>
                <p className="text-sm text-green-700">
                  {formData.documento.tipo} {formData.documento.numero}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar y Continuar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
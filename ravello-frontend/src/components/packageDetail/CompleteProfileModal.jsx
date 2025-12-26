// ===================================================================
// components/packageDetail/CompleteProfileModal.jsx
// ===================================================================

import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, Loader2, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import clientAxios from '../../api/axiosConfig';

export default function CompleteProfileModal({ 
  isOpen, 
  onClose, 
  onProfileCompleted,
  userProfile = {}
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    documento: {
      tipo: 'DNI',
      numero: ''
    },
    fechaNacimiento: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
        },
        fechaNacimiento: userProfile.fechaNacimiento 
          ? new Date(userProfile.fechaNacimiento).toISOString().split('T')[0]
          : ''
      });
    }
  }, [userProfile, isOpen]);

  // Determinar campos faltantes basándose en el modelo
  const camposFaltantes = userProfile.camposRequeridos 
    ? Object.entries(userProfile.camposRequeridos)
        .filter(([_, completed]) => !completed)
        .map(([field]) => field)
    : ['nombre', 'apellido', 'telefono', 'documento'];

  // Verificar si un campo está faltante
  const isCampoFaltante = (campo) => {
    return camposFaltantes.includes(campo);
  };

  // Validaciones específicas
  const validateTelefono = (tel) => {
    // Acepta formatos: +54 11 1234-5678, 11 1234 5678, 1112345678
    const cleaned = tel.replace(/[\s\-]/g, '');
    if (cleaned.length < 10) {
      return 'El teléfono debe tener al menos 10 dígitos';
    }
    return null;
  };

  const validateDocumento = (numero) => {
    const cleaned = numero.replace(/[\s\-\.]/g, '');
    if (cleaned.length < 7 || cleaned.length > 9) {
      return 'El documento debe tener entre 7 y 9 dígitos';
    }
    if (!/^\d+$/.test(cleaned)) {
      return 'El documento solo debe contener números';
    }
    return null;
  };

  const validateFechaNacimiento = (fecha) => {
    if (!fecha) return 'La fecha de nacimiento es requerida';
    
    const birthDate = new Date(fecha);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
      return 'Debes ser mayor de 18 años para hacer una reserva';
    }
    if (age > 120) {
      return 'Por favor ingresa una fecha válida';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    const errors = {};

    // Validar campos faltantes
    if (isCampoFaltante('nombre') && !formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (isCampoFaltante('apellido') && !formData.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    }
    
    if (isCampoFaltante('telefono')) {
      if (!formData.telefono.trim()) {
        errors.telefono = 'El teléfono es requerido';
      } else {
        const telefonoError = validateTelefono(formData.telefono);
        if (telefonoError) errors.telefono = telefonoError;
      }
    }
    
    if (isCampoFaltante('documento')) {
      if (!formData.documento.numero.trim()) {
        errors.documento = 'El número de documento es requerido';
      } else {
        const docError = validateDocumento(formData.documento.numero);
        if (docError) errors.documento = docError;
      }
    }

    // Validar fecha de nacimiento si está faltante
    if (!userProfile.fechaNacimiento) {
      const fechaError = validateFechaNacimiento(formData.fechaNacimiento);
      if (fechaError) errors.fechaNacimiento = fechaError;
    }

    // Si hay errores, mostrarlos
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const dataToUpdate = {};
      
      if (isCampoFaltante('nombre')) dataToUpdate.nombre = formData.nombre.trim();
      if (isCampoFaltante('apellido')) dataToUpdate.apellido = formData.apellido.trim();
      if (isCampoFaltante('telefono')) dataToUpdate.telefono = formData.telefono.trim();
      if (isCampoFaltante('documento')) {
        dataToUpdate.documento = {
          tipo: formData.documento.tipo,
          numero: formData.documento.numero.replace(/[\s\-\.]/g, '')
        };
      }
      if (!userProfile.fechaNacimiento && formData.fechaNacimiento) {
        dataToUpdate.fechaNacimiento = formData.fechaNacimiento;
      }

      console.log('📤 Enviando actualización de perfil:', dataToUpdate);

      const response = await clientAxios.put('/users/me/perfil', dataToUpdate);

      if (response.data.success) {
        console.log('✅ Perfil actualizado exitosamente');
        
        // Notificar al componente padre
        onProfileCompleted(response.data.data);
        
        // Cerrar modal
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(
        err.response?.data?.message || 
        'Error al actualizar el perfil. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Si el perfil ya está completo, no mostrar modal
  if (userProfile.perfilCompleto && camposFaltantes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Completa tu perfil
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Necesitamos verificar tu identidad antes de continuar
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                ¿Por qué necesitamos estos datos?
              </p>
              <p className="text-sm text-blue-700">
                Para procesar tu reserva de manera segura y cumplir con las regulaciones turísticas, 
                necesitamos verificar tu identidad.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          {isCampoFaltante('nombre') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre: e.target.value });
                    setValidationErrors({ ...validationErrors, nombre: null });
                  }}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    validationErrors.nombre ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                  placeholder="Ej: Juan"
                  disabled={loading}
                />
              </div>
              {validationErrors.nombre && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.nombre}</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800">Nombre</p>
                <p className="text-sm text-green-900 font-medium">{formData.nombre}</p>
              </div>
            </div>
          )}

          {/* Apellido */}
          {isCampoFaltante('apellido') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => {
                    setFormData({ ...formData, apellido: e.target.value });
                    setValidationErrors({ ...validationErrors, apellido: null });
                  }}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    validationErrors.apellido ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                  placeholder="Ej: Pérez"
                  disabled={loading}
                />
              </div>
              {validationErrors.apellido && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.apellido}</p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800">Apellido</p>
                <p className="text-sm text-green-900 font-medium">{formData.apellido}</p>
              </div>
            </div>
          )}

          {/* Fecha de Nacimiento - Opcional pero recomendado */}
          {!userProfile.fechaNacimiento && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de nacimiento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => {
                    setFormData({ ...formData, fechaNacimiento: e.target.value });
                    setValidationErrors({ ...validationErrors, fechaNacimiento: null });
                  }}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    validationErrors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                  disabled={loading}
                />
              </div>
              {validationErrors.fechaNacimiento && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.fechaNacimiento}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Debes ser mayor de 18 años
              </p>
            </div>
          )}

          {/* Teléfono */}
          {isCampoFaltante('telefono') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de contacto *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => {
                    setFormData({ ...formData, telefono: e.target.value });
                    setValidationErrors({ ...validationErrors, telefono: null });
                  }}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    validationErrors.telefono ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                  placeholder="+54 11 1234-5678"
                  disabled={loading}
                />
              </div>
              {validationErrors.telefono && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.telefono}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Incluye código de país y área
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800">Teléfono</p>
                <p className="text-sm text-green-900 font-medium">{formData.telefono}</p>
              </div>
            </div>
          )}

          {/* Documento */}
          {isCampoFaltante('documento') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documento de identidad *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={formData.documento.tipo}
                  onChange={(e) => setFormData({
                    ...formData,
                    documento: { ...formData.documento, tipo: e.target.value }
                  })}
                  className="col-span-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white"
                  disabled={loading}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        documento: { ...formData.documento, numero: e.target.value }
                      });
                      setValidationErrors({ ...validationErrors, documento: null });
                    }}
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      validationErrors.documento ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                    placeholder="Número"
                    disabled={loading}
                  />
                </div>
              </div>
              {validationErrors.documento && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.documento}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Sin puntos ni guiones (Ej: 12345678)
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-800">Documento</p>
                <p className="text-sm text-green-900 font-medium">
                  {formData.documento.tipo} {formData.documento.numero}
                </p>
              </div>
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Aviso de privacidad */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              🔒 Tus datos están protegidos y solo se utilizarán para procesar tu reserva de acuerdo 
              con nuestra política de privacidad.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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
// src/components/profile/tabs/SecurityTab.jsx
import React, { useState } from 'react';
import { Shield, Lock, Loader2, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import clientAxios from '../../../api/axiosConfig';

export default function SecurityTab({ user }) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Al menos un número');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setSuccess(false);

    const errors = {};

    // Validar contraseña actual
    if (!formData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es requerida';
    }

    // Validar nueva contraseña
    if (!formData.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        errors.newPassword = passwordErrors.join(', ');
      }
    }

    // Validar confirmación
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const response = await clientAxios.put('/users/me/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Error al cambiar la contraseña. Verifica tu contraseña actual.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Muy débil', color: 'bg-red-500' },
      { strength: 2, label: 'Débil', color: 'bg-orange-500' },
      { strength: 3, label: 'Media', color: 'bg-yellow-500' },
      { strength: 4, label: 'Fuerte', color: 'bg-green-500' },
      { strength: 5, label: 'Muy fuerte', color: 'bg-green-600' }
    ];

    return levels[strength];
  };

  const strength = passwordStrength(formData.newPassword);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
          <Shield size={24} className="text-primary-blue" />
          Seguridad de la Cuenta
        </h2>
        <p className="text-light mt-2">
          Mantén tu cuenta segura actualizando tu contraseña regularmente
        </p>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-green-800">
              ¡Contraseña actualizada exitosamente!
            </p>
            <p className="text-xs text-green-700 mt-1">
              Tu contraseña ha sido cambiada de forma segura.
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contraseña Actual */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Contraseña Actual *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => {
                setFormData({ ...formData, currentPassword: e.target.value });
                setValidationErrors({ ...validationErrors, currentPassword: null });
              }}
              className={`w-full pl-10 pr-12 py-2.5 border ${
                validationErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.currentPassword && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.currentPassword}</p>
          )}
        </div>

        {/* Nueva Contraseña */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Nueva Contraseña *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value });
                setValidationErrors({ ...validationErrors, newPassword: null });
              }}
              className={`w-full pl-10 pr-12 py-2.5 border ${
                validationErrors.newPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
              placeholder="Ingresa tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Indicador de fortaleza */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      level <= strength.strength ? strength.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                strength.strength <= 2 ? 'text-red-600' : 
                strength.strength === 3 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {strength.label}
              </p>
            </div>
          )}

          {validationErrors.newPassword && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.newPassword}</p>
          )}

          {/* Requisitos */}
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-900 mb-2">
              La contraseña debe contener:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <span className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  {formData.newPassword.length >= 8 ? '✓' : '○'}
                </span>
                Mínimo 8 caracteres
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'}
                </span>
                Al menos una letra mayúscula
              </li>
              <li className="flex items-center gap-2">
                <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  {/[a-z]/.test(formData.newPassword) ? '✓' : '○'}
                </span>
                Al menos una letra minúscula
              </li>
              <li className="flex items-center gap-2">
                <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  {/[0-9]/.test(formData.newPassword) ? '✓' : '○'}
                </span>
                Al menos un número
              </li>
            </ul>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Confirmar Nueva Contraseña *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setValidationErrors({ ...validationErrors, confirmPassword: null });
              }}
              className={`w-full pl-10 pr-12 py-2.5 border ${
                validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
          )}
          {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle size={12} />
              Las contraseñas coinciden
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-4 border-t border-border-subtle">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Actualizando contraseña...
              </>
            ) : (
              <>
                <Shield size={18} />
                Cambiar Contraseña
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
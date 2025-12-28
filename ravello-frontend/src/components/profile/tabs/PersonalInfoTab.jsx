// src/components/profile/tabs/PersonalInfoTab.jsx
import React, { useState } from 'react';
import { 
  User, Phone, FileText, Calendar, MapPin, 
  Building, Save, Loader2, CheckCircle, Mail
} from 'lucide-react';
import clientAxios from '../../../api/axiosConfig';

export default function PersonalInfoTab({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    fechaNacimiento: user?.fechaNacimiento 
      ? new Date(user.fechaNacimiento).toISOString().split('T')[0]
      : '',
    documento: {
      tipo: user?.documento?.tipo || 'DNI',
      numero: user?.documento?.numero || ''
    },
    direccion: {
      calle: user?.direccion?.calle || '',
      numero: user?.direccion?.numero || '',
      piso: user?.direccion?.piso || '',
      departamento: user?.direccion?.departamento || '',
      ciudad: user?.direccion?.ciudad || '',
      provincia: user?.direccion?.provincia || '',
      codigoPostal: user?.direccion?.codigoPostal || '',
      pais: user?.direccion?.pais || 'Argentina'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await clientAxios.put('/users/me/perfil', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setEditing(false);
        onUpdate();
        
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      fechaNacimiento: user?.fechaNacimiento 
        ? new Date(user.fechaNacimiento).toISOString().split('T')[0]
        : '',
      documento: {
        tipo: user?.documento?.tipo || 'DNI',
        numero: user?.documento?.numero || ''
      },
      direccion: {
        calle: user?.direccion?.calle || '',
        numero: user?.direccion?.numero || '',
        piso: user?.direccion?.piso || '',
        departamento: user?.direccion?.departamento || '',
        ciudad: user?.direccion?.ciudad || '',
        provincia: user?.direccion?.provincia || '',
        codigoPostal: user?.direccion?.codigoPostal || '',
        pais: user?.direccion?.pais || 'Argentina'
      }
    });
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Información Personal</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-sm text-green-800 font-medium">
            ¡Perfil actualizado exitosamente!
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Datos Básicos */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            <User size={20} className="text-primary-blue" />
            Datos Básicos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email (solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-light mt-1">
                El email no se puede modificar
              </p>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Nombre *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={!editing}
                  className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg ${
                    editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Apellido *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  disabled={!editing}
                  className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg ${
                    editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  disabled={!editing}
                  className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg ${
                    editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Fecha de Nacimiento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  disabled={!editing}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg ${
                    editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documento */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary-blue" />
            Documento de Identidad
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Tipo *
              </label>
              <select
                value={formData.documento.tipo}
                onChange={(e) => setFormData({
                  ...formData,
                  documento: { ...formData.documento, tipo: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
                required
              >
                <option value="DNI">DNI</option>
                <option value="CUIL">CUIL</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark mb-2">
                Número *
              </label>
              <input
                type="text"
                value={formData.documento.numero}
                onChange={(e) => setFormData({
                  ...formData,
                  documento: { ...formData.documento, numero: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Sin puntos ni guiones"
                required
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary-blue" />
            Dirección
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark mb-2">
                Calle
              </label>
              <input
                type="text"
                value={formData.direccion.calle}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, calle: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Número
              </label>
              <input
                type="text"
                value={formData.direccion.numero}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, numero: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Piso
              </label>
              <input
                type="text"
                value={formData.direccion.piso}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, piso: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Departamento
              </label>
              <input
                type="text"
                value={formData.direccion.departamento}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, departamento: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.direccion.ciudad}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, ciudad: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Provincia
              </label>
              <input
                type="text"
                value={formData.direccion.provincia}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, provincia: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Código Postal
              </label>
              <input
                type="text"
                value={formData.direccion.codigoPostal}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, codigoPostal: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                País
              </label>
              <input
                type="text"
                value={formData.direccion.pais}
                onChange={(e) => setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, pais: e.target.value }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white focus:ring-2 focus:ring-primary-blue focus:border-transparent' : 'bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        {editing && (
          <div className="flex gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
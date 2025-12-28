// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import clientAxios from '../../api/axiosConfig';
import { Loader2, AlertCircle } from 'lucide-react';

import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import ProfileTabs from '../../components/profile/ProfileTabs.jsx';
import PersonalInfoTab from '../../components/profile/tabs/PersonalInfoTab.jsx';
import SecurityTab from '../../components/profile/tabs/SecurityTab.jsx';
import PreferencesTab from '../../components/profile/tabs/PreferencesTab.jsx';
import StatsTab from '../../components/profile/tabs/StatsTab.jsx';

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);

  // Cargar datos completos del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await clientAxios.get('/users/me/perfil');
        
        if (response.data.success) {
          setProfileData(response.data.data);
          // Actualizar el usuario en el store
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('No se pudo cargar tu perfil. Por favor recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  // Función para recargar el perfil después de una actualización
  const handleProfileUpdate = async () => {
    try {
      const response = await clientAxios.get('/users/me/perfil');
      if (response.data.success) {
        setProfileData(response.data.data);
        setUser(response.data.data);
      }
    } catch (err) {
      console.error('Error al recargar perfil:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="text-light">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark text-center mb-2">
            Error al cargar el perfil
          </h2>
          <p className="text-light text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header del Perfil */}
        <ProfileHeader user={profileData} />

        {/* Tabs de Navegación */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenido de las Tabs */}
        <div className="mt-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              user={profileData} 
              onUpdate={handleProfileUpdate}
            />
          )}
          
          {activeTab === 'security' && (
            <SecurityTab user={profileData} />
          )}
          
          {activeTab === 'preferences' && (
            <PreferencesTab 
              user={profileData}
              onUpdate={handleProfileUpdate}
            />
          )}
          
          {activeTab === 'stats' && (
            <StatsTab user={profileData} />
          )}
        </div>
      </div>
    </div>
  );
}
// hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import clientAxios from '../api/axiosConfig';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [canBook, setCanBook] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState([]);

  const checkProfile = async () => {
    try {
      setLoading(true);
      
      // Verificar si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Obtener perfil del usuario
      const response = await clientAxios.get('/users/me/perfil');
      
      setUserProfile(response.data.data);
      setCanBook(response.data.puedeReservar);
      setCamposFaltantes(response.data.camposFaltantes || []);
      
    } catch (error) {
      console.error('❌ Error al verificar perfil:', error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProfile();
  }, []);

  const refreshProfile = () => {
    checkProfile();
  };

  return {
    userProfile,
    loading,
    isAuthenticated,
    canBook,
    camposFaltantes,
    refreshProfile
  };
};
// hooks/useBookingValidation.js
import { useState, useCallback } from 'react';
import clientAxios from '../api/axiosConfig';

export function useBookingValidation() {
  const [checking, setChecking] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);

  const checkExistingBooking = useCallback(async (paqueteId) => {
    try {
      setChecking(true);
      const response = await clientAxios.get(`/bookings/verificar-existente/${paqueteId}`);
      
      if (response.data.tieneReserva) {
        setExistingBooking(response.data.data);
        return response.data.data; // Retorna la reserva existente
      }
      
      setExistingBooking(null);
      return null;
    } catch (error) {
      console.error('Error verificando reserva existente:', error);
      setExistingBooking(null);
      return null;
    } finally {
      setChecking(false);
    }
  }, []);

  const clearExistingBooking = useCallback(() => {
    setExistingBooking(null);
  }, []);

  return {
    checking,
    existingBooking,
    checkExistingBooking,
    clearExistingBooking
  };
}
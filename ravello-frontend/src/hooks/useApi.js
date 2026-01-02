// hooks/useApi.js
import { useState, useCallback } from 'react';
import clientAxios from '../api/axiosConfig';

/**
 * Custom hook para manejar peticiones API con manejo de errores robusto
 * @returns {Object} - { loading, error, request, clearError }
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para manejar errores de manera amigable
   * @param {Error} error - Error capturado
   * @param {Object} response - Respuesta de axios (opcional)
   * @returns {string} - Mensaje de error amigable
   */
  const getErrorMessage = (error, response = null) => {
    // Si hay un mensaje personalizado en el error
    if (error.message) {
      // Errores de red
      if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      }
      
      if (error.message.includes("timeout")) {
        return "La solicitud tardó demasiado. Por favor, intenta nuevamente.";
      }
      
      // Errores de servidor
      if (error.message.includes("servidor") || error.message.includes("respondiendo correctamente")) {
        return error.message;
      }
      
      // Errores de pago específicos
      if (error.message.includes("rechazado") || error.message.includes("rejected")) {
        return "Tu pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro medio de pago.";
      }
      
      if (error.message.includes("fondos") || error.message.includes("funds")) {
        return "No hay fondos suficientes. Por favor, intenta con otra tarjeta.";
      }
      
      if (error.message.includes("tarjeta") || error.message.includes("card")) {
        return "Hay un problema con los datos de la tarjeta. Verifica e intenta nuevamente.";
      }
      
      // Si el mensaje no incluye 'undefined' o 'null', usarlo
      if (!error.message.includes('undefined') && !error.message.includes('null')) {
        return error.message;
      }
    }
    
    // Mensajes según código de estado HTTP (desde axios response)
    const status = response?.status || error.response?.status;
    
    if (status) {
      switch (status) {
        case 400:
          return "Datos inválidos. Por favor, verifica la información ingresada.";
        case 401:
          return "No estás autorizado. Por favor, inicia sesión nuevamente.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "El recurso solicitado no fue encontrado.";
        case 409:
          return "Ya existe una reserva con estos datos.";
        case 500:
          return "Error del servidor. Por favor, intenta más tarde.";
        case 503:
          return "Servicio no disponible. Por favor, intenta en unos minutos.";
        default:
          if (status >= 500) {
            return "Error del servidor. Por favor, intenta más tarde.";
          }
      }
    }
    
    // Mensaje genérico
    return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
  };

  /**
   * Realiza una petición con clientAxios y manejo de errores robusto
   * @param {Function} apiCall - Función que realiza la llamada a la API
   * @param {string} errorPrefix - Prefijo para el mensaje de error
   * @returns {Promise<Object>} - Datos de la respuesta
   */
  const request = useCallback(async (apiCall, errorPrefix = "Error") => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error(`❌ ${errorPrefix}:`, err);
      
      // Extraer mensaje de error
      let errorMessage;
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = getErrorMessage(err, err.response);
      }
      
      setError(errorMessage);
      setLoading(false);
      
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    clearError
  };
}

/**
 * Hook específico para operaciones de reservas
 */
export function useBookingApi() {
  const { loading, error, request, clearError } = useApi();

  const createBooking = useCallback(async (bookingData) => {
    return await request(
      () => clientAxios.post('/bookings', bookingData),
      'Error al crear reserva'
    );
  }, [request]);

  const getBooking = useCallback(async (bookingId) => {
    return await request(
      () => clientAxios.get(`/bookings/${bookingId}`),
      'Error al obtener reserva'
    );
  }, [request]);

  const checkExistingBooking = useCallback(async (packageId) => {
    return await request(
      () => clientAxios.get(`/bookings/check/${packageId}`),
      'Error al verificar reserva'
    );
  }, [request]);

  return {
    loading,
    error,
    clearError,
    createBooking,
    getBooking,
    checkExistingBooking
  };
}

/**
 * Hook específico para operaciones de pago
 */
export function usePaymentApi() {
  const { loading, error, request, clearError } = useApi();

  /**
   * Procesar pago con Bricks (inline payment)
   */
  const processBrickPayment = useCallback(async (paymentData) => {
    try {
      const response = await request(
        () => clientAxios.post('/payments/mercadopago/brick', paymentData),
        'Error al procesar pago con Brick'
      );

      return {
        success: true,
        data: response.data,
        message: 'Pago procesado exitosamente'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        message: err.message
      };
    }
  }, [request]);

  /**
   * Crear preferencia de MercadoPago (Checkout Pro)
   */
  const createPreference = useCallback(async (preferenceData) => {
    try {
      const response = await request(
        () => clientAxios.post('/payments/mercadopago/preference', preferenceData),
        'Error al crear preferencia de pago'
      );

      return {
        success: true,
        data: response.data,
        message: 'Preferencia creada exitosamente'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        message: err.message
      };
    }
  }, [request]);

  /**
   * Verificar estado de un pago
   */
  const verifyPaymentStatus = useCallback(async (numeroPago) => {
    try {
      const response = await request(
        () => clientAxios.get(`/payments/verificar/${numeroPago}`),
        'Error al verificar estado de pago'
      );

      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }, [request]);

  /**
   * Obtener pagos de una reserva
   */
  const getBookingPayments = useCallback(async (reservaId) => {
    try {
      const response = await request(
        () => clientAxios.get(`/payments/reserva/${reservaId}`),
        'Error al obtener pagos'
      );

      return {
        success: true,
        data: response.data || response
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }, [request]);

  return {
    loading,
    error,
    clearError,
    processBrickPayment,
    createPreference,
    verifyPaymentStatus,
    getBookingPayments
  };
}
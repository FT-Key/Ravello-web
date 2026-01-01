// hooks/useApi.js
import { useState, useCallback } from 'react';

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
   * @param {Response} response - Respuesta del fetch (opcional)
   * @returns {string} - Mensaje de error amigable
   */
  const getErrorMessage = (error, response = null) => {
    // Si hay un mensaje personalizado en el error
    if (error.message) {
      // Errores de red
      if (error.message.includes("Failed to fetch")) {
        return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      }
      
      if (error.message.includes("NetworkError") || error.message.includes("network")) {
        return "Error de conexión. Por favor, verifica tu internet e intenta nuevamente.";
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
    
    // Mensajes según código de estado HTTP
    if (response) {
      switch (response.status) {
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
          if (response.status >= 500) {
            return "Error del servidor. Por favor, intenta más tarde.";
          }
      }
    }
    
    // Mensaje genérico
    return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
  };

  /**
   * Realiza una petición fetch con manejo de errores robusto
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones del fetch (method, headers, body, etc.)
   * @param {Object} config - Configuración adicional
   * @param {string} config.errorPrefix - Prefijo para el mensaje de error
   * @param {boolean} config.requireAuth - Si requiere token de autenticación
   * @returns {Promise<Object>} - Datos de la respuesta
   */
  const request = useCallback(async (url, options = {}, config = {}) => {
    const {
      errorPrefix = "Error",
      requireAuth = true
    } = config;

    setLoading(true);
    setError(null);

    try {
      // Configurar headers por defecto
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Agregar token de autenticación si es necesario
      if (requireAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      // Realizar la petición
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Verificar el tipo de contenido de la respuesta
      const contentType = response.headers.get("content-type");
      
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        // Respuesta JSON válida
        result = await response.json();
      } else {
        // Respuesta no JSON (probablemente HTML de error)
        const textResponse = await response.text();
        console.error("❌ Respuesta no JSON del servidor:", textResponse.substring(0, 200));
        
        throw new Error(
          "El servidor no está respondiendo correctamente. Por favor, intenta más tarde o contacta con soporte."
        );
      }

      // Si la respuesta no es OK, lanzar error
      if (!response.ok) {
        const errorMsg = result.message || result.error || getErrorMessage(new Error(), response);
        throw new Error(errorMsg);
      }

      setLoading(false);
      return result;

    } catch (err) {
      console.error(`❌ ${errorPrefix}:`, err);
      
      const errorMessage = getErrorMessage(err);
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
      '/api/bookings',
      {
        method: 'POST',
        body: JSON.stringify(bookingData)
      },
      {
        errorPrefix: 'Error al crear reserva',
        requireAuth: true
      }
    );
  }, [request]);

  const getBooking = useCallback(async (bookingId) => {
    return await request(
      `/api/bookings/${bookingId}`,
      { method: 'GET' },
      {
        errorPrefix: 'Error al obtener reserva',
        requireAuth: true
      }
    );
  }, [request]);

  const checkExistingBooking = useCallback(async (packageId) => {
    return await request(
      `/api/bookings/check/${packageId}`,
      { method: 'GET' },
      {
        errorPrefix: 'Error al verificar reserva',
        requireAuth: true
      }
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

  const processBrickPayment = useCallback(async (paymentData) => {
    return await request(
      '/api/payments/mercadopago/brick',
      {
        method: 'POST',
        body: JSON.stringify(paymentData)
      },
      {
        errorPrefix: 'Error al procesar pago',
        requireAuth: true
      }
    );
  }, [request]);

  const createCheckoutPreference = useCallback(async (bookingData) => {
    return await request(
      '/api/payments/mercadopago/create-preference',
      {
        method: 'POST',
        body: JSON.stringify(bookingData)
      },
      {
        errorPrefix: 'Error al crear preferencia de pago',
        requireAuth: true
      }
    );
  }, [request]);

  return {
    loading,
    error,
    clearError,
    processBrickPayment,
    createCheckoutPreference
  };
}
// hooks/usePaymentMethods.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePaymentApi, useBookingApi } from './useApi';

/**
 * Hook para manejar todos los métodos de pago de forma centralizada
 * Elimina la duplicación de código entre componentes
 */
export const usePaymentMethods = () => {
  const navigate = useNavigate();
  const { createPreference } = usePaymentApi();
  const { createBooking } = useBookingApi();

  const [showBrickModal, setShowBrickModal] = useState(false);
  const [reservaForPayment, setReservaForPayment] = useState(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  /**
   * Procesar pago con Checkout Pro (redirect a MercadoPago)
   * @param {Object} params - Parámetros del pago
   * @param {string} params.reservaId - ID de la reserva
   * @param {number} params.montoPago - Monto a pagar
   * @param {string} params.tipoPago - Tipo de pago ("total" | "senia")
   * @param {number} params.numeroCuota - Número de cuota (opcional)
   */
  const processCheckoutPro = async ({ reservaId, montoPago, tipoPago = 'total', numeroCuota = null }) => {
    const toastId = toast.loading('Creando preferencia de pago...');

    try {
      setProcessingCheckout(true);

      console.log("💳 Procesando Checkout Pro:", { reservaId, montoPago, tipoPago });

      const result = await createPreference({
        reservaId,
        montoPago,
        tipoPago,
        numeroCuota
      });

      if (result.success && result.data?.initPoint) {
        toast.success('Redirigiendo a MercadoPago...', { id: toastId });
        
        setTimeout(() => {
          window.location.href = result.data.initPoint;
        }, 500);
        
        return { success: true };
      } else {
        throw new Error(result.error || 'No se recibió la URL de pago');
      }
    } catch (error) {
      console.error("❌ Error en Checkout Pro:", error);
      toast.error(error.message || 'Error al crear la preferencia de pago', { id: toastId });
      setProcessingCheckout(false);
      return { success: false, error: error.message };
    }
  };

  /**
   * Iniciar pago con Bricks (inline payment)
   * Si la reserva ya existe, abre el modal directamente
   * Si no existe, la crea primero y luego abre el modal
   * 
   * @param {Object} params - Parámetros del pago
   * @param {string} params.reservaId - ID de la reserva (si ya existe)
   * @param {Object} params.reservaData - Datos de la reserva (si ya existe)
   * @param {Object} params.bookingData - Datos para crear la reserva (si no existe)
   */
  const initiateBrickPayment = async ({ reservaId, reservaData, bookingData }) => {
    // Caso 1: La reserva ya existe (ej: desde BookingDetailsPage)
    if (reservaId && reservaData) {
      console.log("💳 Abriendo Brick para reserva existente:", reservaId);
      setReservaForPayment(reservaData);
      setShowBrickModal(true);
      return { success: true };
    }

    // Caso 2: Necesitamos crear la reserva primero (ej: desde PackageBookingSidebar)
    if (bookingData) {
      const toastId = toast.loading('Creando tu reserva...');
      
      try {
        console.log("📝 Creando reserva para pago con Brick...");
        
        const result = await createBooking(bookingData);
        const reserva = result.data;

        console.log("✅ Reserva creada:", reserva);
        toast.success('Reserva creada exitosamente', { id: toastId });

        // Abrir el modal de Brick con la reserva creada
        setReservaForPayment(reserva);
        setShowBrickModal(true);

        return { success: true, reserva };
      } catch (error) {
        console.error("❌ Error al crear reserva:", error);
        toast.error(error.message, { 
          id: toastId,
          duration: 5000 
        });
        return { success: false, error: error.message };
      }
    }

    // Caso 3: Faltan datos
    console.error("❌ Faltan datos para iniciar pago con Brick");
    toast.error('Faltan datos para procesar el pago');
    return { success: false, error: 'Datos insuficientes' };
  };

  /**
   * Manejar éxito del pago con Brick
   * @param {Object} result - Resultado del pago
   * @param {Object} options - Opciones adicionales
   * @param {Function} options.onSuccess - Callback adicional
   * @param {string} options.redirectTo - Ruta a donde redirigir (default: /mis-reservas)
   */
  const handleBrickSuccess = (result, options = {}) => {
    const { onSuccess, redirectTo = '/mis-reservas' } = options;

    console.log("✅ Pago con Brick exitoso:", result);
    
    // Cerrar modal
    setShowBrickModal(false);
    setReservaForPayment(null);
    
    // Mostrar mensaje de éxito
    toast.success('¡Pago procesado exitosamente!', {
      icon: '🎉',
      duration: 3000
    });

    // Callback personalizado (ej: recargar datos)
    if (onSuccess) {
      onSuccess(result);
    }

    // Redirigir después de un breve delay
    setTimeout(() => {
      navigate(redirectTo);
    }, 1000);
  };

  /**
   * Manejar error del pago con Brick
   * @param {string|Error} error - Error del pago
   */
  const handleBrickError = (error) => {
    console.error("❌ Error en pago con Brick:", error);
    
    let errorMessage = "Hubo un problema al procesar el pago.";
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage, {
      duration: 4000,
      icon: '💳'
    });
  };

  /**
   * Manejar cancelación del pago con Brick
   * @param {Object} options - Opciones
   * @param {Function} options.onCancel - Callback al cancelar
   */
  const handleBrickCancel = (options = {}) => {
    const { onCancel } = options;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">¿Deseas cancelar el pago?</span>
        <span className="text-sm text-gray-600">La reserva quedará pendiente de pago</span>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setShowBrickModal(false);
              setReservaForPayment(null);
              toast.success('Operación cancelada', { icon: '✓' });
              
              if (onCancel) {
                onCancel();
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Sí, cancelar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            No, continuar
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      icon: '⚠️'
    });
  };

  /**
   * Cerrar modal de Brick manualmente
   */
  const closeBrickModal = () => {
    setShowBrickModal(false);
    setReservaForPayment(null);
  };

  return {
    // Estados
    showBrickModal,
    reservaForPayment,
    processingCheckout,

    // Métodos de pago
    processCheckoutPro,
    initiateBrickPayment,

    // Handlers de Brick
    handleBrickSuccess,
    handleBrickError,
    handleBrickCancel,
    
    // Utilidades
    closeBrickModal
  };
};
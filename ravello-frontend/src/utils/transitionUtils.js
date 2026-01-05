// src/utils/transitionUtils.js

/**
 * Navega con transición de imagen compartida
 * VERSIÓN MEJORADA - Espera a que la transición esté lista
 */
export const navigateWithTransition = async (navigate, path, packageId, imageUrl) => {
  // Guardar datos de la transición
  sessionStorage.setItem('transition-package-id', packageId);
  sessionStorage.setItem('transition-image-url', imageUrl);
  sessionStorage.setItem('transition-active', 'true');
  sessionStorage.setItem('transition-timestamp', Date.now().toString());

  console.log('🎬 Iniciando transición para:', packageId);

  // Verificar soporte de View Transitions
  if (!document.startViewTransition) {
    console.log('⚠️ View Transitions no soportado, navegación normal');
    navigate(path);
    return;
  }

  try {
    // Crear la transición ANTES de navegar
    const transition = document.startViewTransition(async () => {
      // Esta función se ejecuta cuando React está listo para renderizar
      // Usar flushSync para asegurar que React actualice sincrónicamente
      await new Promise(resolve => {
        navigate(path);
        // Dar tiempo mínimo para que React procese
        setTimeout(resolve, 16); // 1 frame
      });
    });

    // Esperar a que la transición esté lista
    await transition.ready;
    console.log('✅ Transición lista');

    // Esperar a que termine completamente
    await transition.finished;
    console.log('✅ Transición completada');

  } catch (error) {
    console.error('❌ Error en transición:', error);
    // Fallback: navegar normalmente si falla
    navigate(path);
  }
};

/**
 * Verifica si hay una transición activa al cargar una página
 */
export const checkActiveTransition = (currentPackageId) => {
  const isActive = sessionStorage.getItem('transition-active') === 'true';
  const packageId = sessionStorage.getItem('transition-package-id');
  const timestamp = sessionStorage.getItem('transition-timestamp');
  
  // Verificar que no haya expirado (máximo 2 segundos)
  const now = Date.now();
  const transitionTime = parseInt(timestamp || '0');
  const isRecent = (now - transitionTime) < 2000;

  const shouldTransition = isActive && packageId === currentPackageId && isRecent;
  
  if (shouldTransition) {
    console.log('🎬 Transición activa detectada para:', currentPackageId);
  }

  return shouldTransition;
};

/**
 * Limpia los datos de transición
 */
export const clearTransition = () => {
  console.log('🧹 Limpiando datos de transición');
  sessionStorage.removeItem('transition-active');
  sessionStorage.removeItem('transition-package-id');
  sessionStorage.removeItem('transition-image-url');
  sessionStorage.removeItem('transition-timestamp');
};

/**
 * Obtiene el nombre de transición para una imagen
 */
export const getTransitionName = (packageId) => {
  return `package-img-${packageId}`;
};

/**
 * Hook personalizado para manejar transiciones
 * Usar en componentes que inician transiciones
 */
export const useImageTransition = () => {
  const handleNavigate = async (navigate, packageId, imageUrl) => {
    await navigateWithTransition(navigate, `/paquetes/${packageId}`, packageId, imageUrl);
  };

  return { handleNavigate };
};
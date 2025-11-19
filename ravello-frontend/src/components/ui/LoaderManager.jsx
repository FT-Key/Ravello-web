import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function LoaderManager() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  // 🛑 Evita correr la lógica en el primer efecto del Strict Mode
  const didRunOnce = useRef(false);

  useEffect(() => {
    if (!didRunOnce.current) {
      didRunOnce.current = true;
      return; // saltar primer efecto duplicado
    }

    const lastShown = localStorage.getItem("ravello_loader_timestamp");
    const now = Date.now();
    const TEN_MIN = 10 * 60 * 1000;

    // Mostrar loader solo si pasaron 10 min
    if (!lastShown || now - lastShown > TEN_MIN) {
      setShowLoader(true);
      localStorage.setItem("ravello_loader_timestamp", now);
    } else {
      setLoading(false);
      setShowLoader(false);
      return;
    }

    // ⏳ tiempo visible del loader
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // ⏳ animación de salida antes de desmontar
  useEffect(() => {
    if (!loading && showLoader) {
      const timeout = setTimeout(() => setShowLoader(false), 1400);
      return () => clearTimeout(timeout);
    }
  }, [loading, showLoader]);

  if (!showLoader) return null;

  return <LoadingScreen isExiting={!loading} />;
}

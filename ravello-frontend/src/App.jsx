import AppRouter from "./router/AppRouter";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
import LoaderManager from "./components/ui/LoaderManager";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <LoaderManager />
      <AppRouter />
    </>
  );
}

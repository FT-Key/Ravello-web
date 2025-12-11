import AppRouter from "./router/AppRouter";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
import LoaderManager from "./components/ui/LoaderManager";
import { Toaster } from "react-hot-toast";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
        }}
      />
      <LoaderManager />
      <AppRouter />
    </>
  );
}

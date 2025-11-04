import AppRouter from "./router/AppRouter";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // solo anima una vez al hacer scroll
    });
  }, []);
  return <AppRouter />;
}

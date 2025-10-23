import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    axios.get("/hello")
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage("Error al conectar con el backend"));
  }, []);

  return (
    <div className="container py-5 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Ravello</h1>
      <p>{message}</p>
    </div>
  );
}

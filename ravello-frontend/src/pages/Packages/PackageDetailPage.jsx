import React from "react";
import { useParams } from "react-router-dom";

export default function PackageDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalle del paquete {id}</h1>
      <p className="text-color-text-dark">Información completa del paquete turístico.</p>
    </div>
  );
}

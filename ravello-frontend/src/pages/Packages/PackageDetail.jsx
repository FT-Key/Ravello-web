import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageById } from "../../services/packageService";
import { useUserStore } from "../../stores/useUserStore";

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const addToCart = useUserStore((state) => state.addToCart);

  useEffect(() => {
    getPackageById(id).then(setPkg);
  }, [id]);

  if (!pkg) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{pkg.name}</h1>
      <img src={pkg.image} alt={pkg.name} className="my-4" />
      <p>{pkg.description}</p>
      <p className="font-bold mt-2">Precio: ${pkg.price}</p>
      <button
        className="btn-primary mt-4"
        onClick={() => addToCart(pkg)}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default PackageDetail;

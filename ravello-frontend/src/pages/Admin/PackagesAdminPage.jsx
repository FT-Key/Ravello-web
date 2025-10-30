/* import React, { useEffect, useState } from "react";
import { getPackages } from "../../services/packageService";
import { Link } from "react-router-dom";

const PackagesAdminPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Paquetes</h1>
      <Link to="/admin/packages/new" className="btn-primary mb-4 inline-block">Nuevo Paquete</Link>
      {packages.map(pkg => (
        <div key={pkg.id} className="flex justify-between items-center mb-2">
          <span>{pkg.name}</span>
          <Link to={`/admin/packages/edit/${pkg.id}`} className="btn-yellow">Editar</Link>
        </div>
      ))}
    </div>
  );
};

export default PackagesAdminPage;
 */
import React from 'react'

function PackagesAdminPage() {
  return (
    <div>PackagesAdminPage</div>
  )
}

export default PackagesAdminPage
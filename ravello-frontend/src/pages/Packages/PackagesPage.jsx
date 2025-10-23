import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { getPackages } from "../../services/packageService";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paquetes Turísticos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} title={pkg.name} description={pkg.description} image={pkg.image} />
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;

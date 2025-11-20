import React from "react";

export default function RegisterPage() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nombre" className="border p-2 rounded" />
        <input type="email" placeholder="Email" className="border p-2 rounded" />
        <input type="password" placeholder="Contraseña" className="border p-2 rounded" />
        <button className="bg-color-primary-blue text-white p-2 rounded">Registrarse</button>
      </form>
    </div>
  );
}

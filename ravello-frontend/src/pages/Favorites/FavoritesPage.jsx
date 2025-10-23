import React from "react";
import { useUserStore } from "../../stores/useUserStore";

const FavoritesPage = () => {
  const favorites = useUserStore((state) => state.favorites);
  const removeFromFavorites = useUserStore((state) => state.removeFromFavorites);

  if (!favorites.length) return <p>No tienes favoritos.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
      {favorites.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name}</span>
          <span>${item.price}</span>
          <button className="btn-red" onClick={() => removeFromFavorites(item.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default FavoritesPage;

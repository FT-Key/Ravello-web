import React, { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PackageTags from "./PackageTags";

const DestinationCard = ({
  image,
  destination,
  country,
  price,
  rating,
  etiquetas = [],
  id,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/paquetes/${id}`);
  };

  return (
    <div
      data-aos="flip-down"
      data-aos-once="true"
      className="cursor-default"
    >
      <div
        className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 h-full bg-white ${isHovered ? "-translate-y-2 shadow-2xl" : "translate-y-0"
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden h-64">
          <div
            className={`w-full h-full bg-cover bg-center transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
              }`}
            style={{ backgroundImage: `url(${image})` }}
          />

          {etiquetas && etiquetas.length > 0 && (
            <PackageTags etiquetas={etiquetas} />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
            <div className="flex items-center text-white text-sm">
              <Star size={16} fill="gold" color="gold" className="mr-1" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-dark">{destination}</h3>
          <p className="text-sm flex items-center text-light">
            <MapPin size={14} className="mr-1" />
            {country}
          </p>
          <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between">
            <div>
              <p className="text-sm mb-1 text-light">Desde</p>
              <p className="text-2xl font-bold text-primary-blue">
                ${price.toLocaleString()}
              </p>
            </div>
            <button onClick={handleClick} className="cursor-pointer bg-primary-blue rounded-full px-6 py-2 font-semibold border-0 text-white transition-transform hover:scale-105">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;

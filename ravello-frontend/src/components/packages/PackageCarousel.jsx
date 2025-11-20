import React, { useEffect, useState } from "react";
import clientAxios from "../../api/axiosConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PackageCarousel = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await clientAxios.get("/packages/promotions", {
          params: {
            page: 1,
            limit: 12,
            sort: "-createdAt",
            search: "", // opcional
            searchFields: "nombre,descripcion", // opcional
          },
        });
        setPromos(response.data.items || []);
      } catch (error) {
        console.error("❌ Error al cargar promociones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <p className="text-center py-8">Cargando promociones...</p>;
  if (!promos.length) return null;

  return (
    <div className="mb-12 relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Promociones Destacadas</h2>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        loop
        grabCursor
        spaceBetween={30}
        speed={700}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
        }}
        className="pb-10"
      >
        {promos.map((promo) => (
          <SwiperSlide key={promo._id}>
            <div className="px-2">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={promo.imagenPrincipal?.url}
                  alt={promo.nombre}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{promo.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {promo.descripcionCorta}
                  </p>
                  {promo.oferta && (
                    <p className="text-blue-600 font-semibold">{promo.oferta}</p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PackageCarousel;

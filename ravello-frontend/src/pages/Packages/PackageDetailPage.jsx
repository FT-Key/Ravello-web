import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clientAxios from "../../api/axiosConfig";
import PackageHeader from "../../components/packageDetail/PackageHeader.jsx";
import PackageGallery from "../../components/packageDetail/PackageGallery.jsx";
import PackageInfo from "../../components/packageDetail/PackageInfo.jsx";
import PackageItinerary from "../../components/packageDetail/PackageItinerary.jsx";
import PackageInclusions from "../../components/packageDetail/PackageInclusions.jsx";
import PackageCoordinators from "../../components/packageDetail/PackageCoordinators.jsx";
import PackageReviews from "../../components/packageDetail/PackageReviews.jsx";
import PackageBookingSidebar from "../../components/packageDetail/PackageBookingSidebar.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import NotFound from "../../components/common/NotFound.jsx";

export default function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [packageDates, setPackageDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datesLoading, setDatesLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({ avg: 0, total: 0 });

  // Fetch del paquete
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await clientAxios.get(`/packages/${id}`);
        setPkg(response?.data?.data);
        setSelectedImage(0);
      } catch (err) {
        console.error("❌ Error al cargar el paquete:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // Fetch de las fechas disponibles
  useEffect(() => {
    const fetchPackageDates = async () => {
      try {
        setDatesLoading(true);
        const response = await clientAxios.get(`/package-dates/by-package/${id}`, {
          params: {
            estado: "disponible",
            sort: "salida:asc",
          },
        });

        const dates = response.data.items || response.data || [];
        setPackageDates(dates);

        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        console.error("❌ Error al cargar fechas:", err);
      } finally {
        setDatesLoading(false);
      }
    };

    if (id) fetchPackageDates();
  }, [id]);

  // Fetch de reseñas
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await clientAxios.get("/reviews", {
          params: {
            paquete: id,
            estadoModeracion: "aprobada",
            limit: 10,
          },
        });

        const reviewItems = response.data.items || [];
        setReviews(reviewItems);

        if (reviewItems.length > 0) {
          const total = reviewItems.length;
          const sum = reviewItems.reduce((acc, r) => acc + r.calificacion, 0);
          const avg = (sum / total).toFixed(1);
          setReviewStats({ avg: parseFloat(avg), total });
        }
      } catch (err) {
        console.error("❌ Error al cargar reseñas:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Cargando paquete..." />;
  }

  if (!pkg) {
    return <NotFound message="Paquete no encontrado" linkText="Volver a paquetes" linkTo="/paquetes" />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <PackageHeader 
        isFavorite={isFavorite} 
        setIsFavorite={setIsFavorite} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PackageGallery 
          pkg={pkg} 
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PackageInfo pkg={pkg} reviewStats={reviewStats} />
            <PackageItinerary pkg={pkg} />
            <PackageInclusions pkg={pkg} />
            <PackageCoordinators pkg={pkg} />
            <PackageReviews packageId={id} reviews={reviews} reviewsLoading={reviewsLoading} />
          </div>

          <div className="lg:col-span-1">
            <PackageBookingSidebar 
              pkg={pkg}
              packageDates={packageDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              datesLoading={datesLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
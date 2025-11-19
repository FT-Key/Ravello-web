import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

import HomePage from "../pages/Home/HomePage";
import PackagesListPage from "../pages/Packages/PackagesListPage";
import PackageDetailPage from "../pages/Packages/PackageDetailPage";
import AboutPage from "../pages/About/AboutPage";
import ContactPage from "../pages/Contact/ContactPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import ManagePackagesPage from "../pages/Admin/ManagePackagesPage";
import ManageReviewsPage from "../pages/Admin/ManageReviewsPage";
import ManageContactsPage from "../pages/Admin/ManageContactsPage";
import ManageUsersPage from "../pages/Admin/ManageUsersPage";
import ManageFeaturedPromotions from "../pages/Admin/ManageFeaturedPromotions";
import UnsubscribePage from "../pages/Newsletter/Unsubscribe"; // o el path donde lo pongas

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ManageNewsletterPage from "../pages/Admin/ManageNewsletterPage";
import ScrollToTop from "../utils/scrollToTop";
import ReviewPage from "../pages/Review/ReviewPage";

function AppRouterInner() {
  const location = useLocation();
  const user = useUserStore((state) => state.user);

  const isHome = location.pathname === "/";

  const AdminRoute = ({ children }) => {
    /* if (!user || user.role !== "admin") return <Navigate to="/login" />; */
    return children;
  };

  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <>
      <Navbar position={isHome ? "fixed" : "sticky"} />

      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/paquetes" element={<PackagesListPage />} />
        <Route path="/paquetes/:id" element={<PackageDetailPage />} />
        <Route path="/opiniones" element={<ReviewPage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />

        {/* Páginas privadas */}
        <Route path="/perfil" element={<PrivateRoute><h1>Perfil del usuario</h1></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/paquetes" element={<AdminRoute><ManagePackagesPage /></AdminRoute>} />
        <Route path="/admin/resenias" element={<AdminRoute><ManageReviewsPage /></AdminRoute>} />
        <Route path="/admin/contactos" element={<AdminRoute><ManageContactsPage /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />
        <Route path="/admin/boletin" element={<AdminRoute><ManageNewsletterPage /></AdminRoute>} />
        <Route path="/admin/ofertas-imperdibles" element={<AdminRoute><ManageFeaturedPromotions /></AdminRoute>} />

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
              404 - Página no encontrada
            </h1>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouterInner />
    </BrowserRouter>
  );
}

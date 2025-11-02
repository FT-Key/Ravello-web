import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import PackagesListPage from "../pages/Packages/PackagesListPage";
import PackageDetailPage from "../pages/Packages/PackageDetailPage";
import AboutPage from "../pages/About/AboutPage";
import ContactPage from "../pages/Contact/ContactPage";
import ReviewsPage from "../pages/Reviews/ReviewsPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import ManagePackagesPage from "../pages/Admin/ManagePackagesPage";
import ManageReviewsPage from "../pages/Admin/ManageReviewsPage";
import ManageContactsPage from "../pages/Admin/ManageContactsPage";
import ManageUsersPage from "../pages/Admin/ManageUsersPage";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useUserStore } from "../stores/useUserStore"; // si usás Zustand o similar

export default function AppRouter() {
  const user = useUserStore((state) => state.user);

  const AdminRoute = ({ children }) => {
    /* if (!user || user.role !== "admin") return <Navigate to="/login" />; */
    return children;
  };

  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/paquetes" element={<PackagesListPage />} />
        <Route path="/paquetes/:id" element={<PackageDetailPage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/opiniones" element={<ReviewsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Páginas privadas */}
        <Route path="/perfil" element={<PrivateRoute><h1>Perfil del usuario</h1></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/paquetes" element={<AdminRoute><ManagePackagesPage /></AdminRoute>} />
        <Route path="/admin/reseñas" element={<AdminRoute><ManageReviewsPage /></AdminRoute>} />
        <Route path="/admin/contactos" element={<AdminRoute><ManageContactsPage /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />

        {/* Ruta 404 */}
        <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "2rem" }}>404 - Página no encontrada</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

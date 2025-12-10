// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";

// Páginas públicas
import HomePage from "../pages/Home/HomePage";
import PackagesListPage from "../pages/Packages/PackagesListPage";
import PackageDetailPage from "../pages/Packages/PackageDetailPage";
import ContactPage from "../pages/Contact/ContactPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ReviewPage from "../pages/Reviews/ReviewPage";
import AboutUsPage from "../pages/AboutUs/AboutUsPage";
import UnsubscribePage from "../pages/Newsletter/Unsubscribe";
import NotFoundPage from "../pages/NotFound/NotFound";

// Páginas Admin
import DashboardPage from "../pages/Admin/DashboardPage";
import ManagePackagesPage from "../pages/Admin/ManagePackagesPage";
import ManageReviewsPage from "../pages/Admin/ManageReviewsPage";
import ManageContactsPage from "../pages/Admin/ManageContactsPage";
import ManageUsersPage from "../pages/Admin/ManageUsersPage";
import ManageFeaturedPromotions from "../pages/Admin/ManageFeaturedPromotions";
import ManageNewsletterPage from "../pages/Admin/ManageNewsletterPage";
import ManagePackageDatesPage from "../pages/Admin/ManagePackageDatesPage";

// Componentes comunes
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollToTop from "../utils/scrollToTop";

function PrivateRoute({ children }) {
  const { user, token, loadingUser } = useUserStore();

  // Evita redirecciones mientras /auth/me está cargando
  if (loadingUser) return null;

  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
}

export function AdminRoute({ children }) {
  const { user, token, loadingUser } = useUserStore();

  // Mientras carga, no redirigir
  if (loadingUser) return null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}

function AppRouterInner() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // ⭐ AGREGAR ESTO: Esperar a que termine de cargar el usuario
  const { loadingUser } = useUserStore();

  // Mostrar un loading mientras se verifica la sesión
  if (loadingUser) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar position={isHome ? "fixed" : "sticky"} />

      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/paquetes" element={<PackagesListPage />} />
        <Route path="/paquetes/:id" element={<PackageDetailPage />} />
        <Route path="/opiniones" element={<ReviewPage />} />
        <Route path="/sobre-nosotros" element={<AboutUsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />

        {/* Ruta privada del usuario */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <h1>Perfil del usuario</h1>
            </PrivateRoute>
          }
        />

        {/* Rutas ADMIN */}
        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/paquetes" element={<AdminRoute><ManagePackagesPage /></AdminRoute>} />
        <Route path="/admin/paquetes-fechas" element={<AdminRoute><ManagePackageDatesPage /></AdminRoute>} />
        <Route path="/admin/resenias" element={<AdminRoute><ManageReviewsPage /></AdminRoute>} />
        <Route path="/admin/contactos" element={<AdminRoute><ManageContactsPage /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />
        <Route path="/admin/boletin" element={<AdminRoute><ManageNewsletterPage /></AdminRoute>} />
        <Route path="/admin/ofertas-imperdibles" element={<AdminRoute><ManageFeaturedPromotions /></AdminRoute>} />

        {/* NotFound */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default function AppRouter() {
  const loadUserFromToken = useUserStore((state) => state.loadUserFromToken);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]); // ⭐ Agregar dependencia

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouterInner />
    </BrowserRouter>
  );
}
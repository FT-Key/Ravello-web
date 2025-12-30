// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useAdminShortcut } from "../hooks/useAdminShortcut";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

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

// Páginas de Usuario
import ProfilePage from "../pages/Auth/ProfilePage";
import MyBookingsPage from "../pages/Bookings/MyBookingsPage";
import BookingDetailsPage from "../pages/Bookings/BookingDetailsPage";

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

// Páginas de Pago
import PaymentSuccessPage from "../pages/Payment/PaymentSuccessPage";
import PaymentFailurePage from "../pages/Payment/PaymentFailurePage";
import PaymentPendingPage from "../pages/Payment/PaymentPendingPage";

function PrivateRoute({ children }) {
  const { user, token, loadingUser } = useUserStore();

  if (loadingUser) return null;

  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
}

export function AdminRoute({ children }) {
  const { user, token, loadingUser } = useUserStore();

  if (loadingUser) return null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/mi-perfil" replace />;
  }

  return children;
}

function AppRouterInner() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith("/admin");

  useAdminShortcut();

  const { loadingUser } = useUserStore();

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
      {/* Mostrar Navbar y Footer solo si NO es ruta admin */}
      {!isAdminRoute && <Navbar position={isHome ? "fixed" : "sticky"} />}

      <Routes>
        {/* ========================================== */}
        {/* PÁGINAS PÚBLICAS */}
        {/* ========================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/paquetes" element={<PackagesListPage />} />
        <Route path="/paquetes/:id" element={<PackageDetailPage />} />
        <Route path="/opiniones" element={<ReviewPage />} />
        <Route path="/sobre-nosotros" element={<AboutUsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />

        {/* ========================================== */}
        {/* RUTAS DE PAGO (Públicas - accesibles con número de reserva) */}
        {/* ========================================== */}
        <Route path="/reservas/:numeroReserva/pago-exitoso" element={<PaymentSuccessPage />} />
        <Route path="/reservas/:numeroReserva/pago-fallido" element={<PaymentFailurePage />} />
        <Route path="/reservas/:numeroReserva/pago-pendiente" element={<PaymentPendingPage />} />

        {/* ========================================== */}
        {/* RUTAS PRIVADAS DEL USUARIO */}
        {/* ========================================== */}
        
        <Route
          path="/mi-perfil"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Rutas de Reservas */}
        <Route
          path="/mis-reservas"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/mis-reservas/:id"
          element={
            <PrivateRoute>
              <BookingDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* ========================================== */}
        {/* RUTAS ADMIN CON LAYOUT */}
        {/* ========================================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="paquetes" element={<ManagePackagesPage />} />
          <Route path="paquetes-fechas" element={<ManagePackageDatesPage />} />
          <Route path="ofertas-imperdibles" element={<ManageFeaturedPromotions />} />
          <Route path="resenias" element={<ManageReviewsPage />} />
          <Route path="contactos" element={<ManageContactsPage />} />
          <Route path="usuarios" element={<ManageUsersPage />} />
          <Route path="boletin" element={<ManageNewsletterPage />} />
        </Route>

        {/* NotFound */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function AppRouter() {
  const loadUserFromToken = useUserStore((state) => state.loadUserFromToken);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouterInner />
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import PackagesPage from "../pages/Packages/PackagesPage";
import PackageDetail from "../pages/Packages/PackageDetail";
import CartPage from "../pages/Cart/CartPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import PackagesAdminPage from "../pages/Admin/PackagesAdminPage";
import PackageForm from "../pages/Admin/PackageForm";
import { useUserStore } from "../stores/useUserStore";

export default function AppRouter() {
  const user = useUserStore((state) => state.user);

  // Ruta privada para admin
  const AdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") return <Navigate to="/login" />;
    return children;
  };

  // Ruta privada para usuarios logueados
  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:id" element={<PackageDetail />} />

        {/* Páginas privadas */}
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/packages" element={<AdminRoute><PackagesAdminPage /></AdminRoute>} />
        <Route path="/admin/packages/new" element={<AdminRoute><PackageForm /></AdminRoute>} />
        <Route path="/admin/packages/edit/:id" element={<AdminRoute><PackageForm /></AdminRoute>} />

        {/* Ruta catch-all */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, CartProvider, useAuth } from './context/AppContext';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminAddProduct from './admin/AdminAddProduct';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /></>} />
      <Route path="/product/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
      <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/checkout" element={<ProtectedRoute><Navbar /><CheckoutPage /></ProtectedRoute>} />
      <Route path="/order-success/:id" element={<ProtectedRoute><Navbar /><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Navbar /><ProfilePage /><Footer /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><Navbar /><MyOrdersPage /><Footer /></ProtectedRoute>} />
      <Route path="/order/:id" element={<ProtectedRoute><Navbar /><OrderDetailPage /><Footer /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Navbar /><WishlistPage /><Footer /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="products/edit/:id" element={<AdminAddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

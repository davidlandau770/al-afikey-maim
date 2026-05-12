import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { BannersProvider } from "./context/BannersContext";
import { AuthProvider } from "./auth/context/AuthContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppFab from "./components/WhatsAppFab";
import PrivateRoute from "./auth/components/PrivateRoute";
import LoginPage from "./auth/page/LoginPage";
import HomePage from "./home/page/HomePage";
import ProductsPage from "./shop/page/ProductsPage";
import ProductPage from "./shop/page/ProductPage";
import CartPage from "./cart/page/CartPage";
import CheckoutPage from "./cart/page/CheckoutPage";
import AdminPage from "./admin/page/AdminPage";
import MethodPage from "./about/page/MethodPage";
import AboutPage from "./about/page/AboutPage";
import AccessibilityPage from "./info/page/AccessibilityPage";
import PrivacyPage from "./info/page/PrivacyPage";
import GamesPage from "./games/page/GamesPage";
import TestimonialsPage from "./testimonials/page/TestimonialsPage";
import BlogPage from "./blog/page/BlogPage";
import BlogPostPage from "./blog/page/BlogPostPage";
import { VITE_API_URL } from "./helpers/environments";
import { useAuth } from "./auth/context/AuthContext";

axios.defaults.baseURL = VITE_API_URL;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthInterceptor = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const id = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) { logout(); navigate("/login"); }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [logout, navigate]);
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthInterceptor />
        <ProductsProvider>
          <CartProvider>
            <BannersProvider>
              <ScrollToTop />
              <NavBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/method" element={<MethodPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
              </Routes>
              <Footer />
              <WhatsAppFab />
            </BannersProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

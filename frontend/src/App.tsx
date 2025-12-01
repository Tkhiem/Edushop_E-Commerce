import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import MyCoursesPage from "./pages/MyCoursesPage";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import VnPayReturnPage from "./pages/VnPayReturnPage";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
const PAYPAL_CLIENT_ID =
  "AW2AsaZhe-zYNhtNftfNjgkCfTuqHEsCUXVXG4B3MhHDit1dUIHmOa3qa47HGuTwHcnmJyo6aR4OyY_v";
function App() {
  return (
    <HelmetProvider>
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="favorites" element={<FavoritesPage />} />
                    <Route path="course/:slug" element={<CourseDetailPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="my-courses" element={<MyCoursesPage />} />
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                  <Route
                    path="/payment/vnpay-return"
                    element={<VnPayReturnPage />}
                  />
                  <Route
                    path="/purchase-history"
                    element={<PurchaseHistoryPage />}
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}

export default App;

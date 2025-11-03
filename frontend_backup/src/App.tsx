import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartProvider";
import { FavoritesProvider } from "./context/FavoritesProvider";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

function App() {
  console.log("🚀 App component rendering"); // Debug

  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster position="top-right" richColors />
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;

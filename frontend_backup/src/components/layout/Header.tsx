import Logo from "@/assets/logo.svg";
import { useCart } from "@/context/CartProvider";
import { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavItem } from "../common/NavItem";
import { SearchBar } from "../common/SearchBar";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { items } = useCart();
  const cartItemCount = items.length;

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Yêu thích", path: "/favorites" },
    { name: "Lịch sử", path: "/history" },
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search") || "";
    setSearchInput(currentSearch);
  }, [location.search]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    navigate({ pathname: "/", search: params.toString() });
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300 h-16 md:h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="AntoLearn logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:block">
          <SearchBar value={searchInput} onChange={handleSearchChange} />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-x-6">
          {navLinks.map((link) => (
            <NavItem key={link.path} to={link.path} label={link.name} />
          ))}

          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative flex items-center gap-2 py-2 px-2 rounded text-black dark:text-white hover:text-primary hover:bg-primary-hover/20 dark:hover:bg-gray-800 transition"
          >
            <MdOutlineShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 -right-1 bg-primary text-white text-sm rounded-full px-2">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 text-xl text-gray-600 dark:text-gray-300 hover:text-primary transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex gap-2 md:hidden">
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative flex items-center gap-2 py-2 px-2 rounded text-black dark:text-white hover:text-primary hover:bg-primary-hover/20 dark:hover:bg-gray-800 transition"
          >
            <MdOutlineShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 -right-1 bg-primary text-white text-sm rounded-full px-2">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button
            className="text-2xl text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in-down">
          <nav className="flex flex-col px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium sblock py-2 px-2 rounded transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-black hover:text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dark Mode Toggle in Mobile */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 px-2 rounded text-black font-medium dark:text-white hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
              <span>{darkMode ? "Chế độ sáng" : "Chế độ tối"}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                E
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">EduShop</h3>
                <p className="text-xs text-gray-400">
                  Online Learning Platform
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Nền tảng học trực tuyến hàng đầu Việt Nam với hơn 3,600+ khóa học
              chất lượng cao từ các chuyên gia trong và ngoài nước.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-500 flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Khám phá</h4>
            <ul className="space-y-2">
              {[
                { label: "Tất cả khóa học", href: "/" },
                {
                  label: "Kinh doanh & Tài chính",
                  href: "/?category=business",
                },
                { label: "Lập trình", href: "/?category=lap-trinh" },
                { label: "Thiết kế đồ họa", href: "/?category=design" },
                { label: "Marketing", href: "/?category=marketing" },
                { label: "Nhiếp ảnh", href: "/?category=photography" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-4 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {[
                { label: "Trung tâm trợ giúp", href: "/help" },
                { label: "Liên hệ", href: "/contact" },
                { label: "Câu hỏi thường gặp", href: "/faq" },
                { label: "Chính sách bảo mật", href: "/privacy" },
                { label: "Điều khoản sử dụng", href: "/terms" },
                { label: "Chính sách hoàn tiền", href: "/refund" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-400 group-hover:w-4 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  123 Đường ABC, Quận 1,
                  <br />
                  Thành phố Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:1900xxxx"
                  className="hover:text-blue-400 transition-colors"
                >
                  1900 xxxx (Miễn phí)
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:support@edushop.vn"
                  className="hover:text-blue-400 transition-colors"
                >
                  support@edushop.vn
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">Đăng ký nhận tin</h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} EduShop. All rights reserved. Made with{" "}
              <Heart className="w-4 h-4 inline-block text-red-500 fill-current animate-pulse" />{" "}
              in Vietnam
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-blue-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;

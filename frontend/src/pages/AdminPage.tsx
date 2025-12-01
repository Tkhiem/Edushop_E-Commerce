import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  MessageSquare,
  Tag,
  TrendingUp,
  DollarSign,
  Heart,
} from "lucide-react";
import * as Icons from "lucide-react";
import AdminCourses from "./admin/AdminCourses";
import AdminUsers from "./admin/AdminUsers";
import AdminOrders from "./admin/AdminOrders";
import AdminReviews from "./admin/AdminReviews";
import AdminCategories from "./admin/AdminCategories";
import AdminFavorites from "./admin/AdminFavorites";

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState<any[] | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("token");
  // Exchange rate: 1 USD = 24,500 VND
  const USD_TO_VND = 24500;

  const formatVND = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num * USD_TO_VND);
  };
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch admin stats");
        const data = await res.json();
        console.log("data", data);
        setStats(data.stats || []);
        setRecentActivities(data.recent || []);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "dashboard") {
      fetchDashboard();
    }
  }, [activeTab, API_BASE, token]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-purple-600",
    },
    {
      id: "courses",
      label: "Khóa học",
      icon: BookOpen,
      color: "text-blue-600",
    },
    { id: "users", label: "Người dùng", icon: Users, color: "text-green-600" },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      id: "reviews",
      label: "Đánh giá",
      icon: MessageSquare,
      color: "text-yellow-600",
    },
    {
      id: "categories",
      label: "Danh mục",
      icon: Tag,
      color: "text-indigo-600",
    },
    {
      id: "favorites",
      label: "Yêu thích",
      icon: Heart,
      color: "text-red-600",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return <AdminCourses />;
      case "users":
        return <AdminUsers />;
      case "orders":
        return <AdminOrders />;
      case "reviews":
        return <AdminReviews />;
      case "categories":
        return <AdminCategories />;
      case "favorites":
        return <AdminFavorites />;
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Chào mừng, {user?.fullName}!
                  </h1>
                  <p className="text-purple-100">
                    Bảng điều khiển quản trị viên - Quản lý hệ thống EduShop
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
              <div>Đang tải số liệu...</div>
            ) : error ? (
              <div className="text-red-600">Lỗi: {error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats?.map((stat, index) => {
                  const Icon = Icons[stat.icon]; // map string -> icon component
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-600 text-sm font-medium">
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.label === "Doanh thu"
                          ? formatVND(stat.value)
                          : stat.value}
                      </h3>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Thao tác nhanh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("courses")}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    Quản lý khóa học
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-gray-900">
                    Quản lý người dùng
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-gray-900">
                    Quản lý đơn hàng
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {(recentActivities || []).map((act, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{act.title}</p>
                      <p className="text-sm text-gray-600">{act.subtitle}</p>
                    </div>
                  </div>
                ))}
                {(!recentActivities || recentActivities.length === 0) &&
                  !loading && (
                    <div className="text-gray-500">
                      Không có hoạt động gần đây
                    </div>
                  )}
              </div>
            </div>

            {/* Swagger API Link */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">API Documentation</h3>
                  <p className="text-blue-100">
                    Xem và test tất cả API endpoints qua Swagger UI
                  </p>
                </div>
                <a
                  href={`${API_BASE}/api-docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Mở Swagger UI
                </a>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen sticky top-0">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                EduShop Admin
              </span>
            </Link>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "dashboard" ? (
            <div className="p-8">{renderContent()}</div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

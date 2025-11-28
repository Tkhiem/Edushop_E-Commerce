import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Shield, Calendar, Edit2, Save, X } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const handleSave = () => {
    // TODO: Implement update profile API call
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem trang này</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      <Shield className="w-4 h-4" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <User className="w-4 h-4" />
                      Khách hàng
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Thông tin cá nhân
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Email không thể thay đổi
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Edit2 className="w-4 h-4" />
                Giới thiệu
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Viết vài dòng về bản thân..."
                />
              ) : (
                <p className="text-gray-900">
                  {user.bio || "Chưa có thông tin"}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4" />
                Vai trò
              </label>
              <p className="text-gray-900">
                {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
              </p>
            </div>

            {/* Account ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Mã tài khoản
              </label>
              <p className="text-gray-900 font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Additional Sections for Admin */}
        {user.role === "admin" && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6 mt-6 border border-purple-200">
            <h2 className="text-xl font-bold text-purple-900 mb-4">
              🔑 Quyền quản trị viên
            </h2>
            <p className="text-purple-700">
              Bạn có quyền quản lý toàn bộ hệ thống, bao gồm khóa học, danh mục,
              người dùng và đơn hàng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// ...existing code...
import React, { useState } from "react";

export default function MailchimpForm() {
  const [email, setEmail] = useState("");
  const actionUrl =
    "https://gmail.us6.list-manage.com/subscribe/post?u=d26b93796043e86547e97d053&amp;id=129d54e961&amp;f_id=0059cce2f0";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Đăng ký nhận thông tin
          </h3>
          <p className="text-sm text-slate-600">
            Nhận cập nhật khóa học mới, khuyến mãi và tài nguyên học tập miễn
            phí. Đăng ký ngay để không bỏ lỡ!
          </p>
        </div>

        <form
          className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3"
          action={actionUrl}
          method="post"
          target="_blank"
          noValidate
        >
          <label htmlFor="mce-EMAIL" className="sr-only">
            Email Address
          </label>
          <input
            id="mce-EMAIL"
            name="EMAIL"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Bạn nhập email của mình..."
            className="w-full sm:w-80 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Honeypot (ẩn cho bot) */}
          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
          >
            <input
              type="text"
              name="b_d26b93796043e86547e97d053_129d54e961"
              tabIndex={-1}
              defaultValue=""
            />
          </div>

          <input
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            value="Đăng ký"
          />
        </form>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Chúng tôi tôn trọng quyền riêng tư của bạn. Thông tin chỉ dùng để gửi
        email liên quan đến khóa học và khuyến mãi.
      </p>
    </div>
  );
}
// ...existing code...

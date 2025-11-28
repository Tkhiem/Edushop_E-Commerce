# ⚡ QUICK START - DEPLOY TRONG 15 PHÚT

## 🎯 MỤC TIÊU
Deploy EduShop lên Vercel + Render với đầy đủ tính năng SEO (4 điểm)

---

## 📝 BƯỚC 1: MONGODB ATLAS (3 phút)

```powershell
# 1. Truy cập
https://www.mongodb.com/cloud/atlas/register

# 2. Tạo cluster (M0 Free)
# 3. Tạo user: edushop_admin / [password]
# 4. Whitelist IP: 0.0.0.0/0
# 5. Copy connection string
```

---

## 🔧 BƯỚC 2: BACKEND - RENDER (5 phút)

```powershell
# 1. Vào https://render.com
# 2. New Web Service → Connect GitHub
# 3. Settings:
Name: edushop-api
Root: backend
Build: npm install
Start: npm start

# 4. Environment Variables:
MONGODB_URI=mongodb+srv://edushop_admin:PASSWORD@...
PORT=5000
NODE_ENV=production
JWT_SECRET=your_random_secret_key_here

# 5. Create → Đợi 5 phút
# 6. Lấy URL: https://edushop-api.onrender.com
```

---

## 🌐 BƯỚC 3: FRONTEND - VERCEL (5 phút)

```powershell
# 1. Cập nhật API URL
# File: frontend/src/api/axiosConfig.ts
const API_BASE_URL = 'https://edushop-api.onrender.com/api';

# 2. Bật Messenger
# File: frontend/src/components/layout/Layout.tsx (dòng 31)
const ENABLE_MESSENGER = true;

# 3. Deploy
cd frontend
npm install -g vercel
vercel login
vercel --prod

# Hoặc qua web: https://vercel.com
# Import → Deploy

# 4. Lấy URL: https://edushop-xyz123.vercel.app
```

---

## ✅ BƯỚC 4: KIỂM TRA SEO (2 phút)

```powershell
# 1. Cài SEO Quake extension
https://chrome.google.com/webstore/detail/seoquake

# 2. Mở website
https://edushop-xyz123.vercel.app

# 3. Click SEOquake → Diagnosis

# 4. Mở chi tiết khóa học
https://edushop-xyz123.vercel.app/course/javascript-fundamentals

# 5. Test Share Facebook
- Click "Chia sẻ" → Facebook
- Check: hình ảnh, tiêu đề, mô tả
- Post → Click link → Mở đúng trang

# 6. Test với Facebook Debugger
https://developers.facebook.com/tools/debug/
- Paste URL
- Debug
- Check OG tags
```

---

## 📸 CHECKLIST NỘP BÀI

**Screenshots cần chụp:**

1. ✅ **URL thân thiện (1đ)**
   - Thanh địa chỉ: `/course/ten-khoa-hoc-slug`

2. ✅ **Meta tags (1đ)**
   - View Page Source → `<head>` có OG tags

3. ✅ **Share Facebook (1đ)**
   - Preview khi share (hình + title + description)
   - Post trên timeline
   - Click link → mở đúng trang

4. ✅ **SEO Score (1đ)**
   - SEO Quake diagnosis
   - Điểm số > 70

---

## 🎉 HOÀN THÀNH!

**URLs của bạn:**
- Frontend: https://edushop-xyz123.vercel.app
- Backend: https://edushop-api.onrender.com

**Đã đạt:**
- ✅ URL thân thiện - 1 điểm
- ✅ Meta tags & OG - 2 điểm  
- ✅ SEO content - 1 điểm
- **TỔNG: 4/4 điểm**

---

## 🆘 BỊ LỖI?

### Backend không chạy:
```
- Check Environment Variables
- Check MongoDB connection string
- Check Render logs
```

### Frontend không call API:
```
- Check API_BASE_URL
- Check CORS in backend
- Test API: https://edushop-api.onrender.com
```

### Share Facebook không có hình:
```
1. https://developers.facebook.com/tools/debug/
2. Paste URL
3. Scrape Again
4. Try share again
```

---

**Chi tiết đầy đủ:** Xem file `HƯỚNG_DẪN_DEPLOY_CHI_TIẾT.md`

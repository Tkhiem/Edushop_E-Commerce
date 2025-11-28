# ⚡ DEPLOY NHANH - CHECKLIST 5 PHÚT

## 📦 TRƯỚC KHI BẮT ĐẦU

### 1. Tạo tài khoản (FREE):
- [ ] MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
- [ ] Render: https://dashboard.render.com/register (dùng GitHub)
- [ ] Vercel: https://vercel.com/signup (dùng GitHub)

---

## 🗄️ BƯỚC 1: DATABASE (5 phút)

### MongoDB Atlas:
1. **Create Cluster:**
   - FREE M0 → AWS → Singapore
   - Cluster name: `EduShop-Cluster`

2. **Database Access:**
   - Add User: `edushop_admin` / `[password]`
   - Role: Atlas Admin
   - ⚠️ **LƯU MẬT KHẨU!**

3. **Network Access:**
   - Allow from Anywhere: `0.0.0.0/0`

4. **Connection String:**
   ```
   Database → Connect → Drivers → Copy:
   mongodb+srv://edushop_admin:<password>@...mongodb.net/edushop_db?...
   ```
   ⚠️ Thay `<password>` + thêm `/edushop_db`

5. **Import Data:**
   ```powershell
   cd backend
   # Sửa MONGODB_URI trong .env
   node scripts/importKaggleWithImages.js
   ```

✅ **Test:** `node scripts/checkDatabase.js` → Thấy courses

---

## 🔧 BƯỚC 2: BACKEND (10 phút)

### Push to GitHub:
```powershell
cd backend
git init
git add .
git commit -m "Backend ready"
git remote add origin https://github.com/YOUR_USERNAME/edushop-backend.git
git push -u origin main
```

### Deploy Render:
1. **New Web Service** → Connect GitHub → `edushop-backend`

2. **Settings:**
   ```
   Name: edushop-backend
   Region: Singapore
   Build: npm install
   Start: node server.js
   Instance: Free
   ```

3. **Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://edushop_admin:...
   JWT_SECRET = edushop_production_2025_secret_xyz
   PORT = 5000
   NODE_ENV = production
   FRONTEND_URL = https://edushop.vercel.app
   ```

4. **Deploy** → Đợi 3-5 phút

5. **Copy URL:** `https://edushop-backend-xxxx.onrender.com`

✅ **Test:** Mở `https://edushop-backend-xxxx.onrender.com/api/courses` → Thấy JSON

---

## 🎨 BƯỚC 3: FRONTEND (10 phút)

### Cập nhật code:

1. **Sửa `.env.production`:**
   ```env
   VITE_API_URL=https://edushop-backend-xxxx.onrender.com/api
   ```
   ⚠️ Thay URL Render thực!

2. **Layout.tsx đã tự động bật Messenger khi production** ✅

3. **Test build:**
   ```powershell
   cd frontend
   npm run build
   ```
   ✅ Thành công → thư mục `dist/` được tạo

### Push to GitHub:
```powershell
cd frontend
git init
git add .
git commit -m "Frontend ready"
git remote add origin https://github.com/YOUR_USERNAME/edushop-frontend.git
git push -u origin main
```

### Deploy Vercel:

1. **Import Project** → GitHub → `edushop-frontend`

2. **Configure:**
   ```
   Framework: Vite
   Build: npm run build
   Output: dist
   ```

3. **Environment Variable:**
   ```
   VITE_API_URL = https://edushop-backend-xxxx.onrender.com/api
   ```

4. **Deploy** → Đợi 2-3 phút

5. **Copy URL:** `https://edushop.vercel.app`

### Cập nhật Render:
- Render → edushop-backend → Environment
- Sửa `FRONTEND_URL` = `https://edushop.vercel.app`
- Save → Auto redeploy

✅ **Test:** Mở `https://edushop.vercel.app` → Thấy courses

---

## 🔍 BƯỚC 4: TEST SEO (10 phút)

### Cài SEOquake:
- Chrome Extension: https://chrome.google.com/webstore/detail/seoquake

### Test HomePage:
1. Mở: `https://edushop.vercel.app`
2. SEOquake icon → **Diagnosis**
3. **Chụp ảnh:** Kết quả điểm số

### Test Course Detail:
1. Mở: `https://edushop.vercel.app/course/reactjs-co-ban-den-nang-cao`
2. **Chụp ảnh:** Address bar (URL slug)
3. View Source (Ctrl+U) → **Chụp ảnh:** Meta tags (5 screenshots)
4. SEOquake → Diagnosis → **Chụp ảnh**

### Test Facebook Share:
1. Click nút **Share** → **Facebook**
2. **Chụp ảnh:** Share dialog (preview)

---

## 📸 SCREENSHOTS CẦN CÓ (8 ảnh)

- [ ] 1. URL friendly (address bar có slug)
- [ ] 2. Meta tags basic (title, description)
- [ ] 3. Open Graph tags (og:title, og:image)
- [ ] 4. Meta keywords
- [ ] 5. Facebook Share dialog
- [ ] 6. SEOquake HomePage
- [ ] 7. SEOquake Course Detail
- [ ] 8. Website overview

---

## ⚠️ XỬ LÝ LỖI NHANH

### Frontend trắng / Không load courses:
```powershell
# 1. Kiểm tra .env.production có đúng URL backend không
# 2. Wake up backend: Mở URL backend trước, đợi 30s
# 3. Check browser console (F12) xem lỗi gì
```

### Backend CORS error:
```javascript
// backend/server.js - Thêm domain Vercel:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edushop.vercel.app',
    'https://edushop-frontend-*.vercel.app'
  ]
}));
```

### Facebook Share không preview:
```
1. Vào: https://developers.facebook.com/tools/debug/
2. Nhập URL course
3. Click "Scrape Again"
4. Xem preview
```

### Render sleep lâu:
```
Dùng UptimeRobot (FREE):
- https://uptimerobot.com/
- Ping backend mỗi 5 phút
- Giữ backend không sleep
```

---

## ✅ CHECKLIST HOÀN TẤT

### Database:
- [ ] MongoDB Atlas cluster created
- [ ] Connection string working
- [ ] Data imported successfully

### Backend:
- [ ] GitHub repo created
- [ ] Render deployed
- [ ] API responding
- [ ] CORS configured

### Frontend:
- [ ] `.env.production` updated
- [ ] GitHub repo created
- [ ] Vercel deployed
- [ ] Website loading
- [ ] Courses displayed

### SEO:
- [ ] SEOquake tested
- [ ] All 8 screenshots captured
- [ ] Facebook Share tested

---

## 🎯 URLs QUAN TRỌNG

```
Frontend: https://edushop.vercel.app
Backend:  https://edushop-backend-xxxx.onrender.com
Database: https://cloud.mongodb.com/

Vercel Dashboard:  https://vercel.com/dashboard
Render Dashboard:  https://dashboard.render.com/
MongoDB Dashboard: https://cloud.mongodb.com/

SEOquake: https://www.seoquake.com/
FB Debugger: https://developers.facebook.com/tools/debug/
```

---

## 🚀 DONE!

**Tổng thời gian:** ~30 phút
**Chi phí:** $0 (100% FREE)
**Điểm SEO mục tiêu:** 4/4 điểm

**Next Steps:**
1. Thu thập 8 screenshots
2. Viết báo cáo ngắn
3. Nộp bài với URLs + Screenshots

**Good luck! 🎉**

# 🚀 HƯỚNG DẪN DEPLOY EDUSHOP - ĐẦY ĐỦ CHI TIẾT

## 📋 MỤC LỤC
1. [Chuẩn bị trước khi deploy](#1-chuẩn-bị-trước-khi-deploy)
2. [Deploy Database - MongoDB Atlas](#2-deploy-database---mongodb-atlas)
3. [Deploy Backend - Render](#3-deploy-backend---render)
4. [Deploy Frontend - Vercel](#4-deploy-frontend---vercel)
5. [Test & SEO](#5-test--seo)
6. [Xử lý lỗi thường gặp](#6-xử-lý-lỗi-thường-gặp)

---

## 1. CHUẨN BỊ TRƯỚC KHI DEPLOY

### 1.1. Tạo tài khoản (miễn phí 100%)

#### a) MongoDB Atlas (Database)
- 🔗 Truy cập: https://www.mongodb.com/cloud/atlas/register
- Đăng ký với email (hoặc Google)
- ✅ FREE: 512MB storage

#### b) Render (Backend hosting)
- 🔗 Truy cập: https://dashboard.render.com/register
- Đăng ký với GitHub (khuyến nghị) hoặc email
- ✅ FREE: 750 giờ/tháng

#### c) Vercel (Frontend hosting)
- 🔗 Truy cập: https://vercel.com/signup
- Đăng ký với GitHub (khuyến nghị)
- ✅ FREE: 100GB bandwidth, 6h build time/tháng

### 1.2. Cài đặt công cụ

```powershell
# Kiểm tra Node.js đã cài chưa
node --version  # Cần >= 18.0.0

# Kiểm tra npm
npm --version

# Cài Git (nếu chưa có)
# Tải từ: https://git-scm.com/download/win

# Kiểm tra Git
git --version
```

### 1.3. Chuẩn bị code

```powershell
# Di chuyển vào thư mục project
cd C:\Users\Administrator\Downloads\EduShop

# Tạo Git repository (nếu chưa có)
git init
git add .
git commit -m "Initial commit - Ready for deployment"

# Tạo .gitignore (quan trọng!)
# File này đã có sẵn, kiểm tra có đầy đủ:
# - node_modules/
# - .env
# - dist/
# - build/
```

---

## 2. DEPLOY DATABASE - MONGODB ATLAS

### Bước 1: Tạo Database Cluster

1. **Đăng nhập MongoDB Atlas**: https://cloud.mongodb.com
2. Click **"Build a Database"**
3. Chọn **FREE M0** cluster:
   - Cloud Provider: **AWS**
   - Region: **Singapore (ap-southeast-1)** (gần VN nhất)
   - Cluster Name: `EduShop-Cluster`
4. Click **"Create"**

### Bước 2: Cấu hình Database Access

1. Sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Nhập thông tin:
   ```
   Username: edushop_admin
   Password: [Tạo mật khẩu mạnh hoặc Auto-generate]
   ⚠️ LƯU MẬT KHẨU NÀY LẠI!
   ```
4. Database User Privileges: **"Atlas Admin"**
5. Click **"Add User"**

### Bước 3: Cấu hình Network Access

1. Sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Cần thiết cho Render/Vercel kết nối
4. Click **"Confirm"**

### Bước 4: Lấy Connection String

1. Quay lại **"Database"** → Click **"Connect"**
2. Chọn **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy Connection String:
   ```
   mongodb+srv://edushop_admin:<password>@edushop-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Thay `<password>` bằng mật khẩu thực:**
   ```
   mongodb+srv://edushop_admin:MatKhauCuaBan123@edushop-cluster.xxxxx.mongodb.net/edushop_db?retryWrites=true&w=majority&appName=EduShop-Cluster
   ```
   
   ⚠️ **Quan trọng:**
   - Thêm `/edushop_db` sau `.mongodb.net` (tên database)
   - Thêm `&appName=EduShop-Cluster` ở cuối
   - Không có dấu `<>` trong password

### Bước 5: Import dữ liệu mẫu

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cập nhật MONGODB_URI trong .env với connection string mới
# Mở file .env và thay đổi dòng MONGODB_URI

# Import dữ liệu từ Kaggle
node scripts/importKaggleWithImages.js

# Kiểm tra dữ liệu đã import
node scripts/checkDatabase.js
```

**✅ Kiểm tra thành công:**
- Thấy thông báo: "✅ Connected to MongoDB Atlas"
- Có danh sách categories và courses
- Tổng số courses > 0

---

## 3. DEPLOY BACKEND - RENDER

### Bước 1: Push code lên GitHub

```powershell
# Tạo repository mới trên GitHub
# 1. Vào https://github.com/new
# 2. Repository name: edushop-backend
# 3. Visibility: Private (hoặc Public)
# 4. KHÔNG tích "Initialize with README"
# 5. Click "Create repository"

# Push code từ local
cd C:\Users\Administrator\Downloads\EduShop\backend

# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Backend ready for Render deployment"

# Link với GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/edushop-backend.git
git branch -M main
git push -u origin main
```

### Bước 2: Tạo Web Service trên Render

1. **Đăng nhập Render**: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository:
   - Click **"Connect account"** (lần đầu)
   - Chọn repository **"edushop-backend"**
4. Cấu hình service:

   ```
   Name: edushop-backend
   Region: Singapore (Southeast Asia)
   Branch: main
   Root Directory: (để trống - vì backend ở root)
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```

5. **Instance Type**: Free (750 hours/month)

### Bước 3: Cấu hình Environment Variables

Scroll xuống **"Environment Variables"**, click **"Add Environment Variable"**, thêm từng dòng:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `MONGODB_URI` | `mongodb+srv://edushop_admin:...` | Connection string từ Atlas |
| `JWT_SECRET` | `edushop_jwt_secret_2025_production_key_abc123` | Tạo chuỗi ngẫu nhiên mạnh |
| `PORT` | `5000` | Port mặc định |
| `NODE_ENV` | `production` | Chế độ production |
| `FRONTEND_URL` | `https://edushop.vercel.app` | URL frontend (sẽ có sau) |
| `PAYPAL_CLIENT_ID` | `(copy từ .env)` | Nếu dùng PayPal |
| `PAYPAL_CLIENT_SECRET` | `(copy từ .env)` | Nếu dùng PayPal |

### Bước 4: Deploy Backend

1. Click **"Create Web Service"**
2. Đợi deploy (3-5 phút):
   - ⏳ Building...
   - ⏳ Installing dependencies...
   - ⏳ Starting server...
   - ✅ Live (hiển thị màu xanh)

3. **Lấy Backend URL:**
   - Ở đầu trang thấy: `https://edushop-backend-xxxx.onrender.com`
   - **Copy URL này** (sẽ dùng cho frontend)

### Bước 5: Test Backend API

```powershell
# Test health check
curl https://edushop-backend-xxxx.onrender.com/api

# Test courses endpoint
curl https://edushop-backend-xxxx.onrender.com/api/courses

# Hoặc mở trực tiếp trong browser:
https://edushop-backend-xxxx.onrender.com/api/courses
```

**✅ Thành công nếu thấy:**
```json
{
  "success": true,
  "data": [...courses...],
  "pagination": {...}
}
```

⚠️ **Lưu ý về Free Tier Render:**
- Backend sẽ **sleep sau 15 phút không hoạt động**
- Lần truy cập đầu tiên sau khi sleep: **30-60 giây** để wake up
- Giải pháp: Dùng [UptimeRobot](https://uptimerobot.com) ping mỗi 10 phút (free)

---

## 4. DEPLOY FRONTEND - VERCEL

### Bước 1: Cập nhật code Frontend

#### a) Tạo file `.env.production`

```powershell
cd C:\Users\Administrator\Downloads\EduShop\frontend

# Tạo file .env.production
New-Item -Path ".env.production" -ItemType File
```

Mở file `.env.production` và thêm:

```env
VITE_API_URL=https://edushop-backend-xxxx.onrender.com/api
```

⚠️ **Thay `edushop-backend-xxxx` bằng URL Render thực của bạn!**

#### b) Bật Messenger Chat (để production hoạt động)

Mở file `frontend/src/components/layout/Layout.tsx`, sửa dòng 36:

```tsx
// TÌM DÒNG NÀY:
const ENABLE_MESSENGER = false;

// ĐỔI THÀNH:
const ENABLE_MESSENGER = true;
```

#### c) Kiểm tra file `vite.config.ts`

Đảm bảo có cấu hình đúng:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

### Bước 2: Test build local

```powershell
# Test build trước khi deploy
cd frontend
npm run build

# Kiểm tra thư mục dist/ được tạo ra
ls dist

# Test production build local (optional)
npm run preview
```

**✅ Thành công nếu:**
- Thư mục `dist/` được tạo
- Không có lỗi TypeScript/ESLint
- Preview chạy được (nếu test)

### Bước 3: Push Frontend lên GitHub

```powershell
cd C:\Users\Administrator\Downloads\EduShop\frontend

# Tạo repository mới trên GitHub
# 1. Vào https://github.com/new
# 2. Repository name: edushop-frontend
# 3. Visibility: Private hoặc Public
# 4. Click "Create repository"

# Push code
git init
git add .
git commit -m "Frontend ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/edushop-frontend.git
git branch -M main
git push -u origin main
```

### Bước 4: Deploy lên Vercel

#### Cách 1: Deploy qua Vercel Dashboard (Dễ nhất)

1. **Đăng nhập Vercel**: https://vercel.com/login
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Click **"Continue with GitHub"**
   - Authorize Vercel truy cập GitHub
   - Chọn repository **"edushop-frontend"**
4. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. **Environment Variables:**
   - Click **"Add Environment Variable"**
   - Name: `VITE_API_URL`
   - Value: `https://edushop-backend-xxxx.onrender.com/api`
   - ⚠️ Thay URL Render thực của bạn!

6. Click **"Deploy"**

7. Đợi deploy (2-3 phút):
   - ⏳ Building...
   - ⏳ Uploading to CDN...
   - ✅ Ready

8. **Lấy Frontend URL:**
   - Vercel tự tạo: `https://edushop-frontend-xxxx.vercel.app`
   - Hoặc tên bạn chọn: `https://edushop.vercel.app`

#### Cách 2: Deploy qua Vercel CLI (Advanced)

```powershell
# Cài Vercel CLI
npm install -g vercel

# Login Vercel
vercel login

# Deploy
cd frontend
vercel

# Làm theo hướng dẫn:
# - Setup and deploy? Y
# - Scope? (chọn account của bạn)
# - Link to existing project? N
# - Project name? edushop-frontend
# - Directory? ./
# - Want to override settings? N

# Deploy production
vercel --prod
```

### Bước 5: Cập nhật FRONTEND_URL trên Render

1. Quay lại **Render Dashboard**
2. Vào service **"edushop-backend"**
3. Tab **"Environment"**
4. Sửa biến `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://edushop.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend sẽ tự deploy lại (1-2 phút)

---

## 5. TEST & SEO

### 5.1. Test chức năng cơ bản

#### a) Test Frontend

1. Mở URL Vercel: `https://edushop.vercel.app`
2. Kiểm tra:
   - ✅ Trang chủ hiển thị đầy đủ courses
   - ✅ Search hoạt động
   - ✅ Filter theo category, level, price
   - ✅ Click vào course → Trang chi tiết
   - ✅ Đăng ký/Đăng nhập
   - ✅ Thêm vào giỏ hàng
   - ✅ Crisp Chat hiển thị (góc dưới bên phải)
   - ✅ Facebook Messenger hiển thị

#### b) Test Backend API

```powershell
# Test từ frontend console (F12)
fetch('https://edushop-backend-xxxx.onrender.com/api/courses')
  .then(r => r.json())
  .then(data => console.log(data))
```

**✅ Thành công:** Thấy danh sách courses trong console

### 5.2. Test SEO với SEOquake

#### a) Cài đặt SEOquake

1. **Chrome Extension:**
   - Truy cập: https://chrome.google.com/webstore/detail/seoquake
   - Click **"Add to Chrome"**
   - Confirm cài đặt

2. **Cấu hình SEOquake:**
   - Click icon SEOquake trên toolbar
   - Settings → Diagnosis → Check all important items

#### b) Test HomePage

1. Mở: `https://edushop.vercel.app`
2. Click icon **SEOquake** → **"Diagnosis"**
3. Kiểm tra điểm:

   **Mục cần đạt (để có điểm cao):**
   - ✅ Title tag present (1-70 characters)
   - ✅ Meta description present (70-160 characters)
   - ✅ Meta keywords present
   - ✅ H1 tag present (only one)
   - ✅ Alt attributes for images
   - ✅ Text/HTML ratio > 15%
   - ✅ Internal links present
   - ✅ No broken links

4. **Chụp ảnh:**
   - Screenshot tổng quan SEOquake (cho thấy điểm số)
   - Screenshot chi tiết Diagnosis

#### c) Test Course Detail Page

1. Mở: `https://edushop.vercel.app/course/reactjs-co-ban-den-nang-cao`
2. Kiểm tra URL thân thiện:
   - ✅ Có slug trong URL (không phải `/course/123`)
   - **Chụp ảnh:** Address bar hiển thị URL slug

3. View Page Source (Ctrl+U):
   - Tìm các thẻ meta:
     ```html
     <title>ReactJS từ cơ bản đến nâng cao | EduShop</title>
     <meta name="description" content="...">
     <meta property="og:title" content="...">
     <meta property="og:image" content="...">
     <meta property="og:description" content="...">
     <meta property="og:url" content="...">
     ```
   - **Chụp ảnh:** 5 screenshots khác nhau cho thấy đầy đủ meta tags

4. Click icon **SEOquake** → **"Diagnosis"**
   - **Chụp ảnh:** Kết quả điểm SEO

### 5.3. Test Facebook Share

1. Mở trang chi tiết khóa học
2. Click nút **"Share"** (icon chia sẻ)
3. Chọn **"Share on Facebook"**
4. Kiểm tra Facebook Share Dialog:
   - ✅ Hiển thị thumbnail khóa học
   - ✅ Hiển thị tiêu đề
   - ✅ Hiển thị mô tả
   - ✅ Link đúng URL

5. **Chụp ảnh:**
   - Share dialog trước khi post
   - Post đã share trên Facebook timeline (nếu muốn)

⚠️ **Nếu preview không hiển thị đúng:**

```
Facebook Sharing Debugger:
1. Truy cập: https://developers.facebook.com/tools/debug/
2. Nhập URL course: https://edushop.vercel.app/course/reactjs-co-ban-den-nang-cao
3. Click "Debug" → "Scrape Again"
4. Kiểm tra preview
```

### 5.4. Tổng hợp Screenshots cần có (8 ảnh)

| # | Nội dung | File name |
|---|----------|-----------|
| 1 | URL thân thiện - Address bar có slug | `1_url_friendly.png` |
| 2 | Meta tags - Page Source `<head>` section | `2_meta_tags_basic.png` |
| 3 | Open Graph tags - og:title, og:image | `3_meta_og_tags.png` |
| 4 | Meta description và keywords | `4_meta_description.png` |
| 5 | Facebook Share Dialog preview | `5_facebook_share_dialog.png` |
| 6 | SEOquake HomePage - Diagnosis result | `6_seoquake_homepage.png` |
| 7 | SEOquake Course Detail - Diagnosis | `7_seoquake_course_detail.png` |
| 8 | Website overview - Homepage đầy đủ | `8_website_overview.png` |

---

## 6. XỬ LÝ LỖI THƯỜNG GẶP

### 6.1. Frontend không load được courses

**Triệu chứng:** Trang trắng, console log "Network Error"

**Nguyên nhân:**
- Backend URL sai trong `.env.production`
- CORS chưa cấu hình đúng
- Backend đang sleep (Render free tier)

**Giải pháp:**

```javascript
// 1. Kiểm tra backend URL
// Mở F12 Console → Network tab
// Xem request gọi đến đâu

// 2. Kiểm tra CORS trong backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edushop.vercel.app',  // ⬅️ Thêm dòng này
    'https://edushop-frontend-xxxx.vercel.app'
  ],
  credentials: true
}));

// 3. Wake up backend trước
// Truy cập: https://edushop-backend-xxxx.onrender.com/api/courses
// Đợi 30-60s
// Sau đó refresh frontend
```

### 6.2. Build thất bại trên Vercel

**Triệu chứng:** Vercel build failed, có lỗi TypeScript

**Giải pháp:**

```powershell
# 1. Test build local trước
cd frontend
npm run build

# 2. Fix TypeScript errors local trước
npm run type-check

# 3. Nếu cần, tạm thời tắt strict mode
# Sửa tsconfig.json:
{
  "compilerOptions": {
    "strict": false  // ⬅️ Tắt tạm thời
  }
}

# 4. Push lại
git add .
git commit -m "Fix build errors"
git push
```

### 6.3. MongoDB connection failed

**Triệu chứng:** Render logs hiển thị "MongooseError: connect ETIMEDOUT"

**Giải pháp:**

```
1. Kiểm tra IP Whitelist trên MongoDB Atlas:
   - Network Access → Allow 0.0.0.0/0

2. Kiểm tra MONGODB_URI trong Render:
   - Có dấu `/` và tên database không?
   - mongodb+srv://user:pass@cluster.xxx.mongodb.net/edushop_db?...
                                                          ^^^^^^^^^^^

3. Test connection từ local:
   node backend/test-connection.js
```

### 6.4. Facebook Share không hiển thị preview

**Giải pháp:**

```
1. Kiểm tra meta tags trong Page Source (Ctrl+U)
   - Có đầy đủ og:title, og:image, og:description không?

2. Dùng Facebook Debugger:
   https://developers.facebook.com/tools/debug/
   - Nhập URL course
   - Click "Scrape Again"
   - Xem preview

3. Kiểm tra og:image:
   - URL phải là absolute (https://...)
   - Kích thước tối thiểu: 200x200px
   - Khuyến nghị: 1200x630px
   - Format: JPG, PNG

4. Nếu vẫn không được:
   - Clear Facebook cache bằng Debugger tool
   - Đợi 5-10 phút để Facebook cập nhật
```

### 6.5. Messenger Chat không hiển thị

**Triệu chứng:** Không thấy icon Messenger góc dưới phải

**Giải pháp:**

```javascript
// 1. Kiểm tra ENABLE_MESSENGER = true trong Layout.tsx
const ENABLE_MESSENGER = true; // ⬅️ Phải là true

// 2. Kiểm tra FB_PAGE_ID đúng
// Lấy Page ID: Facebook Page → Settings → Page Info

// 3. Kiểm tra domain whitelist trên Facebook:
// Page Settings → Messenger Platform → Whitelisted Domains
// Thêm: edushop.vercel.app

// 4. Kiểm tra Page đã publish chưa
// Page phải ở trạng thái Public
```

### 6.6. Render backend sleep quá lâu

**Giải pháp: Dùng UptimeRobot (FREE)**

```
1. Đăng ký: https://uptimerobot.com/signUp
2. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: EduShop Backend
   - URL: https://edushop-backend-xxxx.onrender.com/api
   - Monitoring Interval: 5 minutes
3. Save

✅ Backend sẽ được ping mỗi 5 phút → Không sleep
```

---

## 7. CHECKLIST HOÀN TẤT

### Backend ✅
- [ ] MongoDB Atlas cluster created
- [ ] Database access configured
- [ ] Network access: 0.0.0.0/0
- [ ] Sample data imported
- [ ] GitHub repository created
- [ ] Render web service deployed
- [ ] Environment variables configured
- [ ] API responding: `/api/courses`
- [ ] CORS configured for Vercel domain

### Frontend ✅
- [ ] `.env.production` created with correct API URL
- [ ] `ENABLE_MESSENGER = true` in Layout.tsx
- [ ] Local build successful (`npm run build`)
- [ ] GitHub repository created
- [ ] Vercel project deployed
- [ ] Environment variable `VITE_API_URL` set
- [ ] Website loading correctly
- [ ] Courses displayed
- [ ] Search & filters working
- [ ] Course detail page loading
- [ ] Crisp Chat visible
- [ ] Facebook Messenger visible

### SEO Testing ✅
- [ ] SEOquake installed
- [ ] HomePage SEO score checked
- [ ] Course Detail SEO score checked
- [ ] URL friendly (slug-based) verified
- [ ] Meta tags present (title, description, keywords)
- [ ] Open Graph tags present (og:title, og:image, og:description, og:url)
- [ ] Facebook Share button working
- [ ] Facebook Share preview correct
- [ ] 8 screenshots captured

### Submission ✅
- [ ] All screenshots organized
- [ ] SEO scores documented
- [ ] URLs documented (frontend + backend)
- [ ] Test account credentials prepared
- [ ] Demo video recorded (optional)

---

## 8. THÔNG TIN HỮU ÍCH

### URLs quan trọng

```
Frontend (Vercel):
https://edushop.vercel.app

Backend (Render):
https://edushop-backend-xxxx.onrender.com

Database (MongoDB Atlas):
https://cloud.mongodb.com/

API Endpoints:
GET  /api/courses
GET  /api/courses/:id
GET  /api/courses/slug/:slug
GET  /api/categories
POST /api/auth/register
POST /api/auth/login
GET  /api/reviews/:courseId
POST /api/reviews
```

### Tài khoản test

```
Admin:
Email: admin@edushop.com
Password: admin123

User:
Email: test@edushop.com
Password: test123
```

### Công cụ hữu ích

- **SEOquake**: https://www.seoquake.com/
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **UptimeRobot**: https://uptimerobot.com/ (keep backend awake)
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **MongoDB Atlas**: https://cloud.mongodb.com/

### Lệnh CLI hữu ích

```powershell
# Frontend
npm run dev          # Chạy local development
npm run build        # Build production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript errors

# Backend
npm run dev          # Chạy với nodemon
npm start            # Chạy production
node server.js       # Chạy trực tiếp

# Git
git status           # Kiểm tra thay đổi
git add .            # Add tất cả files
git commit -m "msg"  # Commit với message
git push             # Push lên GitHub

# Vercel CLI
vercel               # Deploy preview
vercel --prod        # Deploy production
vercel logs          # Xem logs
```

---

## 🎉 HOÀN TẤT!

Chúc bạn deploy thành công! Nếu gặp vấn đề, tham khảo mục **"Xử lý lỗi thường gặp"** ở trên.

**Hỗ trợ:**
- Đọc kỹ error messages trên Vercel/Render logs
- Kiểm tra browser console (F12)
- Test từng phần: Database → Backend → Frontend
- Google error messages cụ thể

**Good luck! 🚀**

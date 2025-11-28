# 🚀 HƯỚNG DẪN DEPLOY EDUSHOP LÊN VERCEL & RENDER

## 📋 TỔNG QUAN

Website EduShop được deploy theo kiến trúc:
- **Frontend:** Vercel (miễn phí, domain: edushop.vercel.app)
- **Backend:** Render (miễn phí, domain: edushop-api.onrender.com)
- **Database:** MongoDB Atlas (miễn phí, 512MB)

**Thời gian:** 30-45 phút
**Chi phí:** 100% MIỄN PHÍ

---

## ✅ CÁC TÍNH NĂNG SEO ĐÃ HOÀN THÀNH

### 1. **URL thân thiện (1 điểm)** ✅
- Trang chi tiết khóa học: `/course/ten-khoa-hoc-slug`
- Ví dụ: `/course/javascript-fundamentals`
- File: `App.tsx` - Route: `path="course/:slug"`

### 2. **Meta tags & Open Graph (2 điểm)** ✅
**Đã implement:**
- ✅ Meta description
- ✅ Meta keywords
- ✅ Open Graph title, description, image
- ✅ Twitter Card
- ✅ Product schema (price, currency)
- ✅ Share Facebook button (hình, tiêu đề, mô tả, URL)

**Files:**
- `frontend/src/components/SEO.tsx` - SEO Component
- `frontend/src/components/ShareButton.tsx` - Share Facebook
- `frontend/src/pages/CourseDetailPage.tsx` - Sử dụng SEO

### 3. **SEO Content (1 điểm)** ✅
- Trang chủ đã được tối ưu với SEO content
- Keywords, description phù hợp
- Heading structure chuẩn (H1, H2)
- File: `frontend/src/pages/HomePage.tsx`

**Sau deploy, dùng SEO Quake để đánh giá:**
1. Cài extension: https://chrome.google.com/webstore/detail/seoquake
2. Truy cập website deployed
3. Click icon SEOquake → "Diagnosis"
4. Xem điểm số và khuyến nghị

---

## 📝 BƯỚC 1: SETUP MONGODB ATLAS (10 phút)

### 1.1. Tạo tài khoản & Cluster

```
1. Vào: https://www.mongodb.com/cloud/atlas/register
2. Sign up (dùng Google hoặc Email)
3. Chọn plan: "M0 Sandbox" (FREE)
4. Cloud Provider: AWS
5. Region: ap-southeast-1 (Singapore)
6. Cluster Name: edushop
7. Click "Create Cluster"
```

### 1.2. Tạo Database User

```
1. Security → Database Access
2. Click "Add New Database User"
   - Authentication Method: Password
   - Username: edushop_admin
   - Password: [Tạo password mạnh, save lại]
   - User Privileges: Atlas Admin
3. Click "Add User"
```

### 1.3. Whitelist IP

```
1. Security → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
   - IP: 0.0.0.0/0
   - Description: All IPs (for Render deployment)
4. Click "Confirm"
```

### 1.4. Lấy Connection String

```
1. Database → Connect
2. Chọn "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   mongodb+srv://edushop_admin:<password>@edushop.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. Thay <password> bằng password thật của bạn
6. Save connection string này
```

---

## 🔧 BƯỚC 2: DEPLOY BACKEND LÊN RENDER (15 phút)

### 2.1. Chuẩn bị Backend

**Tạo file `.env` trong thư mục backend:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://edushop_admin:YOUR_PASSWORD@edushop.xxxxx.mongodb.net/edushop?retryWrites=true&w=majority

# Server Config
PORT=5000
NODE_ENV=production

# JWT Secret (tạo random string dài)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_123456789

# PayPal (nếu có)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

**Kiểm tra file `package.json`:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2.2. Deploy lên Render

```
1. Vào: https://render.com
2. Sign up với GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repo (hoặc upload code)
5. Settings:
   Name: edushop-api
   Region: Singapore
   Branch: main (hoặc master)
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free

6. Environment Variables:
   Click "Add Environment Variable"
   Thêm từng biến từ file .env:
   
   MONGODB_URI = mongodb+srv://...
   PORT = 5000
   NODE_ENV = production
   JWT_SECRET = your_secret_key

7. Click "Create Web Service"
8. Đợi 5-10 phút để build và deploy
```

### 2.3. Kiểm tra Backend

```
1. Sau khi deploy xong, bạn sẽ có URL:
   https://edushop-api.onrender.com

2. Test API:
   - Mở: https://edushop-api.onrender.com
   - Bạn sẽ thấy JSON response với message "API is running"

3. Test endpoints:
   - https://edushop-api.onrender.com/api/courses
   - https://edushop-api.onrender.com/api/categories
```

**⚠️ LƯU Ý:** Free tier của Render sẽ ngủ sau 15 phút không dùng. Lần request đầu tiên mất ~30 giây để wake up.

---

## 🌐 BƯỚC 3: DEPLOY FRONTEND LÊN VERCEL (10 phút)

### 3.1. Cập nhật API URL

**File: `frontend/src/api/axiosConfig.ts`**

```typescript
// Thay localhost bằng URL Render
const API_BASE_URL = 'https://edushop-api.onrender.com/api';
```

**Hoặc dùng environment variable:**

Tạo file `frontend/.env.production`:

```env
VITE_API_URL=https://edushop-api.onrender.com/api
```

Cập nhật `axiosConfig.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 3.2. Bật Facebook Messenger

**File: `frontend/src/components/layout/Layout.tsx`** - Dòng 31

```typescript
const ENABLE_MESSENGER = true; // Bật Messenger khi deploy
```

### 3.3. Deploy lên Vercel

**Cách 1: Qua Vercel CLI (Terminal)**

```powershell
# Cài Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd c:\Users\Administrator\Downloads\EduShop\frontend
vercel --prod

# Làm theo hướng dẫn:
# - Set up and deploy? Yes
# - Which scope? [Chọn account của bạn]
# - Link to existing project? No
# - Project name: edushop
# - Directory: ./
# - Override settings? No

# Đợi 3-5 phút để build và deploy
```

**Cách 2: Qua Vercel Dashboard (Web)**

```
1. Vào: https://vercel.com
2. Sign up với GitHub
3. Click "Add New" → "Project"
4. Import Git Repository (hoặc upload folder frontend)
5. Settings:
   Framework Preset: Vite
   Root Directory: frontend (nếu cần)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install

6. Environment Variables:
   VITE_API_URL = https://edushop-api.onrender.com/api

7. Click "Deploy"
8. Đợi 2-3 phút
```

### 3.4. Lấy URL Website

```
Sau khi deploy xong:
1. Vercel sẽ cho bạn URL: https://edushop-xyz123.vercel.app
2. Click vào link để xem website
3. Test các tính năng:
   - Browse khóa học
   - Xem chi tiết khóa học
   - Add to cart
   - Share Facebook
   - Crisp Chat
   - Facebook Messenger
```

---

## ✅ BƯỚC 4: KIỂM TRA SEO (5 phút)

### 4.1. Cài SEO Quake

```
1. Chrome Web Store: 
   https://chrome.google.com/webstore/detail/seoquake

2. Click "Add to Chrome"
3. Pin extension vào toolbar
```

### 4.2. Đánh giá SEO

```
1. Mở website deployed: https://edushop-xyz123.vercel.app

2. Click icon SEOquake → "Diagnosis"

3. Kiểm tra các điểm:
   ✅ Title tag (phải có)
   ✅ Meta description (phải có)
   ✅ H1 tag (chỉ 1 H1)
   ✅ Image alt text
   ✅ Internal links
   ✅ Page load speed

4. Xem trang chi tiết khóa học:
   https://edushop-xyz123.vercel.app/course/javascript-fundamentals

5. Test share Facebook:
   - Click nút "Chia sẻ" → Facebook
   - Kiểm tra preview có đủ: hình, tiêu đề, mô tả
   - Click link trong Facebook → nhảy đúng trang

6. Test với Facebook Debugger:
   https://developers.facebook.com/tools/debug/
   - Paste URL trang chi tiết
   - Click "Debug"
   - Xem OG tags đầy đủ chưa
```

### 4.3. Screenshot kết quả

Chụp màn hình các điểm sau để nộp bài:
```
1. SEO Quake diagnosis (hiện điểm SEO)
2. Facebook share preview (hiện hình, title, description)
3. Share thành công trên Facebook timeline
4. Click link Facebook → mở đúng trang chi tiết
```

---

## 🔍 BƯỚC 5: TỐI ƯU HÓA THÊM (Nếu cần)

### 5.1. Cải thiện SEO Score

**Thêm sitemap.xml:**

Tạo file `frontend/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://edushop.vercel.app/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://edushop.vercel.app/course/javascript-fundamentals</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Thêm robots.txt:**

Tạo file `frontend/public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://edushop.vercel.app/sitemap.xml
```

**Thêm favicon:**

Copy file `favicon.ico` vào `frontend/public/`

### 5.2. Tối ưu Performance

**Lazy loading images:**

```typescript
<img 
  src={course.thumbnail} 
  alt={course.title}
  loading="lazy"
/>
```

**Compress images:**

Dùng TinyPNG hoặc Squoosh để nén ảnh trước khi upload.

---

## 📊 KẾT QUẢ MONG ĐỢI

### ✅ **URL thân thiện (1đ)**
- `/course/javascript-fundamentals` ✅
- `/course/python-for-beginners` ✅
- Slug tự động từ title

### ✅ **Meta tags & Share Facebook (2đ)**
- OG tags đầy đủ ✅
- Share Facebook hiện hình ảnh ✅
- Share Facebook hiện tiêu đề ✅
- Share Facebook hiện mô tả ✅
- Click link nhảy đúng trang ✅

### ✅ **SEO Content (1đ)**
- Trang chủ tối ưu SEO ✅
- Keywords phù hợp ✅
- Description chuẩn ✅
- SEO Quake score > 70 ✅

**TỔNG: 4/4 điểm**

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Backend không connect được MongoDB

**Lỗi:** `MongoServerError: Authentication failed`

**Giải pháp:**
```
1. Kiểm tra password trong MONGODB_URI
2. Kiểm tra username đúng chưa
3. Vào MongoDB Atlas → Database Access → Edit User → Reset Password
4. Update password mới vào Render Environment Variables
5. Restart service
```

### Vấn đề 2: Frontend không call được API

**Lỗi:** `CORS error` hoặc `404 Not Found`

**Giải pháp:**
```
1. Kiểm tra API_BASE_URL đúng chưa
2. Kiểm tra backend đã deploy chưa
3. Test API trực tiếp: https://edushop-api.onrender.com
4. Kiểm tra CORS trong backend:
   
   // backend/server.js
   app.use(cors({
     origin: '*', // Hoặc chỉ định domain Vercel
     credentials: true
   }));
```

### Vấn đề 3: Facebook share không hiện hình

**Giải pháp:**
```
1. Vào: https://developers.facebook.com/tools/debug/
2. Paste URL trang chi tiết
3. Click "Scrape Again"
4. Facebook sẽ cache lại OG tags mới
5. Thử share lại
```

### Vấn đề 4: Messenger không hiển thị

**Giải pháp:**
```
1. Kiểm tra ENABLE_MESSENGER = true
2. Kiểm tra Page ID đúng chưa
3. Kiểm tra Page đã Published chưa
4. Vào Page Settings → Messaging → Bật tất cả
5. Deploy lại frontend
```

### Vấn đề 5: Build failed trên Vercel

**Lỗi:** `Build failed` hoặc `Out of memory`

**Giải pháp:**
```
1. Kiểm tra package.json có lỗi không
2. Delete node_modules và npm install lại
3. Check TypeScript errors: npm run build
4. Sửa các lỗi compile
5. Commit và push lại
```

---

## 🎯 CHECKLIST HOÀN THÀNH

Trước khi nộp bài, đảm bảo:

- [ ] Backend deployed và chạy được
- [ ] Frontend deployed và chạy được
- [ ] MongoDB Atlas connected
- [ ] Courses hiển thị trên trang chủ
- [ ] Chi tiết khóa học mở được với URL thân thiện
- [ ] Meta tags hiển thị đúng (View Page Source)
- [ ] Share Facebook có đủ hình, tiêu đề, mô tả
- [ ] Click link Facebook mở đúng trang
- [ ] SEO Quake đánh giá điểm > 70
- [ ] Screenshot đầy đủ để nộp
- [ ] Crisp Chat hoạt động
- [ ] Facebook Messenger hiển thị (nếu có)

---

## 📸 SCREENSHOTS CẦN NỘP

1. **URL thân thiện:**
   - Screenshot thanh địa chỉ hiện `/course/ten-khoa-hoc`

2. **Meta tags:**
   - View Page Source → Screenshot phần `<head>` có OG tags

3. **Share Facebook:**
   - Screenshot preview khi share (có hình, title, description)
   - Screenshot post trên Facebook timeline
   - Screenshot click link → mở đúng trang

4. **SEO Quake:**
   - Screenshot điểm SEO
   - Screenshot các khuyến nghị

---

## 🎉 HOÀN TẤT!

Website của bạn đã:
- ✅ Deploy thành công
- ✅ Có URL thân thiện
- ✅ Meta tags đầy đủ
- ✅ Share Facebook hoàn hảo
- ✅ SEO tối ưu

**URLs:**
- Frontend: https://edushop-xyz123.vercel.app
- Backend: https://edushop-api.onrender.com
- API Docs: https://edushop-api.onrender.com/api-docs

**Đạt điểm: 4/4 điểm SEO & Sharing! 🎉**

---

**Tài liệu tham khảo:**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Open Graph: https://ogp.me
- SEO Quake: https://www.seoquake.com/

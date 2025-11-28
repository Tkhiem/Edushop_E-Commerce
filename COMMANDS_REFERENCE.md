# 🎯 COMMANDS QUICK REFERENCE

## 📦 LOCAL DEVELOPMENT

### Backend:
```powershell
cd backend

# Chạy development (with nodemon)
npm run dev

# Chạy production
npm start

# Import dữ liệu
node scripts/importKaggleWithImages.js

# Kiểm tra database
node scripts/checkDatabase.js

# Tạo admin user
node scripts/createTestUsers.js

# Lấy admin token
node scripts/getAdminToken.js
```

### Frontend:
```powershell
cd frontend

# Chạy development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## 🔧 GIT COMMANDS

### Khởi tạo Git:
```powershell
# Di chuyển vào thư mục
cd backend  # hoặc frontend

# Khởi tạo git
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit"

# Link với GitHub
git remote add origin https://github.com/USERNAME/REPO.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

### Update code và deploy lại:
```powershell
# Sau khi sửa code
git add .
git commit -m "Fix bugs and update features"
git push

# Vercel và Render sẽ tự động deploy lại
```

---

## 🚀 VERCEL CLI

### Cài đặt:
```powershell
npm install -g vercel
```

### Deploy:
```powershell
cd frontend

# Login Vercel
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# Xem logs
vercel logs

# List projects
vercel list

# Xem environment variables
vercel env ls

# Thêm environment variable
vercel env add VITE_API_URL
# Sau đó nhập value: https://edushop-backend-xxx.onrender.com/api
```

---

## 🗄️ MONGODB COMMANDS

### Test connection:
```powershell
cd backend
node test-connection.js
```

### Import/Export:
```powershell
# Import từ Kaggle dataset
node scripts/importKaggleWithImages.js

# Reset database
node scripts/ResetDatabase.js

# Check categories
node scripts/checkCategories.js

# Check courses
node scripts/checkCourseDetails.js
```

### MongoDB Shell (nếu cài MongoDB local):
```powershell
# Connect to Atlas
mongosh "mongodb+srv://edushop_admin:PASSWORD@cluster.mongodb.net/edushop_db"

# Show databases
show dbs

# Use database
use edushop_db

# Show collections
show collections

# Count documents
db.courses.countDocuments()
db.categories.countDocuments()

# Find one course
db.courses.findOne()

# Find by slug
db.courses.findOne({ slug: "reactjs-co-ban-den-nang-cao" })
```

---

## 🧪 TESTING COMMANDS

### Test API endpoints:
```powershell
# Test courses
curl http://localhost:5000/api/courses

# Test specific course
curl http://localhost:5000/api/courses/slug/reactjs-co-ban-den-nang-cao

# Test categories
curl http://localhost:5000/api/categories

# Test với PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/courses" | Select-Object -Expand Content
```

### Test production:
```powershell
# Test backend Render
curl https://edushop-backend-xxx.onrender.com/api/courses

# Test frontend Vercel (trong browser)
https://edushop.vercel.app
```

---

## 📸 SCREENSHOT COMMANDS

### Windows Screenshot:
```
Win + Shift + S     → Snipping tool (chọn vùng chụp)
Win + PrtScn        → Full screen screenshot
Alt + PrtScn        → Active window only
```

### Browser DevTools:
```
F12                 → Mở DevTools
Ctrl + Shift + C    → Element inspector
Ctrl + U            → View Page Source
Ctrl + Shift + I    → DevTools (alternative)
```

---

## 🔍 DEBUG COMMANDS

### Check ports:
```powershell
# Xem port nào đang dùng
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process trên port
# Lấy PID từ lệnh trên, sau đó:
taskkill /PID <PID> /F
```

### Check Node/npm versions:
```powershell
node --version
npm --version
git --version
```

### Clear cache:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules và reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Clear Vercel build cache (qua dashboard)
# Vercel Dashboard → Project → Settings → Clear Build Cache
```

---

## 🌐 USEFUL URLS

### Development:
```
Frontend Local:  http://localhost:5173
Backend Local:   http://localhost:5000
Backend API:     http://localhost:5000/api
Swagger Docs:    http://localhost:5000/api-docs
```

### Production:
```
Frontend:        https://edushop.vercel.app
Backend:         https://edushop-backend-xxx.onrender.com
API Endpoint:    https://edushop-backend-xxx.onrender.com/api
```

### Dashboards:
```
Vercel:          https://vercel.com/dashboard
Render:          https://dashboard.render.com
MongoDB Atlas:   https://cloud.mongodb.com
GitHub:          https://github.com
```

### Tools:
```
SEOquake:        https://www.seoquake.com/
FB Debug Tool:   https://developers.facebook.com/tools/debug/
UptimeRobot:     https://uptimerobot.com
PageSpeed:       https://pagespeed.web.dev/
GTmetrix:        https://gtmetrix.com/
```

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/edushop_db
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://edushop.vercel.app
```

### Frontend (.env.production):
```env
VITE_API_URL=https://edushop-backend-xxx.onrender.com/api
```

---

## 📝 COMMON FIXES

### Fix: Port already in use
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5001
```

### Fix: CORS error
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edushop.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

### Fix: MongoDB connection timeout
```
1. Kiểm tra IP whitelist: 0.0.0.0/0
2. Kiểm tra username/password đúng
3. Kiểm tra tên database trong connection string
4. Test connection: node test-connection.js
```

### Fix: Vercel build failed
```powershell
# Test build local
cd frontend
npm run build

# Fix TypeScript errors
npm run type-check

# Clear cache
rm -rf dist node_modules
npm install
npm run build
```

### Fix: Render backend sleep
```
Giải pháp 1: UptimeRobot ping mỗi 5 phút
Giải pháp 2: Upgrade Render plan ($7/month)
Giải pháp 3: Chấp nhận cold start 30-60s
```

---

## 🎯 DEPLOYMENT WORKFLOW

### Workflow đầy đủ:
```
1. CODE LOCAL
   ├─ Sửa code
   ├─ Test: npm run dev
   └─ Build: npm run build ✅

2. COMMIT TO GIT
   ├─ git add .
   ├─ git commit -m "message"
   └─ git push ✅

3. AUTO DEPLOY
   ├─ Vercel: Auto từ GitHub push
   ├─ Render: Auto từ GitHub push
   └─ Đợi 2-5 phút ✅

4. VERIFY
   ├─ Mở production URL
   ├─ Test chức năng
   └─ Check console không lỗi ✅

5. SEO TEST (sau deploy)
   ├─ SEOquake diagnosis
   ├─ Facebook share test
   └─ Chụp screenshots ✅
```

### Quick update:
```powershell
# Sửa code → Test → Push
git add .
git commit -m "Update features"
git push

# Vercel/Render auto deploy
# Đợi 2-3 phút → Check website
```

---

## 📚 DOCUMENTATION LINKS

### React:
- React Docs: https://react.dev
- React Router: https://reactrouter.com
- React Helmet: https://github.com/staylor/react-helmet-async

### Node.js:
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com
- JWT: https://jwt.io

### Deployment:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

### SEO:
- Google SEO Guide: https://developers.google.com/search/docs
- Open Graph Protocol: https://ogp.me
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards

---

## 💡 TIPS & TRICKS

### 1. Fast deployment:
```powershell
# Tạo alias trong PowerShell profile
function deploy-frontend {
    cd frontend
    git add .
    git commit -m "Update"
    git push
    cd ..
}

function deploy-backend {
    cd backend
    git add .
    git commit -m "Update"
    git push
    cd ..
}
```

### 2. Quick test:
```powershell
# Test cả frontend và backend cùng lúc
# Terminal 1:
cd backend; npm run dev

# Terminal 2:
cd frontend; npm run dev
```

### 3. Environment switching:
```powershell
# Development
npm run dev

# Production test local
npm run build
npm run preview
```

### 4. Log monitoring:
```powershell
# Vercel logs (CLI)
vercel logs

# Render logs (dashboard)
# Render → Service → Logs tab

# Backend logs local
npm run dev  # Xem console output
```

---

## ✅ FINAL CHECKLIST

Trước khi nộp bài:
```
□ Backend deployed và responding
□ Frontend deployed và loading
□ Database có dữ liệu
□ SEO score >= 70
□ Facebook share working
□ 8 screenshots captured
□ URLs documented
□ Test account ready
□ Báo cáo hoàn chỉnh
```

---

**🚀 DONE! Good luck với deployment!**

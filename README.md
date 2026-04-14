# 📸 SASI ECE Farewell Photo Booth

A full-stack photo booth web app for the SASI ECE farewell event.
Upload, browse, search, download, and share photos via WhatsApp.

---

## 🗂️ Folder Structure

```
sasi-ece-photobooth/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK config
│   │   └── db.js               # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js   # Login logic + JWT
│   │   └── photoController.js  # Upload / get / delete
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── upload.js           # Multer memory storage
│   ├── models/
│   │   ├── Admin.js            # Admin user schema
│   │   └── Photo.js            # Photo metadata schema
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/login
│   │   └── photos.js           # Photo CRUD routes
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── LazyImage.jsx       # Blur-up lazy loading
    │   │   ├── Navbar.jsx
    │   │   ├── PhotoCard.jsx       # Grid card with actions
    │   │   ├── PhotoModal.jsx      # Lightbox with nav
    │   │   ├── ProtectedRoute.jsx
    │   │   └── SkeletonGrid.jsx    # Loading skeleton
    │   ├── context/
    │   │   └── AuthContext.jsx     # JWT auth state
    │   ├── hooks/
    │   │   ├── useIntersectionObserver.js
    │   │   └── usePhotos.js        # Infinite scroll data
    │   ├── pages/
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminPanel.jsx      # Upload + manage
    │   │   └── Gallery.jsx         # Public gallery
    │   ├── utils/
    │   │   └── api.js              # Axios instance + endpoints
    │   ├── App.jsx
    │   ├── index.css               # Tailwind + custom styles
    │   └── index.js
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

---

## ⚙️ Setup Steps

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier = 25GB, paid = 50GB+)

---

### 2. Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. In Settings → Upload, create a folder called `sasi_ece_farewell`

---

### 3. MongoDB Atlas Setup
1. Sign up at https://mongodb.com/atlas
2. Create a free cluster
3. Under **Database Access**: create a user with read/write permissions
4. Under **Network Access**: allow `0.0.0.0/0` (or your server IP)
5. Under **Clusters** → Connect → "Connect your application": copy the connection string
6. Replace `<password>` in the connection string with your DB user's password

---

### 4. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/sasi_ece_photobooth?retryWrites=true&w=majority
JWT_SECRET=any_long_random_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

Start backend:
```bash
npm run dev       # development (with nodemon)
npm start         # production
```

Backend runs on: **http://localhost:5000**

---

### 5. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

For **development** (uses proxy to localhost:5000):
```
# Leave REACT_APP_API_URL empty — proxy handles it
```

For **production**:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

Start frontend:
```bash
npm start         # development
npm run build     # production build → /build folder
```

Frontend runs on: **http://localhost:3000**

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login, returns JWT |
| GET | `/api/photos` | ❌ | Get all photos (paginated) |
| GET | `/api/photos/search/:photoNumber` | ❌ | Search by photo number |
| POST | `/api/photos/upload` | ✅ | Upload single photo |
| POST | `/api/photos/upload-multiple` | ✅ | Upload up to 150 photos |
| DELETE | `/api/photos/:id` | ✅ | Delete photo |

**Pagination**: `GET /api/photos?page=1&limit=20`

---

## 🚀 Deployment

### Backend (Render / Railway / Fly.io)
1. Push `backend/` to GitHub
2. Create a new Web Service pointing to it
3. Set all env variables from `.env`
4. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Push `frontend/` to GitHub
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set env variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

---

## 🔑 Default Admin Credentials

Set in `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sasi_ece_2024
```
Change these before deployment!

---

## 📱 Features

- **Gallery**: Infinite scroll, lazy loading with blur-up effect, responsive grid
- **Search**: Find photos instantly by ECE number (ECE001, ECE002...)
- **Lightbox**: Full-screen viewer with keyboard navigation (← →, Esc)
- **Download**: One-click download as JPEG
- **WhatsApp Share**: Direct share with photo URL
- **Admin Panel**: Drag & drop upload, bulk upload 100+ photos, progress bar, delete
- **Auto-numbering**: Photos auto-assigned ECE001, ECE002... on upload
- **Dark theme**: Premium gold-accented dark UI
- **Mobile first**: Fully responsive on all screen sizes

---

## ⚠️ Important Notes

- Images are **NOT stored in MongoDB** — only metadata (URL, publicId, photoNumber)
- All images live on **Cloudinary** (scalable, CDN-optimized)
- Thumbnails auto-generated via Cloudinary transformations (400×400 crop)
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)

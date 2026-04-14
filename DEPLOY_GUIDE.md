# 🚀 SASI ECE Photo Booth — Complete Deployment Guide

All credentials are pre-filled. Just follow the steps below.

---

## ✅ STEP 1 — Push Code to GitHub

1. Go to https://github.com → click **New repository**
2. Name it: `sasi-ece-photobooth`
3. Set to **Public** or **Private** → click **Create repository**
4. On your computer, open terminal inside the `sasi-ece-photobooth` folder:

```bash
git init
git add .
git commit -m "Initial commit - SASI ECE Photo Booth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sasi-ece-photobooth.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## ✅ STEP 2 — Deploy Backend on Render

1. Go to https://render.com → Sign up / Log in
2. Click **New +** → select **Web Service**
3. Click **Connect a repository** → select `sasi-ece-photobooth`
4. Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `sasi-ece-api` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

5. Scroll down to **Environment Variables** → click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://ganeshkatnam_db_user:OtLx7G1ioQHb55y6@cluster0.atsgeso.mongodb.net/sasi_ece_photobooth?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `sasi_ece_farewell_2024_jwt_secret_key` |
| `JWT_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | `dqqmvy2i1` |
| `CLOUDINARY_API_KEY` | `881323318663225` |
| `CLOUDINARY_API_SECRET` | `pqh6fWV3_2gCRk3Y9pIS6OPvWfc` |
| `CLOUDINARY_FOLDER` | `sasi_ece_farewell` |
| `ADMIN_USERNAME` | `farewell` |
| `ADMIN_PASSWORD` | `admin123` |
| `FRONTEND_URL` | `https://sasi-ece.netlify.app` |

6. Click **Create Web Service**
7. Wait 3-5 minutes for deploy to finish
8. You'll see: `https://sasi-ece-api.onrender.com` ✅

**Test it:** Open `https://sasi-ece-api.onrender.com/api/health` in browser
→ Should show: `{"status":"ok","timestamp":"..."}`

---

## ✅ STEP 3 — Deploy Frontend on Netlify

1. Go to https://netlify.com → Sign up / Log in
2. Click **Add new site** → **Import an existing project**
3. Click **Deploy with GitHub** → select `sasi-ece-photobooth`
4. Fill in these settings:

| Field | Value |
|-------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm install && npm run build` |
| **Publish directory** | `frontend/build` |

5. Click **Show advanced** → **New variable**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://sasi-ece-api.onrender.com/api` |

6. Click **Deploy site**
7. Wait 2-3 minutes
8. Netlify gives you a random URL like `https://amazing-name-123.netlify.app`

### 🔁 Change to your custom URL:
1. Go to **Site configuration** → **Site details** → **Change site name**
2. Type: `sasi-ece` → click **Save**
3. Your site is now: `https://sasi-ece.netlify.app` ✅

---

## ✅ STEP 4 — Test Everything

### Test Backend:
Open in browser:
```
https://sasi-ece-api.onrender.com/api/health
```
Expected: `{"status":"ok"}`

```
https://sasi-ece-api.onrender.com/api/photos
```
Expected: `{"success":true,"data":[],...}`

### Test Frontend:
1. Open `https://sasi-ece.netlify.app`
2. Gallery page loads ✅
3. Go to `https://sasi-ece.netlify.app/admin/login`
4. Login with:
   - Username: `farewell`
   - Password: `admin123`
5. Upload a test photo ✅
6. Go back to gallery → photo appears with number `ECE001` ✅
7. Click photo → Download & WhatsApp share works ✅

---

## ✅ STEP 5 — MongoDB Network Access (Important!)

Make sure Render can connect to your MongoDB:

1. Go to https://cloud.mongodb.com
2. Left sidebar → **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** → `0.0.0.0/0`
5. Click **Confirm**

This allows Render's servers to connect to your database.

---

## 🔐 Your Credentials Summary

| Service | Detail |
|---------|--------|
| **MongoDB** | `ganeshkatnam_db_user` on Cluster0 |
| **Cloudinary** | Cloud: `dqqmvy2i1` |
| **Admin Login** | `farewell` / `admin123` |
| **Backend** | `https://sasi-ece-api.onrender.com` |
| **Frontend** | `https://sasi-ece.netlify.app` |

---

## ⚠️ Common Issues & Fixes

**Backend not starting on Render?**
→ Check logs in Render dashboard → Logs tab
→ Make sure all environment variables are set correctly

**Frontend showing blank page?**
→ Check Netlify deploy log
→ Make sure `REACT_APP_API_URL` env var is set
→ Make sure `_redirects` file is in `frontend/public/`

**Photos not uploading?**
→ Check Cloudinary credentials are correct
→ Check browser console for CORS errors
→ Make sure `FRONTEND_URL` in Render matches your Netlify URL exactly

**MongoDB connection failed?**
→ Go to MongoDB Atlas → Network Access → Allow `0.0.0.0/0`
→ Double-check the connection string in Render env vars

**Render free tier sleeps after 15 mins of inactivity**
→ First request after sleep takes ~30 seconds to wake up
→ This is normal on free tier

---

## 📱 Share With Students

Once deployed, share this link with all ECE students:
```
https://sasi-ece.netlify.app
```

They can:
- Browse all photos
- Search their photo by number (ECE001, ECE002...)
- Download their photo
- Share directly to WhatsApp

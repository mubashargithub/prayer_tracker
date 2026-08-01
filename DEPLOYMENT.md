# Deployment Guide

This guide covers deploying the Deen Tracker MERN application to production. We will use **Render** (or Railway) for the Node.js backend and **Vercel** for the React frontend, with **MongoDB Atlas** as the database.

## 1. Database: MongoDB Atlas
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (the free shared tier is fine).
3. Under **Database Access**, create a new database user with a secure password.
4. Under **Network Access**, add `0.0.0.0/0` to allow access from anywhere (since deployment platforms use dynamic IPs).
5. Click **Connect** -> **Connect your application** and copy the connection string. Replace `<password>` with your database user's password.

## 2. Backend Deployment (Render / Railway)

### Using Render
1. Push your code to a GitHub repository.
2. Sign up on [Render.com](https://render.com) and click **New** -> **Web Service**.
3. Connect your GitHub account and select your repository.
4. **Settings:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Render will override this, but it's good practice)
   - `MONGO_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *A long, random cryptographic string*
6. Click **Create Web Service**. Wait for the build to finish and note the provided URL (e.g., `https://deen-tracker-api.onrender.com`).

## 3. Frontend Deployment (Vercel)

1. Sign up on [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Connect your GitHub account and select the same repository.
3. **Settings:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - **Wait!** You first need to update your Axios base URL. 
   - In `client/src/services/api.js`, the `baseURL` should point to your new Render backend URL instead of `http://localhost:5000/api`.
   - The best way is to use an env variable: `VITE_API_URL`. Set this in Vercel to `https://deen-tracker-api.onrender.com/api`.
5. Click **Deploy**. Note the provided URL (e.g., `https://deen-tracker.vercel.app`).

## 4. Final Configurations (CORS)

Now that you have your frontend URL, you **must** update the backend CORS configuration to allow requests from it.

1. Go back to your backend code (`server/server.js`).
2. Update the `cors` middleware:
   ```javascript
   app.use(cors({ 
     origin: ['http://localhost:5173', 'https://deen-tracker.vercel.app'], 
     credentials: true 
   }));
   ```
3. Commit and push the changes. Render will automatically redeploy the backend with the new CORS policy.

## 5. Security & Performance Verification

- **HTTPS:** Both Vercel and Render automatically provision and enforce HTTPS (SSL/TLS). You do not need to configure this manually.
- **Cookies:** Ensure that when setting the JWT cookie in production, `secure: true` and `sameSite: 'none'` are configured in your `authController.js` to allow cross-origin cookies.
- **Custom Domain (Optional):** You can add custom domains via Vercel's "Domains" settings and Render's "Settings" tab.

Your Deen Tracker is now live!

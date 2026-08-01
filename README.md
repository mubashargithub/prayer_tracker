# Deen Tracker 🕌

![Deen Tracker](https://via.placeholder.com/1200x400?text=Deen+Tracker)

Deen Tracker is a modern, comprehensive MERN stack web application designed to help Muslims track their daily prayers, memorize and recite Duas, and build consistent spiritual habits over time.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)

## Features ✨

* **Authentication & Profiles:** Secure JWT-based authentication (http-only cookies), password recovery, and user profiles.
* **Prayer Tracker:** Interactive daily tracker for the 5 obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) supporting statuses like Completed and Qaza.
* **Dua Library:** Built-in and custom supplications with beautiful RTL Arabic typography (`Amiri` font), transliterations, and translations.
* **Reminder Scheduler:** Set daily or specific-weekday browser notifications so you never forget to recite your Duas.
* **History Dashboard:** A unified analytics hub featuring a GitHub-style activity heatmap, Recharts-powered trend lines, streak tracking, and CSV data export.
* **Security Hardened:** Protected against NoSQL injection, XSS, and brute-force attacks via rate-limiting.

## Tech Stack 🛠️

**Frontend:**
* React (Vite)
* Tailwind CSS v4
* Redux Toolkit (State Management)
* React Router v6
* Framer Motion (Animations)
* Recharts & React Calendar Heatmap (Data Visualization)
* Vitest & React Testing Library (Testing)

**Backend:**
* Node.js & Express
* MongoDB & Mongoose
* JWT & bcryptjs (Auth)
* Helmet, express-mongo-sanitize, xss-clean, express-rate-limit (Security)
* Jest & Supertest (Testing)

## Local Setup 🚀

### Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/deen-tracker.git
cd deen-tracker
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
Create a `.env` file in the `server` directory:
\`\`\`env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/deen_tracker
JWT_SECRET=your_super_secret_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`
The application will be running at `http://localhost:5173`.

## Deployment 🌍

See the included [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions on deploying the backend to Render and the frontend to Vercel.

## Post-Launch Enhancement Roadmap 🗺️

As we continue to grow the application, the following features are planned for future releases:

- [ ] **Aladhan API Integration:** Automatically fetch real-time prayer timings based on the user's geolocation instead of static tracking.
- [ ] **Quran Reading Tracker:** Log surahs/ayahs read daily, with bookmarking capabilities and integration into the activity heatmap.
- [ ] **Ramadan Mode:** A specialized dashboard view that activates during Ramadan, tracking Taraweeh, Fasting status, and specific Ramadan Duas.
- [ ] **Community / Family Groups:** Form groups to share streaks and encourage family members.
- [ ] **PWA & Offline Support:** Convert the React app into a Progressive Web App so users can log prayers even when disconnected from the internet.
- [ ] **Dark Mode:** A soothing dark theme utilizing Tailwind's built-in dark mode support for late-night app usage.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

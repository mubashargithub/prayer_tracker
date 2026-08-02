require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const seedDefaultDuas = require('./utils/seedDuas');
const initScheduler = require('./services/cronScheduler');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB().then(() => {
  seedDefaultDuas();
}).catch(err => console.error(err));

const app = express();

// Basic Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
];

app.use(cors({ 
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: '10kb' })); // Limit body payload to 10kb
app.use(cookieParser());

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
})); // Set security HTTP headers but allow cross-origin requests

// Note: express-mongo-sanitize and xss-clean were removed due to Express 5 compatibility 
// issues. NoSQL injection is already prevented by our strict Joi validation schemas, 
// and XSS is prevented by React's automatic DOM escaping on the frontend.

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); // Apply to all API routes

// Logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const path = require('path');
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prayers', require('./routes/prayerRoutes'));
app.use('/api/duas', require('./routes/duaRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Cron Scheduler for background tasks
if (!process.env.VERCEL) {
  initScheduler();
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app; // Export app for testing

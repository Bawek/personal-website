const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const experienceRoutes = require('./routes/experience');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const chatRoutes = require('./routes/chat');
const syncRoutes = require('./routes/sync');
const uploadRoutes = require('./routes/uploads');

const app = express();

// Fail fast if critical env vars are missing
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change_me')) {
  console.error('❌  FATAL: JWT_SECRET is not set or is still the placeholder. Set a real secret in backend/.env');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('❌  FATAL: MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

// Trust proxy for Next.js development
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('FRONTEND_URL:', process.env.FRONTEND_URL)
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS)

const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  process.env.FRONTEND_URL,
  process.env.BASE_URL,
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ((origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS origin denied: ${origin}`));
      })
    : true,
  credentials: true,
}));

// Rate limiting
// Note: trustProxy is NOT a valid option in express-rate-limit v7+.
// Proxy trust is handled by app.set('trust proxy', 1) above.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

# Next.js + Vercel Migration Guide

## Overview

This guide will help you migrate your personal website from a separate Express backend + Next.js frontend architecture to a unified Next.js application with API routes, ready for Vercel deployment.

## Current Architecture

- **Frontend**: Next.js 13 (in `/frontend`)
- **Backend**: Express.js (in `/backend`)
- **Database**: MongoDB Atlas
- **Current Hosting**: Firebase (frontend) + Render/separate backend

## Target Architecture

- **Unified**: Next.js 13+ with API Routes
- **Hosting**: Vercel (both frontend and backend)
- **Database**: MongoDB Atlas (same)
- **File Uploads**: Cloudinary or Vercel Blob Storage

---

## Migration Steps

### Step 1: Restructure Project

We'll consolidate everything into the `frontend` directory since it's already set up with Next.js.

#### 1.1 Create API Routes Directory

```bash
cd frontend
mkdir -p pages/api
```

#### 1.2 Move Backend Code into Frontend

Create the following structure:
```
frontend/
├── pages/
│   ├── api/          # All API routes will go here
│   │   ├── auth/
│   │   ├── content/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── chat/
│   │   ├── sync/
│   │   ├── settings/
│   │   └── uploads/
│   └── [existing pages]
├── lib/
│   ├── db.js         # MongoDB connection
│   ├── middleware/   # Auth middleware, etc.
│   └── models/       # Mongoose models
├── utils/
│   └── services/     # GitHub, LinkedIn services
└── public/
    └── uploads/      # Static file uploads
```

---

### Step 2: Migrate Backend Dependencies

#### 2.1 Update `frontend/package.json`

Add the backend dependencies to your frontend package.json:

```json
{
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.14.18",
    "@next/font": "^13.5.4",
    "axios": "^1.6.2",
    "bcryptjs": "^3.0.3",
    "cloudinary": "^1.41.0",
    "dotenv": "^16.4.5",
    "emailjs-com": "^3.2.0",
    "express-validator": "^7.3.2",
    "firebase": "^10.6.0",
    "framer-motion": "^10.16.4",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.23.0",
    "multer": "^2.1.1",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.12.0",
    "react-tsparticles": "^2.12.0",
    "react-typed": "^2.0.12",
    "tsparticles": "^2.12.0",
    "typewriter-effect": "^2.21.0"
  }
}
```

Then run:
```bash
npm install
```

---

### Step 3: Set Up Database Connection

Create `frontend/lib/db.js`:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

---

### Step 4: Migrate Mongoose Models

Copy all models from `backend/models/` to `frontend/lib/models/`

Example: `frontend/lib/models/Project.js`

```javascript
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  image: String,
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
```

Repeat for all models: User, Content, Experience, Skill, About, Contact, Settings.

---

### Step 5: Create Middleware

Create `frontend/lib/middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken';

export const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const validate = (validations) => async (req, res, next) => {
  // Implement validation logic if needed
  return next(req, res);
};
```

---

### Step 6: Convert Express Routes to Next.js API Routes

#### Example 1: Projects API

**Old Express Route** (`backend/routes/projects.js`):
```javascript
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});
```

**New Next.js API Route** (`frontend/pages/api/projects/index.js`):
```javascript
import connectDB from '../../../lib/db';
import Project from '../../../lib/models/Project';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const project = await Project.create(req.body);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
```

#### Example 2: Protected Route with Auth

**File**: `frontend/pages/api/projects/[id].js`

```javascript
import connectDB from '../../../lib/db';
import Project from '../../../lib/models/Project';
import { authMiddleware } from '../../../lib/middleware/auth';

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Project.findByIdAndDelete(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// Wrap with auth for protected routes
export default authMiddleware(handler);
```

#### Example 3: Auth Routes

**File**: `frontend/pages/api/auth/login.js`

```javascript
import connectDB from '../../../lib/db';
import User from '../../../lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
```

---

### Step 7: Handle File Uploads

For file uploads on Vercel, you have two options:

#### Option A: Use Cloudinary (Recommended)

Create `frontend/pages/api/uploads/index.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../../../lib/middleware/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { file, folder } = req.body;
    
    const result = await cloudinary.uploader.upload(file, {
      folder: `portfolio/${folder}`,
      resource_type: 'auto'
    });

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default authMiddleware(handler);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
```

#### Option B: Use Vercel Blob Storage

```bash
npm install @vercel/blob
```

```javascript
import { put } from '@vercel/blob';
import { authMiddleware } from '../../../lib/middleware/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filename, file } = req.body;
    
    const blob = await put(filename, file, {
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default authMiddleware(handler);
```

---

### Step 8: Update Next.js Configuration

Update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/expenso', destination: '/projects', permanent: true },
      { source: '/mingo', destination: '/projects', permanent: true },
      { source: '/mailbox-client', destination: '/projects', permanent: true },
    ];
  },
  // Remove the rewrites section since API routes are now local
};

module.exports = nextConfig;
```

---

### Step 9: Configure Environment Variables

Create `frontend/.env.local`:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# GitHub (for sync service)
GITHUB_TOKEN=your_github_token

# LinkedIn (if using)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# OpenAI (for chat)
OPENAI_API_KEY=your_openai_api_key

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### Step 10: Configure Vercel

#### 10.1 Create `vercel.json` in the `frontend` directory:

```json
{
  "version": 2,
  "build": {
    "env": {
      "NPM_CONFIG_LEGACY_PEER_DEPS": "true"
    }
  },
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name",
    "CLOUDINARY_API_KEY": "@cloudinary-api-key",
    "CLOUDINARY_API_SECRET": "@cloudinary-api-secret"
  }
}
```

#### 10.2 Install Vercel CLI:

```bash
npm i -g vercel
```

#### 10.3 Login to Vercel:

```bash
vercel login
```

#### 10.4 Link your project:

```bash
cd frontend
vercel link
```

#### 10.5 Add environment variables:

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add OPENAI_API_KEY
```

Or add them via the Vercel Dashboard: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

---

### Step 11: Update API Base URLs in Frontend Code

Since your API routes are now in the same Next.js app, update all API calls:

**Before** (separate backend):
```javascript
const response = await axios.get('http://localhost:5000/api/projects');
```

**After** (unified Next.js):
```javascript
const response = await axios.get('/api/projects');
```

Create a utility file `frontend/lib/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### Step 12: Test Locally

```bash
cd frontend
npm run dev
```

Your app should now run on http://localhost:3000 with both frontend and API routes working locally.

---

### Step 13: Deploy to Vercel

#### 13.1 Deploy:

```bash
vercel --prod
```

Or push to GitHub and connect your repo to Vercel for automatic deployments.

#### 13.2 Configure Project Settings in Vercel Dashboard:

1. Go to your project on Vercel
2. Settings → General → Root Directory: `frontend`
3. Settings → Environment Variables: Add all your env vars
4. Deployments → Redeploy

---

## File Structure Overview (Final)

```
personal-website/
├── backend/                    # Can be archived/deleted after migration
├── frontend/                   # Your unified Next.js app
│   ├── pages/
│   │   ├── api/               # All backend API routes
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   ├── experience/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── chat/
│   │   │   └── uploads/
│   │   ├── index.js
│   │   ├── about.js
│   │   ├── projects.js
│   │   └── ...
│   ├── lib/
│   │   ├── db.js              # Database connection
│   │   ├── api.js             # API client
│   │   ├── middleware/        # Auth, validation
│   │   └── models/            # Mongoose models
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── .env.local
│   ├── next.config.js
│   ├── package.json
│   └── vercel.json
└── NEXTJS_VERCEL_MIGRATION_GUIDE.md (this file)
```

---

## Migration Checklist

- [ ] Install backend dependencies in frontend
- [ ] Create `lib/db.js` for MongoDB connection
- [ ] Move all models to `lib/models/`
- [ ] Create `lib/middleware/auth.js`
- [ ] Convert all Express routes to Next.js API routes
- [ ] Set up file upload strategy (Cloudinary or Vercel Blob)
- [ ] Update `next.config.js`
- [ ] Configure `.env.local`
- [ ] Update all frontend API calls to use relative paths
- [ ] Test locally with `npm run dev`
- [ ] Set up Vercel project
- [ ] Add environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Test production deployment
- [ ] Update DNS if using custom domain

---

## Troubleshooting

### Issue: API routes return 404

- Ensure files are in `pages/api/` directory
- Check file naming (must be `.js` or `.ts`)
- Restart dev server

### Issue: MongoDB connection errors

- Verify `MONGODB_URI` in environment variables
- Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Ensure database user has proper permissions

### Issue: File uploads fail

- For Cloudinary: verify API keys
- For Vercel Blob: ensure `@vercel/blob` is installed
- Check API route body size limit in `next.config.js`

### Issue: Timeout on API routes

- Vercel free tier has 10s timeout
- For long operations, consider:
  - Background jobs with queues
  - Incremental processing
  - Upgrading to Pro plan (60s timeout)

---

## Benefits of This Migration

✅ **Simplified deployment** - One app instead of two  
✅ **Better performance** - No CORS, faster API calls  
✅ **Automatic scaling** - Vercel handles everything  
✅ **Edge network** - Global CDN for fast loading  
✅ **Zero config** - No server management  
✅ **Preview deployments** - Every Git push gets a URL  
✅ **Better DX** - Hot reload for both frontend and API  

---

## Next Steps

1. Follow the migration steps above
2. Test thoroughly in development
3. Deploy to Vercel
4. Monitor performance and errors
5. Consider upgrading to Vercel Pro for production features

Good luck with your migration! 🚀

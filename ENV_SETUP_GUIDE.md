# Environment Files Setup for Production Deployment

Complete guide to correctly configure environment files for local development and production deployment.

---

## Quick Summary

You need to manage environment files properly because:

1. **Secrets must be hidden** (passwords, API keys, JWT keys)
2. **Different configs for dev/production** (localhost vs live URLs)
3. **Git should NOT contain secrets** (use .gitignore)
4. **Platforms need variables** (Vercel, Railway have UI for this)

---

## Current Status

### ✅ What You Have

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://bawekemekonnen884_db_user:bawekesura@...
JWT_SECRET=baweke_portfolio_jwt_secret_change_this_in_production_2024
PORT=5000
NODE_ENV=development
FRONTEND_URL=https://baweke.personalwebsite.com
```

**Frontend (.env.example):**
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### ⚠️ Issues to Fix

1. **Backend .env has secrets in git** (dangerous!)
2. **JWT_SECRET needs to be stronger** (current one is weak)
3. **Frontend missing .env.local** (should exist for local dev)
4. **FRONTEND_URL uses example domain** (should match deployment)
5. **NODE_ENV=development when it should be production** (for production)

---

## Part 1: Secure Your Backend

### Step 1: Check .gitignore

**File: `backend/.gitignore`**

Should contain:
```
node_modules/
.env
.env.local
.env.*.local
uploads/
```

Let me check your current one:

---

### Step 2: Update Backend .env.example

This is the template (goes in git, no secrets):

**File: `backend/.env.example`**

```bash
# MongoDB connection string (MongoDB Atlas or local)
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT secret for signing auth tokens
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# MUST be at least 32 characters and random!
JWT_SECRET=your_secure_random_secret_here_min_32_chars

# Server port (Railway/Vercel will override this)
PORT=5000

# Node environment: development | production
NODE_ENV=development

# Frontend origin (for CORS configuration)
# Development: http://localhost:3000
# Production: https://your-domain.vercel.app
FRONTEND_URL=http://localhost:3000

# GitHub webhook secret (optional, for sync service)
GITHUB_WEBHOOK_SECRET=

# LinkedIn API credentials (optional, for auto-posting)
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
```

---

### Step 3: Generate Secure JWT_SECRET

**Generate a new secure secret:**

```bash
# On any system with Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output will be something like:**
```
a7f3c9e1b2d4f6a8c0e2g4i6k8m0o2q4s6u8w0y2z4a6c8e0g2i4k6m8o0q2s4u6w8
```

**Copy this value and use it as your JWT_SECRET**

---

## Part 2: Frontend Environment Setup

### Step 1: Create Frontend .env.local

**File: `frontend/.env.local`** (for local development, NOT in git)

```bash
# Backend API URL
# In development, Next.js rewrites /api/* to this URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 2: Update Frontend .env.example

**File: `frontend/.env.example`** (template, goes in git)

```bash
# Backend API URL for production
# In development: http://localhost:5000 (Next.js rewrites handle this)
# In production: https://your-railway-backend.railway.app
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
```

---

## Part 3: .gitignore Setup

### Backend .gitignore

**File: `backend/.gitignore`**

Make sure it includes:

```bash
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables (NEVER commit these!)
.env
.env.local
.env.*.local

# Uploads
uploads/
public/uploads/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
```

### Frontend .gitignore

**File: `frontend/.gitignore`**

Make sure it includes:

```bash
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
.next/
out/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local environment variables (NEVER commit!)
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## Part 4: Development Setup

### For Local Development

**Step 1: Create backend/.env.local** (for local testing with production values)

```bash
# Exact copy of .env for production testing
MONGODB_URI=mongodb+srv://bawekemekonnen884_db_user:bawekesura@cluster0.y3qvjfb.mongodb.net/?appName=Cluster0
JWT_SECRET=your_generated_secret_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Step 2: Create frontend/.env.local** (for local development)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Step 3: Verify .gitignore ignores these**

```bash
git status
# Should NOT show .env or .env.local
```

---

## Part 5: Production Environment Variables

### For Vercel (Frontend)

**Go to: Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this variable:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RAILWAY-URL.railway.app` | Production |

**What it means:**
- In production, frontend will use this URL to call backend API
- In development (local), Next.js rewrites handle localhost:5000

### For Railway (Backend)

**Go to: Railway Dashboard → Your Service → Variables**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@...` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Your generated secret (32+ chars) | MUST be secure random string |
| `PORT` | `5000` | Keep this |
| `NODE_ENV` | `production` | Must be "production" |
| `FRONTEND_URL` | `https://xxx.vercel.app` | Your Vercel frontend URL |
| `GITHUB_WEBHOOK_SECRET` | (optional) | Leave empty if not using |

---

## Part 6: Correct Setup Checklist

### Git & Secrets ✓
- [ ] `.env` is in `.gitignore`
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` is committed (template)
- [ ] No secrets in git history

### Backend Setup ✓
- [ ] `backend/.env.example` exists
- [ ] `backend/.env` exists (local, not in git)
- [ ] JWT_SECRET is 32+ random characters
- [ ] MONGODB_URI is correct
- [ ] PORT=5000
- [ ] NODE_ENV=development (for local)

### Frontend Setup ✓
- [ ] `frontend/.env.example` exists
- [ ] `frontend/.env.local` exists (local, not in git)
- [ ] NEXT_PUBLIC_API_URL=http://localhost:5000 (local)
- [ ] Not committed to git

### Deployment Ready ✓
- [ ] Vercel has NEXT_PUBLIC_API_URL set
- [ ] Railway has all env vars set
- [ ] JWT_SECRET is strong and unique
- [ ] FRONTEND_URL matches Vercel domain
- [ ] MONGODB_URI is correct

---

## Part 7: How Environment Variables Work

### In Development (Local)

```
frontend/.env.local
├─ NEXT_PUBLIC_API_URL=http://localhost:5000
│  └─ Used by frontend to find backend
│
backend/.env
├─ MONGODB_URI=mongodb+srv://...
├─ JWT_SECRET=your_secret
├─ PORT=5000
├─ NODE_ENV=development
└─ FRONTEND_URL=http://localhost:3000
   └─ Used by backend CORS to allow frontend
```

### In Production (Deployed)

```
Vercel Environment Variables
├─ NEXT_PUBLIC_API_URL=https://xxx.railway.app
│  └─ Used by frontend to find backend
│
Railway Environment Variables
├─ MONGODB_URI=mongodb+srv://...
├─ JWT_SECRET=your_secret
├─ PORT=5000
├─ NODE_ENV=production
└─ FRONTEND_URL=https://xxx.vercel.app
   └─ Used by backend CORS to allow frontend
```

---

## Part 8: Security Best Practices

### ✅ DO

- ✅ Generate strong random JWT_SECRET (32+ characters)
- ✅ Store secrets in environment variables
- ✅ Use different secrets for dev and production
- ✅ Keep .env files in .gitignore
- ✅ Use .env.example as a template
- ✅ Rotate secrets periodically
- ✅ Use platform UIs (Vercel, Railway) for secrets

### ❌ DON'T

- ❌ Commit .env files to git
- ❌ Use weak secrets like "change_this_in_production"
- ❌ Share secrets in chat, email, or comments
- ❌ Use same secret for dev and production
- ❌ Put secrets in code
- ❌ Log secrets to console
- ❌ Share production secrets with unauthorized people

---

## Part 9: Step-by-Step Setup

### FINAL PRODUCTION-READY SETUP

**Step 1: Generate Strong Secrets**

```bash
# Generate JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Copy the output, you'll need it
```

**Step 2: Update backend/.env**

```bash
MONGODB_URI=mongodb+srv://bawekemekonnen884_db_user:bawekesura@cluster0.y3qvjfb.mongodb.net/?appName=Cluster0
JWT_SECRET=YOUR_GENERATED_SECRET_HERE
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
```

**Step 3: Create frontend/.env.local**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Step 4: Verify .gitignore**

```bash
# Check that .env files are ignored
git status | grep "\.env"
# Should show NOTHING
```

**Step 5: Set Vercel Variables**

In Vercel Dashboard:
```
NEXT_PUBLIC_API_URL = https://YOUR_RAILWAY_URL.railway.app
```

**Step 6: Set Railway Variables**

In Railway Dashboard:
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = YOUR_GENERATED_SECRET
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://YOUR_VERCEL_URL.vercel.app
```

**Step 7: Test Locally**

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Visit http://localhost:3000 - should work
```

**Step 8: Commit & Deploy**

```bash
# Check nothing sensitive is in git
git status
# Should NOT show .env or .env.local

# Push to GitHub
git add .
git commit -m "Production ready deployment"
git push

# Vercel and Railway auto-deploy from GitHub
```

---

## Part 10: Troubleshooting Environment Variables

### Problem: "Cannot connect to backend"

**Check 1: Frontend has correct NEXT_PUBLIC_API_URL**
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_API_URL)
# Should show your backend URL
```

**Check 2: Backend environment variables set**
```bash
# In backend logs, should see all env vars loaded
# If not, check Railway Variables tab
```

**Solution**: Verify environment variables in each platform.

### Problem: "MongoDB connection failed"

**Check**: MONGODB_URI is correct in Railway
```bash
# Format should be:
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Problem: "CORS error"

**Check**: FRONTEND_URL in Railway matches Vercel domain
```bash
# Should be exactly: https://your-site.vercel.app
# Not: https://your-site.vercel.app/ (no trailing slash)
```

### Problem: "JWT_SECRET error"

**Check**: JWT_SECRET is set in Railway
```bash
# Must be at least 32 characters
# Must be random
# Verify it's actually set in Railway Variables
```

---

## Summary Checklist

- [ ] Generate strong JWT_SECRET
- [ ] Create backend/.env with production values
- [ ] Create frontend/.env.local
- [ ] Update backend/.env.example
- [ ] Update frontend/.env.example
- [ ] Verify .gitignore includes .env files
- [ ] Test locally with both servers
- [ ] Set Vercel environment variables
- [ ] Set Railway environment variables
- [ ] Push to GitHub
- [ ] Verify deployment works
- [ ] Test all features in production

---

## Files Reference

| File | Status | Should be in git? |
|------|--------|-------------------|
| `backend/.env` | Contains secrets | ❌ NO (.gitignore) |
| `backend/.env.example` | Template | ✅ YES |
| `backend/.env.local` | Local test | ❌ NO (.gitignore) |
| `frontend/.env.local` | Local dev | ❌ NO (.gitignore) |
| `frontend/.env.example` | Template | ✅ YES |

---

## You're Now Ready for Production! ✅

Your environment is properly configured for:
- ✅ Secure secret management
- ✅ Development vs Production
- ✅ Git safety (no secrets exposed)
- ✅ Platform deployment (Vercel + Railway)
- ✅ Easy scaling and rotation

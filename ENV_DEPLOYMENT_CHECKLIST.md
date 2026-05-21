# Production Environment Setup Checklist

Complete checklist for properly configuring environment variables before deployment.

---

## Phase 1: Local Development Setup

### ✓ Backend Configuration

**Prerequisite Checklist:**
- [ ] Node.js v16+ installed
- [ ] MongoDB Atlas account created
- [ ] GitHub account created

**Step 1: Create backend/.env**
```bash
# Copy the structure from backend/.env.example
cp backend/.env.example backend/.env
```

**Step 2: Generate JWT_SECRET**
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Step 3: Update backend/.env with your values**
```bash
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/your_db?retryWrites=true&w=majority
JWT_SECRET=YOUR_GENERATED_SECRET_HERE (at least 32 characters)
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GITHUB_WEBHOOK_SECRET= (leave empty if not using)
```

**Verification:**
- [ ] MONGODB_URI is valid format
- [ ] JWT_SECRET is 32+ characters
- [ ] PORT=5000
- [ ] NODE_ENV=development
- [ ] FRONTEND_URL=http://localhost:3000

---

### ✓ Frontend Configuration

**Step 1: Create frontend/.env.local**
```bash
# This file should already exist
# Verify it contains:
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Verification:**
- [ ] NEXT_PUBLIC_API_URL=http://localhost:5000
- [ ] File is NOT committed to git
- [ ] File is in .gitignore

---

### ✓ .gitignore Configuration

**Backend .gitignore:**
- [ ] Contains `.env`
- [ ] Contains `.env.local`
- [ ] Contains `.env.*.local`
- [ ] Contains `node_modules/`
- [ ] Contains `uploads/`

**Frontend .gitignore:**
- [ ] Contains `.env.local`
- [ ] Contains `.env.*.local`
- [ ] Contains `node_modules`
- [ ] Contains `.next`
- [ ] Contains `out`

**Verification:**
```bash
# Run this to verify nothing is staged:
git status

# Should NOT show:
# backend/.env
# backend/.env.local
# frontend/.env.local
```

---

### ✓ Local Testing

**Step 1: Start Backend**
```bash
cd backend
npm install
npm run dev
```

**Wait for:**
- [ ] "Connected to MongoDB Atlas"
- [ ] "Server running on port 5000"
- [ ] No error messages

**Step 2: Start Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

**Wait for:**
- [ ] "ready - started server on 0.0.0.0:3000"
- [ ] No error messages

**Step 3: Test in Browser**
- [ ] Visit http://localhost:3000
- [ ] Page loads without errors
- [ ] Navigate to /blog
- [ ] No console errors (F12)
- [ ] No CORS errors

---

## Phase 2: Production Preparation

### ✓ Update Backend .env for Production

**Step 1: Set NODE_ENV to production (for testing)**
```bash
NODE_ENV=production
```

**Step 2: Update FRONTEND_URL (you'll get this from Vercel)**
```bash
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
```

**Example:**
```bash
MONGODB_URI=mongodb+srv://bawekemekonnen884_db_user:bawekesura@cluster0.y3qvjfb.mongodb.net/?appName=Cluster0
JWT_SECRET=a7f3c9e1b2d4f6a8c0e2g4i6k8m0o2q4s6u8w0y2z4a6c8e0g2i4k6m8o0q2s4u6w8
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://my-personal-site.vercel.app
```

**Verification:**
- [ ] MONGODB_URI is unchanged
- [ ] JWT_SECRET is long random string
- [ ] PORT=5000
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL is HTTPS and matches your Vercel domain
- [ ] No typos in URL

---

### ✓ Git Safety Check

**Step 1: Verify secrets aren't in git**
```bash
git log --all --full-history -- backend/.env
# Should show: "fatal: your current branch has no commits yet"
# Or: showing .env in .gitignore

git status
# Should NOT show backend/.env or frontend/.env.local
```

**Step 2: Remove .env if accidentally committed**
```bash
git rm --cached backend/.env
git rm --cached frontend/.env.local
git commit -m "Remove .env files from git"
```

**Step 3: Verify .gitignore**
- [ ] backend/.gitignore contains `.env`
- [ ] frontend/.gitignore contains `.env.local`
- [ ] Files are actually ignored (not showing in git status)

---

### ✓ Push to GitHub

**Step 1: Commit your code (without .env)**
```bash
cd personal-website
git add .
git status
# Verify NO .env files shown

git commit -m "Ready for deployment"
git push -u origin main
```

**Step 2: Verify on GitHub**
- [ ] Go to your GitHub repo
- [ ] Verify `.env.example` is there (template)
- [ ] Verify `.env` is NOT there (not in git)
- [ ] Check commit history - no secrets visible

---

## Phase 3: Vercel Deployment (Frontend)

### ✓ Environment Variables in Vercel

**Step 1: Go to Vercel Dashboard**
- [ ] Visit https://vercel.com/dashboard
- [ ] Click your project
- [ ] Click Settings tab
- [ ] Click Environment Variables

**Step 2: Add Variable**
- [ ] Key: `NEXT_PUBLIC_API_URL`
- [ ] Value: `https://YOUR-RAILWAY-URL.railway.app` (you'll get this from Railway)
- [ ] Select: "Production" environment
- [ ] Click Save

**Verification:**
- [ ] Variable shows in Production
- [ ] No typos in URL
- [ ] Railway URL doesn't have trailing slash

---

### ✓ Deploy Frontend**

**Step 1: Redeploy**
- [ ] In Vercel dashboard, find latest deployment
- [ ] Click three-dot menu
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

**Step 2: Verify Deployment**
- [ ] Green checkmark shows success
- [ ] Visit your Vercel URL
- [ ] Page loads without errors
- [ ] Check browser console (F12) - no errors

---

## Phase 4: Railway Deployment (Backend)

### ✓ Environment Variables in Railway

**Step 1: Go to Railway Dashboard**
- [ ] Visit https://railway.app
- [ ] Click your project
- [ ] Click Variables tab

**Step 2: Add Variables**
- [ ] `MONGODB_URI` = your MongoDB connection string
- [ ] `JWT_SECRET` = your generated secret
- [ ] `PORT` = 5000
- [ ] `NODE_ENV` = production
- [ ] `FRONTEND_URL` = your Vercel URL (https://xxx.vercel.app)

**Verification:**
- [ ] All variables are added
- [ ] No typos or extra spaces
- [ ] Values are correct
- [ ] Click "Deploy" after adding

**Step 3: Get Your Railway URL**
- [ ] In Railway dashboard, find your service
- [ ] Look for "RAILWAY_PUBLIC_URL" or domain
- [ ] Copy the URL (e.g., https://xxx.railway.app)
- [ ] This is what you use for NEXT_PUBLIC_API_URL

---

### ✓ Verify Backend Deployment**

**Step 1: Test Health Endpoint**
- [ ] Visit: `https://YOUR-RAILWAY-URL.railway.app/api/health`
- [ ] Should show: `{"status":"ok","timestamp":"..."}`

**Step 2: Check Logs**
- [ ] In Railway dashboard, click Logs
- [ ] Should show "Connected to MongoDB Atlas"
- [ ] Should show "Server running on port 5000"
- [ ] No error messages

---

## Phase 5: Connection Verification

### ✓ Frontend to Backend Connection

**Step 1: Go to Vercel**
- [ ] Visit https://vercel.com/dashboard
- [ ] Select your project
- [ ] Go to Settings → Environment Variables
- [ ] Update `NEXT_PUBLIC_API_URL` with your Railway URL

**Step 2: Redeploy Frontend**
- [ ] Click the latest deployment
- [ ] Click three-dot menu → Redeploy
- [ ] Wait for completion

**Step 3: Test in Browser**
- [ ] Visit your Vercel frontend URL
- [ ] Go to `/blog` page
- [ ] Open browser console (F12)
- [ ] Should see NO errors
- [ ] Blog posts should load (if you created any)

---

### ✓ Verify API Communication

**Test 1: API Health**
```
Visit: https://YOUR-RAILWAY-URL.railway.app/api/health
Expected: {"status":"ok",...}
```

**Test 2: Content API**
```
Visit: https://YOUR-RAILWAY-URL.railway.app/api/content
Expected: {"contents":[...],"pagination":{...}}
```

**Test 3: Frontend Request**
```
In browser console (F12):
fetch('https://YOUR-RAILWAY-URL.railway.app/api/content')
  .then(r => r.json())
  .then(console.log)
Expected: Shows your content data
```

---

## Phase 6: Final Verification

### ✓ Functionality Tests

**Frontend Tests:**
- [ ] Homepage loads completely
- [ ] All images display
- [ ] Navigation works
- [ ] Responsive design works on mobile
- [ ] No console errors

**Admin Dashboard:**
- [ ] Can access `/admin/login`
- [ ] Can log in
- [ ] Can create new content
- [ ] Created content appears on site

**API Tests:**
- [ ] `/api/health` returns 200
- [ ] `/api/content` returns data
- [ ] `/api/content?type=post` returns posts
- [ ] Blog page displays posts

**Performance:**
- [ ] Page loads in < 3 seconds
- [ ] No broken images
- [ ] No 404 errors
- [ ] Animations smooth

---

## Phase 7: Security Verification

### ✓ Secrets & Configuration

- [ ] JWT_SECRET is strong random string
- [ ] JWT_SECRET is NOT in git
- [ ] MONGODB_URI is NOT in public
- [ ] FRONTEND_URL matches your domain
- [ ] NODE_ENV=production in production
- [ ] CORS allows only your frontend

### ✓ Git Safety

- [ ] No .env files in git history
- [ ] .gitignore properly configured
- [ ] All environment variables in platform UIs (Vercel/Railway)
- [ ] No secrets in commit messages

---

## Phase 8: Monitoring & Maintenance

### ✓ Set Up Monitoring

**Vercel:**
- [ ] Check analytics dashboard
- [ ] Set up email notifications

**Railway:**
- [ ] Check logs regularly
- [ ] Monitor memory/CPU usage
- [ ] Set up alerts

**MongoDB:**
- [ ] Monitor storage usage
- [ ] Check connection status

---

## Deployment Complete ✅

When ALL items are checked, your deployment is complete and secure:

- ✅ Backend deployed to Railway
- ✅ Frontend deployed to Vercel
- ✅ Environment variables correctly configured
- ✅ Secrets properly protected
- ✅ Connection between services verified
- ✅ All features tested
- ✅ Monitoring set up

---

## Quick Reference: Environment Variables by Platform

### Local Development (backend/.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=YOUR_SECRET
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Local Development (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Vercel (Production)
```
NEXT_PUBLIC_API_URL=https://xxx.railway.app
```

### Railway (Production)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=YOUR_SECRET
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://xxx.vercel.app
```

---

## Troubleshooting

**"Cannot connect to backend"**
→ Check NEXT_PUBLIC_API_URL in Vercel is correct

**"MongoDB connection failed"**
→ Verify MONGODB_URI in Railway is correct and IP whitelisted

**"CORS error"**
→ Check FRONTEND_URL in Railway matches your Vercel domain exactly

**"Deployment failed"**
→ Check logs in Vercel or Railway for specific error

---

## Help Resources

- **ENV_SETUP_GUIDE.md** - Detailed environment setup guide
- **PRODUCTION_CONFIG.md** - Production configuration details
- **DEPLOYMENT_CHECKLIST.md** - Pre/during/after deployment
- **setup-env.bat** - Helper script for environment setup

Good luck! 🚀

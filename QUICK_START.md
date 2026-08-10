# Quick Start Guide - Next.js + Vercel Migration

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Vercel account (free tier works)
- Git installed

---

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all frontend and backend dependencies together.

---

## Step 2: Set Up Environment Variables

1. Copy the environment template:
```bash
copy .env.local.template .env.local
```

2. Edit `.env.local` and fill in your values:

**Required for basic functionality:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A random secret key (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NEXT_PUBLIC_BASE_URL` - `http://localhost:3000` for local, your Vercel URL for production

**Optional (add later if needed):**
- Cloudinary credentials for file uploads
- GitHub token for sync features
- OpenAI key for chat feature

---

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Vercel)
5. Get your connection string
6. Add it to `.env.local` as `MONGODB_URI`

---

## Step 4: Run Locally

```bash
npm run dev
```

Your app will be available at http://localhost:3000

Test the API: http://localhost:3000/api/health

---

## Step 5: Test API Routes

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Projects (Public)
```bash
curl http://localhost:3000/api/projects
```

### Login (if you have a user)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

---

## Step 6: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Link project:
```bash
cd frontend
vercel link
```

4. Add environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
# ... add all your env vars
```

5. Deploy:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Migrate to Next.js unified architecture"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables in the Environment Variables section
7. Click "Deploy"

---

## Step 7: Configure Vercel Project Settings

In Vercel Dashboard → Your Project → Settings:

1. **General**
   - Root Directory: `frontend`
   - Node.js Version: 18.x or 20.x

2. **Environment Variables**
   Add all variables from your `.env.local`:
   - Select "Production", "Preview", and "Development" for each
   - Click "Save"

3. **Functions**
   - Region: Choose closest to your users
   - Maximal Duration: 10s (free), 60s (pro)

4. **Domains**
   - Add your custom domain if you have one

---

## Step 8: Verify Deployment

After deployment:

1. Check health endpoint:
```
https://your-app.vercel.app/api/health
```

2. Check frontend:
```
https://your-app.vercel.app
```

3. Check logs in Vercel Dashboard for any errors

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoNetworkError` or timeout

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. Wait 2-3 minutes for changes to propagate

### API Routes Return 404

**Error**: `/api/projects` returns 404

**Solution**:
1. Verify files are in `frontend/pages/api/` directory
2. Check file naming (must be `.js` or `.ts`)
3. Redeploy: `vercel --prod`

### JWT Secret Missing

**Error**: `JWT_SECRET is not defined`

**Solution**:
1. Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
2. Add to Vercel: `vercel env add JWT_SECRET`
3. Redeploy

### File Upload Issues

**Error**: File uploads fail

**Solution**:
- Vercel has a 4.5MB request limit
- Use Cloudinary or Vercel Blob for file storage
- Update your upload endpoints to use external storage

### Build Fails

**Error**: `Module not found` or compilation errors

**Solution**:
1. Check all imports use ES6 syntax (`import` not `require`)
2. Verify all dependencies are in `package.json`
3. Run `npm install` locally first
4. Check build logs in Vercel dashboard

---

## Migration Checklist

- [ ] All backend dependencies added to `frontend/package.json`
- [ ] Models copied to `frontend/lib/models/`
- [ ] API routes created in `frontend/pages/api/`
- [ ] Database connection setup in `frontend/lib/db.js`
- [ ] Auth middleware created
- [ ] Environment variables configured
- [ ] Local testing complete
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Deployed successfully
- [ ] Health check passes
- [ ] Frontend loads correctly
- [ ] API endpoints work
- [ ] Authentication works
- [ ] File uploads work (if applicable)

---

## Next Steps

1. **Monitor Performance**
   - Use Vercel Analytics
   - Check function execution logs
   - Monitor MongoDB Atlas metrics

2. **Optimize**
   - Enable ISR (Incremental Static Regeneration) for static pages
   - Add caching for API responses
   - Optimize images with Next.js Image component

3. **Security**
   - Set up CORS properly
   - Add rate limiting
   - Enable Vercel's DDoS protection
   - Review environment variable access

4. **Features**
   - Set up CI/CD pipeline
   - Add preview deployments for PRs
   - Configure custom domain
   - Set up monitoring and alerts

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review this guide's troubleshooting section
4. Check Next.js and Vercel documentation

Good luck! 🚀

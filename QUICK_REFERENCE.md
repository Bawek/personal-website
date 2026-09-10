# Quick Reference Guide

## 🚀 Getting Started (5 minutes)

### 1. Install & Setup
```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret
npm run dev
```

### 2. Access the App
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login

### 3. Create Admin Account
1. Go to /admin/register
2. Fill in registration details
3. Account created with admin role

## 📚 Key Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| README.md | Project overview | 5 min |
| API_DOCUMENTATION.md | API reference | 20 min |
| API_ENDPOINTS_COMPLETE.md | All 47 endpoints | 30 min |
| DATABASE_SCHEMA.md | Database structure | 15 min |
| IMPLEMENTATION_README.md | Setup & features | 10 min |
| MIGRATION_CHECKLIST.md | Testing & deployment | 20 min |

## 🔑 Environment Variables

```env
# REQUIRED
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-very-secret-key-32-chars-min

# OPTIONAL
GITHUB_TOKEN=ghp_xxxxx
LINKEDIN_ACCESS_TOKEN=token
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🌐 Most Common API Calls

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"pass123"}'

# Get current user
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/auth/me
```

### Content Management
```bash
# Get all skills
curl http://localhost:3000/api/skills

# Get all projects
curl http://localhost:3000/api/projects

# Get all experience
curl http://localhost:3000/api/experience

# Get about content
curl http://localhost:3000/api/about

# Get settings
curl http://localhost:3000/api/settings
```

### Admin Operations
```bash
# Create skill (admin only)
curl -X POST http://localhost:3000/api/skills \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"React","category":"javascript","level":"advanced"}'

# Create project (admin only)
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"...","techStack":["React"]}'

# Update settings (admin only)
curl -X PUT http://localhost:3000/api/settings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"siteName":"My Portfolio"}'
```

### Contact & Chat
```bash
# Submit contact form (public)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","subject":"Hello","message":"..."}'

# Start chat conversation (public)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"visitorName":"John","visitorEmail":"john@test.com","subject":"Help"}'

# List messages (admin only)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/contact/messages

# List conversations (admin only)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/chat/admin/conversations
```

## 🏗️ Project Structure

```
personal-website/
├── app/
│   ├── page.js               # Home
│   ├── layout.js             # Root layout
│   ├── admin/                # Admin dashboard
│   └── api/                  # API routes (47 endpoints)
├── lib/
│   ├── db.js                 # MongoDB connection
│   ├── models/               # 8 Mongoose models
│   └── middleware/auth.js    # JWT verification
├── components/               # React components
├── styles/                   # CSS
├── public/                   # Static assets
└── package.json
```

## 🗄️ Database Models

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| User | Authentication | email, password, role, syncSettings |
| Skill | Skills | name, category, level, icon |
| Project | Portfolio | title, description, techStack, featured |
| Experience | Timeline | title, company, startDate, endDate |
| About | About page | hero, whoAmI, stats, resumeUrl |
| Contact | Messages | name, email, subject, message, status |
| Conversation | Chat | visitorName, messages, status, priority |
| Settings | Config | siteName, seo, footer, widgets |

## 🔐 Authentication

### Getting a Token
1. Register: POST /api/auth/register
2. Login: POST /api/auth/login
3. Response includes JWT token
4. Token valid for 7 days

### Using Token
Add to all protected requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| admin | Full access, manage users |
| editor | Create/edit content |
| viewer | Read-only access |
| user | Public access only |

## 🔍 Common Query Params

```
# Pagination
?page=1&limit=20

# Skills filtering
?category=javascript&level=advanced

# Projects
?featured=true

# Messages
?status=new&read=false

# Conversations
?status=open&priority=high

# Users
?role=admin
```

## ⚙️ Common Tasks

### Add a New Skill
1. POST /api/skills with admin token
2. Required: name, category
3. Optional: level, icon, description

### Add a New Project
1. POST /api/projects with admin token
2. Required: title, description
3. Optional: techStack, liveUrl, githubUrl, featured

### Update About Page
1. PUT /api/about with admin token
2. Send hero, whoAmI, stats objects

### Update Settings
1. PUT /api/settings with admin token
2. Send siteName, seo, footer, contact, analytics

### View Contact Messages
1. GET /api/contact/messages with admin token
2. Optional params: status, read, page, limit

### View Chat Conversations
1. GET /api/chat/admin/conversations with admin token
2. Optional params: status, priority, search, page, limit

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check Authorization header included
- Verify token format: "Bearer TOKEN"
- Check token not expired
- Verify user role has permission

### "MONGODB_URI not defined"
- Add MONGODB_URI to .env.local
- Restart dev server
- Verify connection string format

### "Database Connection Failed"
- Check MongoDB Atlas IP whitelist
- Verify connection string credentials
- Check network connectivity

### Build Errors
- Run `npm install` again
- Check all required env vars set
- Clear .next folder: `rm -rf .next`
- Run `npm run build` to verify

## 📞 API Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Success (POST - created) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (need token) |
| 403 | Forbidden (permission denied) |
| 404 | Not found |
| 500 | Server error |

## 🚀 Deployment

### To Vercel
```bash
npm i -g vercel
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel --prod
```

### Environment Setup
1. Add MONGODB_URI secret
2. Add JWT_SECRET secret
3. (Optional) Add GITHUB_TOKEN, LINKEDIN_ACCESS_TOKEN
4. Deploy!

## 📊 Useful Endpoints for Stats

```bash
# Dashboard stats
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/projects
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/skills
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/contact/messages
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/chat/admin/stats
```

## 🔄 Sync Features (Stub)

### GitHub Sync
```bash
curl -X POST http://localhost:3000/api/sync/github/sync \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"your-github-username"}'
```

### Save Sync Settings
```bash
curl -X POST http://localhost:3000/api/sync/settings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"autoSyncGithub":true,"githubUsername":"..."}'
```

## 📱 Admin Pages & Their Endpoints

| Admin Page | Main Endpoint(s) |
|-----------|------------------|
| Dashboard | /api/projects, /api/skills, /api/experience, /api/users |
| Skills | GET/POST /api/skills, PUT/DELETE /api/skills/[id] |
| Projects | GET/POST /api/projects, PUT/DELETE /api/projects/[id] |
| Experience | GET/POST /api/experience, PUT/DELETE /api/experience/[id] |
| About | GET/PUT /api/about |
| Contact | GET /api/contact/messages, PATCH/DELETE messages |
| Chat | GET /api/chat/admin/conversations, POST /api/chat/[id]/message |
| Settings | GET/PUT /api/settings |
| Footer | GET/PUT /api/settings/footer |
| Sync | POST /api/sync/github/sync, POST /api/sync/settings |

## ✅ Quick Deployment Checklist

- [ ] All env vars configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Build runs successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] All API endpoints tested
- [ ] Admin login works
- [ ] Create first skill/project to verify
- [ ] Contact form submits successfully
- [ ] Settings save successfully
- [ ] Ready to deploy!

## 📞 Support Resources

- **API Issues**: See API_DOCUMENTATION.md
- **Database Issues**: See DATABASE_SCHEMA.md
- **Deployment Issues**: See MIGRATION_CHECKLIST.md
- **General Help**: See README.md and IMPLEMENTATION_README.md
- **Complete List**: See API_ENDPOINTS_COMPLETE.md

---

**Total API Endpoints: 47**  
**Database Models: 8**  
**Admin Pages: 13**  
**Last Updated: January 2025**

🚀 **Everything you need to know on one page!**

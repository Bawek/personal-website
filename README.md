# Personal Website - Next.js with Full Backend API

Modern personal portfolio website built with Next.js 14+ App Router, MongoDB, and TailwindCSS with a complete REST API backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.local.example` to `.env.local` if needed
   - Or edit the existing `.env.local`
   - Add your MongoDB URI and other credentials

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure (App Router)

```
personal-website/
├── app/                      # App Router (Next.js 14+)
│   ├── layout.js            # Root layout
│   ├── page.js              # Homepage (/)
│   ├── providers.js         # Client-side providers
│   ├── about/               # Public pages
│   ├── projects/
│   ├── skills/
│   ├── experience/
│   ├── contact/
│   ├── admin/               # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   ├── skills/
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── chat/
│   │   ├── settings/
│   │   └── sync/
│   └── api/                 # REST API Routes (45+ endpoints)
│       ├── auth/            # Authentication
│       ├── users/           # User management
│       ├── projects/        # Projects CRUD
│       ├── skills/          # Skills CRUD
│       ├── experience/      # Experience CRUD
│       ├── about/           # About page
│       ├── contact/         # Contact messages
│       ├── chat/            # Chat system
│       ├── settings/        # Site settings
│       ├── sync/            # GitHub/LinkedIn sync
│       └── health/          # Health check
├── components/              # React components
├── lib/                     # Backend utilities
│   ├── db.js               # MongoDB connection
│   ├── api.js              # API client
│   ├── middleware/
│   │   └── auth.js         # JWT auth & authorization
│   └── models/             # Mongoose models
│       ├── User.js         # User authentication
│       ├── Project.js      # Portfolio projects
│       ├── Skill.js        # Technical skills
│       ├── Experience.js   # Work/education timeline
│       ├── About.js        # About page content
│       ├── Contact.js      # Contact messages
│       ├── Conversation.js # Chat conversations
│       └── Settings.js     # Site configuration
├── styles/                  # Global styles
└── public/                  # Static assets
```

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (admin, editor, viewer, user)
- Secure password hashing with bcrypt
- Protected admin endpoints

### 📝 Content Management
- Skills management with categories and levels
- Projects management with featured flag
- Experience/timeline management
- About page content editor
- SEO metadata configuration

### 💬 Communication
- Contact form submission
- Message management with status tracking
- Real-time chat system for visitors
- Bulk message operations

### 📊 Admin Dashboard
- Comprehensive dashboard with statistics
- User management
- Content CRUD operations
- Message and conversation management
- Site settings and configuration

### 🔄 Integrations
- GitHub repository sync
- LinkedIn auto-posting (stub)
- Webhook support for automations

### 🎨 Frontend
- Responsive design (mobile-first)
- Dark mode support
- Smooth animations with Framer Motion
- TailwindCSS styling

## 📡 API Routes

### Complete API with 45+ Endpoints

**Authentication (3 endpoints)**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Content Management (12 endpoints)**
- `GET/POST /api/skills` - Skills CRUD
- `GET/PUT/DELETE /api/skills/[id]` - Single skill
- `GET/POST /api/projects` - Projects CRUD
- `GET/PUT/DELETE /api/projects/[id]` - Single project
- `GET/POST /api/experience` - Experience CRUD
- `GET/PUT/DELETE /api/experience/[id]` - Single experience

**Pages & Settings (6 endpoints)**
- `GET/PUT /api/about` - About page
- `GET/PUT /api/settings` - Site settings
- `GET/PUT /api/settings/footer` - Footer config
- `GET /api/contact` - Public contact info

**Contact & Messages (8 endpoints)**
- `POST /api/contact` - Submit contact form
- `GET /api/contact/messages` - List messages
- `GET/PATCH/DELETE /api/contact/messages/[id]` - Message operations
- `PATCH/DELETE /api/contact/bulk` - Bulk operations

**Chat System (7 endpoints)**
- `POST /api/chat` - Start conversation
- `GET/PATCH/DELETE /api/chat/[id]` - Conversation management
- `POST /api/chat/[id]/message` - Add message
- `GET /api/chat/admin/conversations` - List conversations
- `GET /api/chat/admin/stats` - Chat statistics

**Sync & Integration (4 endpoints)**
- `POST /api/sync/github/sync` - Sync repositories
- `POST /api/sync/linkedin/post` - Post to LinkedIn
- `POST /api/sync/settings` - Sync configuration

**Users & Health (3 endpoints)**
- `GET/POST /api/users` - User management
- `GET/PUT/DELETE /api/users/[id]` - Single user
- `GET /api/health` - Health check

See [API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md) for detailed documentation.

## 🔑 Environment Variables

Required in `.env.local`:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_secret_key

# Optional - Sync Features
GITHUB_TOKEN=your_github_token
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
LINKEDIN_PERSON_URN=your_linkedin_urn

# Optional - Site Info
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CONTACT_EMAIL=admin@example.com
CONTACT_PHONE=+1234567890
```

## 🚢 Deployment to Vercel

### Using Vercel CLI
```bash
npm i -g vercel
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel --prod
```

### Using GitHub
1. Push to GitHub
2. Import in Vercel Dashboard
3. Add environment variables in Settings
4. Deploy!

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18, TailwindCSS, Framer Motion, React Icons
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Deployment**: Vercel
- **Styling**: TailwindCSS + Custom CSS

## 📖 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API reference
- **[API_ENDPOINTS_COMPLETE.md](./API_ENDPOINTS_COMPLETE.md)** - All 45+ endpoints
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[IMPLEMENTATION_README.md](./IMPLEMENTATION_README.md)** - Setup guide
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Migration guide

## 🧪 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📦 Backup Files

Old structure backups (can be deleted after migration):
- `OLD_PAGES_BACKUP/` - Old Pages Router structure
- `OLD_STRUCTURE_BACKUP/` - Original Express backend

## 🐛 Troubleshooting

### Build Errors
- Check all components have `'use client'` if they use hooks
- Verify environment variables are set in `.env.local`
- Ensure MongoDB connection string is correct

### API Errors
- Verify `.env.local` is configured correctly
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure all models are properly imported in routes

### Authentication Issues
- Check JWT_SECRET is set consistently
- Verify Authorization header format: `Bearer <token>`
- Check token hasn't expired (7 day expiration)

### Database Connection
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

## 📊 Database Collections

- **User** - User accounts with authentication
- **Skill** - Technical skills and expertise
- **Project** - Portfolio projects
- **Experience** - Work and education history
- **About** - About page content
- **Contact** - Contact form submissions
- **Conversation** - Chat conversations
- **Settings** - Site-wide configuration

## 🔐 Security Features

- JWT token verification on all protected routes
- Admin role enforcement on sensitive operations
- Input validation on all endpoints
- Secure password hashing (bcrypt)
- Email validation
- Error handling with non-revealing messages

## 📈 Performance

- Optimized database queries with indexes
- Pagination support on all list endpoints
- Efficient data structures
- Caching-ready architecture
- Production-ready build process

## 📄 License

MIT License - Free to use for personal portfolios

---

**Status**: ✅ Complete & Production Ready  
**Version**: Next.js 14+ with Full Backend API  
**Total Endpoints**: 45+  
**Database Models**: 8  
**Last Updated**: January 2025

🚀 Ready for deployment and production use!


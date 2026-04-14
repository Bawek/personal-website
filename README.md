# Dynamic Personal Website

A modern, international personal website with dynamic content management, built with Next.js, Express.js, and MongoDB Atlas.

## Features

- **Dynamic Content Management**: All content is stored in MongoDB and can be updated through an admin dashboard
- **Role-Based Access Control**: Admin, Editor, and Viewer roles with different permissions
- **Internationalization**: Support for multiple languages (English, Amharic, Spanish)
- **SEO Optimized**: Dynamic meta tags and SEO settings
- **Modern UI**: Built with TailwindCSS and Framer Motion animations
- **Secure**: JWT authentication and protected admin routes
- **Responsive**: Mobile-friendly design

## Tech Stack

### Frontend
- Next.js 13
- React 18
- TailwindCSS
- Framer Motion
- Axios

### Backend
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   The backend `.env` file is already configured with your MongoDB Atlas connection:
   ```
   MONGODB_URI=mongodb+srv://bawekemekonnen884_db_user:RZyKV6bpftxHcaAM@cluster0.y3qvjfb.mongodb.net/?appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin/login
   - Backend API: http://localhost:5000

## Initial Setup

### Create Admin User

1. Navigate to http://localhost:3000/admin/register
2. Create your first admin account
3. Use the admin credentials to log in at http://localhost:3000/admin/login

### Configure Website Settings

1. Log in to the admin dashboard
2. Go to Settings page
3. Configure:
   - Site name and description
   - Contact information
   - Social media links
   - SEO settings
   - Theme colors

### Create Content

1. In the admin dashboard, click "Create New Content"
2. Choose content type:
   - **Page**: Static pages (Home, About, etc.)
   - **Post**: Blog posts
   - **Project**: Portfolio projects
   - **Service**: Services offered
   - **Skill**: Technical skills
   - **Testimonial**: Client testimonials

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Content Management
- `GET /api/content` - Get all content (public)
- `GET /api/content/:slug` - Get content by slug (public)
- `POST /api/content` - Create content (admin/editor)
- `PUT /api/content/:id` - Update content (admin/editor/author)
- `DELETE /api/content/:id` - Delete content (admin)
- `POST /api/content/:id/like` - Like content (public)

### Settings
- `GET /api/settings` - Get settings (public)
- `PUT /api/settings` - Update settings (admin)
- `PUT /api/settings/contact` - Update contact info (admin)
- `PUT /api/settings/theme` - Update theme (admin)
- `PUT /api/settings/seo` - Update SEO (admin)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Activate/deactivate user
- `DELETE /api/users/:id` - Delete user

## User Roles

- **Admin**: Full access to all features, user management
- **Editor**: Can create, edit, and manage content
- **Viewer**: Read-only access to content

## Internationalization

The website supports multiple languages:
- English (en)
- Amharic (am)
- Spanish (es)

Users can switch languages using the language selector in the navigation.

## Deployment

### Backend Deployment

1. Set environment variables in production
2. Update CORS origins in `server.js`
3. Deploy to your preferred platform (Vercel, Heroku, etc.)

### Frontend Deployment

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred platform

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please contact the development team or create an issue in the repository.

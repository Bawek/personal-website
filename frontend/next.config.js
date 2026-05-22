/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // unoptimized: true keeps Firebase hosting happy (no server-side image optimization)
    unoptimized: true,
    domains: [
      'localhost',
      'avatars.githubusercontent.com',  // GitHub user avatars (sync service)
      'raw.githubusercontent.com',       // GitHub raw content
      'github.com',
      'res.cloudinary.com',              // Cloudinary (if used for uploads)
      'images.unsplash.com',             // Unsplash
      'lh3.googleusercontent.com',       // Google profile pictures
      'personal-website-lrjc.onrender.com' // ✅ ADD THIS

    ],
  },
  async redirects() {
    return [
      { source: '/expenso', destination: '/projects', permanent: true },
      { source: '/mingo', destination: '/projects', permanent: true },
      { source: '/mailbox-client', destination: '/projects', permanent: true },
    ];
  },
  async rewrites() {
    // In development, proxy /api/* and /uploads/* to the Express backend.
    // In production (Firebase hosting), these are handled by firebase.json rewrites
    // pointing to your deployed backend URL.
    if (process.env.NODE_ENV === 'production') return [];

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

#!/usr/bin/env node

const mongoose = require('mongoose');
const Content = require('./backend/models/Content');
const Settings = require('./backend/models/Settings');
const User = require('./backend/models/User');
require('dotenv').config();

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found. Please run setup.js first.');
      return;
    }

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Create sample content
    const sampleContent = [
      {
        title: 'Home',
        slug: 'home',
        type: 'page',
        content: '<h1>Welcome to My Website</h1><p>This is the home page content. You can edit this through the admin dashboard.</p>',
        excerpt: 'Welcome to my personal website',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        seo: {
          metaTitle: 'Home - My Personal Website',
          metaDescription: 'Welcome to my personal website'
        }
      },
      {
        title: 'About Me',
        slug: 'about',
        type: 'page',
        content: '<h1>About Me</h1><p>I am a passionate front-end developer with expertise in modern web technologies.</p>',
        excerpt: 'Learn more about me and my background',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        seo: {
          metaTitle: 'About Me - My Personal Website',
          metaDescription: 'Learn more about me and my background'
        }
      },
      {
        title: 'React',
        slug: 'react',
        type: 'skill',
        content: '<p>Advanced knowledge of React including hooks, context, and performance optimization.</p>',
        excerpt: 'React development expertise',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        tags: ['frontend', 'javascript', 'library']
      },
      {
        title: 'Node.js',
        slug: 'nodejs',
        type: 'skill',
        content: '<p>Server-side JavaScript development with Express.js and RESTful API design.</p>',
        excerpt: 'Node.js backend development',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        tags: ['backend', 'javascript', 'server']
      },
      {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        type: 'project',
        content: '<p>A modern, responsive portfolio website built with Next.js and TailwindCSS.</p>',
        excerpt: 'Personal portfolio website project',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['nextjs', 'react', 'tailwindcss', 'portfolio'],
        categories: ['web development', 'personal']
      },
      {
        title: 'E-commerce Platform',
        slug: 'ecommerce-platform',
        type: 'project',
        content: '<p>Full-stack e-commerce platform with payment integration and admin dashboard.</p>',
        excerpt: 'Complete e-commerce solution',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['react', 'nodejs', 'mongodb', 'stripe'],
        categories: ['web development', 'ecommerce']
      },
      {
        title: 'Web Development Services',
        slug: 'web-development-services',
        type: 'service',
        content: '<p>Custom web development services including frontend, backend, and full-stack solutions.</p>',
        excerpt: 'Professional web development services',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        tags: ['web development', 'frontend', 'backend'],
        categories: ['services']
      },
      {
        title: 'UI/UX Consulting',
        slug: 'ui-ux-consulting',
        type: 'service',
        content: '<p>Expert UI/UX consulting to improve user experience and interface design.</p>',
        excerpt: 'UI/UX design and consulting services',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        tags: ['ui', 'ux', 'design', 'consulting'],
        categories: ['services']
      },
      {
        title: 'Amazing Work!',
        slug: 'amazing-work',
        type: 'testimonial',
        content: '<p>"The developer delivered an exceptional website that exceeded our expectations. Highly recommended!"</p>',
        excerpt: 'Client testimonial about excellent work',
        status: 'published',
        language: 'en',
        author: adminUser._id,
        tags: ['client', 'feedback', 'satisfied'],
        categories: ['testimonials']
      }
    ];

    // Insert sample content
    await Content.insertMany(sampleContent);
    console.log(`Created ${sampleContent.length} sample content items`);

    // Update settings with sample data
    const settings = await Settings.getSettings();
    settings.siteName = 'My Personal Website';
    settings.siteDescription = 'Welcome to my personal website - showcasing my skills and projects';
    settings.contactInfo = {
      email: 'contact@example.com',
      phone: '+1234567890',
      address: 'Your City, Your Country',
      socialLinks: [
        { platform: 'github', url: 'https://github.com/yourusername', icon: 'github' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername', icon: 'linkedin' },
        { platform: 'twitter', url: 'https://twitter.com/yourusername', icon: 'twitter' }
      ]
    };
    settings.seo = {
      metaTitle: 'My Personal Website',
      metaDescription: 'Welcome to my personal website - showcasing my skills and projects',
      keywords: ['portfolio', 'web development', 'frontend', 'backend']
    };
    settings.languages.supported = [
      { code: 'en', name: 'English', flag: 'US' },
      { code: 'am', name: 'Amharic', flag: 'ET' },
      { code: 'es', name: 'Español', flag: 'ES' }
    ];

    await settings.save();
    console.log('Updated settings with sample data');

    console.log('\nSeeding completed successfully!');
    console.log('\nSample content created:');
    console.log('- 2 Pages (Home, About)');
    console.log('- 2 Skills (React, Node.js)');
    console.log('- 2 Projects (Portfolio, E-commerce)');
    console.log('- 2 Services (Web Development, UI/UX)');
    console.log('- 1 Testimonial');
    console.log('\nYou can now view the content at http://localhost:3000');
    console.log('Or manage it at http://localhost:3000/admin/login');

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

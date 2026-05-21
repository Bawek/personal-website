const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function addContent() {
  try {
    // First, try to create admin user if it doesn't exist
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Admin user already exists');
      } else {
        console.log('Could not create admin user, will try to login');
      }
    }

    // Login to get token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('Logged in successfully');

    // Create axios instance with auth
    const api = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Add blog posts
    const blogPosts = [
      {
        title: 'Getting Started with Next.js 14',
        slug: 'getting-started-nextjs-14',
        type: 'post',
        content: '<p>Next.js 14 introduces several exciting features that improve the developer experience and application performance. In this article, we\'ll explore the key updates and how you can leverage them in your projects.</p><h2>Server Actions</h2><p>One of the most significant additions is Server Actions, which allow you to run server-side code directly from your components without creating API routes.</p><h2>Turbopack</h2><p>The new Turbopack bundler provides faster build times and improved hot module replacement, making development much smoother.</p>',
        excerpt: 'Explore the new features in Next.js 14 including Server Actions and Turbopack',
        status: 'published',
        language: 'en',
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['nextjs', 'react', 'web development', 'tutorial'],
        categories: ['frontend', 'frameworks']
      },
      {
        title: 'Building Scalable APIs with Node.js',
        slug: 'building-scalable-apis-nodejs',
        type: 'post',
        content: '<p>Creating APIs that can handle growth requires careful planning and the right architecture. Let\'s dive into best practices for building scalable Node.js APIs.</p><h2>Authentication & Security</h2><p>Implement proper JWT authentication, rate limiting, and input validation to protect your API from common attacks.</p><h2>Database Optimization</h2><p>Use connection pooling, proper indexing, and caching strategies to ensure your database can handle increased load.</p><h2>Microservices Architecture</h2><p>Consider breaking your API into smaller, focused services that can scale independently based on demand.</p>',
        excerpt: 'Best practices for creating Node.js APIs that can handle growth and increased traffic',
        status: 'published',
        language: 'en',
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['nodejs', 'api', 'backend', 'scalability'],
        categories: ['backend', 'architecture']
      },
      {
        title: 'Introduction to Machine Learning',
        slug: 'introduction-machine-learning',
        type: 'post',
        content: '<p>Machine learning is transforming industries across the globe. This beginner-friendly guide will help you understand the fundamentals and get started on your ML journey.</p><h2>What is Machine Learning?</h2><p>Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.</p><h2>Types of Machine Learning</h2><p>Understanding the difference between supervised, unsupervised, and reinforcement learning is crucial for choosing the right approach for your problem.</p><h2>Getting Started</h2><p>Python with libraries like TensorFlow and PyTorch provides an excellent starting point for beginners.</p>',
        excerpt: 'A beginner-friendly introduction to machine learning concepts and applications',
        status: 'published',
        language: 'en',
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['machine learning', 'ai', 'python', 'tutorial'],
        categories: ['ai', 'data science']
      }
    ];

    // Add testimonials
    const testimonials = [
      {
        title: 'Excellent Communication Skills',
        slug: 'excellent-communication',
        type: 'testimonial',
        content: '<p>"Working with this developer was a pleasure. Great communication skills and always delivered on time. The project was completed exactly as specified."</p>',
        excerpt: 'Testimonial about great communication and timely delivery',
        status: 'published',
        language: 'en',
        tags: ['communication', 'professional', 'timely'],
        categories: ['testimonials']
      },
      {
        title: 'Highly Recommended Developer',
        slug: 'highly-recommended-developer',
        type: 'testimonial',
        content: '<p>"I would definitely work with this developer again. They have a deep understanding of modern web technologies and produce clean, maintainable code."</p>',
        excerpt: 'Recommendation for technical expertise and code quality',
        status: 'published',
        language: 'en',
        tags: ['expertise', 'code quality', 'recommendation'],
        categories: ['testimonials']
      }
    ];

    // Create blog posts
    console.log('Adding blog posts...');
    for (const post of blogPosts) {
      try {
        const response = await api.post('/content', post);
        console.log(`✓ Created blog post: ${post.title}`);
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'Slug already exists') {
          console.log(`- Blog post already exists: ${post.title}`);
        } else {
          console.error(`✗ Failed to create blog post: ${post.title}`, error.response?.data || error.message);
        }
      }
    }

    // Create testimonials
    console.log('\nAdding testimonials...');
    for (const testimonial of testimonials) {
      try {
        const response = await api.post('/content', testimonial);
        console.log(`✓ Created testimonial: ${testimonial.title}`);
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'Slug already exists') {
          console.log(`- Testimonial already exists: ${testimonial.title}`);
        } else {
          console.error(`✗ Failed to create testimonial: ${testimonial.title}`, error.response?.data || error.message);
        }
      }
    }

    console.log('\n✅ Content addition completed!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

addContent();
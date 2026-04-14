import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthProtection from '@/components/AuthProtection';

function AboutContent() {
  const [aboutData, setAboutData] = useState({
    hero: {
      title: '',
      subtitle: '',
      description: ''
    },
    whoAmI: {
      title: '',
      description: ''
    },
    resume: {
      buttonText: '',
      fileUrl: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/about', { headers });
      if (response.data.about) {
        setAboutData(response.data.about);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      setError('Failed to fetch about data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put('/api/about', aboutData, { headers });
      setSuccess('About section updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setAboutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Edit About Section</h2>
            <p className="text-sm text-gray-600 mt-1">Customize your about page content</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Hero Section</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={aboutData.hero.title}
                    onChange={(e) => handleChange('hero', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Hello, I am Baweke"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={aboutData.hero.subtitle}
                    onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="I love to learn new technologies"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Description
                </label>
                <textarea
                  rows={4}
                  value={aboutData.hero.description}
                  onChange={(e) => handleChange('hero', 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Brief description that appears in the hero section"
                />
              </div>
            </div>

            {/* Who I Am Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Who I Am Section</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={aboutData.whoAmI.title}
                  onChange={(e) => handleChange('whoAmI', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Who I Am"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Description
                </label>
                <textarea
                  rows={6}
                  value={aboutData.whoAmI.description}
                  onChange={(e) => handleChange('whoAmI', 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Detailed description about yourself, your experience, and what drives you..."
                />
              </div>
            </div>

            {/* Resume Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Resume Download</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={aboutData.resume.buttonText}
                    onChange={(e) => handleChange('resume', 'buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Download Resume"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume File URL
                  </label>
                  <input
                    type="url"
                    value={aboutData.resume.fileUrl}
                    onChange={(e) => handleChange('resume', 'fileUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/admin/dashboard">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="text-sm text-gray-600 mt-1">See how your about section will look</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Hero Preview */}
              <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {aboutData.hero.title || 'Your Title'}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {aboutData.hero.subtitle || 'Your subtitle'}
                </p>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  {aboutData.hero.description || 'Your description will appear here...'}
                </p>
              </div>

              {/* Who I Am Preview */}
              <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {aboutData.whoAmI.title || 'Who I Am'}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {aboutData.whoAmI.description || 'Your about description will appear here...'}
                  </p>
                </div>
              </div>

              {/* Resume Button Preview */}
              {aboutData.resume.buttonText && (
                <div className="text-center py-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {aboutData.resume.buttonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function AdminAbout() {
  return (
    <AuthProtection requireAuth={true}>
      <AboutContent />
    </AuthProtection>
  );
}

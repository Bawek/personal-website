import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthProtection from '@/components/AuthProtection';

function SyncContent() {
  const [syncSettings, setSyncSettings] = useState({
    autoSyncGithub: false,
    autoPostLinkedin: false,
    githubUsername: '',
    linkedinEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [syncResults, setSyncResults] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSyncSettings();
  }, []);

  const fetchSyncSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      // You'd need to create this endpoint to get user's sync settings
      // const response = await axios.get('/api/sync/settings', { headers });
      // setSyncSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching sync settings:', error);
    }
  };

  const handleGitHubSync = async () => {
    if (!syncSettings.githubUsername) {
      setError('Please enter your GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post('/api/sync/github/sync', 
        { username: syncSettings.githubUsername }, 
        { headers }
      );

      setSyncResults(response.data);
      setSuccess(`Successfully synced ${response.data.synced} repositories!`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to sync repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInPost = async (type, data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post('/api/sync/linkedin/post', 
        { type, data }, 
        { headers }
      );

      setSuccess('Successfully posted to LinkedIn!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to post to LinkedIn');
    } finally {
      setLoading(false);
    }
  };

  const updateSyncSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.post('/api/sync/settings', syncSettings, { headers });
      setSuccess('Sync settings updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Sync Settings</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GitHub Sync */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Sync
              </h2>
              <p className="text-sm text-gray-600 mt-1">Automatically sync your GitHub repositories</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={syncSettings.githubUsername}
                  onChange={(e) => setSyncSettings({ ...syncSettings, githubUsername: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="your-username"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoSyncGithub"
                  checked={syncSettings.autoSyncGithub}
                  onChange={(e) => setSyncSettings({ ...syncSettings, autoSyncGithub: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoSyncGithub" className="ml-2 block text-sm text-gray-700">
                  Auto-sync new repositories
                </label>
              </div>

              <button
                onClick={handleGitHubSync}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Syncing...' : 'Sync Repositories Now'}
              </button>

              {syncResults && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Successfully synced {syncResults.synced} repositories!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* LinkedIn Sync */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="#0077B5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Sync
              </h2>
              <p className="text-sm text-gray-600 mt-1">Automatically post to LinkedIn</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="linkedinEnabled"
                  checked={syncSettings.linkedinEnabled}
                  onChange={(e) => setSyncSettings({ ...syncSettings, linkedinEnabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="linkedinEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable LinkedIn integration
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoPostLinkedin"
                  checked={syncSettings.autoPostLinkedin}
                  onChange={(e) => setSyncSettings({ ...syncSettings, autoPostLinkedin: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoPostLinkedin" className="ml-2 block text-sm text-gray-700">
                  Auto-post new content
                </label>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Test LinkedIn Post:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleLinkedInPost('test', { title: 'Test Post', description: 'Testing LinkedIn integration' })}
                    disabled={loading || !syncSettings.linkedinEnabled}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Posting...' : 'Test Post to LinkedIn'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Save Settings</h2>
            <button
              onClick={updateSyncSettings}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Sync Settings'}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function AdminSync() {
  return (
    <AuthProtection requireAuth={true}>
      <SyncContent />
    </AuthProtection>
  );
}

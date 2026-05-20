import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"

const Toggle = ({ label, desc, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative mt-0.5 flex-shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-violet-500 transition-colors" />
      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
      {desc && <p className="text-xs text-gray-600 mt-0.5">{desc}</p>}
    </div>
  </label>
)

function SyncContent() {
  const [gh, setGh]         = useState({ username: '', autoSync: false })
  const [li, setLi]         = useState({ enabled: false, autoPost: false })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState(null) // { type: 'ok'|'err', text }

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const syncGitHub = async () => {
    if (!gh.username) { setMsg({ type: 'err', text: 'Enter your GitHub username first' }); return }
    setLoading(true); setMsg(null)
    try {
      const { data } = await axios.post('/api/sync/github/sync', { username: gh.username }, { headers: headers() })
      setMsg({ type: 'ok', text: `Synced ${data.synced} repositories successfully!` })
    } catch (err) { setMsg({ type: 'err', text: err.response?.data?.error || 'Sync failed' }) }
    finally { setLoading(false) }
  }

  const saveSettings = async () => {
    setLoading(true); setMsg(null)
    try {
      await axios.post('/api/sync/settings', { autoSyncGithub: gh.autoSync, autoPostLinkedin: li.autoPost, githubUsername: gh.username, linkedinEnabled: li.enabled }, { headers: headers() })
      setMsg({ type: 'ok', text: 'Settings saved' })
    } catch { setMsg({ type: 'err', text: 'Failed to save settings' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">Sync</h1>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${msg.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {msg.type === 'ok' ? <HiCheckCircle size={16} /> : <HiXCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* GitHub */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <FaGithub size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">GitHub Sync</h2>
            <p className="text-xs text-gray-500">Import your repositories as projects</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">GitHub Username</label>
          <input value={gh.username} onChange={e => setGh({ ...gh, username: e.target.value })} placeholder="your-username" className={INPUT_CLS} />
        </div>

        <Toggle label="Auto-sync new repositories" desc="Automatically create projects when you push new repos" checked={gh.autoSync} onChange={e => setGh({ ...gh, autoSync: e.target.checked })} />

        <button onClick={syncGitHub} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/15 transition-all disabled:opacity-50">
          <HiRefresh size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing…' : 'Sync Repositories Now'}
        </button>
      </motion.div>

      {/* LinkedIn */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077B5]/20 border border-[#0077B5]/30 flex items-center justify-center">
            <FaLinkedin size={18} className="text-[#0077B5]" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">LinkedIn Integration</h2>
            <p className="text-xs text-gray-500">Auto-post updates to your LinkedIn profile</p>
          </div>
        </div>

        <Toggle label="Enable LinkedIn integration" checked={li.enabled} onChange={e => setLi({ ...li, enabled: e.target.checked })} />
        <Toggle label="Auto-post new content" desc="Post to LinkedIn when you add new projects or experience" checked={li.autoPost} onChange={e => setLi({ ...li, autoPost: e.target.checked })} />

        {!li.enabled && (
          <p className="text-xs text-gray-600 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
            Set <code className="text-violet-400">LINKEDIN_ACCESS_TOKEN</code> and <code className="text-violet-400">LINKEDIN_PERSON_URN</code> in your backend <code className="text-violet-400">.env</code> to enable this feature.
          </p>
        )}
      </motion.div>

      <button onClick={saveSettings} disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50">
        {loading ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}

export default function AdminSync() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Sync">
        <SyncContent />
      </AdminLayout>
    </AuthProtection>
  )
}

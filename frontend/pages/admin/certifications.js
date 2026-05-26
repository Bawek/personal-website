import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiPlus, HiTrash, HiPencil, HiStar } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"

function CertificationsContent() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
    logoUrl: '',
    skills: '',
    featured: false
  })

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/certifications', { headers: { Authorization: `Bearer ${token}` } })
      setCertifications(data.certifications || [])
    } catch (error) {
      console.error('Error fetching certifications:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const token = localStorage.getItem('token')
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      }
      
      if (editing) {
        await axios.put(`/api/certifications/${editing}`, submitData, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await axios.post('/api/certifications', submitData, { headers: { Authorization: `Bearer ${token}` } })
      }
      setStatus('ok')
      setEditing(null)
      setFormData({
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
        logoUrl: '',
        skills: '',
        featured: false
      })
      fetchCertifications()
    } catch (error) {
      setStatus('err')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cert) => {
    setEditing(cert._id)
    setFormData({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expirationDate: cert.expirationDate ? cert.expirationDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      logoUrl: cert.logoUrl || '',
      skills: cert.skills ? cert.skills.join(', ') : '',
      featured: cert.featured || false
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/certifications/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchCertifications()
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      logoUrl: '',
      skills: '',
      featured: false
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Certifications</h1>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing('new')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <HiPlus size={16} /> Add Certification
          </button>
        )}
      </div>

      {/* Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
            {editing === 'new' ? 'Add Certification' : 'Edit Certification'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Certification Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AWS Solutions Architect"
                  className={INPUT_CLS}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Issuing Organization</label>
                <input
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  className={INPUT_CLS}
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className={INPUT_CLS}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className={INPUT_CLS}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Credential ID (Optional)</label>
                <input
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="e.g., AWS-ASA-12345"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Credential URL (Optional)</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Logo URL (Optional)</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Skills (comma-separated)</label>
                <input
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., AWS, Cloud Computing, Security"
                  className={INPUT_CLS}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-300">Featured certification</span>
              </label>
            </div>

            {status === 'ok' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <HiCheckCircle size={16} /> Saved successfully
              </div>
            )}
            {status === 'err' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <HiXCircle size={16} /> Failed to save. Please try again.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-3">
        {certifications.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">No certifications yet</p>
            <p className="text-sm">Add your professional certifications to showcase your expertise.</p>
          </div>
        ) : (
          certifications.map((cert) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                {cert.logoUrl && (
                  <img src={cert.logoUrl} alt={cert.issuingOrganization} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{cert.name}</h3>
                    {cert.featured && <HiStar className="text-amber-400" size={16} />}
                  </div>
                  <p className="text-violet-400 text-sm">{cert.issuingOrganization}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    {cert.expirationDate && ` • Expires: ${new Date(cert.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                  </p>
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cert.skills.map((skill, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                  title="Edit"
                >
                  <HiPencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default function AdminCertifications() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Certifications">
        <CertificationsContent />
      </AdminLayout>
    </AuthProtection>
  )
}

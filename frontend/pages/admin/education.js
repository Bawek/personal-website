import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiPlus, HiTrash, HiPencil } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"

function EducationContent() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    thesisTopic: '',
    startDate: '',
    endDate: '',
    gpa: '',
    logoUrl: '',
    websiteUrl: ''
  })

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/education', { headers: { Authorization: `Bearer ${token}` } })
      setEducation(data.education || [])
    } catch (error) {
      console.error('Error fetching education:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const token = localStorage.getItem('token')
      if (editing) {
        await axios.put(`/api/education/${editing}`, formData, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await axios.post('/api/education', formData, { headers: { Authorization: `Bearer ${token}` } })
      }
      setStatus('ok')
      setEditing(null)
      setFormData({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        thesisTopic: '',
        startDate: '',
        endDate: '',
        gpa: '',
        logoUrl: '',
        websiteUrl: ''
      })
      fetchEducation()
    } catch (error) {
      setStatus('err')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (edu) => {
    setEditing(edu._id)
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      thesisTopic: edu.thesisTopic || '',
      startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      gpa: edu.gpa || '',
      logoUrl: edu.logoUrl || '',
      websiteUrl: edu.websiteUrl || ''
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education record?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/education/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchEducation()
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      thesisTopic: '',
      startDate: '',
      endDate: '',
      gpa: '',
      logoUrl: '',
      websiteUrl: ''
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Education</h1>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing('new')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <HiPlus size={16} /> Add Education
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
            {editing === 'new' ? 'Add Education' : 'Edit Education'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Institution</label>
                <input
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="University name"
                  className={INPUT_CLS}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Degree</label>
                <input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science"
                  className={INPUT_CLS}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Field of Study</label>
              <input
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="e.g., Computer Science"
                className={INPUT_CLS}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Thesis Topic (Optional)</label>
              <input
                value={formData.thesisTopic}
                onChange={(e) => setFormData({ ...formData, thesisTopic: e.target.value })}
                placeholder="Thesis or capstone topic"
                className={INPUT_CLS}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={INPUT_CLS}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={INPUT_CLS}
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">GPA (Optional)</label>
                <input
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="e.g., 3.8/4.0"
                  className={INPUT_CLS}
                />
              </div>
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
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Website URL (Optional)</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
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
        {education.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">No education records yet</p>
            <p className="text-sm">Add your education to showcase your academic background.</p>
          </div>
        ) : (
          education.map((edu) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                {edu.logoUrl && (
                  <img src={edu.logoUrl} alt={edu.institution} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold">{edu.degree}</h3>
                  <p className="text-violet-400 text-sm">{edu.institution}</p>
                  <p className="text-gray-400 text-sm">{edu.fieldOfStudy}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} — {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(edu)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                  title="Edit"
                >
                  <HiPencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
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

export default function AdminEducation() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Education">
        <EducationContent />
      </AdminLayout>
    </AuthProtection>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiStar, HiPlus, HiX, HiExternalLink, HiSearch, HiFilter, HiCheck, HiUpload, HiPhotograph } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import Link from 'next/link'
import { getImageFromPasteEvent, validateImageFile, filePreviewUrl, uploadImageFile } from '@/lib/imageUpload'

const INIT = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', featured: false }

function ProjectsContent() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFeatured, setFilterFeatured] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [imageInputMode, setImageInputMode] = useState('url') // 'url' or 'upload'
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const handleImagePaste = (e) => {
    if (imageInputMode !== 'upload') return
    const file = getImageFromPasteEvent(e)
    if (file) {
      e.preventDefault()
      handleImageFileSelect(file)
    }
  }

  const handleImageFileSelect = async (file) => {
    const validationError = validateImageFile(file)
    
    if (validationError) {
      setImageError(validationError)
      return
    }
    
    setImageError('')
    setImageFile(file)
    
    // Use async function to get data URL
    const previewUrl = await filePreviewUrl(file)
    setImagePreview(previewUrl)
  }

  const handleImageUpload = async () => {
    if (!imageFile) return
    
    try {
      setUploadingImage(true)
      setImageError('')
      
      // Direct Cloudinary upload approach
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnduqbk4q'
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'preset_unsigned'
      
      const formData = new FormData()
      
      // Convert file to base64 for Cloudinary upload
      const reader = new FileReader()
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })
      
      const base64Data = await base64Promise
      
      formData.append('file', base64Data)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'projects')
      
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error?.message || result.message || 'Upload failed')
      }
      
      const uploadedUrl = result.secure_url
      
      setForm({ ...form, imageUrl: uploadedUrl })
      setImageFile(null)
      setImagePreview('')
      
    } catch (err) {
      console.error('Upload error:', err)
      setImageError(err.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageFileSelect(file)
    }
  }

  const clearImagePreview = () => {
    setImageFile(null)
    setImagePreview('')
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Test Cloudinary connection
  const testCloudinaryConnection = async () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnduqbk4q'
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'preset_unsigned'
    
    // Test with a simple base64 image (1x1 pixel)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    
    const formData = new FormData()
    formData.append('file', testImage)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'test')
    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    
    try {
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Cloudinary connection successful! ✓')
      } else {
        alert('Cloudinary connection failed: ' + (result.error?.message || result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Test Error:', error)
      alert('Test error: ' + error.message)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects', { headers: headers() })
      const projectsArray = Array.isArray(data) ? data : (data.projects || [])
      setProjects(projectsArray)
      setFilteredProjects(projectsArray)
    } catch {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  useEffect(() => {
    let filtered = projects

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.techStack?.some(t => t.toLowerCase().includes(query))
      )
    }

    if (filterFeatured === 'featured') {
      filtered = filtered.filter(p => p.featured)
    } else if (filterFeatured === 'not-featured') {
      filtered = filtered.filter(p => !p.featured)
    }

    setFilteredProjects(filtered)
  }, [searchQuery, filterFeatured, projects])

  const openNew = () => {
    setForm(INIT)
    setEditing(null)
    setShowForm(true)
    setError('')
    setImageInputMode('url')
    setImageFile(null)
    setImagePreview('')
    setImageError('')
  }
  const openEdit = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      techStack: (p.techStack || []).join(', '),
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      imageUrl: p.imageUrl || '',
      featured: p.featured || false
    })
    setEditing(p)
    setShowForm(true)
    setError('')
    setImageInputMode('url')
    setImageFile(null)
    setImagePreview('')
    setImageError('')
  }
  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(INIT)
    setImageFile(null)
    setImagePreview('')
    setImageError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const projectData = {
        title: form.title,
        description: form.description,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
        liveUrl: form.liveUrl,
        githubUrl: form.githubUrl,
        imageUrl: form.imageUrl,
        featured: form.featured
      }
      if (editing) await api.put(`/api/projects/${editing._id}`, projectData, { headers: headers() })
      else await api.post('/api/projects', projectData, { headers: headers() })
      await fetchProjects(); closeForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/api/projects/${id}`, { headers: headers() })
      await fetchProjects()
    } catch {
      setError('Failed to delete')
    }
  }

  const toggleFeatured = async (id) => {
    try {
      const project = projects.find(p => p._id === id)
      await api.put(`/api/projects/${id}`, { ...project, featured: !project.featured }, { headers: headers() })
      await fetchProjects()
    } catch {
      setError('Failed to update')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredProjects.length 
        ? [] 
        : filteredProjects.map(p => p._id)
    )
  }

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} project(s)?`)) return
    try {
      await Promise.all(
        selectedIds.map(id => api.delete(`/api/projects/${id}`, { headers: headers() }))
      )
      setSelectedIds([])
      await fetchProjects()
    } catch {
      setError('Failed to delete projects')
    }
  }

  const bulkToggleFeatured = async () => {
    try {
      await Promise.all(
        selectedIds.map(id => {
          const project = projects.find(p => p._id === id)
          return api.put(`/api/projects/${id}`, { ...project, featured: !project.featured }, { headers: headers() })
        })
      )
      setSelectedIds([])
      await fetchProjects()
    } catch {
      setError('Failed to update projects')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Project
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <HiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-violet-500/30 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterFeatured}
          onChange={e => setFilterFeatured(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-violet-500/30 focus:outline-none transition-colors"
        >
          <option value="all">All Projects</option>
          <option value="featured">Featured Only</option>
          <option value="not-featured">Not Featured</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 bg-violet-500/10 border border-violet-500/20 rounded-xl"
        >
          <span className="text-sm text-violet-300">{selectedIds.length} project(s) selected</span>
          <div className="flex gap-2">
            <button onClick={bulkToggleFeatured} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors">
              <HiStar size={14} /> Toggle Featured
            </button>
            <button onClick={bulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
              <HiTrash size={14} /> Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 hover:text-white transition-colors">
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white"><HiX size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Tech Stack</label>
                <input value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, MongoDB" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your project…" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Live URL</label>
                <input type="url" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://…" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">GitHub URL</label>
                <input type="url" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/…" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Project Image</label>
              
              {/* Input Mode Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    imageInputMode === 'url'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    imageInputMode === 'upload'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  Upload
                </button>
              </div>

              {/* URL Input Mode */}
              {imageInputMode === 'url' && (
                <div className="relative">
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm pr-10"
                  />
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <HiX size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Upload Mode */}
              {imageInputMode === 'upload' && (
                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-300 font-medium">⚠️ Select an image, then click "Upload Image to Cloudinary" button below</p>
                  </div>
                  
                  <div
                    className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-violet-500/30 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onPaste={handleImagePaste}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <HiPhotograph size={24} className="mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400 mb-1">
                      {imageFile ? imageFile.name : 'Click to upload or paste image'}
                    </p>
                    <p className="text-xs text-gray-600">Supports JPG, PNG, GIF (max 5MB)</p>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                      >
                        <HiX size={14} />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  {imageFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleImageUpload()
                      }}
                      disabled={uploadingImage}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <HiUpload size={16} />
                          Upload Image to Cloudinary
                        </>
                      )}
                    </button>
                  )}

                  {/* Upload Error */}
                  {imageError && (
                    <p className="text-xs text-red-400">{imageError}</p>
                  )}

                  {/* Uploaded URL Display */}
                  {form.imageUrl && imageInputMode === 'upload' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                      <p className="text-xs text-green-400 font-mono break-all">{form.imageUrl}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-400">Mark as featured</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Project'}
              </button>
              <button type="button" onClick={closeForm} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">{searchQuery || filterFeatured !== 'all' ? 'No projects match your filters' : 'No projects yet'}</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first project</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>{filteredProjects.length} project(s)</span>
            <button onClick={toggleSelectAll} className="hover:text-violet-400 transition-colors">
              {selectedIds.length === filteredProjects.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-white/5 border rounded-2xl overflow-hidden transition-colors group ${selectedIds.includes(p._id) ? 'border-violet-500/50' : 'border-white/10 hover:border-white/20'}`}>
                <div className="h-36 bg-gray-900 overflow-hidden relative">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-pink-900/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white/10">{p.title?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => toggleSelect(p._id)}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selectedIds.includes(p._id) ? 'bg-violet-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                      {selectedIds.includes(p._id) && <HiCheck size={12} />}
                    </button>
                  </div>
                  {p.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono flex items-center gap-1">
                      <HiStar size={10} /> Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{p.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.techStack?.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">{t}</span>
                    ))}
                    {p.techStack?.length > 3 && <span className="px-2 py-0.5 text-xs text-gray-600">+{p.techStack.length - 3}</span>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-violet-400 transition-colors"><HiExternalLink size={15} /></a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><FaGithub size={14} /></a>}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleFeatured(p._id)} className={`p-1.5 rounded-lg transition-all ${p.featured ? 'text-amber-400 bg-amber-500/10' : 'text-gray-600 hover:text-amber-400 hover:bg-amber-500/10'}`}><HiStar size={14} /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"><HiPencil size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><HiTrash size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminProjects() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Projects">
        <ProjectsContent />
      </AdminLayout>
    </AuthProtection>
  )
}

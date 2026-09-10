import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { HiPhotograph, HiX } from 'react-icons/hi'
import {
  getImageFromPasteEvent,
  getImageFromDataTransfer,
  validateImageFile,
  filePreviewUrl,
  uploadImageFile,
} from '@/lib/imageUpload'

/**
 * Image field with URL input, file picker, drag-drop, and clipboard paste (Ctrl+V).
 *
 * @param {string} value - image URL
 * @param {function} onChange - ({ url, file }) => void
 * @param {File|null} file - optional File for multipart submit (projects)
 * @param {string} folder - upload subfolder for paste/auto-upload
 * @param {boolean} autoUpload - upload pasted/dropped files immediately and set URL
 * @param {function} onError - (message) => void
 */
export default function ImageUploadField({
  label = 'Image',
  value = '',
  file = null,
  onChange,
  folder = 'general',
  autoUpload = true,
  maxMb = 5,
  showUrlInput = true,
  onError,
  className = '',
}) {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const rootRef = useRef(null)
  const zoneRef = useRef(null)
  const fileInputRef = useRef(null)
  const previewRef = useRef(null)

  const resolvePreviewSrc = (src) => {
    if (!src) return null
    if (src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src
    }
    return src.startsWith('/') ? src : `/${src}`
  }

  const displayPreview = resolvePreviewSrc(preview || value) || (file ? filePreviewUrl(file) : null)

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
        previewRef.current = null
      }
    }
  }, [])

  const reportError = useCallback(
    (msg) => {
      if (onError) onError(msg)
    },
    [onError]
  )

  const applyFile = useCallback(
    async (imageFile) => {
      const err = validateImageFile(imageFile, maxMb)
      if (err) {
        reportError(err)
        return
      }

      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
      const localPreview = filePreviewUrl(imageFile)
      previewRef.current = localPreview
      setPreview(localPreview)

      if (autoUpload) {
        setUploading(true)
        try {
          const url = await uploadImageFile(imageFile, folder)
          onChange({ url, file: null })
          setPreview(null)
          if (previewRef.current) {
            URL.revokeObjectURL(previewRef.current)
            previewRef.current = null
          }
        } catch (e) {
          reportError(e.message || 'Upload failed')
          onChange({ url: '', file: imageFile })
        } finally {
          setUploading(false)
        }
      } else {
        onChange({ url: '', file: imageFile })
      }
    },
    [autoUpload, folder, maxMb, onChange, reportError]
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      const imageFile = getImageFromDataTransfer(e.dataTransfer)
      if (imageFile) applyFile(imageFile)
    },
    [applyFile]
  )

  const handleFileInput = (e) => {
    const imageFile = e.target.files?.[0]
    if (imageFile) applyFile(imageFile)
    e.target.value = ''
  }

  const clearImage = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
    }
    setPreview(null)
    onChange({ url: '', file: null })
  }

  // Paste works when focus is anywhere in this field (zone, URL input, etc.)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const onPaste = (e) => {
      if (!root.contains(document.activeElement)) return
      const imageFile = getImageFromPasteEvent(e)
      if (!imageFile) return
      e.preventDefault()
      applyFile(imageFile)
    }

    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [applyFile])

  return (
    <div ref={rootRef} className={`space-y-3 ${className}`} data-image-upload-zone>
      <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest">{label}</label>

      <div
        ref={zoneRef}
        tabIndex={0}
        role="button"
        aria-label={`${label} upload area. Paste, drag and drop, or choose a file.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
        }}
        onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all outline-none focus:ring-2 focus:ring-violet-500/50 ${
          dragOver
            ? 'border-violet-500/60 bg-violet-500/10'
            : 'border-white/20 bg-white/5 hover:border-violet-500/40'
        }`}
      >
        {displayPreview ? (
          <div className="relative h-40 sm:h-48 w-full">
            <Image src={displayPreview} alt="Preview" fill className="w-full h-full object-cover rounded-lg" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <HiX size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <HiPhotograph className="text-gray-500" size={28} />
            <p className="text-sm text-gray-400">
              {uploading ? 'Uploading…' : 'Click to choose, drag & drop, or paste (Ctrl+V)'}
            </p>
            <p className="text-xs text-gray-600 font-mono">PNG, JPG, GIF, WebP · max {maxMb}MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {showUrlInput && (
        <div>
          <label className="block text-xs text-gray-600 mb-1 font-mono">
            Image path or URL {value ? '(set)' : ''}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              if (previewRef.current) {
                URL.revokeObjectURL(previewRef.current)
                previewRef.current = null
              }
              setPreview(null)
              onChange({ url: e.target.value, file: null })
            }}
            placeholder="/uploads/… or https://…/image.jpg"
            className="admin-input"
          />
          <p className="text-xs text-gray-600 mt-1">
            Uploads use a path like /uploads/projects/… — no need to edit if the preview looks correct.
          </p>
        </div>
      )}
    </div>
  )
}

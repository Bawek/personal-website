/** Extract first image file from a paste or drop event */
export function getImageFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return null

  const files = dataTransfer.files
  if (files?.length) {
    const img = Array.from(files).find((f) => f.type.startsWith('image/'))
    if (img) return img
  }

  const items = dataTransfer.items
  if (items) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i]
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        return item.getAsFile()
      }
    }
  }

  return null
}

export function getImageFromPasteEvent(e) {
  return getImageFromDataTransfer(e.clipboardData)
}

export function validateImageFile(file, maxMb = 5) {
  if (!file) return 'No file selected'
  if (!file.type.startsWith('image/')) return 'Only image files are allowed'
  if (file.size > maxMb * 1024 * 1024) return `Image must be under ${maxMb}MB`
  return null
}

export function filePreviewUrl(file) {
  if (!file) return null
  return URL.createObjectURL(file)
}

export async function uploadImageFile(file, folder = 'general') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`/api/uploads?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data.url
}

import { NextResponse } from 'next/server'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'

/**
 * Image Upload API
 * POST /api/uploads - Upload image to Cloudinary (protected - admin only)
 */
export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    const formData = await req.formData()
    const file = formData.get('image')
    const folder = formData.get('folder') || 'general'

    if (!file) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'Image must be under 5MB' },
        { status: 400 }
      )
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: 'Cloudinary credentials not configured' },
        { status: 500 }
      )
    }

    // Upload to Cloudinary using unsigned upload preset
    // You need to configure an unsigned upload preset in Cloudinary dashboard
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    
    if (!uploadPreset || uploadPreset === 'your_unsigned_upload_preset') {
      return NextResponse.json(
        { message: 'Cloudinary upload preset not configured. Please set CLOUDINARY_UPLOAD_PRESET in your environment variables.' },
        { status: 500 }
      )
    }
    
    const formDataCloudinary = new FormData()
    formDataCloudinary.append('file', dataUrl)
    formDataCloudinary.append('upload_preset', uploadPreset)
    formDataCloudinary.append('folder', folder)

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formDataCloudinary,
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: result.error?.message || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { message: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
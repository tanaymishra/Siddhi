import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary (you'll need to add these to your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'hoppon'
): Promise<string> => {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary not configured, using mock URL')
    // Return a mock URL for development
    return `https://mock-storage.com/${folder}/${Date.now()}-${file.originalname}`
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Automatically detect file type
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(new Error('Failed to upload file to cloud storage'))
        } else if (result) {
          resolve(result.secure_url)
        } else {
          reject(new Error('Upload failed - no result returned'))
        }
      }
    )

    // Convert buffer to stream and pipe to cloudinary
    const bufferStream = new Readable()
    bufferStream.push(file.buffer)
    bufferStream.push(null)
    bufferStream.pipe(uploadStream)
  })
}

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

// Get public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}
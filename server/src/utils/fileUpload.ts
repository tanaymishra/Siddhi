import path from 'path'
import fs from 'fs'

// Upload file locally and return the filename
export const uploadFileLocally = async (
  file: Express.Multer.File,
  folder: string = 'documents'
): Promise<string> => {
  try {
    // The file is already saved by multer, we just need to return the filename
    return file.filename
  } catch (error) {
    console.error('Local file upload error:', error)
    throw new Error('Failed to upload file locally')
  }
}

// Delete file from local storage
export const deleteFileLocally = async (filename: string): Promise<boolean> => {
  try {
    const filePath = path.join(process.cwd(), 'uploads', filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('Local file delete error:', error)
    return false
  }
}

// Check if file exists locally
export const fileExistsLocally = (filename: string): boolean => {
  try {
    const filePath = path.join(process.cwd(), 'uploads', filename)
    return fs.existsSync(filePath)
  } catch (error) {
    console.error('File exists check error:', error)
    return false
  }
}
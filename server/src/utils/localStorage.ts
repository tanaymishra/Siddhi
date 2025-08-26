import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

// Create uploads directory if it doesn't exist
const createUploadsDir = async (subDir: string = ''): Promise<string> => {
  const uploadsPath = path.join(process.cwd(), 'uploads', subDir)
  
  try {
    await mkdir(uploadsPath, { recursive: true })
  } catch (error) {
    // Directory might already exist, that's okay
  }
  
  return uploadsPath
}

// Save file locally and return the URL path
export const saveFileLocally = async (
  file: Express.Multer.File,
  folder: string = 'general'
): Promise<string> => {
  try {
    // Create the uploads directory
    const uploadsPath = await createUploadsDir(folder)
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = path.extname(file.originalname)
    const filename = `${timestamp}-${randomString}${fileExtension}`
    
    // Full file path
    const filePath = path.join(uploadsPath, filename)
    
    // Save file
    await writeFile(filePath, file.buffer)
    
    // Return URL path (relative to server root)
    const urlPath = `/uploads/${folder}/${filename}`
    
    console.log(`File saved locally: ${urlPath}`)
    return urlPath
    
  } catch (error) {
    console.error('Local file save error:', error)
    throw new Error('Failed to save file locally')
  }
}

// Delete file from local storage
export const deleteFileLocally = async (filePath: string): Promise<boolean> => {
  try {
    // Convert URL path to actual file path
    const actualPath = path.join(process.cwd(), filePath)
    
    if (fs.existsSync(actualPath)) {
      fs.unlinkSync(actualPath)
      console.log(`File deleted: ${filePath}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Local file delete error:', error)
    return false
  }
}

// Check if file exists locally
export const fileExistsLocally = (filePath: string): boolean => {
  try {
    const actualPath = path.join(process.cwd(), filePath)
    return fs.existsSync(actualPath)
  } catch (error) {
    return false
  }
}
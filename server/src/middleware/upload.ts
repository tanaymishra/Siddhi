import multer from 'multer'
import path from 'path'

// Configure multer for file uploads
const storage = multer.memoryStorage() // Store files in memory for cloudinary upload

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|pdf/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed'))
  }
}

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
})

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      })
      return
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        message: 'Too many files uploaded.'
      })
      return
    }
  }
  
  if (error.message === 'Only JPEG, PNG, and PDF files are allowed') {
    res.status(400).json({
      success: false,
      message: error.message
    })
    return
  }

  next(error)
}
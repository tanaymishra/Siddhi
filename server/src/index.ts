import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/database'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import { handleMulterError } from './middleware/upload'
import authRoutes from './routes/auth'
import rideRoutes from './routes/rides'
import paymentRoutes from './routes/payment'
import driverRoutes from './routes/drivers'
import { setupSocketHandlers } from './socket/socketHandlers'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const PORT = process.env.PORT || 5001

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet()) // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('combined')) // Logging
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HoppOn Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to HoppOn API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      rides: '/api/rides',
      payment: '/api/payment',
      drivers: '/api/drivers'
    }
  })
})

// Auth routes
app.use('/api/auth', authRoutes)

// Ride routes
app.use('/api/rides', rideRoutes)

// Payment routes
app.use('/api/payment', paymentRoutes)

// Driver routes
app.use('/api/drivers', driverRoutes)

// Error handling middleware
app.use(handleMulterError)
app.use(notFound)
app.use(errorHandler)

// Setup socket handlers
setupSocketHandlers(io)

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`)
  console.log(`🔌 Socket.IO server initialized`)
  console.log(`💳 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID ? 'Loaded' : 'Missing'}`)
})

export default app
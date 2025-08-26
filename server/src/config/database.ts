import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    console.log('🔄 Connecting to MongoDB...')

    const conn = await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || 'hoppon_db'
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close()
        console.log('🔒 MongoDB connection closed through app termination')
        process.exit(0)
      } catch (error) {
        console.error('❌ Error during MongoDB disconnection:', error)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

export default connectDB
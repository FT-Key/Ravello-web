import mongoose from "mongoose"
import { config } from "./env.js"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db_uri)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

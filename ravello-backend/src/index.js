import { startServer } from "./server.js"
import { connectDB } from "./config/db.js"

async function bootstrap() {
  try {
    await connectDB()
    await startServer()
  } catch (error) {
    console.error("❌ Error initializing app:", error.message)
    process.exit(1)
  }
}

bootstrap()

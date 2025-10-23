import http from "http"
import { app } from "./app.js"
import { config } from "./config/env.js"

export const startServer = async () => {
  const server = http.createServer(app)

  const PORT = config.port || 5000
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
}

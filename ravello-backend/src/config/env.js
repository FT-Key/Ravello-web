import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: process.env.PORT || 5000,
  db_uri: process.env.DB_URI || "mongodb://localhost:27017/ravello",
  jwt_secret: process.env.JWT_SECRET || "supersecretkey",
}

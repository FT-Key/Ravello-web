import express from "express"
import authRoutes from "./authRoutes.js"

const router = express.Router()

router.get("/hello", (req, res) => {
  res.json({ message: "¡Hola desde el backend de Ravello!" })
})
router.use("/auth", authRoutes)

export default router

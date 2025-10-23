import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import cookieParser from "cookie-parser"

import routes from "./routes/index.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()

app.use(helmet())
app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(compression())

app.use("/api", routes)

app.use(errorHandler)

export { app }

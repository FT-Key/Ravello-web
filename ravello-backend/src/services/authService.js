import User from "../models/userModel.js"
import { hashPassword, verifyPassword } from "../utils/hashPassword.js"
import { generateToken } from "../utils/generateToken.js"

export const registerUser = async (userData) => {
  const { email, password, name } = userData

  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error("User already exists")

  const hashed = await hashPassword(password)

  const user = await User.create({ name, email, password: hashed })
  const token = generateToken(user._id)
  return { user, token }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error("Invalid credentials")

  const valid = await verifyPassword(user.password, password)
  if (!valid) throw new Error("Invalid credentials")

  const token = generateToken(user._id)
  return { user, token }
}

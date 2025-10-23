import { registerUser, loginUser } from "../services/authService.js"

export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body)
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

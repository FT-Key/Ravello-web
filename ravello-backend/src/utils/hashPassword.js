import argon2 from "argon2"

// Hashear contraseña
export const hashPassword = async (password) => {
  try {
    return await argon2.hash(password)
  } catch (error) {
    throw new Error("Error hashing password")
  }
}

// Verificar contraseña
export const verifyPassword = async (hashedPassword, plainPassword) => {
  try {
    return await argon2.verify(hashedPassword, plainPassword)
  } catch (error) {
    throw new Error("Error verifying password")
  }
}

import argon2 from "argon2";
import User from "../models/userModel.js";

export async function createUser({ username, email, password, image }) {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error("El email o nombre de usuario ya está registrado");

  const hashedPassword = await argon2.hash(password);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    image
  });

  return user;
}

export async function getUsers() {
  return await User.find().select("-password");
}

export async function getUserById(id) {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("Usuario no encontrado");
  return user;
}

export async function updateUser(id, data) {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuario no encontrado");

  if (data.password) {
    data.password = await argon2.hash(data.password);
  }

  Object.assign(user, data);
  await user.save();

  return user;
}

export async function deleteUser(id) {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuario no encontrado");
  await user.deleteOne();
  return true;
}

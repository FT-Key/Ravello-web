import { User } from '../models/index.js';

export const getAllUsers = async () => {
  return await User.find().select('-password');
};

export const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

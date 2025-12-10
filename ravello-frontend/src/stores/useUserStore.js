// src/stores/useUserStore.js
import { create } from "zustand";
import clientAxios from "../api/axiosConfig";

export const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loadingUser: true,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      set({ token });
    } else {
      localStorage.removeItem("token");
      set({ token: null });
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Cargar el usuario usando el token almacenado
  loadUserFromToken: async () => {
    const { token } = get();

    if (!token) {
      set({ loadingUser: false });
      return;
    }

    try {
      set({ loadingUser: true });
      const res = await clientAxios.get("/auth/me");
      set({ user: res.data.user });
    } catch (error) {
      get().logout();
    } finally {
      set({ loadingUser: false });
    }
  },
}));
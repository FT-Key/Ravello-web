import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
  clearCart: () => set({ cart: [] }),

  favorites: [],
  addToFavorites: (item) => set((state) => ({ favorites: [...state.favorites, item] })),
  removeFromFavorites: (id) => set((state) => ({ favorites: state.favorites.filter(f => f.id !== id) }))
}));

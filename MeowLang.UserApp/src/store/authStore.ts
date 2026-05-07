// File: src/store/authStore.ts

import { create } from "zustand";
import type { AuthUser } from "../types/auth.types";
import { tokenUtils } from "../utils/token.utils";

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

// Add this helper function
const setAppTheme = () => {
  document.documentElement.setAttribute("data-theme", "app");
  document.body.style.backgroundColor = "#F5F5DC";
};

const setDarkTheme = () => {
  document.documentElement.removeAttribute("data-theme");
  document.body.style.backgroundColor = "";
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: tokenUtils.getUser(),
  isAuthenticated: tokenUtils.getToken() !== null,

  login: (user: AuthUser) => {
    tokenUtils.saveAuth(user);
    setAppTheme();
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    tokenUtils.clearAuth();
    setDarkTheme();
    set({ user: null, isAuthenticated: false });
  },
}));

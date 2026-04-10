// File: src/store/authStore.ts

import { create } from 'zustand'
import type { AuthUser } from '../types/auth.types'
import { tokenUtils } from '../utils/token.utils'

type AuthStore = {
    user: AuthUser | null
    isAuthenticated: boolean
    login: (user: AuthUser) => void
    logout: () => void
}

// Helper functions to switch themes
const setLightTheme = () => {
    document.documentElement.setAttribute('data-theme', 'light')
}

const setDarkTheme = () => {
    document.documentElement.removeAttribute('data-theme')
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: tokenUtils.getUser(),
    isAuthenticated: tokenUtils.getToken() !== null,

    login: (user: AuthUser) => {
        tokenUtils.saveAuth(user)
        setLightTheme()  // Switch to light theme after login
        set({ user, isAuthenticated: true })
    },

    logout: () => {
        tokenUtils.clearAuth()
        setDarkTheme()   // Switch back to dark theme on logout
        set({ user: null, isAuthenticated: false })
    }
}))
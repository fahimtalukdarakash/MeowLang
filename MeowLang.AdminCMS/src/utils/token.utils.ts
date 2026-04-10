// File: src/utils/token.utils.ts

import type { AuthUser } from '../types/auth.types'

const TOKEN_KEY = 'meowlang_token'
const USER_KEY = 'meowlang_user'

export const tokenUtils = {
    // Save token and user after login
    saveAuth: (user: AuthUser): void => {
        localStorage.setItem(TOKEN_KEY, user.token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    // Get the saved token
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY)
    },

    // Get the saved user
    getUser: (): AuthUser | null => {
        const user = localStorage.getItem(USER_KEY)
        if (!user) return null
        return JSON.parse(user) as AuthUser
    },

    // Clear everything on logout
    clearAuth: (): void => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },

    // Check if the token is expired
    isTokenExpired: (expiresAt: string): boolean => {
        return new Date(expiresAt) < new Date()
    }
}
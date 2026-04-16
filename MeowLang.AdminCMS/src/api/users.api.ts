// File: src/api/users.api.ts

import apiClient from './client'

export type AdminUserView = {
    id: number
    userName: string
    firstName: string
    lastName: string
    email: string
    role: string
    isPremium: boolean
    streakDays: number
    createdAt: string
    lastLoginAt: string | null
}

export const usersApi = {
    getAll: async (): Promise<AdminUserView[]> => {
        const response = await apiClient.get<AdminUserView[]>('/users')
        return response.data
    }
}
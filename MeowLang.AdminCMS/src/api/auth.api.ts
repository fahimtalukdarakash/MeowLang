// File: src/api/auth.api.ts

import apiClient from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'

export const authApi = {
    // POST /auth/login
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data)
        return response.data
    },

    // POST /auth/register
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data)
        return response.data
    }
}
// File: src/api/languages.api.ts

import apiClient from './client'
import type { Language, CreateLanguageRequest } from '../types/content.types'

export const languagesApi = {
    // GET /languages
    getAll: async (): Promise<Language[]> => {
        const response = await apiClient.get<Language[]>('/languages')
        return response.data
    },

    // GET /languages/:id
    getById: async (id: number): Promise<Language> => {
        const response = await apiClient.get<Language>(`/languages/${id}`)
        return response.data
    },

    // POST /languages
    create: async (data: CreateLanguageRequest): Promise<Language> => {
        const response = await apiClient.post<Language>('/languages', data)
        return response.data
    },

    // DELETE /languages/:id
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/languages/${id}`)
    }
}
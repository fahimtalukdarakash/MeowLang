// File: src/api/languages.api.ts

import apiClient from './client'

export type Language = {
    id: number
    code: string
    name: string
    flagUrl: string | null
    isActive: boolean
}

export const languagesApi = {
    getAll: async (): Promise<Language[]> => {
        const response = await apiClient.get<Language[]>('/languages')
        return response.data
    }
}
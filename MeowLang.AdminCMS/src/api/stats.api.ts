// File: src/api/stats.api.ts

import apiClient from './client'

export type StatsResponse = {
    totalLanguages: number
    activeLanguages: number
    totalLevels: number
    totalSubLevels: number
    totalContentItems: number
    totalUsers: number
}

export const statsApi = {
    get: async (): Promise<StatsResponse> => {
        const response = await apiClient.get<StatsResponse>('/stats')
        return response.data
    }
}
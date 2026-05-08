// File: src/api/sublevels.api.ts

import apiClient from './client'

export type SubLevel = {
    id: number
    title: string
    description: string | null
    sortOrder: number
    displayType: 'alphabet' | 'number' | 'standard'
    totalParts: number
    itemsPerPart: number | null
    levelId: number
    contentItemCount: number
}

export const subLevelsApi = {
    getAll: async (languageId: number, levelId: number): Promise<SubLevel[]> => {
        const response = await apiClient.get<SubLevel[]>(
            `/languages/${languageId}/levels/${levelId}/sublevels`
        )
        return response.data
    }
}
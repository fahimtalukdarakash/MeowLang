// File: src/api/levels.api.ts

import apiClient from './client'

export type Level = {
    id: number
    code: string
    displayName: string
    sortOrder: number
    languageId: number
    subLevelCount: number
}

export const levelsApi = {
    getAll: async (languageId: number): Promise<Level[]> => {
        const response = await apiClient.get<Level[]>(
            `/languages/${languageId}/levels`
        )
        return response.data
    }
}
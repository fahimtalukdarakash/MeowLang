// File: src/api/contentitems.api.ts

import apiClient from './client'

export type ContentItem = {
    id: number
    targetText: string
    nativeText: string
    exampleWordsJson: string | null
    audioUrl: string | null
    imageUrl: string | null
    partNumber: number
    sortOrder: number
    subLevelId: number
}

export type ExampleWord = {
    word: string
    meaning: string
}

export const contentItemsApi = {
    // Get all items for a sublevel
    getAll: async (
        languageId: number,
        levelId: number,
        subLevelId: number
    ): Promise<ContentItem[]> => {
        const response = await apiClient.get<ContentItem[]>(
            `/languages/${languageId}/levels/${levelId}/sublevels/${subLevelId}/contentitems`
        )
        return response.data
    },

    // Get items for a specific part
    getByPart: async (
        languageId: number,
        levelId: number,
        subLevelId: number,
        partNumber: number
    ): Promise<ContentItem[]> => {
        const response = await apiClient.get<ContentItem[]>(
            `/languages/${languageId}/levels/${levelId}/sublevels/${subLevelId}/contentitems`,
            { params: { partNumber } }
        )
        return response.data
    }
}

// Helper to parse example words JSON safely
export function parseExampleWords(json: string | null): ExampleWord[] {
    if (!json) return []
    try {
        return JSON.parse(json) as ExampleWord[]
    } catch {
        return []
    }
}
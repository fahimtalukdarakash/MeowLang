// File: src/api/sublevels.api.ts

import apiClient from './client'
import type { SubLevel, CreateSubLevelRequest } from '../types/content.types'

export const subLevelsApi = {
    // GET /languages/:languageId/levels/:levelId/sublevels
    getAll: async (languageId: number, levelId: number): Promise<SubLevel[]> => {
        const response = await apiClient.get<SubLevel[]>(
            `/languages/${languageId}/levels/${levelId}/sublevels`
        )
        return response.data
    },

    // POST /languages/:languageId/levels/:levelId/sublevels
    create: async (
        languageId: number,
        levelId: number,
        data: CreateSubLevelRequest
    ): Promise<SubLevel> => {
        const response = await apiClient.post<SubLevel>(
            `/languages/${languageId}/levels/${levelId}/sublevels`,
            data
        )
        return response.data
    },

    // DELETE /languages/:languageId/levels/:levelId/sublevels/:id
    delete: async (
        languageId: number,
        levelId: number,
        id: number
    ): Promise<void> => {
        await apiClient.delete(
            `/languages/${languageId}/levels/${levelId}/sublevels/${id}`
        )
    }
}
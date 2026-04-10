// File: src/api/levels.api.ts

import apiClient from './client'
import type { Level, CreateLevelRequest } from '../types/content.types'

export const levelsApi = {
    // GET /languages/:languageId/levels
    getAll: async (languageId: number): Promise<Level[]> => {
        const response = await apiClient.get<Level[]>(
            `/languages/${languageId}/levels`
        )
        return response.data
    },

    // GET /languages/:languageId/levels/:id
    getById: async (languageId: number, id: number): Promise<Level> => {
        const response = await apiClient.get<Level>(
            `/languages/${languageId}/levels/${id}`
        )
        return response.data
    },

    // POST /languages/:languageId/levels
    create: async (
        languageId: number,
        data: CreateLevelRequest
    ): Promise<Level> => {
        const response = await apiClient.post<Level>(
            `/languages/${languageId}/levels`,
            data
        )
        return response.data
    },

    // DELETE /languages/:languageId/levels/:id
    delete: async (languageId: number, id: number): Promise<void> => {
        await apiClient.delete(`/languages/${languageId}/levels/${id}`)
    }
}
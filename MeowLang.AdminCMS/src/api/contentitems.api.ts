// File: src/api/contentitems.api.ts

import apiClient from './client'
import type { ContentItem, CreateContentItemRequest } from '../types/content.types'

export const contentItemsApi = {
    // GET /languages/:languageId/levels/:levelId/sublevels/:subLevelId/contentitems
    getAll: async (
        languageId: number,
        levelId: number,
        subLevelId: number,
        partNumber?: number
    ): Promise<ContentItem[]> => {
        const url = `/languages/${languageId}/levels/${levelId}/sublevels/${subLevelId}/contentitems`
        const response = await apiClient.get<ContentItem[]>(url, {
            params: partNumber ? { partNumber } : {}
        })
        return response.data
    },

    // POST single item
    create: async (
        languageId: number,
        levelId: number,
        subLevelId: number,
        data: CreateContentItemRequest
    ): Promise<ContentItem> => {
        const url = `/languages/${languageId}/levels/${levelId}/sublevels/${subLevelId}/contentitems`
        const response = await apiClient.post<ContentItem>(url, data)
        return response.data
    },

    // POST multiple items — calls create for each one
    bulkCreate: async (
        languageId: number,
        levelId: number,
        subLevelId: number,
        items: CreateContentItemRequest[]
    ): Promise<ContentItem[]> => {
        const results: ContentItem[] = []
        for (const item of items) {
            const created = await contentItemsApi.create(
                languageId, levelId, subLevelId, item
            )
            results.push(created)
        }
        return results
    },

    // DELETE
    delete: async (
        languageId: number,
        levelId: number,
        subLevelId: number,
        id: number
    ): Promise<void> => {
        await apiClient.delete(
            `/languages/${languageId}/levels/${levelId}/sublevels/${subLevelId}/contentitems/${id}`
        )
    }
}
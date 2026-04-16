// File: src/api/languages.api.ts

import apiClient from "./client";
import type {
  Language,
  CreateLanguageRequest,
  UpdateLanguageRequest,
} from "../types/content.types";

export const languagesApi = {
  // GET /languages
  getAll: async (): Promise<Language[]> => {
    const response = await apiClient.get<Language[]>("/languages");
    return response.data;
  },

  // GET /languages/:id
  getById: async (id: number): Promise<Language> => {
    const response = await apiClient.get<Language>(`/languages/${id}`);
    return response.data;
  },

  // POST /languages
  create: async (data: CreateLanguageRequest): Promise<Language> => {
    const response = await apiClient.post<Language>("/languages", data);
    return response.data;
  },
  // Add this inside the languagesApi object
  update: async (
    id: number,
    data: UpdateLanguageRequest,
  ): Promise<Language> => {
    const response = await apiClient.put<Language>(`/languages/${id}`, data);
    return response.data;
  },

  // DELETE /languages/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/languages/${id}`);
  },
};

// File: src/types/content.types.ts

// ── Language ──────────────────────────────
export type Language = {
    id: number
    code: string
    name: string
    flagUrl: string | null
    isActive: boolean
}

export type CreateLanguageRequest = {
    code: string
    name: string
    flagUrl?: string
}

// ── Level ─────────────────────────────────
export type Level = {
    id: number
    code: string
    displayName: string
    sortOrder: number
    languageId: number
    subLevelCount: number
}

export type CreateLevelRequest = {
    code: string
    displayName: string
    sortOrder: number
}

// ── SubLevel ──────────────────────────────
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

export type CreateSubLevelRequest = {
    title: string
    description?: string
    displayType: 'alphabet' | 'number' | 'standard'
    sortOrder: number
    totalParts: number
    itemsPerPart?: number
}

// ── ContentItem ───────────────────────────
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

export type CreateContentItemRequest = {
    targetText: string
    nativeText: string
    exampleWordsJson?: string
    partNumber: number
    sortOrder: number
}
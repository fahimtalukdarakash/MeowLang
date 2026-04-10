// File: src/pages/Levels/LevelsPage.tsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import { levelsApi } from '../../api/levels.api'
import { languagesApi } from '../../api/languages.api'
import type { Level, Language, CreateLevelRequest } from '../../types/content.types'
import styles from './LevelsPage.module.css'

// The predefined level codes for a language
// These are fixed — every language has the same level structure
const LEVEL_OPTIONS = [
    { code: 'beginner', displayName: 'Beginner', sortOrder: 0 },
    { code: 'a1',       displayName: 'A1',       sortOrder: 1 },
    { code: 'a2',       displayName: 'A2',       sortOrder: 2 },
    { code: 'b1',       displayName: 'B1',       sortOrder: 3 },
    { code: 'b2',       displayName: 'B2',       sortOrder: 4 },
    { code: 'c1',       displayName: 'C1',       sortOrder: 5 },
]

function LevelsPage() {
    // ── URL params ────────────────────────────────────────────────
    // React Router gives us the languageId from the URL
    const { languageId } = useParams<{ languageId: string }>()
    const navigate = useNavigate()

    // ── State ─────────────────────────────────────────────────────
    const [language, setLanguage] = useState<Language | null>(null)
    const [levels, setLevels] = useState<Level[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Selected level option from dropdown
    const [selectedLevel, setSelectedLevel] = useState(LEVEL_OPTIONS[0].code)

    // ── Load data on page load ────────────────────────────────────
    useEffect(() => {
        if (languageId) {
            loadData(parseInt(languageId))
        }
    }, [languageId])

    const loadData = async (langId: number) => {
        try {
            setIsLoading(true)
            // Load language and levels at the same time
            const [lang, levelsData] = await Promise.all([
                languagesApi.getById(langId),
                levelsApi.getAll(langId)
            ])
            setLanguage(lang)
            setLevels(levelsData)
        } catch {
            setError('Failed to load data.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Add level ─────────────────────────────────────────────────
    const handleAdd = async () => {
        if (!languageId) return

        const option = LEVEL_OPTIONS.find(l => l.code === selectedLevel)
        if (!option) return

        // Check if this level already exists
        const alreadyExists = levels.some(l => l.code === option.code)
        if (alreadyExists) {
            setError(`Level "${option.displayName}" already exists.`)
            return
        }

        try {
            setIsSubmitting(true)
            const request: CreateLevelRequest = {
                code: option.code,
                displayName: option.displayName,
                sortOrder: option.sortOrder
            }
            const created = await levelsApi.create(parseInt(languageId), request)
            setLevels([...levels, created].sort((a, b) => a.sortOrder - b.sortOrder))
            setIsAdding(false)
        } catch {
            setError('Failed to create level.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Delete level ──────────────────────────────────────────────
    const handleDelete = async (id: number, name: string) => {
        if (!languageId) return

        const confirmed = window.confirm(
            `Delete "${name}"? All sublevels and content inside will be deleted.`
        )
        if (!confirmed) return

        try {
            await levelsApi.delete(parseInt(languageId), id)
            setLevels(levels.filter(l => l.id !== id))
        } catch {
            setError('Failed to delete level.')
        }
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <CMSLayout>
            <Header
                title={language ? `${language.name} — Levels` : 'Levels'}
                subtitle={language ? `Managing levels for ${language.name}` : ''}
                action={
                    <div className={styles.headerActions}>
                        <Button
                            label="← Back to Languages"
                            variant="secondary"
                            onClick={() => navigate('/languages')}
                        />
                        <Button
                            label="+ Add Level"
                            onClick={() => setIsAdding(true)}
                        />
                    </div>
                }
            />

            <div className={styles.content}>

                {/* Error */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className={styles.errorClose}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Add level form */}
                {isAdding && (
                    <div className={styles.addForm}>
                        <h3 className={styles.formTitle}>Add New Level</h3>
                        <div className={styles.formRow}>
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Select level
                                </label>
                                <select
                                    className={styles.select}
                                    value={selectedLevel}
                                    onChange={e => setSelectedLevel(e.target.value)}
                                >
                                    {LEVEL_OPTIONS.map(option => (
                                        <option
                                            key={option.code}
                                            value={option.code}
                                        >
                                            {option.displayName}
                                        </option>
                                    ))}
                                </select>
                                <span className={styles.hint}>
                                    Levels follow the standard language proficiency scale
                                </span>
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <Button
                                label={isSubmitting ? 'Saving...' : 'Save Level'}
                                onClick={handleAdd}
                                disabled={isSubmitting}
                            />
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={() => setIsAdding(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Levels table */}
                {isLoading ? (
                    <div className={styles.loading}>Loading levels...</div>
                ) : levels.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No levels yet.</p>
                        <p>Click "Add Level" to create your first one.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Level</th>
                                <th className={styles.th}>Code</th>
                                <th className={styles.th}>Sublevels</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map(level => (
                                <tr key={level.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <span className={styles.levelName}>
                                            {level.displayName}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.code}>
                                            {level.code}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.count}>
                                            {level.subLevelCount} sublevels
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <Button
                                                label="Manage"
                                                variant="secondary"
                                                onClick={() => navigate(
                                                    `/languages/${languageId}/levels/${level.id}/sublevels`
                                                )}
                                            />
                                            <Button
                                                label="Delete"
                                                variant="danger"
                                                onClick={() => handleDelete(
                                                    level.id,
                                                    level.displayName
                                                )}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </CMSLayout>
    )
}

export default LevelsPage
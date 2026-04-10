// File: src/pages/Languages/LanguagesPage.tsx

import { useState, useEffect } from 'react'
import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import Button from '../../components/common/Button'
import { languagesApi } from '../../api/languages.api'
import type { Language, CreateLanguageRequest } from '../../types/content.types'
import styles from './LanguagesPage.module.css'

function LanguagesPage() {
    // ── State ─────────────────────────────────────────────────────
    const [languages, setLanguages] = useState<Language[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    // Form state
    const [newCode, setNewCode] = useState('')
    const [newName, setNewName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ── Load languages on page load ───────────────────────────────
    useEffect(() => {
        loadLanguages()
    }, [])

    const loadLanguages = async () => {
        try {
            setIsLoading(true)
            const data = await languagesApi.getAll()
            setLanguages(data)
        } catch {
            setError('Failed to load languages.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Add language ──────────────────────────────────────────────
    const handleAdd = async () => {
        if (!newCode.trim() || !newName.trim()) return

        try {
            setIsSubmitting(true)
            const request: CreateLanguageRequest = {
                code: newCode.trim().toLowerCase(),
                name: newName.trim()
            }
            const created = await languagesApi.create(request)
            setLanguages([...languages, created])
            setNewCode('')
            setNewName('')
            setIsAdding(false)
        } catch {
            setError('Failed to create language.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Delete language ───────────────────────────────────────────
    const handleDelete = async (id: number, name: string) => {
        // Ask for confirmation before deleting
        const confirmed = window.confirm(
            `Are you sure you want to delete "${name}"? This will delete all levels and content inside it.`
        )
        if (!confirmed) return

        try {
            await languagesApi.delete(id)
            setLanguages(languages.filter(l => l.id !== id))
        } catch {
            setError('Failed to delete language.')
        }
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <CMSLayout>
            <Header
                title="Languages"
                subtitle="Manage languages available in MeowLang"
                action={
                    <Button
                        label="+ Add Language"
                        onClick={() => setIsAdding(true)}
                    />
                }
            />

            <div className={styles.content}>

                {/* Error message */}
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

                {/* Add language form */}
                {isAdding && (
                    <div className={styles.addForm}>
                        <h3 className={styles.formTitle}>Add New Language</h3>
                        <div className={styles.formRow}>
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Language code
                                </label>
                                <input
                                    className={styles.input}
                                    placeholder="de"
                                    value={newCode}
                                    onChange={e => setNewCode(e.target.value)}
                                    maxLength={5}
                                />
                                <span className={styles.hint}>
                                    Short code — "de" for German, "fr" for French
                                </span>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Language name
                                </label>
                                <input
                                    className={styles.input}
                                    placeholder="German"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <Button
                                label={isSubmitting ? 'Saving...' : 'Save Language'}
                                onClick={handleAdd}
                                disabled={isSubmitting || !newCode || !newName}
                            />
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={() => {
                                    setIsAdding(false)
                                    setNewCode('')
                                    setNewName('')
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Languages table */}
                {isLoading ? (
                    <div className={styles.loading}>Loading languages...</div>
                ) : languages.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No languages yet.</p>
                        <p>Click "Add Language" to create your first one.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Code</th>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {languages.map(language => (
                                <tr key={language.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <span className={styles.code}>
                                            {language.code}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {language.name}
                                    </td>
                                    <td className={styles.td}>
                                        <span className={
                                            language.isActive
                                                ? styles.statusActive
                                                : styles.statusInactive
                                        }>
                                            {language.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <Button
                                            label="Delete"
                                            variant="danger"
                                            onClick={() => handleDelete(
                                                language.id,
                                                language.name
                                            )}
                                        />
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

export default LanguagesPage
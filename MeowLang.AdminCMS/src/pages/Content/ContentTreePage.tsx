// File: src/pages/Content/ContentTreePage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import { languagesApi } from '../../api/languages.api'
import { levelsApi } from '../../api/levels.api'
import { subLevelsApi } from '../../api/sublevels.api'
import type { Language, Level, SubLevel } from '../../types/content.types'
import styles from './ContentTreePage.module.css'

function ContentTreePage() {
    const navigate = useNavigate()

    // ── State ─────────────────────────────────────────────────────
    const [languages, setLanguages] = useState<Language[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Track which languages and levels are expanded
    const [expandedLanguages, setExpandedLanguages] = useState<number[]>([])
    const [expandedLevels, setExpandedLevels] = useState<number[]>([])

    // Cache loaded levels and sublevels to avoid reloading
    const [levelsCache, setLevelsCache] = useState<Record<number, Level[]>>({})
    const [subLevelsCache, setSubLevelsCache] = useState<Record<number, SubLevel[]>>({})

    // Track loading states for individual items
    const [loadingLevels, setLoadingLevels] = useState<number[]>([])
    const [loadingSubLevels, setLoadingSubLevels] = useState<number[]>([])

    // ── Load languages on mount ───────────────────────────────────
    useEffect(() => {
        loadLanguages()
    }, [])

    const loadLanguages = async () => {
        try {
            setIsLoading(true)
            const data = await languagesApi.getAll()
            setLanguages(data)
        } catch {
            console.error('Failed to load languages')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Toggle language ───────────────────────────────────────────
    const toggleLanguage = async (language: Language) => {
        const isExpanded = expandedLanguages.includes(language.id)

        if (isExpanded) {
            setExpandedLanguages(expandedLanguages.filter(id => id !== language.id))
            return
        }

        // Expand and load levels if not cached
        setExpandedLanguages([...expandedLanguages, language.id])

        if (!levelsCache[language.id]) {
            try {
                setLoadingLevels([...loadingLevels, language.id])
                const levels = await levelsApi.getAll(language.id)
                setLevelsCache({ ...levelsCache, [language.id]: levels })
            } catch {
                console.error('Failed to load levels')
            } finally {
                setLoadingLevels(loadingLevels.filter(id => id !== language.id))
            }
        }
    }

    // ── Toggle level ──────────────────────────────────────────────
    const toggleLevel = async (languageId: number, level: Level) => {
        const isExpanded = expandedLevels.includes(level.id)

        if (isExpanded) {
            setExpandedLevels(expandedLevels.filter(id => id !== level.id))
            return
        }

        // Expand and load sublevels if not cached
        setExpandedLevels([...expandedLevels, level.id])

        if (!subLevelsCache[level.id]) {
            try {
                setLoadingSubLevels([...loadingSubLevels, level.id])
                const subLevels = await subLevelsApi.getAll(languageId, level.id)
                setSubLevelsCache({ ...subLevelsCache, [level.id]: subLevels })
            } catch {
                console.error('Failed to load sublevels')
            } finally {
                setLoadingSubLevels(loadingSubLevels.filter(id => id !== level.id))
            }
        }
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <CMSLayout>
            <Header
                title="Content tree"
                subtitle="Browse and manage all content in one place"
            />

            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : languages.length === 0 ? (
                    <div className={styles.empty}>
                        No languages yet. Go to Languages to create one.
                    </div>
                ) : (
                    <div className={styles.tree}>
                        {languages.map(language => (
                            <div key={language.id} className={styles.languageNode}>

                                {/* Language row */}
                                <div
                                    className={styles.languageRow}
                                    onClick={() => toggleLanguage(language)}
                                >
                                    <div className={styles.rowLeft}>
                                        <span className={styles.arrow}>
                                            {expandedLanguages.includes(language.id) ? '▼' : '▶'}
                                        </span>
                                        <span className={styles.langIcon}>🌐</span>
                                        <span className={styles.languageName}>
                                            {language.name}
                                        </span>
                                        <span className={styles.langCode}>
                                            {language.code}
                                        </span>
                                        <span className={language.isActive
                                            ? styles.statusActive
                                            : styles.statusInactive
                                        }>
                                            {language.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.manageBtn}
                                        onClick={e => {
                                            e.stopPropagation()
                                            navigate(`/languages/${language.id}/levels`)
                                        }}
                                    >
                                        Manage levels →
                                    </button>
                                </div>

                                {/* Levels */}
                                {expandedLanguages.includes(language.id) && (
                                    <div className={styles.levelsList}>
                                        {loadingLevels.includes(language.id) ? (
                                            <div className={styles.treeLoading}>
                                                Loading levels...
                                            </div>
                                        ) : (levelsCache[language.id] ?? []).length === 0 ? (
                                            <div className={styles.treeEmpty}>
                                                No levels yet.
                                            </div>
                                        ) : (
                                            (levelsCache[language.id] ?? []).map(level => (
                                                <div key={level.id} className={styles.levelNode}>

                                                    {/* Level row */}
                                                    <div
                                                        className={styles.levelRow}
                                                        onClick={() => toggleLevel(language.id, level)}
                                                    >
                                                        <div className={styles.rowLeft}>
                                                            <span className={styles.arrow}>
                                                                {expandedLevels.includes(level.id) ? '▼' : '▶'}
                                                            </span>
                                                            <span className={styles.levelIcon}>📊</span>
                                                            <span className={styles.levelName}>
                                                                {level.displayName}
                                                            </span>
                                                            <span className={styles.countBadge}>
                                                                {level.subLevelCount} sublevels
                                                            </span>
                                                        </div>
                                                        <button
                                                            className={styles.manageBtn}
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                navigate(`/languages/${language.id}/levels/${level.id}/sublevels`)
                                                            }}
                                                        >
                                                            Manage sublevels →
                                                        </button>
                                                    </div>

                                                    {/* Sublevels */}
                                                    {expandedLevels.includes(level.id) && (
                                                        <div className={styles.subLevelsList}>
                                                            {loadingSubLevels.includes(level.id) ? (
                                                                <div className={styles.treeLoading}>
                                                                    Loading sublevels...
                                                                </div>
                                                            ) : (subLevelsCache[level.id] ?? []).length === 0 ? (
                                                                <div className={styles.treeEmpty}>
                                                                    No sublevels yet.
                                                                </div>
                                                            ) : (
                                                                (subLevelsCache[level.id] ?? []).map(subLevel => (
                                                                    <div
                                                                        key={subLevel.id}
                                                                        className={styles.subLevelRow}
                                                                    >
                                                                        <div className={styles.rowLeft}>
                                                                            <span className={styles.subLevelIcon}>📝</span>
                                                                            <span className={styles.subLevelName}>
                                                                                {subLevel.title}
                                                                            </span>
                                                                            <span className={`${styles.typeBadge} ${styles[subLevel.displayType]}`}>
                                                                                {subLevel.displayType}
                                                                            </span>
                                                                            <span className={styles.countBadge}>
                                                                                {subLevel.contentItemCount} items
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            className={styles.uploadBtn}
                                                                            onClick={() => navigate(
                                                                                `/languages/${language.id}/levels/${level.id}/sublevels/${subLevel.id}/content`
                                                                            )}
                                                                        >
                                                                            Upload content →
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CMSLayout>
    )
}

export default ContentTreePage
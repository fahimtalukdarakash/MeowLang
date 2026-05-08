// File: src/pages/App/LevelMap/LevelMapPage.tsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { levelsApi } from '../../../api/levels.api'
import { languagesApi } from '../../../api/languages.api'
import type { Level } from '../../../api/levels.api'
import type { Language } from '../../../api/languages.api'
import styles from './LevelMapPage.module.css'

// Accent colors per level — each level has its own identity
const LEVEL_COLORS: Record<string, string> = {
    'beginner': '#F0A500',
    'a1':       '#00C9B1',
    'a2':       '#FF2D78',
    'b1':       '#0066FF',
    'b2':       '#00C853',
    'c1':       '#9B59B6',
}

function LevelMapPage() {
    const { languageId } = useParams<{ languageId: string }>()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const [language, setLanguage] = useState<Language | null>(null)
    const [levels, setLevels] = useState<Level[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (languageId) loadData(parseInt(languageId))
    }, [languageId])

    const loadData = async (langId: number) => {
        try {
            setIsLoading(true)
            const [lang, lvls] = await Promise.all([
                languagesApi.getAll().then(
                    langs => langs.find(l => l.id === langId) ?? null
                ),
                levelsApi.getAll(langId)
            ])
            setLanguage(lang)
            setLevels(lvls)
        } catch {
            console.error('Failed to load levels')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // For now first level is unlocked, rest are locked
    // Later this will come from user progress
    const isUnlocked = (index: number) => index === 0

    return (
        <div className={styles.page}>

            {/* ── Top bar ───────────────────────────────── */}
            <header className={styles.topBar}>
                <div className={styles.topLeft}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate('/app')}
                    >
                        ← Back
                    </button>
                    <div className={styles.logo}>🐾 MeowLang</div>
                </div>
                <div className={styles.userArea}>
                    <div className={styles.livesDisplay}>
                        ❤️ ❤️ ❤️ ❤️ ❤️
                    </div>
                    <span className={styles.userName}>
                        {user?.firstName}
                    </span>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ── Main content ──────────────────────────── */}
            <main className={styles.main}>
                <div className={styles.heading}>
                    <h1 className={styles.title}>
                        {language?.name ?? 'German'} Course
                    </h1>
                    <p className={styles.subtitle}>
                        Complete each level to unlock the next
                    </p>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading levels...</div>
                ) : (
                    <div className={styles.levelPath}>
                        {levels.map((level, index) => {
                            const color = LEVEL_COLORS[level.code] ?? '#F0A500'
                            const unlocked = isUnlocked(index)

                            return (
                                <div key={level.id} className={styles.levelItem}>
                                    {/* Connector line — not shown for first item */}
                                    {index > 0 && (
                                        <div className={styles.connector} />
                                    )}

                                    {/* Level card */}
                                    <div
                                        className={`
                                            ${styles.levelCard}
                                            ${unlocked
                                                ? styles.levelCardUnlocked
                                                : styles.levelCardLocked
                                            }
                                        `}
                                        style={unlocked ? {
                                            borderColor: '#000',
                                            '--level-color': color
                                        } as React.CSSProperties : undefined}
                                        onClick={() => {
                                            if (unlocked) {
                                                navigate(
                                                    `/app/language/${languageId}/level/${level.id}`
                                                )
                                            }
                                        }}
                                    >
                                        {/* Lock badge for locked levels */}
                                        {!unlocked && (
                                            <div className={styles.lockBadge}>
                                                🔒 Locked
                                            </div>
                                        )}

                                        {/* Level accent block */}
                                        <div
                                            className={styles.levelAccent}
                                            style={{
                                                background: unlocked
                                                    ? color
                                                    : '#cccccc'
                                            }}
                                        >
                                            <span className={styles.levelCode}>
                                                {level.displayName}
                                            </span>
                                        </div>

                                        {/* Level info */}
                                        <div className={styles.levelInfo}>
                                            <p className={styles.levelMeta}>
                                                {level.subLevelCount} sublevels
                                            </p>
                                            {unlocked && (
                                                <button
                                                    className={styles.enterBtn}
                                                    style={{
                                                        background: color
                                                    }}
                                                >
                                                    Enter →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

export default LevelMapPage
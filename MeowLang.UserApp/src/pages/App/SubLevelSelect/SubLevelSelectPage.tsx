// File: src/pages/App/SubLevelSelect/SubLevelSelectPage.tsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { subLevelsApi } from '../../../api/sublevels.api'
import { levelsApi } from '../../../api/levels.api'
import type { SubLevel } from '../../../api/sublevels.api'
import type { Level } from '../../../api/levels.api'
import styles from './SubLevelSelectPage.module.css'

// Icon per display type
const TYPE_ICON: Record<string, string> = {
    'alphabet': '🔤',
    'number':   '🔢',
    'standard': '📖',
}

// Color per display type
const TYPE_COLOR: Record<string, string> = {
    'alphabet': '#F0A500',
    'number':   '#00C9B1',
    'standard': '#FF2D78',
}

function SubLevelSelectPage() {
    const { languageId, levelId } = useParams<{
        languageId: string
        levelId: string
    }>()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const [level, setLevel] = useState<Level | null>(null)
    const [subLevels, setSubLevels] = useState<SubLevel[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (languageId && levelId) {
            loadData(parseInt(languageId), parseInt(levelId))
        }
    }, [languageId, levelId])

    const loadData = async (langId: number, lvlId: number) => {
        try {
            setIsLoading(true)
            const [levels, subs] = await Promise.all([
                levelsApi.getAll(langId),
                subLevelsApi.getAll(langId, lvlId)
            ])
            const currentLevel = levels.find(l => l.id === lvlId) ?? null
            setLevel(currentLevel)
            setSubLevels(subs)
        } catch {
            console.error('Failed to load sublevels')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // For now first sublevel is unlocked
    const isUnlocked = (index: number) => index === 0

    return (
        <div className={styles.page}>

            {/* ── Top bar ───────────────────────────────── */}
            <header className={styles.topBar}>
                <div className={styles.topLeft}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(`/app/language/${languageId}`)}
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
                        {level?.displayName ?? 'Beginner'}
                    </h1>
                    <p className={styles.subtitle}>
                        Choose a topic to start learning
                    </p>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : subLevels.length === 0 ? (
                    <div className={styles.empty}>
                        No sublevels yet. Check back soon!
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {subLevels.map((subLevel, index) => {
                            const unlocked = isUnlocked(index)
                            const color = TYPE_COLOR[subLevel.displayType]
                            const icon = TYPE_ICON[subLevel.displayType]

                            return (
                                <div
                                    key={subLevel.id}
                                    className={`
                                        ${styles.card}
                                        ${unlocked
                                            ? styles.cardUnlocked
                                            : styles.cardLocked
                                        }
                                    `}
                                    onClick={() => {
                                        if (unlocked) {
                                            navigate(
                                                `/app/language/${languageId}/level/${levelId}/sublevel/${subLevel.id}`
                                            )
                                        }
                                    }}
                                >
                                    {/* Lock badge */}
                                    {!unlocked && (
                                        <div className={styles.lockBadge}>
                                            🔒 Locked
                                        </div>
                                    )}

                                    {/* Top accent bar */}
                                    <div
                                        className={styles.accentBar}
                                        style={{
                                            background: unlocked
                                                ? color
                                                : '#cccccc'
                                        }}
                                    />

                                    {/* Card content */}
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardIcon}>
                                            {icon}
                                        </div>
                                        <h2 className={styles.cardTitle}>
                                            {subLevel.title}
                                        </h2>
                                        {subLevel.description && (
                                            <p className={styles.cardDesc}>
                                                {subLevel.description}
                                            </p>
                                        )}

                                        {/* Stats row */}
                                        <div className={styles.statsRow}>
                                            <div className={styles.stat}>
                                                <span className={styles.statValue}>
                                                    {subLevel.totalParts}
                                                </span>
                                                <span className={styles.statLabel}>
                                                    Parts
                                                </span>
                                            </div>
                                            <div className={styles.stat}>
                                                <span className={styles.statValue}>
                                                    {subLevel.contentItemCount}
                                                </span>
                                                <span className={styles.statLabel}>
                                                    Items
                                                </span>
                                            </div>
                                            <div className={styles.stat}>
                                                <span className={styles.statValue}>
                                                    {subLevel.displayType}
                                                </span>
                                                <span className={styles.statLabel}>
                                                    Type
                                                </span>
                                            </div>
                                        </div>

                                        {/* Start button */}
                                        {unlocked && (
                                            <button
                                                className={styles.startBtn}
                                                style={{ background: color }}
                                            >
                                                Start lesson →
                                            </button>
                                        )}
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

export default SubLevelSelectPage
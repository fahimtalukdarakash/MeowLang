// File: src/pages/App/Lesson/LessonPage.tsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { contentItemsApi, parseExampleWords } from '../../../api/contentitems.api'
import { subLevelsApi } from '../../../api/sublevels.api'
import type { ContentItem } from '../../../api/contentitems.api'
import type { SubLevel } from '../../../api/sublevels.api'
import styles from './LessonPage.module.css'

function LessonPage() {
    const { languageId, levelId, subLevelId } = useParams<{
        languageId: string
        levelId: string
        subLevelId: string
    }>()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const [subLevel, setSubLevel] = useState<SubLevel | null>(null)
    const [items, setItems] = useState<ContentItem[]>([])
    const [currentPart, setCurrentPart] = useState(1)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [partFinished, setPartFinished] = useState(false)

    useEffect(() => {
        if (languageId && levelId && subLevelId) {
            loadData()
        }
    }, [languageId, levelId, subLevelId])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const [subs, partItems] = await Promise.all([
                subLevelsApi.getAll(
                    parseInt(languageId!),
                    parseInt(levelId!)
                ),
                contentItemsApi.getByPart(
                    parseInt(languageId!),
                    parseInt(levelId!),
                    parseInt(subLevelId!),
                    1
                )
            ])
            const currentSub = subs.find(
                s => s.id === parseInt(subLevelId!)
            ) ?? null
            setSubLevel(currentSub)
            setItems(partItems)
        } catch {
            console.error('Failed to load lesson content')
        } finally {
            setIsLoading(false)
        }
    }

    const loadPart = async (partNumber: number) => {
        try {
            setIsLoading(true)
            const partItems = await contentItemsApi.getByPart(
                parseInt(languageId!),
                parseInt(levelId!),
                parseInt(subLevelId!),
                partNumber
            )
            setItems(partItems)
            setCurrentIndex(0)
            setPartFinished(false)
            setCurrentPart(partNumber)
        } catch {
            console.error('Failed to load part')
        } finally {
            setIsLoading(false)
        }
    }

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            setPartFinished(true)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setPartFinished(false)
        }
    }

    const _handleNextPart = () => {
        if (subLevel && currentPart < subLevel.totalParts) {
            loadPart(currentPart + 1)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const currentItem = items[currentIndex]
    const exampleWords = currentItem
        ? parseExampleWords(currentItem.exampleWordsJson)
        : []

    return (
        <div className={styles.page}>

            {/* ── Top bar ───────────────────────────────── */}
            <header className={styles.topBar}>
                <div className={styles.topLeft}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(
                            `/app/language/${languageId}/level/${levelId}`
                        )}
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

            {/* ── Progress bar ──────────────────────────── */}
            <div className={styles.progressBar}>
                <div className={styles.progressInfo}>
                    <span className={styles.subLevelTitle}>
                        {subLevel?.title ?? 'Lesson'}
                    </span>
                    <span className={styles.partInfo}>
                        Part {currentPart} of {subLevel?.totalParts ?? 1}
                    </span>
                </div>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${((currentIndex + 1) / items.length) * 100}%`
                        }}
                    />
                </div>
            </div>

            {/* ── Main content ──────────────────────────── */}
            <main className={styles.main}>
                {isLoading ? (
                    <div className={styles.loading}>Loading lesson...</div>
                ) : partFinished ? (

                    // ── Part finished screen ───────────────
                    <div className={styles.partFinished}>
                        <div className={styles.finishedCard}>
                            <img
                                src="/assets/characters/Frieren_giving_love.png"
                                alt="Frieren celebrating"
                                className={styles.finishedImage}
                            />
                            <h2 className={styles.finishedTitle}>
                                Part {currentPart} Complete!
                            </h2>
                            <p className={styles.finishedText}>
                                Great job! Ready for the test?
                            </p>
                            <div className={styles.finishedActions}>
                                <button
                                    className={styles.testBtn}
                                    onClick={() => navigate(
                                        `/app/language/${languageId}/level/${levelId}/sublevel/${subLevelId}/test/${currentPart}`
                                    )}
                                >
                                    Take test →
                                </button>
                                
                            </div>
                        </div>
                    </div>

                ) : currentItem ? (

                    // ── Lesson content ─────────────────────
                    <div className={styles.lessonLayout}>

                        {/* Left — content card */}
                        <div className={styles.contentSide}>

                            {/* Item counter */}
                            <div className={styles.itemCounter}>
                                {currentIndex + 1} / {items.length}
                            </div>

                            {/* Main letter/word card */}
                            <div className={styles.mainCard}>
                                <div className={styles.targetText}>
                                    {currentItem.targetText}
                                </div>
                                <div className={styles.nativeText}>
                                    {currentItem.nativeText}
                                </div>
                            </div>

                            {/* Example words — only for alphabet type */}
                            {exampleWords.length > 0 && (
                                <div className={styles.examplesSection}>
                                    <p className={styles.examplesLabel}>
                                        Example words
                                    </p>
                                    <div className={styles.examplesList}>
                                        {exampleWords.map((ex, i) => (
                                            <div
                                                key={i}
                                                className={styles.exampleCard}
                                            >
                                                <span className={styles.exampleWord}>
                                                    {ex.word}
                                                </span>
                                                <span className={styles.exampleMeaning}>
                                                    {ex.meaning}
                                                </span>
                                                <button
                                                    className={styles.soundBtn}
                                                    title="Play pronunciation"
                                                >
                                                    🔊
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className={styles.navigation}>
                                <button
                                    className={styles.prevBtn}
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                >
                                    ← Previous
                                </button>
                                <button
                                    className={styles.nextBtn}
                                    onClick={handleNext}
                                >
                                    {currentIndex === items.length - 1
                                        ? 'Finish part →'
                                        : 'Next →'
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Right — Tom the teacher */}
                        <div className={styles.teacherSide}>
                            <img
                                src="/assets/characters/tom1.png"
                                alt="Tom the teacher"
                                className={styles.teacherImage}
                            />
                            <div className={styles.teacherSpeech}>
                                <p className={styles.speechText}>
                                    {currentIndex === 0
                                        ? "Let's learn together! 📚"
                                        : "You're doing great! Keep going! 🎯"
                                    }
                                </p>
                            </div>
                        </div>

                    </div>

                ) : (
                    <div className={styles.empty}>
                        No content found for this lesson.
                    </div>
                )}
            </main>
        </div>
    )
}

export default LessonPage
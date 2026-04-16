// File: src/pages/Dashboard/DashboardPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import { statsApi } from '../../api/stats.api'
import type { StatsResponse } from '../../api/stats.api'
import { useAuthStore } from '../../store/authStore'
import styles from './DashboardPage.module.css'

function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    // ── State ─────────────────────────────────────────────────────
    const [stats, setStats] = useState<StatsResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // ── Load stats ────────────────────────────────────────────────
    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await statsApi.get()
            setStats(data)
        } catch {
            console.error('Failed to load stats')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <CMSLayout>
            <Header
                title={`Welcome back, ${user?.firstName ?? user?.userName}`}
                subtitle="Here is what is happening in MeowLang today"
            />

            <div className={styles.content}>

                {/* Stats grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🌐</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {isLoading ? '—' : stats?.totalLanguages}
                            </span>
                            <span className={styles.statLabel}>
                                Total languages
                            </span>
                        </div>
                        <span className={styles.statSub}>
                            {isLoading ? '' : `${stats?.activeLanguages} active`}
                        </span>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📊</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {isLoading ? '—' : stats?.totalLevels}
                            </span>
                            <span className={styles.statLabel}>
                                Total levels
                            </span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📚</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {isLoading ? '—' : stats?.totalSubLevels}
                            </span>
                            <span className={styles.statLabel}>
                                Total sublevels
                            </span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>📝</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {isLoading ? '—' : stats?.totalContentItems}
                            </span>
                            <span className={styles.statLabel}>
                                Content items
                            </span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>👤</span>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {isLoading ? '—' : stats?.totalUsers}
                            </span>
                            <span className={styles.statLabel}>
                                Total users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick links */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Quick actions</h2>
                    <div className={styles.quickLinks}>
                        <div
                            className={styles.quickLink}
                            onClick={() => navigate('/languages')}
                        >
                            <span className={styles.quickIcon}>🌐</span>
                            <div className={styles.quickInfo}>
                                <span className={styles.quickTitle}>
                                    Manage languages
                                </span>
                                <span className={styles.quickDesc}>
                                    Add or edit languages
                                </span>
                            </div>
                            <span className={styles.quickArrow}>→</span>
                        </div>

                        <div
                            className={styles.quickLink}
                            onClick={() => navigate('/languages')}
                        >
                            <span className={styles.quickIcon}>📝</span>
                            <div className={styles.quickInfo}>
                                <span className={styles.quickTitle}>
                                    Upload content
                                </span>
                                <span className={styles.quickDesc}>
                                    Add words, sentences, tests
                                </span>
                            </div>
                            <span className={styles.quickArrow}>→</span>
                        </div>

                        <div
                            className={styles.quickLink}
                            onClick={() => navigate('/users')}
                        >
                            <span className={styles.quickIcon}>👤</span>
                            <div className={styles.quickInfo}>
                                <span className={styles.quickTitle}>
                                    Manage users
                                </span>
                                <span className={styles.quickDesc}>
                                    View and manage user accounts
                                </span>
                            </div>
                            <span className={styles.quickArrow}>→</span>
                        </div>
                    </div>
                </div>

            </div>
        </CMSLayout>
    )
}

export default DashboardPage
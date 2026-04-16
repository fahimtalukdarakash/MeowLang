// File: src/pages/Users/UsersPage.tsx

import { useState, useEffect } from 'react'
import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import { usersApi } from '../../api/users.api'
import type { AdminUserView } from '../../api/users.api'
import styles from './UsersPage.module.css'

function UsersPage() {
    // ── State ─────────────────────────────────────────────────────
    const [users, setUsers] = useState<AdminUserView[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // ── Load users ────────────────────────────────────────────────
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            setIsLoading(true)
            const data = await usersApi.getAll()
            setUsers(data)
        } catch {
            setError('Failed to load users.')
        } finally {
            setIsLoading(false)
        }
    }

    // ── Format date ───────────────────────────────────────────────
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—'
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    // ── Render ────────────────────────────────────────────────────
    return (
        <CMSLayout>
            <Header
                title="Users"
                subtitle={`${users.length} registered users`}
            />

            <div className={styles.content}>

                {/* Error */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className={styles.errorClose}
                        >✕</button>
                    </div>
                )}

                {/* Users table */}
                {isLoading ? (
                    <div className={styles.loading}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div className={styles.empty}>
                        No users registered yet.
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>User</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Plan</th>
                                <th className={styles.th}>Streak</th>
                                <th className={styles.th}>Joined</th>
                                <th className={styles.th}>Last login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                {user.firstName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>
                                                    {user.firstName} {user.lastName}
                                                </span>
                                                <span className={styles.userHandle}>
                                                    @{user.userName}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.email}>
                                            {user.email}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={
                                            user.role === 'admin'
                                                ? styles.roleAdmin
                                                : styles.roleUser
                                        }>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={
                                            user.isPremium
                                                ? styles.planPremium
                                                : styles.planFree
                                        }>
                                            {user.isPremium ? 'Premium' : 'Free'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.streak}>
                                            <span className={styles.streakIcon}>
                                                🔥
                                            </span>
                                            <span className={styles.streakDays}>
                                                {user.streakDays}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.date}>
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.date}>
                                            {formatDate(user.lastLoginAt)}
                                        </span>
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

export default UsersPage
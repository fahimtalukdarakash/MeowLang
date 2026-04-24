// File: src/components/modals/RegisterModal.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth.api'
import type { AuthUser } from '../../types/auth.types'
import styles from './RegisterModal.module.css'

type RegisterModalProps = {
    onClose: () => void
    onSwitchToLogin: () => void
}

function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
    const navigate = useNavigate()
    const login = useAuthStore(state => state.login)

    const [userName, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await authApi.register({
                userName,
                firstName,
                lastName,
                email,
                password
            })

            const user: AuthUser = {
                userId: response.userId,
                userName: response.userName,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
                role: response.role,
                token: response.token,
                expiresAt: response.expiresAt
            }

            login(user)
            navigate('/app')
        } catch {
            setError('Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Create account</h2>
                    <p className={styles.subtitle}>
                        Start your language journey today
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.twoCol}>
                        <div className={styles.field}>
                            <label className={styles.label}>First name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                className={styles.input}
                                placeholder="John"
                                required
                                autoFocus
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Last name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                className={styles.input}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            className={styles.input}
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button
                        className={styles.switchBtn}
                        onClick={onSwitchToLogin}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    )
}

export default RegisterModal
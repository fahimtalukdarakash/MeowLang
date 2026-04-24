// File: src/components/modals/LoginModal.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth.api'
import type { AuthUser } from '../../types/auth.types'
import styles from './LoginModal.module.css'

type LoginModalProps = {
    onClose: () => void
    onSwitchToRegister: () => void
}

function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
    const navigate = useNavigate()
    const login = useAuthStore(state => state.login)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await authApi.login({ email, password })

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
            setError('Invalid email or password.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        // Backdrop — sits at z:40, cursor visible behind at z:10
        <div className={styles.backdrop} onClick={onClose}>

            {/* Glass card — stops click propagation so backdrop click closes */}
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Welcome back</h2>
                    <p className={styles.subtitle}>
                        Sign in to continue learning
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="you@example.com"
                            required
                            autoFocus
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
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Don't have an account?{' '}
                    <button
                        className={styles.switchBtn}
                        onClick={onSwitchToRegister}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}

export default LoginModal
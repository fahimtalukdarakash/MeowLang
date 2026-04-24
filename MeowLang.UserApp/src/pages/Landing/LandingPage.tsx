// File: src/pages/Landing/LandingPage.tsx

import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import LoginModal from '../../components/modals/LoginModal'
import RegisterModal from '../../components/modals/RegisterModal'
import styles from './LandingPage.module.css'

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    return (
        <div className={styles.page}>
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
            />

            {/* Hero section */}
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>
                    Most Interactive Language
                    <span className={styles.heroTitleAccent}>
                        Learning App
                    </span>
                </h1>
            </section>

            {/* Modals */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                    }}
                />
            )}

            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => {
                        setShowRegister(false)
                        setShowLogin(true)
                    }}
                />
            )}
        </div>
    )
}

export default LandingPage
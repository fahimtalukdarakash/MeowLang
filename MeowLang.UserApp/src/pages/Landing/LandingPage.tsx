// File: src/pages/Landing/LandingPage.tsx

import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import LoginModal from '../../components/modals/LoginModal'
import RegisterModal from '../../components/modals/RegisterModal'
import LanguageGlobe from '../../components/globe/LanguageGlobe'
import FeaturesSection from '../../components/features/FeaturesSection'
import CTASection from '../../components/cta/CTASection'
import styles from './LandingPage.module.css'

const ACTIVE_LANGUAGES = ['de']

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

            {/* Globe section */}
            <section className={styles.globeSection}>
                <h2 className={styles.sectionTitle}>
                    Languages we teach
                </h2>
                <p className={styles.sectionSubtitle}>
                    More languages coming soon
                </p>
                <LanguageGlobe activeLanguageCodes={ACTIVE_LANGUAGES} />
            </section>

            {/* Features section */}
            <FeaturesSection />

            {/* CTA section */}
            <CTASection onRegisterClick={() => setShowRegister(true)} />

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
// File: src/pages/Landing/LandingPage.tsx

import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
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

            {/* Login modal placeholder */}
            {showLogin && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        padding: '40px',
                        borderRadius: '20px',
                        color: 'white'
                    }}>
                        Login modal coming soon
                        <br />
                        <button
                            onClick={() => setShowLogin(false)}
                            style={{ color: 'white', marginTop: '16px' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Register modal placeholder */}
            {showRegister && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        padding: '40px',
                        borderRadius: '20px',
                        color: 'white'
                    }}>
                        Register modal coming soon
                        <br />
                        <button
                            onClick={() => setShowRegister(false)}
                            style={{ color: 'white', marginTop: '16px' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LandingPage
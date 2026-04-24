// File: src/components/navbar/Navbar.tsx

import { useState } from 'react'
import styles from './Navbar.module.css'

type NavbarProps = {
    onLoginClick: () => void
    onRegisterClick: () => void
}

function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className={styles.navbar}>
            {/* App name */}
            <div className={styles.brand}>
                MeowLang
            </div>

            {/* Desktop buttons */}
            <div className={styles.actions}>
                <button
                    className={styles.loginBtn}
                    onClick={onLoginClick}
                >
                    Login
                </button>
                <button
                    className={styles.registerBtn}
                    onClick={onRegisterClick}
                >
                    Get started
                </button>
            </div>

            {/* Mobile menu button */}
            <button
                className={styles.menuBtn}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <button
                        className={styles.mobileLoginBtn}
                        onClick={() => {
                            onLoginClick()
                            setMenuOpen(false)
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={styles.mobileRegisterBtn}
                        onClick={() => {
                            onRegisterClick()
                            setMenuOpen(false)
                        }}
                    >
                        Get started
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar
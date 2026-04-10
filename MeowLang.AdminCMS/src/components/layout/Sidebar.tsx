// File: src/components/layout/Sidebar.tsx

import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import styles from './Sidebar.module.css'

// Navigation items — easy to add more later
const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { path: '/languages', label: 'Languages', icon: '🌐' },
    { path: '/content', label: 'Content', icon: '📝' },
    { path: '/users', label: 'Users', icon: '👤' },
]

function Sidebar() {
    const { user, logout } = useAuthStore()

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <span className={styles.logoIcon}>🐾</span>
                <span className={styles.logoText}>MeowLang</span>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                <p className={styles.navLabel}>Main Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                        }
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom — user info and logout */}
            <div className={styles.bottom}>
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                        {user?.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userDetails}>
                        <p className={styles.userName}>{user?.userName}</p>
                        <p className={styles.userRole}>Administrator</p>
                    </div>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                    Sign out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
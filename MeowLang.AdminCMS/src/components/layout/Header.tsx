// File: src/components/layout/Header.tsx

import styles from './Header.module.css'

type HeaderProps = {
    title: string
    subtitle?: string
    action?: React.ReactNode
}

function Header({ title, subtitle, action }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && (
                    <p className={styles.subtitle}>{subtitle}</p>
                )}
            </div>
            {action && (
                <div className={styles.action}>
                    {action}
                </div>
            )}
        </header>
    )
}

export default Header
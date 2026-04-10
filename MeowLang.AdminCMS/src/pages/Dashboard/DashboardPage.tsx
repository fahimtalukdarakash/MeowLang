// File: src/pages/Dashboard/DashboardPage.tsx

import CMSLayout from '../../components/layout/CMSLayout'
import Header from '../../components/layout/Header'
import styles from './DashboardPage.module.css'

function DashboardPage() {
    return (
        <CMSLayout>
            <Header
                title="Dashboard"
                subtitle="Welcome to MeowLang CMS"
            />
            <div className={styles.content}>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Dashboard content coming soon...
                </p>
            </div>
        </CMSLayout>
    )
}

export default DashboardPage
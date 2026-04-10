// File: src/components/layout/CMSLayout.tsx

import Sidebar from './Sidebar'
import styles from './CMSLayout.module.css'

type CMSLayoutProps = {
    children: React.ReactNode
}

function CMSLayout({ children }: CMSLayoutProps) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}

export default CMSLayout
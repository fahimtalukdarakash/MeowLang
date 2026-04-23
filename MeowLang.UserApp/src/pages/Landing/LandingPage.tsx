// File: src/pages/Landing/LandingPage.tsx

function LandingPage() {
    return (
        <div style={{
            position: 'relative',
            zIndex: 20,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '48px',
                color: 'var(--color-gold)',
                textAlign: 'center'
            }}>
                MeowLang
            </h1>
        </div>
    )
}

export default LandingPage
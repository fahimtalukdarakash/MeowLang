// File: src/components/cta/CTASection.tsx

import styles from './CTASection.module.css'

type CTASectionProps = {
    onRegisterClick: () => void
}

function CTASection({ onRegisterClick }: CTASectionProps) {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>

                {/* Left — image, no animation */}
                <div className={styles.imageWrapper}>
                    <img
                        src="/assets/characters/fern_holding_frieren.png"
                        alt="Fern holding Frieren"
                        className={styles.image}
                    />
                </div>

                {/* Right — text and button */}
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        We won't let you go
                        <span className={styles.accent}> to that owl.</span>
                    </h2>
                    <p className={styles.paragraph}>
                        Most people give up on languages in the first week.
                        MeowLang won't let that happen. Your teacher shows up
                        every day. Your streak keeps you coming back. And when
                        you fail — trust us, Fern will make sure you try again.
                    </p>
                    <button
                        className={styles.ctaBtn}
                        onClick={onRegisterClick}
                    >
                        Start learning — it's free
                    </button>
                </div>

            </div>
        </section>
    )
}

export default CTASection
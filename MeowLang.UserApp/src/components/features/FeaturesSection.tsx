// File: src/components/features/FeaturesSection.tsx

import styles from './FeaturesSection.module.css'

const characters = [
    {
        src: '/assets/characters/tom1.png',
        alt: 'Tom teacher',
        className: styles.charTopLeft,
        delay: '0s'
    },
    {
        src: '/assets/characters/tom3.png',
        alt: 'Tom pointing',
        className: styles.charTopRight,
        delay: '0.8s'
    },
    {
        src: '/assets/characters/Frieren_giving_love.png',
        alt: 'Frieren giving love',
        className: styles.charMiddleLeft,
        delay: '0.4s'
    },
    {
        src: '/assets/characters/Fern_angry_face1.png',
        alt: 'Fern angry',
        className: styles.charMiddleRight,
        delay: '1.2s'
    },
    {
        src: '/assets/characters/Frieren_crying_face1.png',
        alt: 'Frieren crying',
        className: styles.charBottomLeft,
        delay: '0.6s'
    },
    {
        src: '/assets/characters/frieren_smark_face.png',
        alt: 'Frieren smirk',
        className: styles.charBottomRight,
        delay: '1.0s'
    },
]

function FeaturesSection() {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>

                {/* Floating characters */}
                {characters.map((char, i) => (
                    <div
                        key={i}
                        className={`${styles.charWrapper} ${char.className}`}
                        style={{ animationDelay: char.delay }}
                    >
                        <img
                            src={char.src}
                            alt={char.alt}
                            className={styles.charImage}
                        />
                    </div>
                ))}

                {/* Center text — no card, just clean text */}
                <div className={styles.textCenter}>
                    <h2 className={styles.title}>
                        Why MeowLang?
                    </h2>
                    <p className={styles.paragraph}>
                        Your cat teacher <span className={styles.highlight}>Tom</span> guides every lesson.
                        A <span className={styles.highlight}>lives system</span> keeps you sharp.
                        <span className={styles.highlight}> AI checks your pronunciation</span> in real time.
                        <span className={styles.highlight}> Frieren cheers</span> your wins.
                        <span className={styles.highlight}> Fern judges</span> your mistakes.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default FeaturesSection
// File: src/pages/App/LanguageSelect/LanguageSelectPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { languagesApi } from "../../../api/languages.api";
import type { Language } from "../../../api/languages.api";
import styles from "./LanguageSelectPage.module.css";

// Flag emojis for known language codes
const FLAG_MAP: Record<string, string> = {
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  it: "🇮🇹",
  tr: "🇹🇷",
  ja: "🇯🇵",
  zh: "🇨🇳",
  pt: "🇧🇷",
};

// Coming soon languages — shown as locked cards
const COMING_SOON = [
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
];

function LanguageSelectPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const data = await languagesApi.getAll();
      setLanguages(data.filter((l) => l.isActive));
    } catch {
      console.error("Failed to load languages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (language: Language) => {
    navigate(`/app/language/${language.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      {/* ── Top bar ───────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.logo}>🐾 MeowLang</div>
        <div className={styles.userArea}>
          <span className={styles.userName}>Hey, {user?.firstName}!</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ──────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Choose your language</h1>
          <p className={styles.subtitle}>
            Pick a language and start your journey today
          </p>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.grid}>
            {/* Active languages from database */}
            {languages.map((language) => (
              <div
                key={language.id}
                className={styles.card}
                onClick={() => handleSelect(language)}
              >
                <div className={styles.cardFlag}>
                  <span
                    className={styles.flagCode}
                    style={
                      language.code === "de"
                        ? {
                            background:
                              "linear-gradient(180deg, #000000 33%, #DD0000 33%, #DD0000 66%, #FFCE00 66%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : undefined
                    }
                  >
                    {language.code.toUpperCase()}
                  </span>
                </div>
                <h2 className={styles.cardName}>{language.name}</h2>
                <p className={styles.cardMeta}>6 levels available</p>
                <button className={styles.startBtn}>Start →</button>
              </div>
            ))}

            {/* Coming soon — locked cards */}
            {COMING_SOON.filter(
              (cs) => !languages.find((l) => l.code === cs.code),
            ).map((lang) => (
              <div
                key={lang.code}
                className={`${styles.card} ${styles.cardLocked}`}
              >
                <div className={styles.lockBadge}>Coming soon</div>
                <div className={styles.cardFlag}>
                  {FLAG_MAP[lang.code] ?? "🌐"}
                </div>
                <h2 className={styles.cardName}>{lang.name}</h2>
                <p className={styles.cardMeta}>In development</p>
                <button className={styles.startBtn} disabled>
                  Locked 🔒
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LanguageSelectPage;

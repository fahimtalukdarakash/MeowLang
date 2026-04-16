// File: src/pages/Login/LoginPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/auth.api";
import type { AuthUser } from "../../types/auth.types";
import styles from "./LoginPage.module.css";

function LoginPage() {
  // ── State ─────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Hooks ─────────────────────────────────────────────────────
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // ── Submit Handler ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the browser from refreshing the page on form submit
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      // Check if the logged in user is actually an admin
      if (response.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        setIsLoading(false);
        return;
      }

      // Build the AuthUser object and save to store
      const user: AuthUser = {
        userId: response.userId,
        userName: response.userName,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
        token: response.token,
        expiresAt: response.expiresAt,
      };

      login(user);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      // Always runs — whether success or error
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      {/* Left side — branding */}
      <div className={styles.branding}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🐾</span>
            <span className={styles.logoText}>MeowLang</span>
          </div>
          <h1 className={styles.tagline}>Content Management System</h1>
          <p className={styles.subtitle}>
            Build the future of language learning, one word at a time.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>6</span>
              <span className={styles.statLabel}>Levels</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Words</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>AI</span>
              <span className={styles.statLabel}>Grading</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@meowlang.com"
                required
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

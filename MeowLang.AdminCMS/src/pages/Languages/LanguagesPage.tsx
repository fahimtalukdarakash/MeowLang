// File: src/pages/Languages/LanguagesPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CMSLayout from "../../components/layout/CMSLayout";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import { languagesApi } from "../../api/languages.api";
import type {
  Language,
  CreateLanguageRequest,
} from "../../types/content.types";
import styles from "./LanguagesPage.module.css";

function LanguagesPage() {
  // ── State ─────────────────────────────────────────────────────
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFlagUrl, setEditFlagUrl] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Load languages on page load ───────────────────────────────
  useEffect(() => {
    loadLanguages();
  }, []);

  const navigate = useNavigate();

  const loadLanguages = async () => {
    try {
      setIsLoading(true);
      const data = await languagesApi.getAll();
      setLanguages(data);
    } catch {
      setError("Failed to load languages.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Add language ──────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newCode.trim() || !newName.trim()) return;

    try {
      setIsSubmitting(true);
      const request: CreateLanguageRequest = {
        code: newCode.trim().toLowerCase(),
        name: newName.trim(),
      };
      const created = await languagesApi.create(request);
      setLanguages([...languages, created]);
      setNewCode("");
      setNewName("");
      setIsAdding(false);
    } catch {
      setError("Failed to create language.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete language ───────────────────────────────────────────
  const handleDelete = async (id: number, name: string) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This will delete all levels and content inside it.`,
    );
    if (!confirmed) return;

    try {
      await languagesApi.delete(id);
      setLanguages(languages.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete language.");
    }
  };
  // ── Start editing ─────────────────────────────────────────
  const handleStartEdit = (language: Language) => {
    setEditingId(language.id);
    setEditName(language.name);
    setEditFlagUrl(language.flagUrl ?? "");
    setEditIsActive(language.isActive);
  };

  // ── Save edit ─────────────────────────────────────────────
  const handleSaveEdit = async (id: number) => {
    try {
      setIsSaving(true);
      const updated = await languagesApi.update(id, {
        name: editName,
        flagUrl: editFlagUrl || undefined,
        isActive: editIsActive,
      });
      setLanguages(languages.map((l) => (l.id === id ? updated : l)));
      setEditingId(null);
    } catch {
      setError("Failed to update language.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <CMSLayout>
      <Header
        title="Languages"
        subtitle="Manage languages available in MeowLang"
        action={
          <Button label="+ Add Language" onClick={() => setIsAdding(true)} />
        }
      />

      <div className={styles.content}>
        {/* Error message */}
        {error && (
          <div className={styles.error}>
            {error}
            <button
              onClick={() => setError(null)}
              className={styles.errorClose}
            >
              ✕
            </button>
          </div>
        )}

        {/* Add language form */}
        {isAdding && (
          <div className={styles.addForm}>
            <h3 className={styles.formTitle}>Add New Language</h3>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Language code</label>
                <input
                  className={styles.input}
                  placeholder="de"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  maxLength={5}
                />
                <span className={styles.hint}>
                  Short code — "de" for German, "fr" for French
                </span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Language name</label>
                <input
                  className={styles.input}
                  placeholder="German"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <Button
                label={isSubmitting ? "Saving..." : "Save Language"}
                onClick={handleAdd}
                disabled={isSubmitting || !newCode || !newName}
              />
              <Button
                label="Cancel"
                variant="secondary"
                onClick={() => {
                  setIsAdding(false);
                  setNewCode("");
                  setNewName("");
                }}
              />
            </div>
          </div>
        )}

        {/* Languages table */}
        {isLoading ? (
          <div className={styles.loading}>Loading languages...</div>
        ) : languages.length === 0 ? (
          <div className={styles.empty}>
            <p>No languages yet.</p>
            <p>Click "Add Language" to create your first one.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language) =>
                editingId === language.id ? (
                  // ── Edit row ───────────────────────────────
                  <tr key={language.id} className={styles.tr}>
                    <td className={styles.td} colSpan={4}>
                      <div className={styles.editRow}>
                        <div className={styles.editGrid}>
                          <div className={styles.field}>
                            <label className={styles.label}>Name</label>
                            <input
                              className={styles.input}
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>
                              Flag URL (optional)
                            </label>
                            <input
                              className={styles.input}
                              value={editFlagUrl}
                              onChange={(e) => setEditFlagUrl(e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Status</label>
                            <select
                              className={styles.select}
                              value={editIsActive ? "active" : "inactive"}
                              onChange={(e) =>
                                setEditIsActive(e.target.value === "active")
                              }
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.editActions}>
                          <Button
                            label={isSaving ? "Saving..." : "Save"}
                            onClick={() => handleSaveEdit(language.id)}
                            disabled={isSaving || !editName}
                          />
                          <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => setEditingId(null)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // ── View row ───────────────────────────────
                  <tr key={language.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.code}>{language.code}</span>
                    </td>
                    <td
                      className={styles.td}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/languages/${language.id}/levels`)
                      }
                    >
                      <span style={{ color: "var(--color-accent)" }}>
                        {language.name}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={
                          language.isActive
                            ? styles.statusActive
                            : styles.statusInactive
                        }
                      >
                        {language.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <Button
                          label="Edit"
                          variant="secondary"
                          onClick={() => handleStartEdit(language)}
                        />
                        <Button
                          label="Delete"
                          variant="danger"
                          onClick={() =>
                            handleDelete(language.id, language.name)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </CMSLayout>
  );
}

export default LanguagesPage;

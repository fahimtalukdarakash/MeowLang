// File: src/pages/SubLevels/SubLevelsPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CMSLayout from "../../components/layout/CMSLayout";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import { subLevelsApi } from "../../api/sublevels.api";
import { levelsApi } from "../../api/levels.api";
import type {
  SubLevel,
  Level,
  CreateSubLevelRequest,
} from "../../types/content.types";
import styles from "./SubLevelsPage.module.css";

function SubLevelsPage() {
  const { languageId, levelId } = useParams<{
    languageId: string;
    levelId: string;
  }>();
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────
  const [level, setLevel] = useState<Level | null>(null);
  const [subLevels, setSubLevels] = useState<SubLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayType, setDisplayType] = useState<
    "alphabet" | "number" | "standard"
  >("standard");
  const [totalParts, setTotalParts] = useState(1);
  const [itemsPerPart, setItemsPerPart] = useState<number | "">("");

  // ── Load data ─────────────────────────────────────────────────
  useEffect(() => {
    if (languageId && levelId) {
      loadData(parseInt(languageId), parseInt(levelId));
    }
  }, [languageId, levelId]);

  const loadData = async (langId: number, lvlId: number) => {
    try {
      setIsLoading(true);
      const [levelData, subLevelsData] = await Promise.all([
        levelsApi.getById(langId, lvlId),
        subLevelsApi.getAll(langId, lvlId),
      ]);
      setLevel(levelData);
      setSubLevels(subLevelsData);
    } catch {
      setError("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset form ────────────────────────────────────────────────
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDisplayType("standard");
    setTotalParts(1);
    setItemsPerPart("");
    setIsAdding(false);
  };

  // ── Add sublevel ──────────────────────────────────────────────
  const handleAdd = async () => {
    if (!languageId || !levelId || !title.trim()) return;

    try {
      setIsSubmitting(true);
      const request: CreateSubLevelRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        displayType,
        sortOrder: subLevels.length,
        totalParts,
        itemsPerPart: itemsPerPart === "" ? undefined : itemsPerPart,
      };
      const created = await subLevelsApi.create(
        parseInt(languageId),
        parseInt(levelId),
        request,
      );
      setSubLevels([...subLevels, created]);
      resetForm();
    } catch {
      setError("Failed to create sublevel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete sublevel ───────────────────────────────────────────
  const handleDelete = async (id: number, title: string) => {
    if (!languageId || !levelId) return;

    const confirmed = window.confirm(
      `Delete "${title}"? All content inside will be deleted.`,
    );
    if (!confirmed) return;

    try {
      await subLevelsApi.delete(parseInt(languageId), parseInt(levelId), id);
      setSubLevels(subLevels.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete sublevel.");
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <CMSLayout>
      <Header
        title={level ? `${level.displayName} — Sublevels` : "Sublevels"}
        subtitle={level ? `Managing sublevels for ${level.displayName}` : ""}
        action={
          <div className={styles.headerActions}>
            <Button
              label="← Back to Levels"
              variant="secondary"
              onClick={() => navigate(`/languages/${languageId}/levels`)}
            />
            <Button label="+ Add Sublevel" onClick={() => setIsAdding(true)} />
          </div>
        }
      />

      <div className={styles.content}>
        {/* Error */}
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

        {/* Add sublevel form */}
        {isAdding && (
          <div className={styles.addForm}>
            <h3 className={styles.formTitle}>Add New Sublevel</h3>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  placeholder="Alphabets"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Display type</label>
                <select
                  className={styles.select}
                  value={displayType}
                  onChange={(e) =>
                    setDisplayType(
                      e.target.value as "alphabet" | "number" | "standard",
                    )
                  }
                >
                  <option value="alphabet">Alphabet</option>
                  <option value="number">Number</option>
                  <option value="standard">Standard</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Total parts</label>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={totalParts}
                  onChange={(e) => setTotalParts(parseInt(e.target.value))}
                />
                <span className={styles.hint}>
                  How many parts this sublevel is divided into
                </span>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Items per part</label>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  placeholder="Leave empty to show all"
                  value={itemsPerPart}
                  onChange={(e) =>
                    setItemsPerPart(
                      e.target.value === "" ? "" : parseInt(e.target.value),
                    )
                  }
                />
                <span className={styles.hint}>
                  5 for words, 10 for numbers, empty for alphabets
                </span>
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Description (optional)</label>
                <input
                  className={styles.input}
                  placeholder="Brief description of this sublevel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                label={isSubmitting ? "Saving..." : "Save Sublevel"}
                onClick={handleAdd}
                disabled={isSubmitting || !title}
              />
              <Button label="Cancel" variant="secondary" onClick={resetForm} />
            </div>
          </div>
        )}

        {/* Sublevels table */}
        {isLoading ? (
          <div className={styles.loading}>Loading sublevels...</div>
        ) : subLevels.length === 0 ? (
          <div className={styles.empty}>
            <p>No sublevels yet.</p>
            <p>Click "Add Sublevel" to create your first one.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Type</th>
                <th className={styles.th}>Parts</th>
                <th className={styles.th}>Items/Part</th>
                <th className={styles.th}>Content</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subLevels.map((subLevel) => (
                <tr key={subLevel.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.subLevelTitle}>
                      {subLevel.title}
                    </span>
                    {subLevel.description && (
                      <p className={styles.subLevelDesc}>
                        {subLevel.description}
                      </p>
                    )}
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.typeBadge} ${styles[subLevel.displayType]}`}
                    >
                      {subLevel.displayType}
                    </span>
                  </td>
                  <td className={styles.td}>{subLevel.totalParts}</td>
                  <td className={styles.td}>{subLevel.itemsPerPart ?? "—"}</td>
                  <td className={styles.td}>
                    <span className={styles.count}>
                      {subLevel.contentItemCount} items
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <Button
                        label="Upload"
                        variant="secondary"
                        onClick={() =>
                          navigate(
                            `/languages/${languageId}/levels/${levelId}/sublevels/${subLevel.id}/content`,
                          )
                        }
                      />
                      <Button
                        label="Delete"
                        variant="danger"
                        onClick={() =>
                          handleDelete(subLevel.id, subLevel.title)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CMSLayout>
  );
}

export default SubLevelsPage;

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

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editTotalParts, setEditTotalParts] = useState(1);
  const [editItemsPerPart, setEditItemsPerPart] = useState<number | "">("");
  const [isSaving, setIsSaving] = useState(false);

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
  // ── Start editing ─────────────────────────────────────────
  const handleStartEdit = (subLevel: SubLevel) => {
    setEditingId(subLevel.id);
    setEditTitle(subLevel.title);
    setEditDescription(subLevel.description ?? "");
    setEditSortOrder(subLevel.sortOrder);
    setEditTotalParts(subLevel.totalParts);
    setEditItemsPerPart(subLevel.itemsPerPart ?? "");
  };

  // ── Save edit ─────────────────────────────────────────────
  const handleSaveEdit = async (id: number) => {
    if (!languageId || !levelId) return;

    try {
      setIsSaving(true);
      const updated = await subLevelsApi.update(
        parseInt(languageId),
        parseInt(levelId),
        id,
        {
          title: editTitle,
          description: editDescription || undefined,
          sortOrder: editSortOrder,
          totalParts: editTotalParts,
          itemsPerPart: editItemsPerPart === "" ? undefined : editItemsPerPart,
        },
      );
      setSubLevels(subLevels.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
    } catch {
      setError("Failed to update sublevel.");
    } finally {
      setIsSaving(false);
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
              {subLevels.map((subLevel) =>
                editingId === subLevel.id ? (
                  // ── Edit row ───────────────────────────────
                  <tr key={subLevel.id} className={styles.tr}>
                    <td className={styles.td} colSpan={6}>
                      <div className={styles.editRow}>
                        <div className={styles.editGrid}>
                          <div className={styles.field}>
                            <label className={styles.label}>Title</label>
                            <input
                              className={styles.input}
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <input
                              className={styles.input}
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Sort order</label>
                            <input
                              className={styles.input}
                              type="number"
                              value={editSortOrder}
                              onChange={(e) =>
                                setEditSortOrder(parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Total parts</label>
                            <input
                              className={styles.input}
                              type="number"
                              value={editTotalParts}
                              onChange={(e) =>
                                setEditTotalParts(parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>
                              Items per part
                            </label>
                            <input
                              className={styles.input}
                              type="number"
                              placeholder="Empty = show all"
                              value={editItemsPerPart}
                              onChange={(e) =>
                                setEditItemsPerPart(
                                  e.target.value === ""
                                    ? ""
                                    : parseInt(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className={styles.editActions}>
                          <Button
                            label={isSaving ? "Saving..." : "Save"}
                            onClick={() => handleSaveEdit(subLevel.id)}
                            disabled={isSaving || !editTitle}
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
                    <td className={styles.td}>
                      {subLevel.itemsPerPart ?? "—"}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.count}>
                        {subLevel.contentItemCount} items
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <Button
                          label="Edit"
                          variant="secondary"
                          onClick={() => handleStartEdit(subLevel)}
                        />
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
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </CMSLayout>
  );
}

export default SubLevelsPage;

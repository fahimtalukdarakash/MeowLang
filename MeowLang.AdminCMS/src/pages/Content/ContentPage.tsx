// File: src/pages/Content/ContentPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CMSLayout from "../../components/layout/CMSLayout";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import { contentItemsApi } from "../../api/contentitems.api";
import { subLevelsApi } from "../../api/sublevels.api";
import type {
  ContentItem,
  SubLevel,
  CreateContentItemRequest,
} from "../../types/content.types";
import styles from "./ContentPage.module.css";

function ContentPage() {
  const { languageId, levelId, subLevelId } = useParams<{
    languageId: string;
    levelId: string;
    subLevelId: string;
  }>();
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────
  const [subLevel, setSubLevel] = useState<SubLevel | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Manual add form
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [nativeText, setNativeText] = useState("");
  const [partNumber, setPartNumber] = useState(1);
  const [sortOrder, setSortOrder] = useState(1);

  // Bulk upload
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [jsonText, setJsonText] = useState("");

  // ── Load data ─────────────────────────────────────────────────
  useEffect(() => {
    if (languageId && levelId && subLevelId) {
      loadData();
    }
  }, [languageId, levelId, subLevelId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [subLevelData, items] = await Promise.all([
        subLevelsApi
          .getAll(parseInt(languageId!), parseInt(levelId!))
          .then((list) => list.find((s) => s.id === parseInt(subLevelId!))),
        contentItemsApi.getAll(
          parseInt(languageId!),
          parseInt(levelId!),
          parseInt(subLevelId!),
        ),
      ]);
      if (subLevelData) setSubLevel(subLevelData);
      setContentItems(items);
    } catch {
      setError("Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Add single item ───────────────────────────────────────────
  const handleAddSingle = async () => {
    if (!targetText.trim() || !nativeText.trim()) return;

    try {
      setIsSubmitting(true);
      const request: CreateContentItemRequest = {
        targetText: targetText.trim(),
        nativeText: nativeText.trim(),
        partNumber,
        sortOrder,
      };
      const created = await contentItemsApi.create(
        parseInt(languageId!),
        parseInt(levelId!),
        parseInt(subLevelId!),
        request,
      );
      setContentItems([...contentItems, created]);
      setTargetText("");
      setNativeText("");
      setSortOrder(sortOrder + 1);
      setSuccess("Item added successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to add item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Bulk upload ───────────────────────────────────────────────
  const handleBulkUpload = async () => {
    if (!jsonText.trim()) return;

    try {
      setIsBulkUploading(true);
      setError(null);

      // Parse the JSON
      const parsed = JSON.parse(jsonText) as CreateContentItemRequest[];

      // Validate it is an array
      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of items.");
        return;
      }

      const created = await contentItemsApi.bulkCreate(
        parseInt(languageId!),
        parseInt(levelId!),
        parseInt(subLevelId!),
        parsed,
      );

      setContentItems([...contentItems, ...created]);
      setJsonText("");
      setSuccess(`${created.length} items uploaded successfully.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError("Invalid JSON format. Please check your JSON.");
      } else {
        setError("Failed to upload items.");
      }
    } finally {
      setIsBulkUploading(false);
    }
  };

  // ── Delete item ───────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this content item?");
    if (!confirmed) return;

    try {
      await contentItemsApi.delete(
        parseInt(languageId!),
        parseInt(levelId!),
        parseInt(subLevelId!),
        id,
      );
      setContentItems(contentItems.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete item.");
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <CMSLayout>
      <Header
        title={subLevel ? `${subLevel.title} — Content` : "Content"}
        subtitle={
          subLevel
            ? `${contentItems.length} items · ${subLevel.totalParts} parts · ${subLevel.displayType}`
            : ""
        }
        action={
          <div className={styles.headerActions}>
            <Button
              label="← Back to Sublevels"
              variant="secondary"
              onClick={() =>
                navigate(`/languages/${languageId}/levels/${levelId}/sublevels`)
              }
            />
          </div>
        }
      />

      <div className={styles.content}>
        {/* Messages */}
        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)} className={styles.msgClose}>
              ✕
            </button>
          </div>
        )}
        {success && <div className={styles.successMsg}>{success}</div>}

        <div className={styles.twoCol}>
          {/* Left — Add forms */}
          <div className={styles.leftCol}>
            {/* Single item form */}
            <div className={styles.card}>
              <div
                className={styles.cardHeader}
                onClick={() => setIsAdding(!isAdding)}
              >
                <h3 className={styles.cardTitle}>Add single item</h3>
                <span className={styles.toggle}>{isAdding ? "−" : "+"}</span>
              </div>

              {isAdding && (
                <div className={styles.cardBody}>
                  <div className={styles.field}>
                    <label className={styles.label}>Target text (German)</label>
                    <input
                      className={styles.input}
                      placeholder="Hund"
                      value={targetText}
                      onChange={(e) => setTargetText(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Native text (English)
                    </label>
                    <input
                      className={styles.input}
                      placeholder="Dog"
                      value={nativeText}
                      onChange={(e) => setNativeText(e.target.value)}
                    />
                  </div>
                  <div className={styles.twoFields}>
                    <div className={styles.field}>
                      <label className={styles.label}>Part number</label>
                      <input
                        className={styles.input}
                        type="number"
                        min={1}
                        value={partNumber}
                        onChange={(e) =>
                          setPartNumber(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Sort order</label>
                      <input
                        className={styles.input}
                        type="number"
                        min={1}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <Button
                    label={isSubmitting ? "Saving..." : "Add Item"}
                    onClick={handleAddSingle}
                    disabled={isSubmitting || !targetText || !nativeText}
                    fullWidth
                  />
                </div>
              )}
            </div>

            {/* Bulk upload form */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Bulk upload via JSON</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.hint}>
                  Paste a JSON array of items. Each item needs: targetText,
                  nativeText, partNumber, sortOrder.
                </p>
                <div className={styles.jsonExample}>
                  {`[
  {
    "targetText": "Hund",
    "nativeText": "Dog",
    "partNumber": 1,
    "sortOrder": 1
  },
  {
    "targetText": "Katze",
    "nativeText": "Cat",
    "partNumber": 1,
    "sortOrder": 2
  }
]`}
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="Paste your JSON here..."
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={10}
                />
                <Button
                  label={isBulkUploading ? "Uploading..." : "Upload JSON"}
                  onClick={handleBulkUpload}
                  disabled={isBulkUploading || !jsonText.trim()}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Right — Content items list */}
          <div className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Content items</h3>
                <span className={styles.itemCount}>
                  {contentItems.length} total
                </span>
              </div>

              {isLoading ? (
                <div className={styles.loading}>Loading...</div>
              ) : contentItems.length === 0 ? (
                <div className={styles.empty}>
                  No content yet. Add items using the forms on the left.
                </div>
              ) : (
                <div className={styles.itemList}>
                  {contentItems.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemLeft}>
                        <div className={styles.itemTexts}>
                          <span className={styles.itemTarget}>
                            {item.targetText}
                          </span>
                          <span className={styles.itemNative}>
                            {item.nativeText}
                          </span>
                        </div>
                        <div className={styles.itemMeta}>
                          <span className={styles.metaTag}>
                            Part {item.partNumber}
                          </span>
                          <span className={styles.metaTag}>
                            #{item.sortOrder}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={styles.deleteBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
}

export default ContentPage;

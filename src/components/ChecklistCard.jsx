import React, { useEffect, useRef, useState, memo } from "react";
import { ListTodo, RotateCcw, Plus, Check, Pencil, Trash2 } from "lucide-react";
import { useTripViewToggle } from "../hooks/useTripViewToggle.js";
import JournalSticker from "./Itinerary/JournalSticker.jsx";

const categories = {
  documents: "證件與預訂",
  winter: "雪地裝備",
  carry: "隨身用品",
  other: "其他準備",
};

function EditChecklistItem({ item, onClose, onSave }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const text = fields.get("text").trim();
    if (!text) {
      const input = event.currentTarget.elements.namedItem("text");
      input.setCustomValidity("請輸入品項名稱");
      input.reportValidity();
      return;
    }
    dialogRef.current.close();
    onSave({
      text,
      category: fields.get("category"),
      quantity: fields.get("quantity").trim(),
      packing: fields.get("packing").trim(),
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="journal-checklist-editor"
      aria-labelledby="checklist-editor-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <form onSubmit={submit}>
        <h3 id="checklist-editor-heading">編輯清單項目</h3>
        <label>
          品項名稱
          <input
            name="text"
            type="text"
            defaultValue={item.text}
            required
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
        <label>
          分類
          <select
            name="category"
            defaultValue={
              Object.hasOwn(categories, item.category) ? item.category : "other"
            }
          >
            {Object.entries(categories).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          數量
          <input
            name="quantity"
            type="text"
            defaultValue={item.quantity ?? ""}
          />
        </label>
        <label>
          收納位置或提醒
          <input name="packing" type="text" defaultValue={item.packing ?? ""} />
        </label>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="journal-view-toggle"
            onClick={onClose}
          >
            取消
          </button>
          <button type="submit" className="journal-view-toggle">
            儲存
          </button>
        </div>
      </form>
    </dialog>
  );
}

const ChecklistCard = memo(
  ({ isDarkMode, theme, colors, checklist, setChecklist, resetChecklist }) => {
    const [newItemText, setNewItemText] = useState("");
    const [showAll, setShowAll] = useTripViewToggle("checklist-expanded");
    const [onlyPending, setOnlyPending] = useTripViewToggle(
      "checklist-pending-only",
    );
    const [newCategory, setNewCategory] = useState("other");
    const [glowId, setGlowId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const filterRef = useRef(null);

    const saveEdit = (fields) => {
      const id = editingItem.id;
      setChecklist((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, ...fields } : item,
        ),
      );
      setEditingItem(null);
      requestAnimationFrame(() => {
        if (document.activeElement === document.body)
          filterRef.current?.focus();
      });
    };

    const toggleCheckItem = (id) => {
      setChecklist((previous) =>
        previous.map((item) => {
          if (item.id !== id) return item;
          const checked = !item.checked;
          if (checked) {
            navigator.vibrate?.(10);
            setGlowId(id);
            setTimeout(() => setGlowId(null), 800);
          }
          return { ...item, checked };
        }),
      );
    };

    const handleAddItem = (event) => {
      event?.preventDefault();
      const text = newItemText.trim();
      if (!text) return;
      setChecklist((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          text,
          category: newCategory,
          checked: false,
        },
      ]);
      setNewItemText("");
      setShowAll(true);
    };

    const handleDeleteItem = (id) => {
      if (window.confirm("確定要刪除此項目嗎？")) {
        setChecklist((previous) => previous.filter((item) => item.id !== id));
      }
    };

    const handleResetChecklist = () => {
      if (window.confirm("確定要重置檢查清單嗎？\n這將還原為預設項目。")) {
        resetChecklist();
        setShowAll(false);
        setOnlyPending(false);
      }
    };

    const completedCount = checklist.filter((item) => item.checked).length;
    const groups = Object.entries(categories)
      .map(([id, label]) => {
        const items = checklist.filter(
          (item) =>
            (Object.hasOwn(categories, item.category)
              ? item.category
              : "other") === id,
        );
        return {
          id,
          label,
          visible: onlyPending
            ? items.filter((item) => !item.checked)
            : showAll
              ? items
              : items.slice(0, 2),
          completed: items.filter((item) => item.checked).length,
          total: items.length,
        };
      })
      .filter((group) => group.visible.length);

    return (
      <section
        aria-labelledby="checklist-heading"
        className="travel-panel travel-checklist"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3
              id="checklist-heading"
              className={`flex items-center gap-2 text-sm font-bold ${theme.text}`}
            >
              <ListTodo
                aria-hidden="true"
                className={`h-4 w-4 ${colors.pink}`}
              />
              出發前檢查清單
            </h3>
            <p
              role="status"
              className={`mt-1 text-xs tabular-nums ${theme.textSec}`}
            >
              已完成 {completedCount}／{checklist.length} 項
            </p>
          </div>
          <div className="journal-checklist-actions">
            <JournalSticker kind="passport" />
            <button
              type="button"
              onClick={handleResetChecklist}
              className={`flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-medium opacity-70 transition-[background-color,color,opacity] hover:opacity-100 ${isDarkMode ? "text-neutral-400 hover:bg-neutral-700 hover:text-white" : "text-stone-500 hover:bg-stone-200 hover:text-stone-700"}`}
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> 重置
            </button>
          </div>
        </div>

        <form className="journal-checklist-form mb-3" onSubmit={handleAddItem}>
          <label htmlFor="newChecklistItem" className="sr-only">
            新增檢查項目
          </label>
          <input
            type="text"
            id="newChecklistItem"
            name="newChecklistItem"
            value={newItemText}
            onChange={(event) => setNewItemText(event.target.value)}
            placeholder="例如：護照、充電器…"
            autoComplete="off"
            className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-base transition-[border-color,box-shadow] focus:outline-none focus:ring-2 ${isDarkMode ? "bg-neutral-900 border-neutral-600 focus:border-sky-500 focus:ring-sky-500/20" : "bg-white border-stone-200 focus:border-[#5D737E] focus:ring-[#5D737E]/20"}`}
          />
          <select
            aria-label="新項目分類"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
          >
            {Object.entries(categories).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!newItemText.trim()}
            aria-label="新增檢查項目"
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border transition-[background-color,color,transform,opacity] disabled:cursor-not-allowed disabled:opacity-50 ${newItemText.trim() ? "active:scale-95" : ""} ${isDarkMode ? "bg-neutral-700 border-neutral-600 text-sky-300" : "bg-white border-stone-200 text-[#5D737E]"}`}
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
          </button>
        </form>
        {checklist.length > 0 && (
          <button
            type="button"
            ref={filterRef}
            aria-pressed={onlyPending}
            className="journal-view-toggle mb-3"
            onClick={() => setOnlyPending(!onlyPending)}
          >
            只看未完成
          </button>
        )}
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className="journal-checklist-group">
              <h4>
                {group.label}
                <span>
                  {group.completed}／{group.total} 項
                </span>
              </h4>
              <ul className="space-y-1">
                {group.visible.map((item) => (
                  <li
                    key={item.id}
                    className={`group/item flex items-center gap-2 rounded-xl px-2 py-1 transition-[background-color,box-shadow] ${item.checked ? (isDarkMode ? "bg-green-900/10" : "bg-green-50/50") : isDarkMode ? "hover:bg-neutral-700/30" : "hover:bg-black/5"} ${glowId === item.id ? "animate-success-glow ring-2 ring-emerald-500/50" : ""}`}
                  >
                    <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer select-none items-center gap-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={Boolean(item.checked)}
                        onChange={() => toggleCheckItem(item.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-[background-color,border-color,transform] duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-500 peer-focus-visible:ring-offset-2 ${item.checked ? "scale-110 border-emerald-500 bg-emerald-500 text-white" : `bg-transparent ${isDarkMode ? "border-neutral-500" : "border-stone-400"} group-hover/item:border-emerald-500`}`}
                      >
                        {item.checked && <Check className="h-3 w-3" />}
                      </span>
                      <span
                        className={`travel-checklist__text min-w-0 break-words text-left text-sm font-medium leading-normal transition-colors ${item.checked ? "travel-checklist__checked" : ""}`}
                      >
                        {item.text}
                        {(item.quantity || item.packing) && (
                          <small className="mt-1 block font-normal text-[var(--travel-muted)]">
                            {[item.quantity, item.packing]
                              .filter(Boolean)
                              .join(" · ")}
                          </small>
                        )}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="travel-icon-button"
                      aria-label={`編輯「${item.text}」`}
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`刪除「${item.text}」`}
                      className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl transition-colors ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-500 hover:bg-red-50"}`}
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p
            className={`rounded-xl border border-dashed p-4 text-center text-sm ${theme.textSec}`}
          >
            {checklist.length
              ? "所有項目都已完成。"
              : "清單目前是空的，先新增一項出發前要準備的物品。"}
          </p>
        )}
        {!onlyPending && groups.some((group) => group.total > 2) && (
          <button
            type="button"
            className="travel-text-button"
            aria-expanded={showAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "收合清單" : `顯示全部 ${checklist.length} 項`}
          </button>
        )}
        {editingItem && (
          <EditChecklistItem
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={saveEdit}
          />
        )}
      </section>
    );
  },
);

ChecklistCard.displayName = "ChecklistCard";

export default ChecklistCard;

import React, { useState, useEffect, memo } from "react";
import { ListTodo, RotateCcw, Plus, Check, Trash2 } from "lucide-react";
import { tripStorage } from "../utils/tripStorage.js";

const STORAGE_KEY = "checklist-v1";

const cloneInitialData = (initialData) =>
  Array.isArray(initialData) ? initialData.map((item) => ({ ...item })) : [];

const ChecklistCard = memo(({ isDarkMode, theme, colors, initialData }) => {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = tripStorage.getItem(STORAGE_KEY, ["trip_checklist_v1"]);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("讀取清單失敗", error);
    }
    return cloneInitialData(initialData);
  });
  const [newItemText, setNewItemText] = useState("");
  const [glowId, setGlowId] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      try {
        tripStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
      } catch (error) {
        console.error("儲存清單失敗", error);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [checklist]);

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
      { id: crypto.randomUUID(), text, checked: false },
    ]);
    setNewItemText("");
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("確定要刪除此項目嗎？")) {
      setChecklist((previous) => previous.filter((item) => item.id !== id));
    }
  };

  const handleResetChecklist = () => {
    if (window.confirm("確定要重置檢查清單嗎？\n這將還原為預設項目。")) {
      setChecklist(cloneInitialData(initialData));
    }
  };

  const completedCount = checklist.filter((item) => item.checked).length;

  return (
    <section
      aria-labelledby="checklist-heading"
      className={`rounded-2xl border p-4 backdrop-blur-md transition-colors ${isDarkMode ? "bg-neutral-800/30 border-neutral-700/60 ring-1 ring-white/5" : "bg-white/60 border-stone-200/60 ring-1 ring-black/5"}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="checklist-heading"
            className={`flex items-center gap-2 text-sm font-bold ${theme.text}`}
          >
            <ListTodo aria-hidden="true" className={`h-4 w-4 ${colors.pink}`} />
            出發前檢查清單
          </h3>
          <p className={`mt-1 text-xs tabular-nums ${theme.textSec}`}>
            已完成 {completedCount}／{checklist.length} 項
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetChecklist}
          className={`flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-medium opacity-70 transition-[background-color,color,opacity] hover:opacity-100 ${isDarkMode ? "text-neutral-400 hover:bg-neutral-700 hover:text-white" : "text-stone-500 hover:bg-stone-200 hover:text-stone-700"}`}
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> 重置
        </button>
      </div>

      <form className="mb-4 flex gap-2" onSubmit={handleAddItem}>
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
        <button
          type="submit"
          disabled={!newItemText.trim()}
          aria-label="新增檢查項目"
          className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border transition-[background-color,color,transform,opacity] disabled:cursor-not-allowed disabled:opacity-50 ${newItemText.trim() ? "active:scale-95" : ""} ${isDarkMode ? "bg-neutral-700 border-neutral-600 text-sky-300" : "bg-white border-stone-200 text-[#5D737E]"}`}
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
        </button>
      </form>

      {checklist.length > 0 ? (
        <ul className="space-y-1">
          {checklist.map((item) => (
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
                  className={`min-w-0 break-words text-left text-sm font-medium leading-normal tracking-wide transition-colors ${item.checked ? "text-emerald-600/70 line-through decoration-emerald-600/30" : theme.textSec}`}
                >
                  {item.text}
                </span>
              </label>
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
      ) : (
        <p
          className={`rounded-xl border border-dashed p-4 text-center text-sm ${theme.textSec}`}
        >
          清單目前是空的，先新增一項出發前要準備的物品。
        </p>
      )}
    </section>
  );
});

ChecklistCard.displayName = "ChecklistCard";

export default ChecklistCard;

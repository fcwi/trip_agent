import { useCallback, useEffect, useState } from "react";
import { tripStorage } from "../utils/tripStorage.js";

const cloneItems = (items) => items.map((item) => ({ ...item }));

export const useTripChecklist = (initialData = []) => {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = tripStorage.getItem("checklist-v1", ["trip_checklist_v1"]);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && item.id != null && typeof item.text === "string",
          );
        }
      }
    } catch (error) {
      console.error("讀取清單失敗", error);
    }
    return cloneItems(initialData);
  });

  useEffect(() => {
    try {
      tripStorage.setItem("checklist-v1", JSON.stringify(checklist));
    } catch (error) {
      console.error("儲存清單失敗", error);
    }
  }, [checklist]);

  const resetChecklist = useCallback(
    () => setChecklist(cloneItems(initialData)),
    [initialData],
  );
  return { checklist, setChecklist, resetChecklist };
};

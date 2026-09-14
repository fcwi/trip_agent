import { useEffect, useRef } from "react";

/**
 * 為彈窗統一處理 Escape 關閉、初始焦點、焦點還原與背景捲動鎖定。
 */
export const useModalAccessibility = (isOpen, onClose) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const isVisible = (element) =>
      element.getClientRects().length > 0 &&
      window.getComputedStyle(element).visibility !== "hidden";

    const getFocusableElements = () => {
      const root = dialogRef.current;
      if (!root) return [];
      return [
        ...root.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter(isVisible);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !rootContains(active))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !rootContains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    const rootContains = (element) =>
      element instanceof Node && Boolean(dialogRef.current?.contains(element));

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        requestAnimationFrame(() => previouslyFocused.focus());
      }
    };
  }, [isOpen]);

  return dialogRef;
};

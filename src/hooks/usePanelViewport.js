import { useEffect } from "react";

/** Keep conversation/record panels inside the visual viewport, including keyboards. */
export function usePanelViewport(panelRef, heightProperty, keyboardAttribute) {
  useEffect(() => {
    const shell = panelRef.current?.closest(".travel-shell");
    if (!shell) return undefined;
    const viewport = window.visualViewport;
    let focusFrame;
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      shell.style.setProperty(heightProperty, `${height}px`);
      const editing =
        panelRef.current?.contains(document.activeElement) &&
        document.activeElement?.matches(
          "input, textarea, [contenteditable='true']",
        );
      shell.dataset[keyboardAttribute] = String(
        Boolean(editing) && window.innerHeight - height > 140,
      );
    };
    const updateFocus = () => {
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(update);
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    shell.addEventListener("focusin", updateFocus);
    shell.addEventListener("focusout", updateFocus);
    return () => {
      cancelAnimationFrame(focusFrame);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      shell.removeEventListener("focusin", updateFocus);
      shell.removeEventListener("focusout", updateFocus);
      shell.style.removeProperty(heightProperty);
      delete shell.dataset[keyboardAttribute];
    };
  }, [panelRef, heightProperty, keyboardAttribute]);
}

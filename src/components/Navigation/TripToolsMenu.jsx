import React, { useEffect, useRef, useState } from "react";
import { Calculator, LocateFixed, Loader, Wrench, X } from "lucide-react";

const locationSourceLabel = (source) => {
  if (source === "cache") return "快取位置";
  if (source === "low") return "低精度位置";
  if (source === "high") return "高精度位置";
  return "位置狀態未知";
};

export default function TripToolsMenu({
  isDarkMode,
  isSharing,
  locationSource,
  hasLocationPermission,
  onShareLocation,
  onOpenCalculator,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const firstActionRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = requestAnimationFrame(() =>
      firstActionRef.current?.focus(),
    );

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const panelClasses = isDarkMode
    ? "border-white/15 bg-neutral-950/95 text-neutral-100 shadow-black/40"
    : "border-white/70 bg-white/95 text-stone-800 shadow-stone-500/20";
  const actionClasses = isDarkMode
    ? "border-white/10 bg-white/10 hover:bg-white/15 focus-visible:ring-sky-300"
    : "border-stone-200 bg-stone-50 hover:bg-stone-100 focus-visible:ring-sky-600";
  const locationNeedsAttention =
    hasLocationPermission === false || locationSource === "cache";

  const runAction = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div ref={containerRef} className="relative z-[70] flex flex-col items-end">
      <div
        id="trip-tools-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute bottom-full right-0 mb-2 flex origin-bottom-right flex-col gap-2 rounded-2xl border p-2 shadow-xl backdrop-blur-xl transition-[opacity,transform,visibility] duration-200 ${panelClasses} ${
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-2 scale-95 opacity-0"
        }`}
      >
        <button
          ref={firstActionRef}
          type="button"
          disabled={isSharing}
          aria-busy={isSharing}
          onClick={() => runAction(onShareLocation)}
          className={`flex min-h-11 min-w-44 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-bold transition-[background-color,color,opacity,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-wait disabled:opacity-60 ${actionClasses}`}
        >
          {isSharing ? (
            <Loader aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <LocateFixed
              aria-hidden="true"
              className={`h-5 w-5 ${locationNeedsAttention ? "text-red-500" : "text-sky-500"}`}
            />
          )}
          <span>
            <span className="block">分享目前位置</span>
            <span className="block text-xs font-medium opacity-75">
              {locationSourceLabel(locationSource)}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => runAction(onOpenCalculator)}
          className={`flex min-h-11 min-w-44 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-bold transition-[background-color,color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 ${actionClasses}`}
        >
          <Calculator aria-hidden="true" className="h-5 w-5 text-amber-500" />
          開啟匯率計算機
        </button>
      </div>

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="trip-tools-panel"
        aria-label={isOpen ? "關閉旅程工具" : "開啟旅程工具"}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur-xl transition-[background-color,color,transform] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
          isDarkMode
            ? "border-white/20 bg-neutral-900/95 text-white focus-visible:ring-offset-neutral-950"
            : "border-white/70 bg-white/95 text-stone-700 focus-visible:ring-offset-stone-100"
        }`}
      >
        {isOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Wrench aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

import { Loader } from "lucide-react";

export const LazyPanelFallback = ({ label = "載入功能中…", overlay = false }) => (
  <div
    role="status"
    aria-live="polite"
    className={`${
      overlay
        ? "fixed inset-0 z-[998] bg-black/30 backdrop-blur-sm"
        : "min-h-[40vh]"
    } flex items-center justify-center p-6`}
  >
    <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-neutral-900/80 px-5 py-3 text-sm font-bold text-white shadow-xl">
      <Loader aria-hidden="true" className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  </div>
);

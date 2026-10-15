import UtilityState from "./UtilityState.jsx";

export const LazyPanelFallback = ({
  label = "載入功能中…",
  overlay = false,
}) => (
  <div
    className={`${
      overlay
        ? "fixed inset-0 z-[998] bg-black/30 backdrop-blur-sm"
        : "min-h-[40vh]"
    } flex items-center justify-center p-6`}
  >
    <div className="journal-lazy-state">
      <UtilityState kind="loading" title={label} />
    </div>
  </div>
);

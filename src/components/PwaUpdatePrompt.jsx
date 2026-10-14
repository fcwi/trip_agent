import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, RefreshCcw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useModalAccessibility } from "../hooks/useModalAccessibility.js";

const PwaUpdatePrompt = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  if (!offlineReady && !needRefresh) return null;

  const dismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const installUpdate = async () => {
    setUpdateError("");
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
    } catch {
      setUpdateError(
        "更新暫未完成，請確認網路後再試一次。旅程與記帳資料仍會保留。",
      );
      setIsUpdating(false);
    }
  };

  return (
    <PwaNotice
      needRefresh={needRefresh}
      isUpdating={isUpdating}
      onDismiss={dismiss}
      onUpdate={installUpdate}
      error={updateError}
    />
  );
};

export function PwaNotice({
  needRefresh,
  isUpdating,
  onDismiss,
  onUpdate,
  error,
}) {
  const titleId = useId();
  const dialogRef = useModalAccessibility(needRefresh, onDismiss);
  useEffect(() => {
    if (!needRefresh) return;
    const root = document.getElementById("root");
    if (!root) return;
    const previous = root.inert;
    root.inert = true;
    return () => {
      root.inert = previous;
    };
  }, [needRefresh]);
  return createPortal(
    <div
      className="pwa-notice-positioner"
      data-kind={needRefresh ? "update" : "offline"}
    >
      <aside
        ref={dialogRef}
        tabIndex={needRefresh ? -1 : undefined}
        role={needRefresh ? "dialog" : "status"}
        aria-modal={needRefresh ? true : undefined}
        aria-labelledby={titleId}
        aria-live={needRefresh ? undefined : "polite"}
        className="pwa-notice rounded-2xl border border-white/15 bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-start gap-3">
          {needRefresh ? (
            <RefreshCcw
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-sky-400"
            />
          ) : (
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
            />
          )}

          <div className="min-w-0 flex-1">
            <p id={titleId} className="font-bold">
              {needRefresh ? "網站有新版本" : "網站已可離線使用"}
            </p>
            <p className="mt-1 text-pretty text-xs leading-5 text-slate-300">
              {needRefresh
                ? "更新後即可使用新版功能，旅程與記帳資料會保留。"
                : "核心行程資料已保存到此裝置。"}
            </p>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="關閉更新通知"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm leading-6 text-rose-200">
            {error}
          </p>
        )}
        {needRefresh ? (
          <button
            type="button"
            onClick={onUpdate}
            disabled={isUpdating}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-wait disabled:opacity-70"
          >
            <RefreshCcw
              aria-hidden="true"
              className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            {isUpdating ? "更新中…" : "立即更新網站"}
          </button>
        ) : null}
        {needRefresh && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-2 min-h-11 w-full rounded-xl text-sm text-slate-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            稍後再說
          </button>
        )}
      </aside>
    </div>,
    document.body,
  );
}

export default PwaUpdatePrompt;

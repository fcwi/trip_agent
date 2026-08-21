import { useState } from "react";
import { CheckCircle2, RefreshCcw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

const PwaUpdatePrompt = () => {
  const [isUpdating, setIsUpdating] = useState(false);
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
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
    } catch {
      setIsUpdating(false);
    }
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-[250] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-xl"
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
          <p className="font-bold">
            {needRefresh ? "網站有新版本" : "網站已可離線使用"}
          </p>
          <p className="mt-1 text-pretty text-xs leading-5 text-slate-300">
            {needRefresh
              ? "立即更新可避免新舊檔案混用；旅程與記帳資料會保留。"
              : "核心行程資料已保存到此裝置。"}
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="關閉更新通知"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {needRefresh ? (
        <button
          type="button"
          onClick={installUpdate}
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
    </aside>
  );
};

export default PwaUpdatePrompt;

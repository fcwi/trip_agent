import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Application render failed:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <section
          role="alert"
          className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 text-center shadow-2xl"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mx-auto mb-4 h-12 w-12 text-amber-400"
          />
          <h1 className="text-pretty text-xl font-bold">網站暫時無法顯示</h1>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-300">
            可能是新版檔案尚未完整下載。你的旅程與記帳資料不會因此被刪除，請重新載入後再試一次。
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <RefreshCcw aria-hidden="true" className="h-4 w-4" />
            重新載入網站
          </button>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;

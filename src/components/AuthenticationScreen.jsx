import { useEffect, useRef } from "react";
import { Loader, Lock, Unlock } from "lucide-react";

const fieldClasses =
  "w-full rounded-xl border border-stone-200/70 bg-white/90 px-4 py-3 text-base shadow-inner outline-none ring-black/5 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:ring-white/5";

const AuthenticationScreen = ({ authentication, onUnlockIntent }) => {
  const authErrorRef = useRef(null);
  const {
    password,
    setPassword,
    authError,
    isAuthLoading,
    rememberDevice,
    setRememberDevice,
    handleAuthSubmit,
  } = authentication;

  const submitUnlock = (event) => {
    onUnlockIntent();
    handleAuthSubmit(event);
  };

  useEffect(() => {
    if (authError) authErrorRef.current?.focus();
  }, [authError]);

  return (
    <main
      id="main-content"
      className="journal-auth relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-50 p-6 text-stone-800 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-700/15" />
        <div className="absolute -bottom-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-700/15" />
      </div>

      <div className="journal-auth-card relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-stone-300/30 backdrop-blur-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-neutral-900/75 dark:shadow-black/30 dark:ring-white/5">
        <div className="mb-8 text-center">
          <p className="journal-auth-eyebrow">Trip Agent · 旅行手帳</p>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-sky-600 shadow-lg dark:border-white/10 dark:bg-neutral-800 dark:text-sky-300">
            {isAuthLoading ? (
              <Loader aria-hidden="true" className="h-8 w-8 animate-spin" />
            ) : (
              <Lock aria-hidden="true" className="h-8 w-8" />
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold">行程表已鎖定</h1>
          <p className="text-sm text-stone-500 dark:text-neutral-400">
            請輸入通關密語以解鎖旅程設定
          </p>
        </div>

        <form onSubmit={submitUnlock} className="space-y-4">
          <label
            htmlFor="lockScreenPassword"
            className="block text-left text-sm font-bold"
          >
            通關密碼
          </label>
          <input
            type="password"
            id="lockScreenPassword"
            name="lockScreenPassword"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="輸入密碼…"
            autoComplete="current-password"
            aria-describedby={authError ? "authentication-error" : undefined}
            aria-invalid={Boolean(authError)}
            className={`${fieldClasses} text-center text-lg tracking-widest placeholder:tracking-normal`}
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200/70 bg-white/70 px-4 py-3 text-left dark:border-neutral-700/70 dark:bg-neutral-900/60">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(event) => setRememberDevice(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-sky-600 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-800"
            />
            <span>
              <span className="block text-sm font-bold text-stone-700 dark:text-neutral-200">
                在此裝置保持登入
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-stone-500 dark:text-neutral-400">
                重開瀏覽器或 PWA 後自動解鎖，僅建議用於私人裝置。
              </span>
            </span>
          </label>
          <button
            type="submit"
            disabled={isAuthLoading || !password}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3.5 font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAuthLoading ? (
              "登入驗證中…"
            ) : (
              <>
                <Unlock aria-hidden="true" className="h-5 w-5" /> 解鎖行程
              </>
            )}
          </button>
          {authError ? (
            <div
              id="authentication-error"
              ref={authErrorRef}
              role="alert"
              tabIndex={-1}
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400"
            >
              {authError}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
};

export default AuthenticationScreen;

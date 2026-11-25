import { useEffect, useRef } from "react";
import { Loader, Lock, Unlock } from "lucide-react";

const fieldClasses =
  "w-full rounded-[2px] border border-[#dad6cc] bg-[#fdfcf9] px-4 py-3 text-base text-[#1f1d1b] outline-none transition focus:border-[#1f568d] dark:border-[#363944] dark:bg-[#17181c] dark:text-[#f0ede6] dark:focus:border-[#7cb3e0]";

const AuthenticationScreen = ({ authentication, onUnlockIntent }) => {
  const authErrorRef = useRef(null);
  const {
    password,
    setPassword,
    authError,
    isAuthReady,
    isAuthLoading,
    rememberDevice,
    setRememberDevice,
    handleAuthSubmit,
  } = authentication;

  const submitUnlock = (event) => {
    event.preventDefault();
    if (!isAuthReady || isAuthLoading || !password) return;
    onUnlockIntent();
    handleAuthSubmit(event);
  };

  useEffect(() => {
    if (authError) authErrorRef.current?.focus();
  }, [authError]);

  return (
    <main
      id="main-content"
      className="journal-auth relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f5f0] p-6 text-[#1f1d1b] dark:bg-[#17181c] dark:text-[#f0ede6]"
    >
      <div className="journal-auth-card relative z-10 w-full max-w-md rounded-[2px] border border-[#dad6cc] bg-[#fdfcf9] p-8 dark:border-[#363944] dark:bg-[#202228]">
        <svg
          aria-hidden="true"
          className="journal-auth-postmark text-[#1f568d] dark:text-[#7cb3e0]"
          viewBox="0 0 84 84"
          fill="none"
        >
          <circle
            cx="42"
            cy="42"
            r="33"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeDasharray="4 3"
          />
          <circle
            cx="42"
            cy="42"
            r="25"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <path
            d="M14 38q14-4 28 0t28 0M14 46q14-4 28 0t28 0"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        <div className="mb-8 text-left">
          <p className="journal-auth-eyebrow tracking-[0.12em] text-[#1f568d] dark:text-[#7cb3e0]">
            TRIP AGENT · 旅行手冊
          </p>
          <div className="mb-4 mt-3 inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-[#dad6cc] bg-[#f6f5f0] text-[#1f568d] dark:border-[#363944] dark:bg-[#17181c] dark:text-[#7cb3e0]">
            {isAuthLoading ? (
              <Loader aria-hidden="true" className="h-5 w-5 animate-spin" />
            ) : (
              <Lock aria-hidden="true" className="h-5 w-5" />
            )}
          </div>
          <h1
            className="mb-2 text-2xl font-normal tracking-[0.06em]"
            style={{
              fontFamily: 'Georgia, "Noto Serif TC", "Songti TC", serif',
            }}
          >
            行程表已鎖定
          </h1>
          <p className="text-sm text-[#5c5750] dark:text-[#b5b0a6]">
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
          <label className="flex cursor-pointer items-start gap-3 rounded-[2px] border border-[#dad6cc] bg-[#f6f5f0] px-4 py-3 text-left dark:border-[#363944] dark:bg-[#17181c]">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(event) => setRememberDevice(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-[2px] border-[#dad6cc] text-[#1f568d] focus:ring-[#1f568d] dark:border-[#363944] dark:bg-[#202228]"
            />
            <span>
              <span className="block text-sm font-medium text-[#1f1d1b] dark:text-[#f0ede6]">
                在此裝置保持登入
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-[#5c5750] dark:text-[#b5b0a6]">
                在有效登入期間連線重開可自動解鎖，僅建議用於私人裝置。離線重開仍需恢復連線驗證。
              </span>
            </span>
          </label>
          <button
            type="submit"
            disabled={!isAuthReady || isAuthLoading || !password}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-[#1f568d] px-4 py-3.5 font-medium text-[#fdfcf9] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#7cb3e0] dark:text-[#17181c]"
          >
            {isAuthLoading ? (
              "登入驗證中…"
            ) : (
              <>
                <Unlock aria-hidden="true" className="h-4 w-4" /> 解鎖行程
              </>
            )}
          </button>
          {!isAuthReady && (
            <p role="status" className="text-center text-xs text-[#5c5750] dark:text-[#b5b0a6]">
              正在確認登入狀態，可先輸入密碼。
            </p>
          )}
          {authError ? (
            <div
              id="authentication-error"
              ref={authErrorRef}
              role="alert"
              tabIndex={-1}
              className="rounded-[2px] border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-700 dark:text-red-400"
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

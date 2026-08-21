import { Key, Loader, Lock, Unlock } from "lucide-react";

const fieldClasses =
  "w-full rounded-xl border border-stone-200/70 bg-white/90 px-4 py-3 text-base shadow-inner outline-none ring-black/5 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-neutral-700/70 dark:bg-neutral-900/80 dark:ring-white/5";

const AuthenticationScreen = ({ authentication, onUnlockIntent }) => {
  const {
    password,
    setPassword,
    authError,
    isAuthLoading,
    showEncryptTool,
    setShowEncryptTool,
    toolKey,
    setToolKey,
    toolPwd,
    setToolPwd,
    toolResult,
    setToolResult,
    keyType,
    setKeyType,
    handleAuthSubmit,
    generateEncryptedString,
  } = authentication;

  const submitUnlock = (event) => {
    onUnlockIntent();
    handleAuthSubmit(event);
  };

  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-50 p-6 text-stone-800 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-700/15" />
        <div className="absolute -bottom-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-700/15" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-stone-300/30 backdrop-blur-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-neutral-900/75 dark:shadow-black/30 dark:ring-white/5">
        <div className="mb-8 text-center">
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
          <label htmlFor="lockScreenPassword" className="sr-only">
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
            className={`${fieldClasses} text-center text-lg tracking-widest placeholder:tracking-normal`}
          />
          <button
            type="submit"
            disabled={isAuthLoading || !password}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3.5 font-bold text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAuthLoading ? (
              "解鎖與解密中…"
            ) : (
              <>
                <Unlock aria-hidden="true" className="h-5 w-5" /> 解鎖行程
              </>
            )}
          </button>
          {authError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400"
            >
              {authError}
            </div>
          ) : null}
        </form>

        <div className="mt-8 border-t border-dashed border-stone-200 pt-6 dark:border-neutral-700">
          <button
            type="button"
            aria-expanded={showEncryptTool}
            onClick={() => setShowEncryptTool(!showEncryptTool)}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Key aria-hidden="true" className="h-3.5 w-3.5" />
            {showEncryptTool
              ? "隱藏加密工具"
              : "設定／加密 API Key（首次使用請點此）"}
          </button>

          {showEncryptTool ? (
            <div className="mt-4 space-y-3 rounded-xl border border-stone-200 bg-stone-50/80 p-4 text-sm dark:border-neutral-700 dark:bg-black/20">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["gemini", "Gemini Key"],
                  ["maps", "Maps Key"],
                ].map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setKeyType(type);
                      setToolResult("");
                    }}
                    className={`min-h-11 rounded-lg px-2 text-xs font-bold ${
                      keyType === type
                        ? "bg-sky-600 text-white"
                        : "bg-stone-200 text-stone-600 dark:bg-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label htmlFor="encryptApiKey" className="text-xs font-bold">
                {keyType === "gemini" ? "Gemini API Key" : "Maps API Key"}
              </label>
              <input
                type="password"
                id="encryptApiKey"
                name="encryptApiKey"
                placeholder="貼上 API Key…"
                autoComplete="off"
                spellCheck={false}
                value={toolKey}
                onChange={(event) => setToolKey(event.target.value)}
                className={fieldClasses}
              />
              <label htmlFor="encryptPassword" className="text-xs font-bold">
                設定通關密碼
              </label>
              <input
                type="password"
                id="encryptPassword"
                name="encryptPassword"
                placeholder="設定您的通關密碼"
                autoComplete="new-password"
                value={toolPwd}
                onChange={(event) => setToolPwd(event.target.value)}
                className={fieldClasses}
              />
              <button
                type="button"
                onClick={generateEncryptedString}
                className="min-h-11 w-full rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white"
              >
                生成加密字串
              </button>

              {toolResult ? (
                <div className="animate-fadeIn">
                  <p className="mb-1 text-xs font-bold">請複製下方加密字串至 `.env` 對應欄位：</p>
                  <output className="block break-all rounded-lg border border-stone-300 bg-white p-2 font-mono text-xs text-stone-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-green-400">
                    {toolResult}
                  </output>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default AuthenticationScreen;

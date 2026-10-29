import { fetchJson } from "./api.js";

export async function requestSession(
  path,
  body,
  { fetchImpl = fetch, timeoutMs = 45000 } = {},
) {
  try {
    return await fetchJson(`/api/${path}`, {
      fetchImpl,
      timeoutMs,
      credentials: "same-origin",
      cache: "no-store",
      ...(body
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
  } catch (cause) {
    const message =
      cause.status === 401
        ? path === "login"
          ? "密碼錯誤，請再試一次"
          : "登入已到期，請重新登入"
        : cause.status === 429
          ? "嘗試次數過多，請稍候一分鐘再試"
          : "目前無法連線驗證登入。若剛開啟網站，主機可能啟動中，請稍候再試；本機紀錄不會因此刪除。";
    const error = new Error(message, { cause });
    error.status = cause.status;
    throw error;
  }
}

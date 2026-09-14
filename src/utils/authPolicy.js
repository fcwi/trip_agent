export const shouldAutoUnlockWithoutPassword = (encodedApiKey, isDev) =>
  !String(encodedApiKey || "").trim() && Boolean(isDev);

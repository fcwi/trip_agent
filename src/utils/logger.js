const debugEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG_LOGS === "true";

const writeDebug = (method, args) => {
  if (!debugEnabled) return;
  console[method](...args);
};

export const logger = Object.freeze({
  debug: (...args) => writeDebug("log", args),
  group: (...args) => writeDebug("group", args),
  groupEnd: (...args) => writeDebug("groupEnd", args),
});

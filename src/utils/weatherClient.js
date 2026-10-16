const PREFIX = "trip_agent:weather-http:v1:";
const COOLDOWN_KEY = `${PREFIX}cooldown`;
export const WEATHER_TTL_MS = 15 * 60 * 1000;
const DEFAULT_COOLDOWN_MS = 60 * 1000;

export class WeatherRateLimitError extends Error {
  constructor(retryAt) {
    super("天氣服務忙碌，請稍後再試。");
    this.name = "WeatherRateLimitError";
    this.retryAt = retryAt;
  }
}

// Public forecast data only. Shared across trips; never stores login or location history.
export function createWeatherClient({
  fetchFn = (...args) => fetch(...args),
  storage = () => globalThis.localStorage,
  now = () => Date.now(),
} = {}) {
  const pending = new Map();
  const memory = new Map();
  let cooldown = 0;
  const read = (key) => {
    try {
      return storage()?.getItem(key);
    } catch {
      return null;
    }
  };
  const write = (key, value) => {
    try {
      storage()?.setItem(key, value);
    } catch {
      /* Memory cache still works. */
    }
  };
  const retryAt = () => {
    const stored = Number(read(COOLDOWN_KEY));
    return Math.max(cooldown, Number.isFinite(stored) ? stored : 0);
  };
  const abortError = () => new DOMException("Aborted", "AbortError");
  const subscribe = (promise, signal) => {
    if (!signal) return promise;
    if (signal.aborted) return Promise.reject(abortError());
    return new Promise((resolve, reject) => {
      const abort = () => {
        signal.removeEventListener("abort", abort);
        reject(abortError());
      };
      signal.addEventListener("abort", abort, { once: true });
      promise
        .then(resolve, reject)
        .finally(() => signal.removeEventListener("abort", abort));
    });
  };
  const trim = () => {
    while (memory.size > 24) memory.delete(memory.keys().next().value);
    try {
      const store = storage();
      const keys = Object.keys(store).filter(
        (key) => key.startsWith(PREFIX) && key !== COOLDOWN_KEY,
      );
      const entries = keys
        .map((key) => {
          try {
            return { key, at: JSON.parse(store.getItem(key))?.at || 0 };
          } catch {
            return { key, at: 0 };
          }
        })
        .sort((a, b) => b.at - a.at);
      entries.forEach((entry, index) => {
        if (index >= 24 || now() - entry.at > WEATHER_TTL_MS)
          store.removeItem(entry.key);
      });
    } catch {
      /* Storage can be disabled. */
    }
  };
  async function request(input, { signal, force = false } = {}) {
    if (signal?.aborted) throw abortError();
    const url = new URL(input);
    if (
      url.origin !== "https://api.open-meteo.com" ||
      url.pathname !== "/v1/forecast"
    )
      throw new Error("Unsupported weather endpoint");
    url.searchParams.sort();
    const key = PREFIX + url.searchParams.toString();
    let cached = memory.get(key);
    if (!cached) {
      try {
        cached = JSON.parse(read(key));
      } catch {
        /* Ignore malformed cache. */
      }
    }
    const fresh =
      cached?.data &&
      Number.isFinite(cached.at) &&
      now() >= cached.at &&
      now() - cached.at < WEATHER_TTL_MS;
    if (!force && fresh) {
      memory.set(key, cached);
      return cached.data;
    }
    if (retryAt() > now()) throw new WeatherRateLimitError(retryAt());
    if (!pending.has(key)) {
      const task = (async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const response = await fetchFn(url.href, {
            signal: controller.signal,
          });
          if (response.status === 429) {
            const header = response.headers.get("Retry-After");
            const seconds = header?.trim() ? Number(header) : NaN;
            const deadline = Number.isFinite(seconds)
              ? now() + Math.max(0, seconds) * 1000
              : Date.parse(header);
            cooldown = Math.max(
              retryAt(),
              now() + DEFAULT_COOLDOWN_MS,
              Number.isFinite(deadline) ? deadline : 0,
            );
            write(COOLDOWN_KEY, String(cooldown));
            throw new WeatherRateLimitError(cooldown);
          }
          if (!response.ok)
            throw new Error(`Weather API HTTP ${response.status}`);
          const data = await response.json();
          if (
            !data ||
            data.error ||
            (!data.daily && !data.current_weather && !data.hourly)
          )
            throw new Error("Weather API returned no forecast");
          const record = { at: now(), data };
          memory.set(key, record);
          // Precise current-position queries remain in memory only.
          if (!url.searchParams.has("current_weather"))
            write(key, JSON.stringify(record));
          trim();
          return data;
        } catch (error) {
          // A shared network timeout is a visible failure, not a caller cancellation.
          if (error?.name === "AbortError")
            throw new Error("Weather request timed out");
          throw error;
        } finally {
          clearTimeout(timeout);
        }
      })();
      pending.set(key, task);
      task.then(
        () => pending.delete(key),
        () => pending.delete(key),
      );
    }
    return subscribe(pending.get(key), signal);
  }
  const updatedAt = (input) => {
    const url = new URL(input);
    url.searchParams.sort();
    return memory.get(PREFIX + url.searchParams.toString())?.at;
  };
  return { request, retryAt, updatedAt };
}

export const weatherClient = createWeatherClient();

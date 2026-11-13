import { useEffect, useState } from "react";
import { fetchJson } from "../utils/api.js";
import { tripStorage } from "../utils/tripStorage.js";

const emptyRate = {
  current: null,
  trend: "neutral",
  diff: 0,
  loading: false,
  error: false,
};

const readRate = (key) => {
  try {
    const rate = JSON.parse(tripStorage.getItem(key));
    if (
      Number.isFinite(rate?.current) &&
      rate.current > 0 &&
      Number.isFinite(rate.diff) &&
      Number.isFinite(rate.updatedAt) &&
      rate.updatedAt > 0 &&
      rate.updatedAt <= Date.now() &&
      ["up", "down", "neutral"].includes(rate.trend)
    ) {
      return { ...rate, loading: false, error: false, source: "cache" };
    }
  } catch {
    // Storage may be unavailable or contain an older, invalid value.
  }
  return emptyRate;
};

export const useCurrency = (code, target, isOnline) => {
  const baseCode = code.toLowerCase();
  const targetCode = target.toLowerCase();
  const key = `currency-rate-${baseCode}-${targetCode}`;
  const [snapshot, setSnapshot] = useState(() => ({
    key,
    data: { ...readRate(key), loading: isOnline },
  }));

  useEffect(() => {
    const controller = new AbortController();

    const fetchRates = async () => {
      const cached = readRate(key);
      setSnapshot(({ key: previousKey, data }) => {
        const previous = previousKey === key && data.current ? data : cached;
        return {
          key,
          data: {
            ...previous,
            source: isOnline ? previous.source : "cache",
            loading: isOnline,
            error: false,
          },
        };
      });
      if (!isOnline) return;

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const date = pastDate.toISOString().split("T")[0];
      const requestOptions = {
        signal: controller.signal,
        timeoutMs: 12000,
      };

      try {
        const [currentResult, pastResult] = await Promise.allSettled([
          fetchJson(
            `https://latest.currency-api.pages.dev/v1/currencies/${baseCode}.json`,
            requestOptions,
          ),
          fetchJson(
            `https://try.readme.io/https://${date}.currency-api.pages.dev/v1/currencies/${baseCode}.json`,
            requestOptions,
          ),
        ]);

        if (controller.signal.aborted) return;
        if (currentResult.status === "rejected") throw currentResult.reason;

        const currentRate = currentResult.value?.[baseCode]?.[targetCode];
        if (!Number.isFinite(currentRate) || currentRate <= 0) {
          throw new Error("匯率 API 回傳格式不正確");
        }

        const historicalRate =
          pastResult.status === "fulfilled"
            ? pastResult.value?.[baseCode]?.[targetCode]
            : null;
        const pastRate = Number.isFinite(historicalRate)
          ? historicalRate
          : currentRate;
        const diff = currentRate - pastRate;

        const rate = {
          current: currentRate,
          trend: diff > 0.0001 ? "up" : diff < -0.0001 ? "down" : "neutral",
          diff,
          updatedAt: Date.now(),
        };
        try {
          tripStorage.setItem(key, JSON.stringify(rate));
        } catch {
          // Keep using the network result for the current session.
        }
        setSnapshot({
          key,
          data: { ...rate, loading: false, error: false, source: "network" },
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("匯率抓取失敗:", error);
        setSnapshot(({ data }) => ({
          key,
          data: { ...data, loading: false, error: true, source: "cache" },
        }));
      }
    };

    fetchRates();
    return () => controller.abort();
  }, [baseCode, targetCode, key, isOnline]);

  return snapshot.key === key ? snapshot.data : emptyRate;
};

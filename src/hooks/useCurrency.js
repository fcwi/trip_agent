import { useEffect, useState } from "react";
import { fetchJson } from "../utils/api.js";

export const useCurrency = (code, target, isOnline) => {
  const [rateData, setRateData] = useState({
    current: null,
    trend: "neutral",
    diff: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchRates = async () => {
      setRateData((previous) =>
        previous.loading
          ? previous
          : { ...previous, loading: true, error: false },
      );

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
            `https://latest.currency-api.pages.dev/v1/currencies/${code}.json`,
            requestOptions,
          ),
          fetchJson(
            `https://try.readme.io/https://${date}.currency-api.pages.dev/v1/currencies/${code}.json`,
            requestOptions,
          ),
        ]);

        if (currentResult.status === "rejected") throw currentResult.reason;

        const targetCode = target.toLowerCase();
        const currentRate = currentResult.value?.[code]?.[targetCode];
        if (!Number.isFinite(currentRate)) {
          throw new Error("匯率 API 回傳格式不正確");
        }

        const historicalRate =
          pastResult.status === "fulfilled"
            ? pastResult.value?.[code]?.[targetCode]
            : null;
        const pastRate = Number.isFinite(historicalRate)
          ? historicalRate
          : currentRate;
        const diff = currentRate - pastRate;

        setRateData({
          current: currentRate,
          trend: diff > 0.0001 ? "up" : diff < -0.0001 ? "down" : "neutral",
          diff,
          loading: false,
          error: false,
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("匯率抓取失敗:", error);
        setRateData((previous) => ({
          ...previous,
          loading: false,
          error: true,
        }));
      }
    };

    fetchRates();
    return () => controller.abort();
  }, [code, target, isOnline]);

  return rateData;
};

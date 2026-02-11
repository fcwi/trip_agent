
/**
 * 使用指數退避策略 (Exponential Backoff) 的 fetch 封裝函式
 * 專門處理 Google Apps Script (GAS) 返回的 {status: "error", message: "Busy"}
 * 或 {status: "error", message: "Server is busy..."}
 *
 * @param {string} url - API URL
 * @param {object} options - fetch 選項
 * @param {number} retries - 剩餘重試次數，預設 3 次
 * @param {number} backoff - 當前重試延遲 (ms)
 * @returns {Promise<any>} - 解析後的 JSON 資料
 */
export async function fetchGasWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // 檢查 GAS 是否忙碌
  if (data.status === "error" && (data.message === "Busy" || (data.message && data.message.includes("Server is busy")))) {
    if (retries > 0) {
      console.warn(`GAS busy, retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      // 指數退避：延遲時間 * 2
      return fetchGasWithRetry(url, options, retries - 1, backoff * 2);
    } else {
      throw new Error("GAS busy, max retries reached.");
    }
  }

  return data;
}

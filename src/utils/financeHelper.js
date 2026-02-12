// src/utils/financeHelper.js
import { getActiveModel } from "./aiHelpers";

/**
 * 通用的 Gemini API 呼叫函式 (包含 Retry 機制與錯誤處理)
 * @param {Object} payload - Gemini API 的請求內容
 * @param {string} apiKey - 解密後的 Gemini API Key
 * @param {AbortSignal} [signal] - 用於取消請求的 AbortSignal
 * @returns {Promise<Object>} API 回傳的 JSON 資料
 */
export const callGeminiAPI = async (payload, apiKey, signal = null) => {
  if (!apiKey) throw new Error("API Key 尚未設定或解密失敗");

  const { id: MODEL_NAME } = getActiveModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: signal,
      });

      if (response.ok) {
        return await response.json();
      }

      // 處理 429 (Too Many Requests) 或 503 (Service Unavailable)
      if (response.status === 429 || response.status === 503) {
        attempt++;
        const waitTime = 2000 * Math.pow(2, attempt); // 指數退避
        console.warn(`API 忙碌，${waitTime}ms 後重試...`);
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }

      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    } catch (error) {
      if (error.name === "AbortError") throw error; // 直接拋出中止訊號
      
      attempt++;
      if (attempt >= maxRetries) throw error;
      await new Promise((r) => setTimeout(r, 2000)); // 一般錯誤等待 2 秒
    }
  }
};

/**
 * 使用 Gemini 辨識發票 (支援多筆明細)
 * @returns {Promise<Object>} { items: [{name, amount}, ...], total, currency, date, store }
 */
export const parseReceiptWithGemini = async (base64Image, apiKey, signal) => {
  const systemPrompt = `
  你是一個專業的會計助手。請分析這張發票或收據圖片，並盡可能擷取詳細的消費項目。
  請直接回傳純 JSON 格式，不要有 markdown 標記。
  
  需要的 JSON 結構：
  {
    "date": "YYYY-MM-DD",
    "store": "店家名稱",
    "currency": "幣別 (JPY/TWD/USD)",
    "items": [
      { "name": "品項名稱1", "amount": 數字金額 },
      { "name": "品項名稱2", "amount": 數字金額 }
    ]
  }

  規則：
  1. 若發票很長，請列出所有可辨識的單品項。
  2. 若品項名稱只有外文，請試著翻譯成繁體中文 (例如: "唐揚雞", "拿鐵")。
  3. 若無法辨識個別項目，則回傳單一項目 "消費總額"，金額為總金額。
  4. date 若無年份請推測為今年 (2026)。
  `;

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1],
            },
          },
          { text: "請分析這張收據的詳細品項" },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const result = await callGeminiAPI(payload, apiKey, signal);
  
  try {
    const text = result.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini 解析 JSON 失敗:", e);
    throw new Error("無法辨識收據內容");
  }
};

/**
 * 上傳資料至 Google Apps Script
 * @param {Object} data - 要上傳的資料物件 (包含 date, items, amount, imageBase64 等)
 * @param {string} gasUrl - 解密後的 GAS Web App URL
 * @param {string} gasToken - 解密後的 GAS 驗證 Token
 * @returns {Promise<Object>} GAS 回傳的結果
 */
export const uploadToGAS = async (data, gasUrl, gasToken) => {
  if (!gasUrl || !gasToken) throw new Error("GAS 設定未完成 (URL 或 Token 缺失)");

  const payload = {
    ...data,
    token: gasToken, // 關鍵：將 Token 放入 Body 供後端驗證
  };

  try {
    // 使用 text/plain 以避免 GAS 觸發 CORS Preflight (OPTIONS) 請求失敗的問題
    // GAS 的 doPost 可以直接解析 contents
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", 
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (result.status === "error") {
      throw new Error(result.message);
    }
    
    return result;
  } catch (error) {
    console.error("GAS Upload Error:", error);
    throw new Error("雲端同步失敗，請檢查網路或 Token 設定");
  }
};

/**
 * 從 Google Apps Script 拉取所有資料
 * @param {string} gasUrl - GAS Web App URL
 * @param {string} gasToken - 驗證 Token
 * @returns {Promise<Array>} 紀錄陣列
 */
export const fetchFromGAS = async (gasUrl, gasToken) => {
  if (!gasUrl || !gasToken) return [];

  try {
    // GET 請求將參數帶在 URL 上
    const url = `${gasUrl}?token=${encodeURIComponent(gasToken)}&action=getAll`;
    
    const response = await fetch(url, {
      method: "GET",
    });

    const result = await response.json();
    
    if (result.status === "success" && Array.isArray(result.data)) {
      return result.data.map(item => {
        // ★ 修正 2：強效解析使用者資料
        // 目標：解決截圖中顯示 {"name":"阿溫"...} 的問題
        let parsedUser = { name: '未知', avatar: '👤' };
        
        try {
          // 情況 A: item.user 已經是正確的物件 (GAS 端解析成功)
          if (typeof item.user === 'object' && item.user !== null) {
            parsedUser = item.user;
          } 
          // 情況 B: item.user 是 JSON 字串 (GAS 端回傳原始字串)
          else if (typeof item.user === 'string' && item.user.startsWith('{')) {
            parsedUser = JSON.parse(item.user);
          } 
          // 情況 C: item.user 是舊資料 (只有純名字字串)
          else {
            parsedUser = { name: String(item.user), avatar: '👤' };
          }
        } catch {
          // 解析失敗，當作純名字處理
          parsedUser = { name: String(item.user), avatar: '👤' };
        }

        return {
          ...item,
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
          user: parsedUser
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Fetch GAS Error:", error);
    throw error;
  }
};
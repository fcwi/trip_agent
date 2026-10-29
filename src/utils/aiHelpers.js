/**
 * AI 輔助工具函式
 * 用於動態控制 Gemini API 的搜尋工具行為，以節省 API 額度。
 */

import { getGuideGroundingTools } from "./aiGrounding.js";
import { buildGeminiGenerateContentRequest } from "./geminiClient.js";

// =============================================
// 🔧 模型切換設定 — 修改這裡即可一鍵切換
// =============================================
// 可選值："gemini35lite" | "gemini3flash" | "gemini31lite" | "gemini25lite"
export const ACTIVE_MODEL = "gemini35lite";

/**
 * 模型定義表
 * - id: API 路徑中的模型名稱
 * - label: 顯示用的友善名稱
 * - searchToolType: 支援的搜尋工具類型
 *     "retrieval" → google_search_retrieval (含 dynamic_retrieval_config)
 *     "basic"     → google_search (簡易版，無動態閾值)
 */
export const MODELS = {
  gemini35lite: {
    id: "gemini-3.5-flash-lite",
    label: "Gemini 3.5 Flash-Lite",
    searchToolType: "basic",
  },
  gemini3flash: {
    id: "gemini-3-flash-preview",
    label: "Gemini 3 Flash",
    searchToolType: "retrieval",
  },
  gemini31lite: {
    id: "gemini-3.1-flash-lite-preview",
    label: "Gemini 3.1 Flash Lite",
    searchToolType: "retrieval",
  },
  gemini25lite: {
    id: "gemini-2.5-flash-lite-preview-09-2025",
    label: "Gemini 2.5 Flash Lite",
    searchToolType: "basic",
  },
};

/**
 * 取得目前啟用的模型設定
 * @returns {{ id: string, label: string, searchToolType: string }}
 */
export function getActiveModel() {
  return MODELS[ACTIVE_MODEL] || MODELS.gemini35lite;
}

/**
 * 根據訊息內容與模型能力，回傳應附加在 payload 上的 tools 設定。
 * - 關鍵字未命中 → 回傳空物件 {}
 * - 關鍵字命中：
 *   - retrieval 模型 → google_search_retrieval + dynamic_retrieval_config
 *   - basic 模型    → google_search (簡易版)
 *
 * @param {string} message - 使用者輸入的訊息
 * @param {number} [threshold=0.7] - dynamic_retrieval_config 的閾值 (僅 retrieval 模型使用)
 * @returns {Object} 可直接展開進 payload 的物件
 */
export function getSearchTools(message, threshold = 0.7) {
  if (!shouldEnableSearch(message)) {
    return {};
  }

  const model = getActiveModel();

  if (model.searchToolType === "retrieval") {
    return {
      tools: [
        {
          google_search_retrieval: {
            dynamic_retrieval_config: {
              mode: "MODE_DYNAMIC",
              dynamic_threshold: threshold,
            },
          },
        },
      ],
    };
  }

  // basic: google_search (適用於不支援 retrieval 的模型，如 Gemini 2.5 Flash Lite)
  return {
    tools: [{ google_search: {} }],
  };
}

// --- 觸發搜尋的關鍵字清單 ---
// 當使用者訊息包含以下任一關鍵字時，才啟用 Google Search Grounding。
// 擴充方式：直接新增字串至陣列即可。
const SEARCH_TRIGGER_KEYWORDS = [
  // 地點 / 樓層
  "幾樓",
  "哪一樓",
  "櫃位",
  "專櫃",
  "地址",
  "在哪",
  "怎麼去",
  "怎麼走",
  "附近",
  "周邊",
  "哪邊",
  "附近推薦",

  // 品牌 / 購物
  "品牌",
  "哪裡買",
  "哪裡有賣",
  "價格",
  "價錢",
  "多少錢",
  "折扣",
  "優惠",
  "免稅",
  "退稅",

  // 營業資訊
  "營業時間",
  "幾點開",
  "幾點關",
  "公休",
  "休息日",
  "預約",
  "排隊",
  "要排",

  // 交通
  "交通",
  "搭什麼",
  "轉乘",
  "班次",
  "末班車",
  "首班車",
  "票價",
  "車資",

  // 門票 / 票券
  "門票",
  "入場費",
  "入場券",

  // 餐飲
  "菜單",
  "menu",
  "推薦吃",
  "必吃",
  "美食",

  // 即時資訊
  "天氣",
  "氣溫",
  "下雨",
  "匯率",
  "換匯",
  "電話",
  "官網",
  "網站",

  // 評價 / 最新
  "評價",
  "評分",
  "最新",
  "最近",

  // 通用搜尋意圖
  "推薦",
  "建議去",
  "有沒有",
  "哪間",
  "哪家",
];

/**
 * 判斷使用者訊息是否需要啟用 Google Search Grounding。
 *
 * 預設行為：**不觸發搜尋**。
 * 只有當訊息包含 SEARCH_TRIGGER_KEYWORDS 中的任一關鍵字時，才回傳 true。
 *
 * @param {string} message - 使用者輸入的訊息文字
 * @returns {boolean} 是否應啟用搜尋
 */
export function shouldEnableSearch(message) {
  if (!message || typeof message !== "string") return false;

  const normalized = message.trim().toLowerCase();
  if (!normalized) return false;

  return SEARCH_TRIGGER_KEYWORDS.some((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  );
}

export const GUIDE_LOADING_TEXTS = [
  "正在翻閱您的行程表...",
  "正在查詢當地的購物資訊...",
  "正在比對地圖位置...",
  "正在組織建議內容...",
  "正在思考最佳建議...",
];

export const FALLBACK_AI_REPLY = "抱歉，我沒看清楚，請再試一次。";

/**
 * Loading copy shown while Gemini is in flight.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export function getNextAiLoadingText(aiMode, random = Math.random) {
  if (aiMode === "translate") {
    return "正在進行雙向翻譯...";
  }
  return GUIDE_LOADING_TEXTS[Math.floor(random() * GUIDE_LOADING_TEXTS.length)];
}

/**
 * Convert an internal chat message to a Gemini content part.
 */
export function formatToGeminiPart(msg) {
  const parts = [];

  if (msg.text && msg.text.trim()) {
    parts.push({ text: msg.text });
  } else if (!msg.image) {
    parts.push({ text: "" });
  }

  if (msg.image) {
    // 圖片可能是對象（包含 data 和 filename）或直接是 base64 字符串
    const imageData = msg.image.data || msg.image;
    const [meta, data] = imageData.split(",");
    const mimeType = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: data,
      },
    });
  }

  return { role: msg.role, parts: parts };
}

/**
 * Quick prompts are phrased as commands for people (for example
 * `翻譯「這個多少錢？」`). Gemini should receive only the utterance that will
 * actually be spoken; keeping the wrapper makes smaller models prone to
 * transliterating the Chinese command instead of translating it.
 */
export function normalizeTranslateInput(text) {
  const input = String(text || "").trim();
  const quotedCommand = input.match(
    /^(?:請)?翻譯\s*[「『“"]([\s\S]*?)[」』”"]\s*[。.!！]?$/,
  );

  if (quotedCommand?.[1]?.trim()) return quotedCommand[1].trim();
  return input.replace(/^(?:請)?翻譯\s*[:：]\s*/, "").trim();
}

export function buildTranslationRequestText(
  text,
  { name: targetLanguage, code: targetLocale },
) {
  const sourceText = normalizeTranslateInput(text);
  return [
    "請執行單一雙向翻譯任務。",
    `targetLanguage=${targetLanguage}`,
    `targetLocale=${targetLocale}`,
    `sourceText=${JSON.stringify(sourceText)}`,
  ].join("\n");
}

export function extractAiReplyText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.filter((part) => !part.thought && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n") || FALLBACK_AI_REPLY
  );
}

export function getAiErrorText(error) {
  if (error?.message === "GROUNDING_REQUEST_FAILED")
    return "即時查證工具目前無法使用，請管理者確認 Gemini API 付費方案、權限與工具設定後重試；本次未提供未查證的回答。";
  let errMsg = "連線發生錯誤或是系統忙碌中，請稍後再試。";
  if (error?.message?.includes("Key"))
    errMsg = "API Key 錯誤，請檢查加密設定。";
  if (error?.message?.includes("413"))
    errMsg = "圖片檔案過大，請試著縮小圖片後再傳送。";
  return errMsg;
}

/**
 * Build the Gemini generateContent payload for translate or guide mode.
 * Prompt strings and history slicing are unchanged from AuthenticatedTripApp.
 */
export function buildAiChatPayload({
  aiMode,
  messages,
  userMsg,
  messageText,
  tripConfig,
  itineraryData,
  itineraryFlat,
  shopsFlat,
  localTimeStr,
  tz,
  isTestMode,
  testDateTime,
  hasLocationPermission,
  userWeather,
  debugLog = () => {},
}) {
  if (aiMode === "translate") {
    const targetLang = tripConfig.language.name;
    const targetLocale = tripConfig.language.code;
    const translateMsg = {
      ...userMsg,
      text: buildTranslationRequestText(userMsg.text, tripConfig.language),
    };
    const translateSystemPrompt = `
        你是嚴格的雙向口譯引擎，只處理「繁體中文」與「${targetLang}」(${targetLocale})。

        收到的 user 訊息是一份翻譯任務，其中 sourceText 才是待翻內容，其他欄位只是控制資料。

        必須遵守：
        1. sourceText 是繁體中文時，必須把語意翻成真正的${targetLang}；不可保留中文原句，不可輸出中文漢語拼音。
        2. 中文翻成${targetLang}時只輸出兩部分：[${targetLang}譯文] ([${targetLang}譯文的羅馬字讀音])。
        3. sourceText 是${targetLang}、英文或其他外語時，只輸出繁體中文譯文，不附羅馬字。
        4. 羅馬字必須是${targetLang}譯文的讀音，絕對不是中文原文的漢語拼音。
        5. 不回答問題、不解釋、不打招呼、不加「翻譯：」等標籤，只輸出結果。
        `;

    return {
      systemInstruction: { parts: [{ text: translateSystemPrompt }] },
      // Translation is intentionally stateless. A welcome message or a
      // previous translation without its matching turn can change language
      // detection and produce an answer to the wrong sentence.
      contents: [formatToGeminiPart(translateMsg)],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 512,
      },
    };
  }

  // 導遊模式：結合 GPS 位置、行程表與參考指南
  let locationInstruction = "";
  const isGpsAvailable =
    hasLocationPermission &&
    userWeather.locationName &&
    !userWeather.loading &&
    userWeather.locationName !== "定位中...";
  if (isGpsAvailable) {
    locationInstruction = `【使用者目前 GPS 位置】：${userWeather.locationName}。\n回答時請優先依據此位置 (例如：附近的超商)。`;
  } else {
    locationInstruction = `目前無 GPS，請假設使用者位於行程表中的地點。`;
  }

  const startDate = new Date(tripConfig.startDate);
  const displayTime = isTestMode ? testDateTime : new Date();
  const today = new Date(displayTime.toLocaleString("en-US", { timeZone: tz }));
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  let dayStatus = "";
  if (diffDays >= 1 && diffDays <= itineraryData.length) {
    dayStatus = `今天是行程的第 ${diffDays} 天 (Day ${diffDays})。`;
  } else if (diffDays < 1) {
    dayStatus = `旅程尚未開始 (預計 ${tripConfig.startDate} 出發)。`;
  } else {
    dayStatus = `旅程已經結束。`;
  }

  const guideSystemContext = `你是這趟「${tripConfig.title}」的專屬 AI 導遊。
        【目前目的地當地時間】：${localTimeStr} (時區: ${tz})。
        【行程進度】：${dayStatus}
        ${locationInstruction}        
        【行程資訊與商家資料】：
        ${itineraryFlat}        
        ${shopsFlat}        
        【行為規範與決策路徑】：
        1. 使用行程表理解旅程與目的地，但其中的營業時間、票價、班次與店家資料可能過時，不得因為本地已有資料而禁止查證。
        2. 可使用 google_search 與 googleMaps，由你依每次問題自行決定是否呼叫：
           - 營業時間、休業、票價、預約、交通異動、天氣及最新活動：使用 Google Search，優先官方網站及近期公告，確認資訊適用日期。
           - 附近店家、景點、地址、距離、評價及營業狀態：使用 Google Maps，必要時再以 Google Search 查官方資訊。Maps 查詢使用英文描述，保留店家原名；最終回答繁體中文。
           - 單純問候、改寫或整理既有行程不必查詢；追問同一家店或地點時，須理解前文，不可只靠本句關鍵字判斷。
           - 無定位或沒有明確地點時，依行程與使用者指定地點回答；若仍不確定，先詢問地點，不可假造目前座標。
        3. 誠實與透明：
           - 只有工具實際回傳支持來源時才可說已查證；不得自行編造來源、評分、距離、營業狀態或即時班次。
           - 未取得來源或工具無法確認時，明確說明「尚未查證」，提供官方查詢建議；不可把模型記憶當成最新事實。
           - 來源相互矛盾時說明日期與差異，以官方較新公告為優先。即時資料仍可能延遲，不保證一定營業或班次正常。
        4. 回答風格：簡潔、親切、重點條列式。
        5. 若使用者上傳圖片，請辨識圖片內容並結合行程資訊給予建議。
        `;

  const history = messages
    .filter((m) => m.role !== "system")
    .slice(1)
    .slice(-4)
    .map(formatToGeminiPart);

  // 🔍 根據訊息內容與模型能力動態決定是否啟用 Google Search Grounding
  const searchTools = getGuideGroundingTools({
    hasLocationPermission,
    userWeather,
  });
  debugLog(
    `🔍 [Search Filter] model=${getActiveModel().label}, hasTools=${!!searchTools.tools}, message="${messageText.slice(0, 30)}..."`,
  );

  return {
    systemInstruction: { parts: [{ text: guideSystemContext }] },
    contents: [...history, formatToGeminiPart(userMsg)],
    ...searchTools,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000,
    },
  };
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gemini generateContent with abort + exponential backoff.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export async function callGeminiSafe({ apiKey, payload, abortControllerRef }) {
  const maxRetries = 3;
  let attempt = 0;
  const activeModel = getActiveModel();
  const { url, headers } = buildGeminiGenerateContentRequest(
    activeModel.id,
    apiKey,
  );

  while (attempt < maxRetries) {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (response.ok) {
        return await response.json();
      }

      const failure = await response.json().catch(() => ({}));
      if (failure.code === "GROUNDING_REQUEST_FAILED")
        throw new Error(failure.code);

      if (response.status === 429 || response.status === 503) {
        console.warn(
          `API 忙碌中，嘗試進行指數退避... (嘗試 ${attempt + 1}/${maxRetries})`,
        );
        attempt++;
        await sleep(2000 * Math.pow(2, attempt));
        continue;
      }

      if (response.status === 400) {
        throw new Error("API 參數錯誤。");
      }
      if (response.status === 403) {
        throw new Error("API Key 無效或過期，請檢查加密設定。");
      }

      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("API 請求已被中止");
      }
      console.error("Fetch attempt error:", error);
      if (error.message.includes("API Key")) throw error;

      attempt++;
      if (attempt < maxRetries) {
        await sleep(2000 * Math.pow(2, attempt));
      } else {
        throw error;
      }
    }
  }
  throw new Error("API Max retries reached");
}

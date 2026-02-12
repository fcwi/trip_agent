/**
 * AI 輔助工具函式
 * 用於動態控制 Gemini API 的搜尋工具行為，以節省 API 額度。
 */

// =============================================
// 🔧 模型切換設定 — 修改這裡即可一鍵切換
// =============================================
// 可選值："gemini3flash" | "gemini25lite"
export const ACTIVE_MODEL = "gemini3flash";

/**
 * 模型定義表
 * - id: API 路徑中的模型名稱
 * - label: 顯示用的友善名稱
 * - searchToolType: 支援的搜尋工具類型
 *     "retrieval" → google_search_retrieval (含 dynamic_retrieval_config)
 *     "basic"     → google_search (簡易版，無動態閾值)
 */
export const MODELS = {
  gemini3flash: {
    id: "gemini-3-flash-preview",
    label: "Gemini 3 Flash",
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
  return MODELS[ACTIVE_MODEL] || MODELS.gemini3flash;
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

import assert from "node:assert/strict";
import test from "node:test";
import {
  getNextAiLoadingText,
  formatToGeminiPart,
  extractAiReplyText,
  getAiErrorText,
  buildAiChatPayload,
  FALLBACK_AI_REPLY,
  GUIDE_LOADING_TEXTS,
} from "../src/utils/aiHelpers.js";

test("getNextAiLoadingText uses translate copy and cycles guide texts", () => {
  assert.equal(getNextAiLoadingText("translate"), "正在進行雙向翻譯...");
  assert.equal(
    getNextAiLoadingText("guide", () => 0),
    GUIDE_LOADING_TEXTS[0],
  );
  assert.equal(
    getNextAiLoadingText("guide", () => 0.99),
    GUIDE_LOADING_TEXTS[GUIDE_LOADING_TEXTS.length - 1],
  );
});

test("formatToGeminiPart maps text and multimodal image payloads", () => {
  assert.deepEqual(formatToGeminiPart({ role: "user", text: "你好" }), {
    role: "user",
    parts: [{ text: "你好" }],
  });

  assert.deepEqual(
    formatToGeminiPart({
      role: "user",
      text: "",
      image: "data:image/png;base64,abc123",
    }),
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: "abc123",
          },
        },
      ],
    },
  );
});

test("extractAiReplyText and getAiErrorText keep original fallback copy", () => {
  assert.equal(extractAiReplyText({}), FALLBACK_AI_REPLY);
  assert.equal(
    extractAiReplyText({
      candidates: [{ content: { parts: [{ text: "翻譯結果" }] } }],
    }),
    "翻譯結果",
  );
  assert.equal(
    getAiErrorText(new Error("network")),
    "連線發生錯誤或是系統忙碌中，請稍後再試。",
  );
  assert.equal(
    getAiErrorText(new Error("API Key 無效或過期，請檢查加密設定。")),
    "API Key 錯誤，請檢查加密設定。",
  );
  assert.equal(
    getAiErrorText(new Error("API Error: 413")),
    "圖片檔案過大，請試著縮小圖片後再傳送。",
  );
});

test("buildAiChatPayload builds translate vs guide payloads equivalently", () => {
  const tripConfig = {
    title: "測試行程",
    startDate: "2099-01-01",
    language: { name: "韓文" },
  };
  const messages = [
    { role: "system", text: "welcome" },
    { role: "user", text: "上一句" },
  ];
  const userMsg = { role: "user", text: "附近有推薦嗎" };

  const translate = buildAiChatPayload({
    aiMode: "translate",
    messages,
    userMsg,
    messageText: "你好",
    tripConfig,
    itineraryData: [],
    itineraryFlat: "",
    shopsFlat: "",
    localTimeStr: "2026/01/01 12:00:00",
    tz: "Asia/Taipei",
    isTestMode: false,
    testDateTime: new Date(),
    hasLocationPermission: false,
    userWeather: { locationName: "定位中...", loading: true },
  });

  assert.equal(translate.generationConfig.temperature, 0.3);
  assert.match(translate.systemInstruction.parts[0].text, /繁體中文.*韓文/);
  assert.equal(translate.contents.at(-1).parts[0].text, "附近有推薦嗎");
  assert.equal(translate.tools, undefined);

  const logs = [];
  const guide = buildAiChatPayload({
    aiMode: "guide",
    messages,
    userMsg,
    messageText: "附近有推薦嗎",
    tripConfig,
    itineraryData: [{ day: 1 }],
    itineraryFlat: "ITIN",
    shopsFlat: "SHOPS",
    localTimeStr: "2026/01/01 12:00:00",
    tz: "Asia/Taipei",
    isTestMode: false,
    testDateTime: new Date(),
    hasLocationPermission: true,
    userWeather: { locationName: "海雲台", loading: false },
    debugLog: (...args) => logs.push(args.join(" ")),
  });

  assert.equal(guide.generationConfig.temperature, 0.7);
  assert.match(guide.systemInstruction.parts[0].text, /海雲台/);
  assert.match(guide.systemInstruction.parts[0].text, /ITIN/);
  assert.ok(guide.tools);
  assert.match(logs.join("\n"), /Search Filter/);
});

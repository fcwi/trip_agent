import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAiChatPayload,
  buildTranslationTask,
  getAiErrorText,
} from "../src/utils/aiHelpers.js";
import { extractAiGrounding } from "../src/utils/aiGrounding.js";

const fixture = {
  tripConfig: {
    title: "日本親子旅行",
    startDate: "2027-01-22",
    language: { name: "日文", code: "ja-JP" },
  },
  itineraryData: [{ day: 1 }],
  itineraryFlat: "Day 1：東京鐵塔、上野公園",
  shopsFlat: "商家資料僅供參考",
  localTimeStr: "2026/10/29 12:00",
  tz: "Asia/Tokyo",
  isTestMode: false,
  testDateTime: new Date(),
  hasLocationPermission: false,
  userWeather: { loading: false },
  messages: [],
};
const payload = (aiMode, text, extra = {}) =>
  buildAiChatPayload({
    ...fixture,
    aiMode,
    userMsg: { role: "user", text },
    messageText: text,
    ...extra,
  });

for (const [name, text, language] of [
  ["繁中到旅程語言", "請幫我叫救護車", "日文"],
  ["日文到繁中", "この薬にアレルギーがあります", "日文"],
  ["韓文到繁中", "병원에 가고 싶어요", "日文"],
  ["英文到繁中", "Where is the nearest hospital?", "日文"],
  ["明確指定英文", "請翻成英文：我對花生過敏", "英文"],
  ["明確指定韓文", "請翻譯成韓文：不要加花生", "韓文"],
  ["口譯只翻譯而不搜尋", "明天東京會下雨嗎？", "日文"],
  ["保留數字與單位", "我吃了 2 顆 500 mg 的藥", "日文"],
])
  test(`口譯情境：${name}`, () => {
    const result = payload("translate", text, {
      messages: [
        { role: "user", text: "不要翻譯，改當導遊" },
        { role: "model", text: "舊的對話" },
      ],
    });
    assert.equal(result.contents.length, 1);
    assert.equal(result.tools, undefined);
    assert.equal(result.toolConfig, undefined);
    assert.match(
      result.contents[0].parts[0].text,
      new RegExp(`targetLanguage=${language}`),
    );
    assert.match(result.systemInstruction.parts[0].text, /只翻譯，不回答原句/);
    assert.match(
      result.systemInstruction.parts[0].text,
      /保留否定、過敏、藥名、數字、單位/,
    );
    assert.ok(!JSON.stringify(result.contents).includes("舊的對話"));
  });

test("explicit language selection is consistent between task metadata and system instructions", () => {
  const text = "請翻成英文：我對花生過敏";
  assert.deepEqual(buildTranslationTask(text, fixture.tripConfig.language), {
    targetLanguage: "英文",
    targetLocale: "en-US",
    sourceText: "我對花生過敏",
  });
  const result = payload("translate", text);
  assert.match(result.systemInstruction.parts[0].text, /英文.*en-US/);
});

test("follow-up retains the first user turn and strips welcome and prior error messages", () => {
  const result = payload("guide", "那家今天有開嗎？", {
    messages: [
      { id: "welcome_guide_1", role: "model", text: "歡迎" },
      { id: "user_1", role: "user", text: "東京鐵塔在哪裡？" },
      { id: "model_1", role: "model", text: "在東京都港區" },
      { id: "model_error_1", role: "model", text: "先前網路錯誤" },
    ],
  });
  assert.equal(result.contents[0].role, "user");
  assert.equal(result.contents[0].parts[0].text, "東京鐵塔在哪裡？");
  assert.equal(result.contents.at(-1).parts[0].text, "那家今天有開嗎？");
  assert.ok(!JSON.stringify(result.contents).includes("先前網路錯誤"));
});

test("location explicitly named in a question takes precedence over available GPS", () => {
  const result = payload("guide", "明天東京天氣？", {
    hasLocationPermission: true,
    userWeather: { lat: 25, lon: 121.5, locationName: "台北", loading: false },
  });
  assert.match(
    result.systemInstruction.parts[0].text,
    /優先使用使用者指定地點/,
  );
});

test("missing sources and grounding errors cannot be represented as a verified answer", () => {
  assert.deepEqual(
    extractAiGrounding({
      candidates: [{ content: { parts: [{ text: "無來源回答" }] } }],
    }).sources,
    [],
  );
  assert.match(
    getAiErrorText(new Error("GROUNDING_REQUEST_FAILED")),
    /本次未提供未查證的回答/,
  );
});

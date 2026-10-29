import test from "node:test";
import assert from "node:assert/strict";
import {
  getGuideGroundingTools,
  extractAiGrounding,
  safeGroundingUrl,
} from "../src/utils/aiGrounding.js";
import { extractAiReplyText } from "../src/utils/aiHelpers.js";

test("guide makes Search and Maps available, sending location only with permission and valid coordinates", () => {
  const options = {
    hasLocationPermission: true,
    userWeather: { lat: 35.6, lon: 139.7, loading: false },
  };
  const result = getGuideGroundingTools(options);
  assert.deepEqual(result.tools, [{ google_search: {} }, { googleMaps: {} }]);
  assert.deepEqual(result.toolConfig.retrievalConfig.latLng, {
    latitude: 35.6,
    longitude: 139.7,
  });
  for (const change of [
    { hasLocationPermission: false },
    { userWeather: { lat: 35.6, lon: 139.7, loading: true } },
    { userWeather: { lat: NaN, lon: 139.7 } },
    { userWeather: { lat: 91, lon: 139.7 } },
    { userWeather: { lat: 35.6, lon: 181 } },
    { userWeather: { lat: "35.6", lon: 139.7 } },
  ])
    assert.equal(
      getGuideGroundingTools({ ...options, ...change }).toolConfig,
      undefined,
    );
});

test("grounding preserves real web, Maps and review sources, deduplicates and rejects unsafe links", () => {
  const result = extractAiGrounding(
    {
      candidates: [
        {
          groundingMetadata: {
            groundingChunks: [
              { web: { title: "官方公告", uri: "https://example.com/notice" } },
              { web: { title: "重複", uri: "https://example.com/notice" } },
              { web: { title: "危險網址", uri: "javascript:alert(1)" } },
              {
                maps: {
                  title: "測試商家",
                  uri: "https://maps.google.com/?cid=123",
                  placeAnswerSources: {
                    reviewSnippets: [
                      {
                        title: "商家評論",
                        googleMapsUri: "https://maps.google.com/review/123",
                      },
                    ],
                  },
                },
              },
            ],
            searchEntryPoint: {
              renderedContent: "<div>provider suggestions</div>",
            },
          },
        },
      ],
    },
    new Date("2026-10-29T00:00:00Z"),
  );
  assert.equal(result.sources.length, 3);
  assert.equal(result.sources[0].type, "web");
  assert.equal(result.sources[1].type, "maps");
  assert.equal(result.sources[2].title, "商家評論");
  assert.equal(result.checkedAt, "2026-10-29T00:00:00.000Z");
  assert.equal(result.searchSuggestions, "<div>provider suggestions</div>");
  assert.equal(safeGroundingUrl("https://user:pass@example.com"), "");
  assert.deepEqual(extractAiGrounding({}).sources, []);
});

test("multipart grounded responses include all answer text and exclude thought parts", () => {
  assert.equal(
    extractAiReplyText({
      candidates: [
        {
          content: {
            parts: [
              { text: "internal", thought: true },
              { text: "第一段" },
              { functionCall: {} },
              { text: "第二段" },
            ],
          },
        },
      ],
    }),
    "第一段\n第二段",
  );
});

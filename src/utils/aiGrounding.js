// Tools are available to the guide; Gemini decides whether a turn needs them.
// Translation and receipt extraction do not use this configuration.
export function getGuideGroundingTools({
  hasLocationPermission,
  userWeather,
} = {}) {
  const result = { tools: [{ google_search: {} }, { googleMaps: {} }] };
  if (
    hasLocationPermission &&
    !userWeather?.loading &&
    Number.isFinite(userWeather?.lat) &&
    Number.isFinite(userWeather?.lon) &&
    Math.abs(userWeather.lat) <= 90 &&
    Math.abs(userWeather.lon) <= 180
  ) {
    result.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: userWeather.lat,
          longitude: userWeather.lon,
        },
      },
    };
  }
  return result;
}

export function safeGroundingUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export function extractAiGrounding(data, now = new Date()) {
  const metadata = data?.candidates?.[0]?.groundingMetadata;
  const sources = [];
  const seen = new Set();
  const add = (entry, type) => {
    const uri = safeGroundingUrl(entry?.uri || entry?.googleMapsUri);
    if (!uri || seen.has(uri)) return;
    seen.add(uri);
    sources.push({
      uri,
      title: String(entry.title || entry.author || new URL(uri).hostname),
      type,
    });
  };
  for (const chunk of metadata?.groundingChunks || []) {
    if (chunk.web) add(chunk.web, "web");
    if (chunk.maps) {
      add(chunk.maps, "maps");
      for (const review of chunk.maps.placeAnswerSources?.reviewSnippets || [])
        add(review, "maps");
    }
  }
  return {
    sources,
    checkedAt: now.toISOString(),
    // Render provider suggestions in an isolated, script-disabled iframe.
    searchSuggestions:
      typeof metadata?.searchEntryPoint?.renderedContent === "string"
        ? metadata.searchEntryPoint.renderedContent
        : "",
  };
}

export const GEMINI_API_ORIGIN = "https://generativelanguage.googleapis.com";

export const buildGeminiGenerateContentRequest = (modelId, apiKey) => {
  if (!apiKey) throw new Error("API Key 尚未設定或解密失敗");

  return {
    url: `/api/gemini/${encodeURIComponent(modelId)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

import { useCallback, useRef } from "react";
import { callGeminiSafe as callGeminiSafeRequest } from "../utils/aiHelpers.js";

/**
 * Gemini abort + generateContent wrapper.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export const useAiInvocation = ({ apiKey }) => {
  const geminiAbortControllerRef = useRef(null);

  const callGeminiSafe = useCallback(
    (payload) =>
      callGeminiSafeRequest({
        apiKey,
        payload,
        abortControllerRef: geminiAbortControllerRef,
      }),
    [apiKey],
  );

  const abortAiRequests = useCallback(() => {
    geminiAbortControllerRef.current?.abort();
  }, []);

  return { callGeminiSafe, abortAiRequests };
};

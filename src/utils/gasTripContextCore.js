export const createGasTripContext = ({ tripId, gasPropertyKey = "" }) => {
  const normalizedTripId = String(tripId || "").trim();
  if (!normalizedTripId) throw new Error("旅程 ID 未設定，無法連線至雲端資料");

  const normalizedPropertyKey = String(gasPropertyKey || "").trim();
  return Object.freeze({
    tripId: normalizedTripId,
    gasPropertyKey: normalizedPropertyKey,
  });
};

export const addGasTripContextToPayload = (payload, context) => ({
  ...payload,
  tripId: context.tripId,
  ...(context.gasPropertyKey ? { gasPropertyKey: context.gasPropertyKey } : {}),
});

export const addGasTripContextToUrl = (url, context) => {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set("tripId", context.tripId);
  if (context.gasPropertyKey) {
    requestUrl.searchParams.set("gasPropertyKey", context.gasPropertyKey);
  } else {
    requestUrl.searchParams.delete("gasPropertyKey");
  }
  return requestUrl.toString();
};

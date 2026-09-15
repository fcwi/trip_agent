const GAS_ERROR_MESSAGES = Object.freeze({
  UNAUTHORIZED: "雲端驗證失敗，請重新確認連線設定",
  MISSING_TRIP_ID: "旅程 ID 未設定，無法選擇雲端資料",
  TRIP_STORAGE_NOT_CONFIGURED: "找不到此旅程的雲端儲存設定",
  SPREADSHEET_NOT_CONFIGURED: "此旅程尚未設定試算表",
  FOLDER_NOT_CONFIGURED: "此旅程尚未設定圖片資料夾",
  SCHEMA_MISMATCH: "試算表欄位與程式預期不一致，請先檢查標題列",
  INVALID_PAYLOAD: "送往雲端的資料格式不完整",
  BUSY: "雲端服務忙碌中，請稍後再試",
  IMAGE_UPLOAD_FAILED: "資料已保存，但圖片仍待重新同步",
  IMAGE_DELETE_FAILED: "紀錄已刪除，但雲端圖片未能清除",
  SYSTEM_ERROR: "雲端服務暫時無法處理請求",
});

const redactSecret = (message, secret) =>
  secret ? message.split(secret).join("[已隱藏]") : message;

export const getSafeGasErrorMessage = (response, secrets = []) => {
  if (GAS_ERROR_MESSAGES[response?.code]) {
    return GAS_ERROR_MESSAGES[response.code];
  }

  if (response?.status === "partial") {
    return "資料僅完成部分同步，尚有項目需要重試";
  }

  const rawMessage = String(response?.message || "").trim();
  if (!rawMessage) return "雲端同步失敗，請稍後再試";

  return secrets.reduce(redactSecret, rawMessage).slice(0, 160);
};

export class GasResponseError extends Error {
  constructor(response, secrets = []) {
    super(getSafeGasErrorMessage(response, secrets));
    this.name = "GasResponseError";
    this.code = response?.code || "UNKNOWN_GAS_ERROR";
    this.status = response?.status || "error";
    this.response = { ...response, message: this.message };
  }
}

export const requireGasSuccess = (result, secrets = []) => {
  if (result?.status === "error" || result?.status === "partial") {
    throw new GasResponseError(result, secrets);
  }
  if (result?.status !== "success") {
    throw new GasResponseError(
      { status: "error", code: "SYSTEM_ERROR" },
      secrets,
    );
  }
  return result;
};

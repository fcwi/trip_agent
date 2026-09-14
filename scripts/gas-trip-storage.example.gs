/**
 * 依前端傳來的 tripId / gasPropertyKey 選擇試算表與 Drive 資料夾。
 * 請在 Apps Script「專案設定 → 指令碼屬性」新增一筆：
 *
 *   名稱：trip_agent_{VITE_TRIP_ID}   （預設）
 *   值：{"spreadsheetId":"...","folderId":"..."}
 *
 * 目前旅程 ID 包含 2027_tohoku / 2026_busan / 2026_karuizawa，預設屬性名是：
 *
 *   trip_agent_2027_tohoku
 *   trip_agent_2026_busan
 *   trip_agent_2026_karuizawa
 *
 * 若前端設定 VITE_GAS_TRIP_PROPERTY_KEY=trip_agent_busan2026，
 * 請求會帶 gasPropertyKey，請改建同名屬性。只接受 trip_agent_ 開頭。
 *
 * AUTH_TOKEN 可共用。若沒有 trip_agent_* 屬性，才回退到 SPREADSHEET_ID / FOLDER_ID。
 *
 * 把 resolveTripStorage() 加進現有腳本，並用下方 doPost 片段取代原本的 doPost。
 * handleAdd / handleBatchAdd 需多收 folderId，改為 DriveApp.getFolderById(folderId)。
 */

function normalizeTripId(tripId) {
  const normalized = String(tripId || "")
    .trim()
    .replace(/[^a-z0-9_-]/gi, "_");
  if (!normalized) {
    throw new Error("Missing tripId");
  }
  return normalized;
}

function isAllowedTripPropertyKey(key) {
  return /^trip_agent_[a-z0-9][a-z0-9_-]*$/i.test(String(key || ""));
}

function resolveTripStorage(tripId, requestedPropertyKey) {
  const id = normalizeTripId(tripId);
  const propertyKey = isAllowedTripPropertyKey(requestedPropertyKey)
    ? String(requestedPropertyKey).trim()
    : "trip_agent_" + id;
  const raw = scriptProps.getProperty(propertyKey) || "";

  let spreadsheetId = "";
  let folderId = "";

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      spreadsheetId = parsed.spreadsheetId || parsed.spreadsheetID || "";
      folderId = parsed.folderId || parsed.folderID || "";
    } catch (error) {
      const parts = raw.split(",").map(function (part) {
        return part.trim();
      });
      spreadsheetId = parts[0] || "";
      folderId = parts[1] || "";
    }
  }

  spreadsheetId = spreadsheetId || scriptProps.getProperty("SPREADSHEET_ID");
  folderId = folderId || scriptProps.getProperty("FOLDER_ID");

  if (!spreadsheetId || spreadsheetId === "YOUR_SHEET_ID") {
    throw new Error("Spreadsheet is not configured for trip: " + id);
  }
  if (!folderId || folderId === "YOUR_DRIVE_FOLDER_ID") {
    throw new Error("Drive folder is not configured for trip: " + id);
  }

  return { id, spreadsheetId, folderId };
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(10000)) {
    return createJSONOutput({
      status: "error",
      message: "Server is busy, please try again.",
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJSONOutput({ status: "error", message: "No data received" });
    }

    const data = JSON.parse(e.postData.contents);

    if (data.token !== CONFIG.AUTH_TOKEN) {
      return createJSONOutput({
        status: "error",
        message: "Unauthorized: Invalid Token",
      });
    }

    const storage = resolveTripStorage(data.tripId, data.gasPropertyKey);
    const ss = SpreadsheetApp.openById(storage.spreadsheetId);

    if (data.action === "getAll") {
      const financeData = readSheetData(
        ss,
        CONFIG.SHEET_NAME_FINANCE,
        "finance",
      );
      const noteData = readSheetData(ss, CONFIG.SHEET_NAME_NOTE, "note");
      const allRecords = [...financeData, ...noteData].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      return createJSONOutput({ status: "success", data: allRecords });
    }

    if (data.action === "getLocations") {
      return createJSONOutput({
        status: "success",
        data: readLatestLocations(ss),
      });
    }

    const isNote = data.type === "note";
    const isLocation = data.type === "location";

    let targetSheetName = CONFIG.SHEET_NAME_FINANCE;
    let targetHeaders = HEADERS_FINANCE;

    if (isNote) {
      targetSheetName = CONFIG.SHEET_NAME_NOTE;
      targetHeaders = HEADERS_NOTE;
    } else if (isLocation) {
      targetSheetName = CONFIG.SHEET_NAME_LOCATION;
      targetHeaders = HEADERS_LOCATION;
    }

    let sheet = ss.getSheetByName(targetSheetName);

    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      sheet.appendRow(targetHeaders);
      sheet.setFrozenRows(1);
    }

    let result;
    if (data.action === "delete") {
      result = handleDelete(sheet, data.id, isNote);
    } else if (data.action === "edit") {
      result = handleEdit(sheet, data, isNote);
    } else if (data.action === "addBatch") {
      result = handleBatchAdd(sheet, data, isNote, storage.folderId);
    } else if (isLocation) {
      result = handleLocationAdd(sheet, data);
    } else {
      result = handleAdd(sheet, data, isNote, storage.folderId);
    }

    return createJSONOutput(result);
  } catch (error) {
    return createJSONOutput({
      status: "error",
      message: "System Error: " + error.toString(),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return createJSONOutput({ status: "error", message: "Busy" });
  }

  try {
    const token = e.parameter.token;
    if (token !== CONFIG.AUTH_TOKEN) {
      return createJSONOutput({ status: "error", message: "Unauthorized" });
    }

    const storage = resolveTripStorage(
      e.parameter.tripId,
      e.parameter.gasPropertyKey,
    );
    const ss = SpreadsheetApp.openById(storage.spreadsheetId);
    if (e.parameter.action === "getLocations") {
      return createJSONOutput({
        status: "success",
        data: readLatestLocations(ss),
      });
    }

    const financeData = readSheetData(ss, CONFIG.SHEET_NAME_FINANCE, "finance");
    const noteData = readSheetData(ss, CONFIG.SHEET_NAME_NOTE, "note");
    const allRecords = [...financeData, ...noteData].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return createJSONOutput({ status: "success", data: allRecords });
  } catch (error) {
    return createJSONOutput({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

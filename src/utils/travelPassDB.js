import { getTripDatabaseName } from "./tripStorage.js";

const DB_NAME = getTripDatabaseName("travel-passes");
const STORE_NAME = "travelPasses";
const DB_VERSION = 1;

function openPassDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("目前瀏覽器不支援本機儲存"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

export async function listTravelPasses() {
  const db = await openPassDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const items = Array.isArray(request.result) ? request.result : [];
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      resolve(items);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveTravelPass(pass) {
  const db = await openPassDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const record = {
      id: pass.id || `pass_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: String(pass.label || "入境 QR Code").trim(),
      imageData: pass.imageData,
      createdAt: pass.createdAt || Date.now(),
    };
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTravelPass(id) {
  const db = await openPassDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(String(id));
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * 將上傳的截圖／圖片等比例縮放至適合條碼與 QR Code 清晰辨識的大小。
 */
export function readPassImageFile(file, maxDimension = 1600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("讀取圖片失敗"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("不支援的圖片格式"));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // 🆕 引入 PWA 套件
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_TRIP_ID = "2026_busan";

const normalizeBasePath = (value = "/trip_agent/") => {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

// 🆕 生成構建版本號（使用當前時間）
const generateBuildVersion = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 🔧 從行程檔案讀取 Meta 設定 (不依賴 Node.js 執行環境轉譯 JSX)
const loadTripMeta = (filePath) => {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
    const configSource = content.slice(
      content.indexOf("export const tripConfig"),
    );
    const titleMatch = configSource.match(
      /meta:\s*{[\s\S]*?title:\s*"([^"]+)"/,
    );
    const descMatch = configSource.match(
      /meta:\s*{[\s\S]*?description:\s*"([^"]+)"/,
    );
    const shortMatch = configSource.match(
      /meta:\s*{[\s\S]*?short(?:Name|_name):\s*"([^"]+)"/,
    );
    const ogImageMatch = configSource.match(
      /meta:\s*{[\s\S]*?ogImage:\s*"([^"]+)"/,
    );

    // 預設值 (若 Regex 沒抓到)
    const defaultTitle = "Trip Agent";
    const defaultDesc = "Travel Itinerary Assistant";

    return {
      title: titleMatch ? titleMatch[1] : defaultTitle,
      description: descMatch ? descMatch[1] : defaultDesc,
      short_name: shortMatch
        ? shortMatch[1]
        : titleMatch
          ? titleMatch[1].substring(0, 12)
          : "TripAgent",
      ogImage: ogImageMatch ? ogImageMatch[1] : "icon-512.png",
    };
  } catch (error) {
    console.warn("⚠️ 無法讀取行程 Meta，使用預設值:", error.message);
    return {
      title: "Trip Agent",
      description: "Travel Assistant",
      short_name: "TripAgent",
      ogImage: "icon-512.png",
    };
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const tripId = env.VITE_TRIP_ID || DEFAULT_TRIP_ID;
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(tripId)) {
    throw new Error(`VITE_TRIP_ID 格式不合法：${tripId}`);
  }

  const tripFilePath = `src/tripdata_${tripId}.jsx`;
  if (!fs.existsSync(path.resolve(__dirname, tripFilePath))) {
    throw new Error(
      `找不到旅程資料檔：${tripFilePath}。請確認 VITE_TRIP_ID 或新增對應檔案。`,
    );
  }

  const basePath = normalizeBasePath(env.VITE_BASE_PATH);
  const tripMeta = loadTripMeta(tripFilePath);
  const publicSiteUrl = (env.VITE_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const ogImage = tripMeta.ogImage.startsWith("http")
    ? tripMeta.ogImage
    : `${basePath}${tripMeta.ogImage.replace(/^\//, "")}`;

  console.log(`🛠️ Current Trip: ${tripId} (${tripFilePath})`);

  return {
    // 🆕 定義環境變數
    define: {
      "import.meta.env.VITE_BUILD_VERSION": JSON.stringify(
        generateBuildVersion(),
      ),
      "import.meta.env.VITE_TRIP_ID": JSON.stringify(tripId),
    },

    resolve: {
      alias: [
        {
          find: /^@trip-data-source$/,
          replacement: path.resolve(__dirname, tripFilePath),
        },
        {
          find: /^@trip-data$/,
          replacement: path.resolve(__dirname, "src/config/tripData.js"),
        },
      ],
    },

    // 🆕 在 plugins 陣列中加入 VitePWA
    plugins: [
      react(),
      {
        name: "html-transform",
        transformIndexHtml(html) {
          return html
            .replace(/%TITLE%/g, tripMeta.title)
            .replace(/%SHORT_TITLE%/g, tripMeta.short_name)
            .replace(/%DESC%/g, tripMeta.description)
            .replace(/%BASE_PATH%/g, basePath)
            .replace(/%OG_IMAGE%/g, ogImage)
            .replace(/%SITE_URL%/g, publicSiteUrl || basePath);
        },
      },
      VitePWA({
        registerType: "prompt", // 發現新版時先提示，避免使用中突然切換分塊
        includeAssets: ["robots.txt"], // 只列出 public/ 內實際存在的靜態資源（圖示已由 manifest icons 處理）

        // Manifest 設定：這決定了安裝到手機桌面時的樣子
        manifest: {
          name: tripMeta.title,
          short_name: tripMeta.short_name, // 可以再優化，目前可能用 title 代替
          description: tripMeta.description,
          id: `${basePath}?trip=${tripId}`,
          start_url: basePath,
          prefer_related_applications: false, // 明確告知 Chrome 不要偏好原生 App，優先安裝 WebAPK
          background_color: "#FDFBF7", // 啟動畫面背景色（與 APP 背景一致）
          theme_color: "#FDFBF7", // 狀態列顏色（這是 PWA 模式的關鍵設定）
          display: "standalone",
          orientation: "portrait", // 鎖定直向 (避免意外旋轉)
          categories: ["travel", "productivity", "utilities"],
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon-maskable-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },

        // 🛠️ Workbox 快取策略：這是「複雜快取」的核心
        workbox: {
          // 1. 靜態資源預先快取：讓 HTML, JS, CSS, 圖片在離線時也能載入
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
          // 地圖引擎與 HEIC 轉換器體積較大，改為首次使用時下載並快取。
          globIgnores: [
            "**/assets/maplibre-gl-*.js",
            "**/assets/heic2any-*.js",
          ],
          // 自動清除舊版本快取
          cleanupOutdatedCaches: true,
          // 離線導航 fallback：確保離線啟動時回傳預快取的 index.html
          navigateFallback: "index.html",
          navigateFallbackDenylist: [new RegExp(`^${basePath}api`)],

          // 2. 執行時快取 (Runtime Caching)
          runtimeCaching: [
            // (0) 大型選用功能：首次使用後即可由快取快速再次開啟
            {
              urlPattern: /\/assets\/(?:maplibre-gl|heic2any)-[^/]+\.js$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_optional-features-cache",
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (A) Google Fonts 字型：很少變動，優先用快取，過期時間設很長 (1年)
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (B) 天氣 API (Open-Meteo)：資料需要新鮮
            // 使用 NetworkFirst (網路優先)：有網路抓最新的，沒網路才用舊資料
            {
              urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
              handler: "StaleWhileRevalidate", // 👈 改成這招：有舊的先給舊的，背景再更新
              options: {
                cacheName: "trip_agent_weather-api-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24, // 延長到 24 小時，確保隔天沒網路也能看昨天的預報
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (B-2) 匯率 API (Currency-API)：資料變動不頻繁，但需要離線存取
            {
              urlPattern: /^https:\/\/.*\.currency-api\.pages\.dev\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "trip_agent_currency-api-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 天
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (C) 地圖圖磚 (CartoDB)：快取地圖圖片，提升拖曳順暢度
            {
              urlPattern: /^https:\/\/\w+\.basemaps\.cartocdn\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_map-tiles-cache",
                expiration: {
                  maxEntries: 500, // 增加數量，地圖圖磚很多
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (D) 路線規劃 (OSRM) 與 地址反查 (Nominatim)：固定座標的結果是固定的
            {
              urlPattern:
                /^https:\/\/(router\.project-osrm\.org|nominatim\.openstreetmap\.org)\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_geo-api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            // (E) 本地字體檔案 (Runtime Cache)：不預先下載，而是用到時才快取
            {
              urlPattern: /\.(?:woff|woff2)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_local-fonts-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 年
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // (F) 外部圖片或地圖圖磚 (如果有用到)
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "trip_agent_images-cache",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
                },
              },
            },
          ],
        },
      }),
    ],

    base: basePath,

    build: {
      // ✅ 保留您的優化設定
      chunkSizeWarningLimit: 1000,
      // 🆕 啟用 terser 壓縮優化
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true, // 如果要保留 console.log以便除錯，請設為 false
          drop_debugger: true, // 移除 debugger
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "motion-vendor": ["framer-motion"],
            "icons-vendor": ["lucide-react"],
            // MapLibre 與 HEIC 轉換皆由功能元件動態載入，交由 Rollup 自動分包。
          },
        },
      },
    },
  };
});

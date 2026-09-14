import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import {
  fetchLocationsFromGasWithContext,
  uploadToGasWithContext,
} from "./utils/gasClient.js";
import { gasTripContext } from "./utils/gasTripContext.js";
import {
  getNextAiLoadingText,
  buildAiChatPayload,
  extractAiReplyText,
  getAiErrorText,
} from "./utils/aiHelpers.js";
import { resolveShareLandmark } from "./utils/geoPlaces.js";
import {
  Sun,
  CloudSnow,
  MapPin,
  Train,
  ShoppingBag,
  Camera,
  AlertCircle,
  Snowflake,
  Hotel,
  Utensils,
  QrCode,
  Plus,
  Trash2,
  RotateCcw,
  Calendar,
  Home,
  Clock,
  Map,
  Sparkles,
  Languages,
  Send,
  MessageSquare,
  Loader,
  User,
  Bot,
  Briefcase,
  Thermometer,
  Navigation,
  Shield,
  Volume2,
  StopCircle,
  Mic,
  MicOff,
  CloudRain,
  Cloud,
  CloudFog,
  CloudLightning,
  Wind,
  ArrowRight,
  Check,
  X,
  Share2,
  LocateFixed,
  LayoutDashboard,
  ListTodo,
  Plane,
  History,
  Phone,
  DollarSign,
  Download,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  itineraryData,
  guidesData,
  usefulLinks,
  shopGuideData,
  // } from "./tripdata_2026_karuizawa.jsx";
} from "@trip-data";
import { tripConfig, checklistData } from "@trip-data"; // 👈 從這裡切換不同行程資料

// 🔧 Helper to update meta tags dynamically
const updateMetaTag = (name, content, attribute = "name") => {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};
import {
  flattenItinerary,
  flattenShops,
  escapeRegex,
  getWeatherData,
  getDailyLocationKey, // 新增
  getAiWelcomeTemplate, // 新增
  buildShareTextLogic, // 新增
  getWeatherForecastIndex, // 新增
} from "./utils/itineraryHelpers.js";
import { processFileForHeic } from "./utils/imageUtils";
// import { financeDB } from "./utils/indexedDBManager.js";

// 抑制 ESLint 對於 JSX 中 motion 未使用的誤判
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
const ChatInput = lazy(() => import("./components/ChatInput.jsx"));
const CalculatorModal = lazy(() => import("./components/CalculatorModal.jsx"));
const TestModePanel = lazy(() => import("./components/TestModePanel.jsx"));
const WeatherDetail = lazy(() => import("./components/WeatherDetail.jsx"));

const tabModuleLoaders = {
  itinerary: () => import("./components/Tabs/ItineraryTab.jsx"),
  finance: () => import("./components/Tabs/FinanceTab.jsx"),
  ai: () => import("./components/AI/AIPanel.jsx"),
  guides: () => import("./components/Tabs/GuidesTab.jsx"),
  shops: () => import("./components/Tabs/ShopsTab.jsx"),
};

const preloadTab = (tabId) => {
  tabModuleLoaders[tabId]?.().catch(() => {
    // 預載失敗時交由 React.lazy 在真正切換頁籤時顯示錯誤邊界。
  });
};

import WeatherParticles from "./components/Background/WeatherParticles.jsx";
import { getParticleType, getSkyCondition } from "./utils/weatherHelpers.js";

import SkyObjects from "./components/Background/SkyObjects.jsx";
import TripHeader from "./components/TripHeader.jsx";
import TripToolsMenu from "./components/Navigation/TripToolsMenu.jsx";

// 使用 Web Crypto API 實作加密工具，取代外部依賴以提升安全性與效能
//  FlightInfoCard 組件
import FlightInfoCard from "./components/FlightInfoCard.jsx";
// ChecklistCard 組件
import ChecklistCard from "./components/ChecklistCard.jsx";
// WeatherCard 組件
import WeatherCard from "./components/WeatherCard.jsx";

// BottomNav 組件
import BottomNav from "./components/Navigation/BottomNav.jsx";
import TripTabPanels from "./components/TripTabPanels.jsx";
import { LazyPanelFallback } from "./components/LazyPanelFallback.jsx";

// 提取主題設定

// 自定義 Hook：匯率管理
import { useCurrency } from "./hooks/useCurrency.js";
import { useNetworkStatus } from "./hooks/useNetworkStatus.js";
import { useDeviceChrome } from "./hooks/useDeviceChrome.js";
import { useTripShellTheme } from "./hooks/useTripShellTheme.js";
import { useItineraryDayPager } from "./hooks/useItineraryDayPager.js";
import { useModalAccessibility } from "./hooks/useModalAccessibility.js";
import { useTripNavigation } from "./hooks/useTripNavigation.js";
import { useTabScrollRestoration } from "./hooks/useTabScrollRestoration.js";
import { useGeoPlaces } from "./hooks/useGeoPlaces.js";
import { useAiInvocation } from "./hooks/useAiInvocation.js";
import { tripStorage } from "./utils/tripStorage.js";
import { logger } from "./utils/logger.js";

const debugLog = (...args) => logger.debug(...args);
const debugGroup = (...args) => logger.group(...args);
const debugGroupEnd = (...args) => logger.groupEnd(...args);

const ItineraryApp = ({ authentication }) => {
  const {
    isVerified,
    apiKey,
    mapsApiKey,
    gasUrl,
    gasToken,
    maptilerKey,
    lock: lockAuthentication,
  } = authentication;
  const [otherUsersLocations, setOtherUsersLocations] = useState([]);

  // 🆕 使用 Ref 同步重要狀態，解決非同步 Callbacks (如 GPS) 抓取到過時 State 的問題
  const gasUrlRef = useRef("");
  const gasTokenRef = useRef("");

  useEffect(() => {
    gasUrlRef.current = gasUrl;
  }, [gasUrl]);
  useEffect(() => {
    gasTokenRef.current = gasToken;
  }, [gasToken]);
  const [fullPreviewImage, setFullPreviewImage] = useState(null);
  const previewDialogRef = useModalAccessibility(
    Boolean(fullPreviewImage),
    () => setFullPreviewImage(null),
  );
  const scrollContainerRef = useRef(null);
  const isFetchingLocationsRef = useRef(false); // 🆕 防止重複獲取其他使用者位置
  const [loadingText, setLoadingText] = useState("");
  const [autoTimeZone, setAutoTimeZone] = useState("Asia/Taipei");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  // 圖片下載：處理 data URL 及一般 URL，避免另開分頁
  const handleDownloadPreview = async (e) => {
    if (e) e.stopPropagation();
    try {
      if (isIOSSafari) {
        setToast({
          show: true,
          message: "iOS：長按圖片即可儲存",
          type: "success",
        });
        return;
      }
      if (!fullPreviewImage) return;

      let blob;
      if (fullPreviewImage.startsWith("data:")) {
        const [header, data] = fullPreviewImage.split(",");
        const mimeMatch = header.match(/data:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const bstr = atob(data);
        const len = bstr.length;
        const u8arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8arr[i] = bstr.charCodeAt(i);
        blob = new Blob([u8arr], { type: mime });
      } else {
        const resp = await fetch(fullPreviewImage);
        blob = await resp.blob();
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = blob.type.includes("png")
        ? "png"
        : blob.type.includes("webp")
          ? "webp"
          : "jpg";
      a.download = `image.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 800);

      setToast({ show: true, message: "已開始下載", type: "success" });
    } catch (err) {
      console.error("download error", err);
      setToast({ show: true, message: "下載失敗，請稍後重試", type: "error" });
    }
  };

  // 優先從快取讀取天氣資訊，若無則顯示啟動畫面進行定位
  const [isAppReady, setIsAppReady] = useState(() => {
    const cached = tripStorage.getItem("cached-user-weather", [
      "trip_agent_cached_user_weather",
      "cached_user_weather",
    ]);
    return !!cached;
  });

  // 行程內容不應被定位或外部天氣服務阻塞；解鎖後先顯示可用的離線資料，
  // 定位與天氣仍由既有 effect 在背景更新。
  useEffect(() => {
    if (isVerified) setIsAppReady(true);
  }, [isVerified]);

  const {
    activeTab,
    visitedTabs,
    activeModal,
    changeTab: navigateToTab,
    openModal,
    closeModal,
  } = useTripNavigation();
  const isCalculatorOpen = activeModal === "calculator";
  const isMapModalOpen = activeModal === "map";
  const showWeatherDetail = activeModal === "weather";
  const isTestMode = activeModal === "testMode";
  const rememberCurrentTabScroll = useTabScrollRestoration(activeTab);
  const handleTabChange = React.useCallback(
    (nextTab) => {
      if (nextTab === activeTab) return;
      rememberCurrentTabScroll();
      navigateToTab(nextTab);
    },
    [activeTab, navigateToTab, rememberCurrentTabScroll],
  );

  const handleCalculatorOpen = React.useCallback(
    () => openModal("calculator"),
    [openModal],
  );
  const handleCalculatorClose = React.useCallback(
    () => closeModal("calculator"),
    [closeModal],
  );
  const handleMapModalToggle = React.useCallback(
    (isOpen) => (isOpen ? openModal("map") : closeModal("map")),
    [closeModal, openModal],
  );
  const handleWeatherDetailOpen = React.useCallback(
    () => openModal("weather"),
    [openModal],
  );
  const handleWeatherDetailClose = React.useCallback(
    () => closeModal("weather"),
    [closeModal],
  );
  const handleTestModeOpen = React.useCallback(
    () => openModal("testMode"),
    [openModal],
  );
  const handleTestModeClose = React.useCallback(
    () => closeModal("testMode"),
    [closeModal],
  );
  const { isOnline, connectionNotice } = useNetworkStatus();
  const {
    isIOSSafari,
    showIOSInstallPrompt,
    setShowIOSInstallPrompt,
    showOrientationWarning,
    setShowOrientationWarning,
    orientationDialogRef,
  } = useDeviceChrome();

  // 使用自定義 Hook 簡化狀態管理
  const { code, target } = tripConfig.currency;
  const rateData = useCurrency(code, target, isOnline);

  const { keywordsSet, combinedRegex } = React.useMemo(() => {
    const allKeywordsRaw = [
      ...itineraryData.flatMap((day) => day.events.map((e) => e.title)),
      ...shopGuideData.flatMap((area) => area.mainShops.map((s) => s.name)),
    ];
    const filtered = allKeywordsRaw.filter((k) => k && k.length >= 2);
    const set = new Set(filtered);
    const pattern = filtered.map(escapeRegex).join("|");
    const regex = new RegExp(
      `(https?://[^\\s]+)|(${pattern})|(\\*\\*.*?\\*\\*)`,
      "g",
    );
    return { keywordsSet: set, combinedRegex: regex };
  }, []);

  const renderMessage = (text) => {
    if (!text) return null;

    return text.split(combinedRegex).map((part, index) => {
      if (!part) return null;

      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 underline"
          >
            {part}
          </a>
        );
      }

      if (keywordsSet.has(part)) {
        return (
          <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(part)}`}
            className="text-orange-500 font-bold border-b border-dashed border-orange-400 hover:text-orange-400"
          >
            {part}
          </a>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  const handleImageSelect = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // 先做基本的檔案大小檢查 (針對非HEIC，因為HEIC轉換後大小會變)
    const maxFileSize = 5 * 1024 * 1024;
    // 注意: processFileForHeic 可能會回傳 Blob，沒有 size 屬性限制檢查
    // 因此如果是 HEIC 先轉換，轉換後的 Blob 大小我們再來檢查

    // 處理 HEIC 轉換
    const processedFile = await processFileForHeic(file, () => {
      showToast("正在轉換 HEIC 圖片，請稍候...", "info");
    });
    file = processedFile;

    if (file.size > maxFileSize) {
      showToast("圖片檔案過大（超過 5MB），請選擇較小的圖片", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;

      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            processImageCompression(imageData);
          },
          { timeout: 2000 },
        );
      } else {
        setTimeout(() => {
          processImageCompression(imageData);
        }, 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImageCompression = (imageData) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      const MAX_SIDE = 1600;
      if (width > height) {
        if (width > MAX_SIDE) {
          height *= MAX_SIDE / width;
          width = MAX_SIDE;
        }
      } else {
        if (height > MAX_SIDE) {
          width *= MAX_SIDE / height;
          height = MAX_SIDE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
      setTempImage(compressedBase64);
    };
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = async (text, successMsg = "已複製到剪貼簿") => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToast(successMsg);
        return true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          showToast(successMsg);
          return true;
        } else {
          throw new Error("複製命令失敗");
        }
      }
    } catch (err) {
      console.error("複製失敗:", err);
      showToast("複製失敗", "error");
      return false;
    }
  };

  const handleCopy = (text) => {
    copyToClipboard(text, `已複製：${text}`);
  };

  const {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    currentTheme,
    componentStyles,
    cBase,
    cAccent,
    containerStyle,
    colors,
  } = useTripShellTheme();

  // activeDay + day swipe/pull-to-refresh live in useItineraryDayPager
  const [expandedItems, setExpandedItems] = useState({});
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isFlightInfoExpanded, setIsFlightInfoExpanded] = useState(false);

  // 🆕 2026-02-11 Dynamic Metadata Update
  useEffect(() => {
    if (tripConfig.meta) {
      document.title = tripConfig.meta.title;
      updateMetaTag("description", tripConfig.meta.description);
      updateMetaTag("og:title", tripConfig.meta.title, "property");
      updateMetaTag("og:description", tripConfig.meta.description, "property");
      updateMetaTag("og:image", tripConfig.meta.ogImage, "property");
    } else if (tripConfig.title) {
      document.title = tripConfig.title;
    }
  }, []);

  const dayPagerDepsRef = useRef({});

  const {
    activeDay,
    navContainerRef,
    navItemsRef,
    pullDistance,
    isRefreshing,
    handleMainTouchStart,
    handleMainTouchMove,
    handleMainTouchEnd,
    direction,
    slideVariants,
    onTouchStart,
    onTouchEnd,
    changeDay,
  } = useItineraryDayPager({
    itineraryLength: itineraryData.length,
    scrollContainerRef,
    showWeatherDetail,
    isCalculatorOpen,
    isMapModalOpen,
    depsRef: dayPagerDepsRef,
  });

  const [weatherForecast, setWeatherForecast] = useState(() => ({
    ...Object.fromEntries(tripConfig.locations.map(({ key }) => [key, null])),
    loading: true,
  }));

  const weatherDialogRef = useModalAccessibility(
    showWeatherDetail,
    handleWeatherDetailClose,
  );

  const [userWeather, setUserWeather] = useState(() => {
    try {
      const cached = tripStorage.getItem("cached-user-weather", [
        "cached_user_weather",
      ]);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.locationName) {
          debugLog("🚀 State 初始化：直接載入快取資料", parsed.locationName);
          return parsed;
        }
      }
    } catch (e) {
      console.error("快取初始化解析失敗", e);
    }

    return {
      temp: null,
      desc: "",
      locationName: "定位中...",
      landmark: "",
      weatherCode: null,
      loading: false,
      error: null,
    };
  });

  // 讓開發者可以透過 Console 快速測試不同天氣與日夜效果
  useEffect(() => {
    window.setTestWeather = (code, isDark) => {
      if (code !== undefined) {
        setUserWeather((prev) => ({ ...prev, weatherCode: code }));
      }
      if (isDark !== undefined) {
        setIsDarkMode(isDark);
      }
      debugLog(`🧪 測試模式啟動: Code=${code}, DarkMode=${isDark}`);
    };

    return () => {
      delete window.setTestWeather;
    };
  }, [setIsDarkMode]);

  const [locationSource, setLocationSource] = useState(() => {
    try {
      const cached = tripStorage.getItem("cached-user-weather", [
        "cached_user_weather",
      ]);
      return cached ? "cache" : null;
    } catch {
      return null;
    }
  });

  const lastHighPrecisionAtRef = useRef(null);
  const isFetchingLocationRef = useRef(false);
  const lastFetchAtRef = useRef(0);

  const [isSharing, setIsSharing] = useState(false);

  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const isTestModeRef = useRef(false);
  useEffect(() => {
    isTestModeRef.current = isTestMode;
  }, [isTestMode]);
  const [testModeClickCount, setTestModeClickCount] = useState(0);
  const [testDateTime, setTestDateTime] = useState(new Date());
  const [testLatitude, setTestLatitude] = useState(35.4437);
  const [testLongitude, setTestLongitude] = useState(138.3919);
  const [testWeatherOverride, setTestWeatherOverride] = useState({
    overview: null,
    days: {},
  });
  const [frozenTestDateTime, setFrozenTestDateTime] = useState(null);
  const [frozenTestWeatherOverride, setFrozenTestWeatherOverride] =
    useState(null);

  const freezeTestSettings = () => {
    setFrozenTestDateTime(new Date(testDateTime));
    setFrozenTestWeatherOverride(
      JSON.parse(JSON.stringify(testWeatherOverride)),
    );
    debugLog(
      `🔒 凍結測試設定 - dateTime=${testDateTime.toLocaleString("zh-TW")}, weather=`,
      testWeatherOverride,
    );
    showToast("✅ 測試設定已凍結，不會被覆蓋", "success");
  };

  const unfreezeTestSettings = () => {
    setFrozenTestDateTime(null);
    setFrozenTestWeatherOverride(null);
    debugLog(`🔓 解凍測試設定`);
    showToast("測試設定已解凍", "success");
  };

  useEffect(() => {
    if (isTestMode) {
      const hour = testDateTime.getHours();
      if (hour >= 17 || hour < 6) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    }
  }, [isTestMode, testDateTime, setIsDarkMode]);

  const { getBestPOI, lookupReverseGeoName, abortPlacesRequests } =
    useGeoPlaces({ mapsApiKey });
  const { callGeminiSafe, abortAiRequests } = useAiInvocation({ apiKey });
  const forecastAbortControllerRef = useRef(null);

  const [aiMode, setAiMode] = useState("translate");
  // 初始訊息設為空陣列，等待 IndexedDB 載入後再決定
  const [messages, setMessages] = useState([]);
  const isAiChatLoadedRef = useRef(false); // 追蹤初始載入是否完成

  // 初始化 IndexedDB 並加載聊天記錄
  // 邏輯：先檢查 IndexedDB 是否有快取，沒有才顯示預設歡迎訊息
  useEffect(() => {
    const initAndLoad = async () => {
      try {
        const { aiChatDB } = await import("./utils/indexedDBManager.js");
        await aiChatDB.init();
        const savedMessages = await aiChatDB.loadMessages(aiMode);
        debugLog(
          "📦 App.jsx IndexedDB 載入結果:",
          savedMessages?.length || 0,
          "則訊息",
        );

        if (savedMessages && savedMessages.length > 0) {
          // IndexedDB 有快取資料，加載每條消息的圖片
          const messagesWithImages = await Promise.all(
            savedMessages.map(async (msg) => {
              if (msg.image && msg.image.id) {
                try {
                  const imageRecord = await aiChatDB.getImage(msg.image.id);
                  if (imageRecord) {
                    return {
                      ...msg,
                      image: {
                        id: imageRecord.id,
                        data: imageRecord.data,
                        filename: imageRecord.filename,
                      },
                    };
                  }
                } catch (error) {
                  console.warn(`無法加載圖片 ${msg.image.id}:`, error);
                }
              }
              return msg;
            }),
          );
          debugLog(
            "✅ 從 IndexedDB 載入完成，共",
            messagesWithImages.length,
            "則訊息",
          );
          // 2026-02-11 Fix: Ensure welcome message matches current language config
          if (
            messagesWithImages.length > 0 &&
            messagesWithImages[0]?.id?.startsWith("welcome_")
          ) {
            try {
              const currentWelcome = getAiWelcomeTemplate(aiMode, tripConfig);
              // Check if the current cached message contains the correct language name (e.g. "韓文" vs "日文")
              if (aiMode === "translate") {
                const targetLangName = tripConfig.language.name;
                if (!messagesWithImages[0].text.includes(targetLangName)) {
                  debugLog(
                    `♻️ Welcome message outdated (Lang mismatch), refreshing to ${targetLangName}...`,
                  );
                  messagesWithImages[0] = currentWelcome;
                }
              }
            } catch (e) {
              console.warn("Failed to refresh welcome message", e);
            }
          }
          setMessages(messagesWithImages);
        } else {
          // IndexedDB 為空，檢查 localStorage 進行遷移
          const oldData = tripStorage.getItem(`chat-history-${aiMode}`, [
            `trip_chat_history_${aiMode}`,
          ]);
          if (oldData) {
            try {
              const oldMessages = JSON.parse(oldData);
              if (Array.isArray(oldMessages) && oldMessages.length > 0) {
                const messagesToSave = oldMessages.map((msg) => ({
                  ...msg,
                  image: null,
                }));
                await aiChatDB.saveMessages(aiMode, messagesToSave);
                tripStorage.removeItem(`chat-history-${aiMode}`);
                setMessages(oldMessages);
                debugLog(`✅ 已將聊天記錄從 localStorage 遷移至 IndexedDB`);
              } else {
                // localStorage 也沒有數據，使用默認歡迎消息
                debugLog("📭 無快取資料，顯示預設歡迎訊息");
                setMessages([getAiWelcomeTemplate(aiMode, tripConfig)]);
              }
            } catch (error) {
              console.error("遷移 localStorage 數據失敗:", error);
              setMessages([getAiWelcomeTemplate(aiMode, tripConfig)]);
            }
          } else {
            // IndexedDB 和 localStorage 都沒有數據，使用默認歡迎消息
            debugLog("📭 無快取資料，顯示預設歡迎訊息");
            setMessages([getAiWelcomeTemplate(aiMode, tripConfig)]);
          }
        }

        // 標記初始載入完成
        isAiChatLoadedRef.current = true;
      } catch (error) {
        console.error("初始化 IndexedDB 失敗:", error);
        // 發生錯誤時也顯示默認歡迎消息
        setMessages([getAiWelcomeTemplate(aiMode, tripConfig)]);
        isAiChatLoadedRef.current = true;
      }
    };

    initAndLoad();
  }, [aiMode]);

  // 保存聊天記錄到 IndexedDB
  useEffect(() => {
    // 初始載入完成前不要保存，避免覆蓋已存的資料
    if (!isAiChatLoadedRef.current || messages.length === 0) return;

    const debounceTimer = setTimeout(() => {
      const saveMessages = async () => {
        try {
          const { aiChatDB } = await import("./utils/indexedDBManager.js");

          // 先保存圖片並獲取 imageId
          const messagesWithImageIds = await Promise.all(
            messages.map(async (msg) => {
              if (msg.image && msg.image.data && msg.id) {
                try {
                  // 如果已有 imageId 就重用，否則生成新的
                  const imageId =
                    msg.image.id ||
                    (await aiChatDB.saveImage(
                      msg.id,
                      msg.image.data,
                      msg.image.filename,
                    ));
                  return {
                    ...msg,
                    image: { id: imageId, filename: msg.image.filename },
                  };
                } catch (error) {
                  console.error(`保存圖片失敗 (msg: ${msg.id}):`, error);
                  // 圖片保存失敗時，移除圖片但保留消息
                  return { ...msg, image: null };
                }
              }
              return {
                ...msg,
                image: msg.image
                  ? { id: msg.image.id, filename: msg.image.filename }
                  : null,
              };
            }),
          );

          // 初始化 IndexedDB 後再保存
          await aiChatDB.init();
          await aiChatDB.saveMessages(aiMode, messagesWithImageIds);
        } catch (error) {
          console.error("保存到 IndexedDB 失敗:", error);
        }
      };

      saveMessages();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [messages, aiMode]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningLang, setListeningLang] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState({});
  const prevMessageCount = useRef(0); // 追蹤訊息數量以偵測新訊息
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [showAiSearch, setShowAiSearch] = useState(false);
  const chatEndRef = useRef(null);
  const messageRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleConfirmImage = () => {
    setSelectedImage(tempImage);
    setTempImage(null);
  };
  const handleCancelImage = () => {
    setTempImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const imageConfirmDialogRef = useModalAccessibility(
    Boolean(tempImage),
    handleCancelImage,
  );

  const toggleExpand = (dayIndex, eventIndex) => {
    const key = `${dayIndex}-${eventIndex}`;
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleMessageExpand = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // 當有新訊息時自動展開（偵測 messages 長度變化）
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      // 有新訊息加入，自動展開最後一則
      const newIndex = messages.length - 1;
      setExpandedMessages((prev) => ({
        ...prev,
        [newIndex]: true,
      }));
    }
    prevMessageCount.current = messages.length;
  }, [messages.length]);

  const scrollToMessage = (index) => {
    if (messageRefs.current[index]) {
      messageRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // 高亮動畫
      messageRefs.current[index].classList.add(
        "ring-2",
        "ring-sky-400",
        "ring-offset-2",
      );
      setTimeout(() => {
        messageRefs.current[index]?.classList.remove(
          "ring-2",
          "ring-sky-400",
          "ring-offset-2",
        );
      }, 2000);
    }
  };

  const getSearchResults = () => {
    if (!aiSearchQuery.trim()) return [];
    const query = aiSearchQuery.toLowerCase();
    return messages
      .map((msg, index) => ({ ...msg, index }))
      .filter((msg) => msg.text?.toLowerCase().includes(query));
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "ai") scrollToBottom();
  }, [messages, activeTab]);

  // 追蹤上一次的 activeTab，用於偵測頁面切換
  const prevActiveTab = useRef(activeTab);

  // 只有當「從其他頁面切換回 AI 頁面」時才收折舊訊息
  useEffect(() => {
    // 偵測是否是從非 AI 頁面切換到 AI 頁面
    if (prevActiveTab.current !== "ai" && activeTab === "ai") {
      // 從其他頁面回到 AI 頁面，收折所有訊息
      setExpandedMessages({});
    }
    // 更新前一次的 tab 狀態
    prevActiveTab.current = activeTab;
  }, [activeTab]); // 只依賴 activeTab，不依賴 messages.length

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  }, []);

  const itineraryFlat = React.useMemo(
    () => flattenItinerary(itineraryData),
    [],
  );
  const shopsFlat = React.useMemo(() => flattenShops(shopGuideData), []);

  // ... existing map and weather helpers ...
  // 1. Get Google Map Link
  const getMapLink = (query) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  // 2. Get Weather Info from WMO Code
  // UI 版本，包含圖示和顏色（依賴 isDarkMode，用於顯示層）
  const getWeatherInfo = React.useCallback(
    (code) => {
      const iconClass = "w-7 h-7"; // Slightly larger icons
      const color = isDarkMode ? "text-neutral-300" : "text-neutral-600"; // Muted icons
      const textSecColor = isDarkMode
        ? currentTheme.textColors?.secDark || `text-${cBase}-300`
        : currentTheme.textColors?.secLight || `text-${cBase}-600`;
      const data = getWeatherData(code);

      let icon;
      if (code === 0)
        icon = (
          <Sun
            className={`${iconClass} ${isDarkMode ? "text-amber-200" : "text-amber-500"}`}
          />
        );
      else if ([1, 2, 3].includes(code))
        icon = <Cloud className={`${iconClass} ${color}`} />;
      else if ([45, 48].includes(code))
        icon = <CloudFog className={`${iconClass} ${textSecColor}`} />;
      else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
        icon = (
          <CloudRain
            className={`${iconClass} ${isDarkMode ? "text-sky-300" : "text-sky-600"}`}
          />
        );
      else if ([71, 73, 75, 77, 85, 86].includes(code))
        icon = (
          <Snowflake
            className={`${iconClass} ${isDarkMode ? "text-cyan-200" : "text-cyan-500"}`}
          />
        );
      else if ([95, 96, 99].includes(code))
        icon = (
          <CloudLightning
            className={`${iconClass} ${isDarkMode ? "text-yellow-200" : "text-yellow-600"}`}
          />
        );
      else icon = <Sun className={`${iconClass} ${color}`} />;

      return {
        icon,
        text: data.text,
        advice: data.advice,
      };
    },
    [isDarkMode, cBase, currentTheme],
  );

  const { tripStatus, daysUntilTrip, currentTripDayIndex } =
    React.useMemo(() => {
      const tripStartDate = new Date(tripConfig.startDate);
      const tripEndDate = new Date(tripConfig.endDate);
      // 優先順序：凍結的測試時間 > 測試模式時間 > 系統當前時間
      const displayDateTime =
        frozenTestDateTime || (isTestMode ? testDateTime : new Date());

      debugLog(
        `🧪 行程狀態計算 - isTestMode=${isTestMode}, isFrozen=${!!frozenTestDateTime}, displayDateTime=${displayDateTime.toLocaleString("zh-TW")}`,
      );

      let calculatedTripStatus = "before";
      let calculatedDaysUntilTrip = 0;
      let calculatedCurrentTripDayIndex = -1;

      if (displayDateTime < tripStartDate) {
        calculatedTripStatus = "before";
        const diffTime = Math.abs(tripStartDate - displayDateTime);
        calculatedDaysUntilTrip = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else if (
        displayDateTime >= tripStartDate &&
        displayDateTime <= tripEndDate
      ) {
        calculatedTripStatus = "during";
        const diffTime = Math.abs(displayDateTime - tripStartDate);
        calculatedCurrentTripDayIndex = Math.floor(
          diffTime / (1000 * 60 * 60 * 24),
        );
        debugLog(
          `🧪 正在行程中 - currentTripDayIndex=${calculatedCurrentTripDayIndex}`,
        );
      } else {
        calculatedTripStatus = "after";
      }

      return {
        tripStatus: calculatedTripStatus,
        daysUntilTrip: calculatedDaysUntilTrip,
        currentTripDayIndex: calculatedCurrentTripDayIndex,
      };
    }, [isTestMode, testDateTime, frozenTestDateTime]);

  const didAutoFocusTripDayRef = useRef(false);
  useEffect(() => {
    if (didAutoFocusTripDayRef.current) return;
    if (tripStatus !== "during" || currentTripDayIndex < 0) return;
    didAutoFocusTripDayRef.current = true;
    changeDay(currentTripDayIndex);
  }, [changeDay, currentTripDayIndex, tripStatus]);

  // 🆕 使用者狀態 (用於後台定位記錄)
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserRef = useRef(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // 🆕 初始化時載入使用者 (Mimic FinanceNote logic)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { financeDB } = await import("./utils/indexedDBManager.js");
        const savedUser = await financeDB.loadUser();
        if (savedUser) {
          debugLog("👤 [App] User loaded from DB:", savedUser);
          setCurrentUser(savedUser);
        } else {
          // Fallback to localStorage logic
          const localUserNew = tripStorage.getItem("finance-user", [
            "trip_agent_finance_user",
            "finance_user",
          ]);
          const localUserOld = null;
          let fallbackUser = null;
          if (localUserNew) fallbackUser = JSON.parse(localUserNew);
          else if (localUserOld) fallbackUser = JSON.parse(localUserOld);

          if (fallbackUser) {
            debugLog("👤 [App] User loaded from LocalStorage:", fallbackUser);
            setCurrentUser(fallbackUser);
          } else {
            debugLog("👤 [App] No user found, default to Guest");
          }
        }
      } catch (e) {
        console.error("👤 [App] User load failed:", e);
      }
    };
    loadUser();
  }, []); // Empty dependency array to run only once on mount

  // 🆕 位置記錄 Helper
  const logLocationToSheet = React.useCallback(
    async (weatherData, accuracy) => {
      // 1. 檢查開關狀態
      const hasLocationSharingConsent =
        tripStorage.getItem("location-sharing-consent-v1") === "true";
      const isTrackingEnabled =
        hasLocationSharingConsent &&
        tripStorage.getItem("location-tracking", [
          "trip_agent_location_tracking",
        ]) === "true";

      // 使用 Ref 獲取最新狀態，避免 Closure 陷阱
      const currentGasUrl = gasUrlRef.current;
      const currentGasToken = gasTokenRef.current;

      debugLog(
        `📍 [LocationLog] Triggered. Enabled: ${isTrackingEnabled}, GAS_URL: ${currentGasUrl ? "Set" : "Missing"}, Accuracy: ${accuracy}`,
      );

      if (!isTrackingEnabled) return;

      if (!currentGasUrl) {
        console.warn("📍 [LocationLog] Skipped: GAS URL not set");
        return;
      }

      if (!currentGasToken) {
        console.warn("📍 [LocationLog] Skipped: GAS Token not set");
        return;
      }

      // 2. 獲取用戶資訊 (優先使用 Ref)
      let user = currentUserRef.current;

      // Double check if ref is missing
      if (!user) {
        console.warn(
          "📍 [LocationLog] User state missing, trying instant fetch...",
        );
        try {
          const { financeDB } = await import("./utils/indexedDBManager.js");
          const dbUser = await financeDB.loadUser();
          if (dbUser) user = dbUser;
          else {
            const localUserNew = tripStorage.getItem("finance-user", [
              "trip_agent_finance_user",
              "finance_user",
            ]);
            const localUserOld = null;
            if (localUserNew) user = JSON.parse(localUserNew);
            else if (localUserOld) user = JSON.parse(localUserOld);
          }
        } catch (e) {
          console.error("📍 [LocationLog] Instant fetch failed:", e);
        }
      }

      // Final default
      if (!user) user = { name: "訪客", avatar: "👤" };

      // 3. 偵測裝置資訊
      const getDeviceInfo = () => {
        try {
          const ua = navigator.userAgent;
          let os = "Unknown";
          let browser = "Unknown";

          // OS Detection
          if (/iPhone/.test(ua)) os = "iPhone";
          else if (/iPad/.test(ua)) os = "iPad";
          else if (/Android/.test(ua)) {
            const match = ua.match(/Android\s[\d.]+;\s*([^)]+)\)/);
            os = match
              ? `Android · ${match[1].split(" Build")[0].trim()}`
              : "Android";
          } else if (/Windows/.test(ua)) os = "Windows";
          else if (/Mac OS/.test(ua)) os = "Mac";
          else if (/Linux/.test(ua)) os = "Linux";

          // Browser Detection
          if (/CriOS/.test(ua)) browser = "Chrome";
          else if (/FxiOS/.test(ua)) browser = "Firefox";
          else if (/EdgA|Edg\//.test(ua)) browser = "Edge";
          else if (/SamsungBrowser/.test(ua)) browser = "Samsung";
          else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
          else if (/Chrome/.test(ua)) browser = "Chrome";
          else if (/Firefox/.test(ua)) browser = "Firefox";

          return `${os} · ${browser}`;
        } catch {
          return "Unknown";
        }
      };

      try {
        uploadToGasWithContext({
          data: {
            action: "add",
            type: "location",
            id: crypto.randomUUID(),
            userName: user.name,
            userAvatar: user.avatar,
            lat: weatherData.lat,
            lon: weatherData.lon,
            accuracy: accuracy,
            device: getDeviceInfo(),
          },
          gasUrl: currentGasUrl,
          gasToken: currentGasToken,
          context: gasTripContext,
        })
          .then(() =>
            debugLog("📍 Location log sent successfully (with retry)"),
          )
          .catch((e) =>
            console.error("Location log send failed after retries", e),
          );
      } catch (e) {
        console.error("Location log error", e);
      }
    },
    [], // 不需要依賴項，因為內部都使用 Ref
  );

  // 🆕 獲取其他使用者的最新位置
  const fetchOtherUsersLocations = React.useCallback(async () => {
    if (!gasUrl || !gasToken) return;

    // 🔒 鎖定檢查：若正在獲取中，則直接跳過
    if (isFetchingLocationsRef.current) {
      debugLog("⏳ 正在獲取其他使用者位置，略過本次請求");
      return;
    }

    try {
      isFetchingLocationsRef.current = true; // 上鎖
      debugLog("📍 [App] 正在獲取其他使用者位置...");

      const locations = await fetchLocationsFromGasWithContext({
        gasUrl,
        gasToken,
        context: gasTripContext,
      });
      const me = currentUserRef.current?.name;
      const others = me
        ? locations.filter((loc) => loc.user?.name !== me)
        : locations;
      debugLog("✅ [App] 獲取其他使用者位置成功:", others.length);
      setOtherUsersLocations(others);
    } catch (e) {
      console.error("📍 [App] 獲取其他使用者位置失敗:", e);
    } finally {
      isFetchingLocationsRef.current = false; // 解鎖
    }
  }, [gasUrl, gasToken]);

  const getUserLocationWeather = React.useCallback(
    async (options = {}) => {
      if (!isVerified) return null;

      const {
        isSilent = false,
        highAccuracy = false,
        timeout = 10000,
        coords = null,
      } = options;

      // 避免短時間內重複觸發定位請求，減少 API 消耗與效能負擔
      const now = Date.now();
      // 放寬冷卻時間，避免短時間重複刷新造成過多外部請求
      const minGapMs = isSilent ? 10000 : 30000;
      if (!highAccuracy) {
        if (
          isFetchingLocationRef.current ||
          now - lastFetchAtRef.current < minGapMs
        ) {
          debugLog("⏳ 略過重複定位請求 (節流中)");
          return null;
        }
      }
      isFetchingLocationRef.current = true;
      if (!isSilent && !highAccuracy) setIsUpdatingLocation(true);

      // 測試模式處理：若未提供 explicit coords 則使用測試設定座標
      let effectiveCoords = coords;
      if (isTestMode && !effectiveCoords) {
        effectiveCoords = { latitude: testLatitude, longitude: testLongitude };
        debugLog("🧪 測試模式：使用設定的測試位置座標");
      }

      const fetchLocalWeather = async (
        latitude,
        longitude,
        customName = null,
      ) => {
        try {
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weathercode,uv_index,uv_index_clear_sky,wind_speed_10m,wind_gusts_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,uv_index_clear_sky_max,wind_speed_10m_max,wind_gusts_10m_max,precipitation_probability_max,sunrise,sunset&forecast_days=7&timezone=auto`;
          const weatherRes = await fetch(weatherUrl);
          const weatherData = await weatherRes.json();

          if (weatherData.error) {
            throw new Error(weatherData.reason || "Weather API error");
          }

          let city = customName;
          let landmark = "";
          let isGeneric = true;

          if (!city) {
            try {
              const geo = await lookupReverseGeoName(latitude, longitude);
              if (geo.geoData) {
                city = geo.city;
                landmark = geo.landmark;
                isGeneric = geo.isGeneric;
              }
            } catch (e) {
              console.warn("Geo lookup failed:", e);
              city = "目前位置";
            }
          }

          const info = getWeatherData(weatherData.current_weather.weathercode);
          const newWeatherData = {
            temp: Math.round(weatherData.current_weather.temperature),
            desc: info.text,
            weatherCode: weatherData.current_weather.weathercode,
            hourly: weatherData.hourly,
            daily: weatherData.daily,
            locationName: city || "未知地點",
            landmark: landmark,
            isGeneric: isGeneric,
            lat: latitude,
            lon: longitude,
            loading: false,
            error: null,
          };

          tripStorage.setItem(
            "cached-user-weather",
            JSON.stringify({ ...newWeatherData, timestamp: Date.now() }),
          );
          setUserWeather(newWeatherData);
          if (weatherData.timezone) setAutoTimeZone(weatherData.timezone);

          return newWeatherData;
        } catch (err) {
          console.error("定位失敗:", err);
          if (!isAppReady)
            setUserWeather((prev) => ({
              ...prev,
              loading: false,
              error: "連線失敗",
            }));
          return null;
        } finally {
          setIsAppReady(true);
          setIsUpdatingLocation(false);
          isFetchingLocationRef.current = false;
          lastFetchAtRef.current = Date.now();
        }
      };

      // 優先載入快取資料以提供即時反饋
      const cached = tripStorage.getItem("cached-user-weather", [
        "cached_user_weather",
      ]);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUserWeather(parsed);
          setLocationSource("cache");
          setIsAppReady(true);
          debugLog("🚀 快取載入成功");
        } catch (e) {
          console.error("快取解析失敗", e);
        }
      }

      // 若無快取且非靜默更新，嘗試使用 IP 定位作為初步位置參考
      if (!cached && !isSilent && !effectiveCoords) {
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          const ipData = await ipRes.json();
          if (ipData.latitude) {
            debugLog("📡 IP 定位補位成功");
            const info = await fetchLocalWeather(
              ipData.latitude,
              ipData.longitude,
              ipData.city,
            );
            if (info) logLocationToSheet(info, "Low (IP)");
            setLocationSource("low");
          }
        } catch {
          console.warn("IP 定位失敗");
          if (!cached) {
            const info = await fetchLocalWeather(25.033, 121.5654, "台北");
            if (info) logLocationToSheet(info, "Low (Default)");
            setLocationSource("low");
          }
        }
      }

      if (
        effectiveCoords &&
        effectiveCoords.latitude &&
        effectiveCoords.longitude
      ) {
        try {
          setHasLocationPermission(true);
          if (highAccuracy || isTestMode) {
            lastHighPrecisionAtRef.current = Date.now();
            setLocationSource("high");
          } else {
            // 測試模式下即便是低精度也視同提供有效座標，由呼叫端決定是否需再提升精確度
            setLocationSource("low");
          }
          const info = await fetchLocalWeather(
            effectiveCoords.latitude,
            effectiveCoords.longitude,
            effectiveCoords.name || null,
          );
          if (info)
            logLocationToSheet(
              info,
              isTestMode ? "Test" : highAccuracy ? "High" : "Low",
            );
          return info;
        } catch (e) {
          console.error("使用提供的座標抓取失敗", e);
          // Restore missing fetchLocalWeather call
          if (!cached && !isAppReady) {
            const info = await fetchLocalWeather(25.033, 121.5654, "台北");
            if (info) logLocationToSheet(info, "Default (Coords Fail)");
            setLocationSource("low");
          }
        }
      }

      // 啟動瀏覽器原生定位以獲取更精確的座標 (測試模式下跳過，除非明確傳入 coords)
      if (navigator.geolocation && !isTestMode) {
        const geoOptions = {
          enableHighAccuracy: highAccuracy,
          timeout,
          maximumAge: highAccuracy ? 0 : 600000,
        };

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (isTestModeRef.current) {
              debugLog("🚫 略過 GPS 回傳 (處於測試模式中)");
              return;
            }
            setHasLocationPermission(true);
            if (highAccuracy) {
              lastHighPrecisionAtRef.current = Date.now();
              setLocationSource("high");
            } else {
              setLocationSource("low");
            }
            const info = await fetchLocalWeather(
              position.coords.latitude,
              position.coords.longitude,
            );
            if (info) {
              logLocationToSheet(info, highAccuracy ? "High" : "Low");
            }
            if (!highAccuracy) {
              isFetchingLocationRef.current = false;
              lastFetchAtRef.current = Date.now();
            }
          },
          async (err) => {
            console.warn("GPS 定位未成功", err.code, err.message);

            if (err.code === 1) {
              setHasLocationPermission(false);
              if (!isSilent) showToast("您已封鎖定位權限", "error");
            } else {
              setHasLocationPermission(null);
            }

            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                // 即使 GPS 失敗，若有快取資料且允許追蹤，則記錄最後已知位置
                logLocationToSheet(parsed, "Last Known (GPS Fail)");
              } catch (e) {
                console.error("快取解析失敗 (Log)", e);
              }
            } else if (!isAppReady) {
              const info = await fetchLocalWeather(25.033, 121.5654, "台北");
              if (info) logLocationToSheet(info, "Default (GPS Fail)");
              setLocationSource("low");
            }
            isFetchingLocationRef.current = false;
          },
          geoOptions,
        );
      } else {
        setHasLocationPermission(false);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            logLocationToSheet(parsed, "Last Known (No GPS)");
          } catch (e) {
            console.warn("快取解析失敗", e);
          }
        } else if (!isAppReady) {
          const info = await fetchLocalWeather(25.033, 121.5654, "台北");
          if (info) logLocationToSheet(info, "Default (No GPS)");
          setLocationSource("low");
        }
        isFetchingLocationRef.current = false;
      }
    },
    [
      isVerified,
      showToast,
      isAppReady,
      isTestMode,
      testLatitude,
      testLongitude,
      logLocationToSheet,
      lookupReverseGeoName,
    ],
  );

  useEffect(() => {
    if (!isVerified) return undefined;

    const alreadyHasData =
      userWeather.temp !== null && userWeather.locationName !== "定位中...";

    getUserLocationWeather({ isSilent: alreadyHasData, highAccuracy: false });
    fetchOtherUsersLocations(); // 初始載入位置

    // 每 10 分鐘自動更新一次天氣資訊與位置，確保資料時效性
    const intervalId = setInterval(() => {
      debugLog("⏰ 自動更新位置、天氣與隊友位置...");
      getUserLocationWeather({ isSilent: true, highAccuracy: false });
      fetchOtherUsersLocations();
    }, 600000);

    // 🆕 加入 visibilitychange 監聽：當 App 回到前景時主動更新，解決背景 setInterval 暫停問題
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        debugLog("👀 App 回到前景，檢查是否需要觸發位置更新...");
        const now = Date.now();
        // 確保冷卻時間至少 30 秒，避免頻繁切換視窗導致 API 請求過載
        if (now - lastFetchAtRef.current > 30000) {
          debugLog("🚀 冷卻時間已過，立即更新！");
          getUserLocationWeather({ isSilent: true, highAccuracy: false });
          fetchOtherUsersLocations();
        } else {
          debugLog("⏳ 冷卻時間未到 (30s)，略過更新");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isVerified,
    getUserLocationWeather,
    fetchOtherUsersLocations,
    userWeather.temp,
    userWeather.locationName,
  ]);

  // Keep day-pager late deps in sync (refresh + toast + test-mode click reset)
  dayPagerDepsRef.current = {
    onPullRefresh: () =>
      getUserLocationWeather({ isSilent: true, highAccuracy: false }),
    showToast,
    testModeClickCount,
    setTestModeClickCount,
  };

  const handleShareLocation = async () => {
    // 測試模式優先處理：直接使用測試設定的位置分享，不觸發實際定位
    if (isTestMode) {
      const shareLat = testLatitude;
      const shareLng = testLongitude;
      const shareLandmark = userWeather.landmark || "";
      const shareLocationName = userWeather.locationName || "測試地點";
      const shareIsGeneric = userWeather.isGeneric;

      const composed = await buildShareText(
        shareLat,
        shareLng,
        shareLandmark,
        shareLocationName,
        shareIsGeneric,
      );
      const { baseMessage, fullText, tag } = composed;
      const mapUrl = `https://www.google.com/maps?q=${shareLat},${shareLng}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "我的位置 (測試模式)",
            text: baseMessage,
            url: mapUrl,
          });
          showToast(`分享成功 (測試) — 來源: ${tag}`);
          return;
        } catch (err) {
          if (
            err &&
            (err.name === "AbortError" || err.name === "NotAllowedError")
          ) {
            showToast("使用者取消分享", "info");
            return;
          }
        }
      }
      await copyToClipboard(fullText, "測試位置已複製到剪貼簿");
      return;
    }

    if (!navigator.geolocation) {
      const lat = userWeather.lat;
      const lng = userWeather.lon;
      const landmark = userWeather.landmark || "";

      if (lat && lng) {
        const composed = await buildShareText(
          lat,
          lng,
          landmark,
          userWeather.locationName,
          userWeather.isGeneric,
        );
        const { baseMessage, fullText, tag } = composed;

        if (navigator.share) {
          try {
            await navigator.share({
              title: "我的位置",
              text: baseMessage,
              url: `https://www.google.com/maps?q=${lat},${lng}`,
            });
            showToast(`分享成功 — 來源: ${tag}`);
            return;
          } catch (err) {
            if (
              err &&
              (err.name === "AbortError" || err.name === "NotAllowedError")
            ) {
              showToast("使用者取消分享", "info");
              return;
            }
            await copyToClipboard(fullText, "分享失敗，但位置已複製到剪貼簿");
            return;
          }
        } else {
          await copyToClipboard(fullText, "位置與地標資訊已複製！");
          return;
        }
      }

      showToast("您的瀏覽器不支援定位功能", "error");
      return;
    }

    const twoMinutes = 2 * 60 * 1000;
    const hasRecentHigh =
      isTestMode || // 測試模式下視同擁有精準座標，不重新抓取以免覆蓋
      (locationSource === "high" &&
        lastHighPrecisionAtRef.current &&
        Date.now() - lastHighPrecisionAtRef.current <= twoMinutes);

    if (userWeather.lat && userWeather.lon) {
      const lat = userWeather.lat;
      const lng = userWeather.lon;
      const landmark = userWeather.landmark || "";
      const composed = await buildShareText(
        lat,
        lng,
        landmark,
        userWeather.locationName,
        userWeather.isGeneric,
      );
      const { baseMessage, fullText, tag } = composed;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      if (hasRecentHigh) {
        if (navigator.share) {
          try {
            await navigator.share({
              title: "我的位置",
              text: baseMessage,
              url: mapUrl,
            });
            showToast(`分享成功 — 來源: ${tag}`);
            return;
          } catch (err) {
            if (
              err &&
              (err.name === "AbortError" || err.name === "NotAllowedError")
            ) {
              showToast("使用者取消分享", "info");
              return;
            }
            console.error("分享失敗，改為複製到剪貼簿:", err);
            await copyToClipboard(fullText, "分享失敗，但位置已複製到剪貼簿");
            return;
          }
        } else {
          await copyToClipboard(fullText, "位置與地標資訊已複製！");
          return;
        }
      }

      setIsSharing(true);
      showToast("正在取得精準位置...", "success");

      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        });

        // 成功拿到高精度座標並更新（會同步完成，接著分享）
        const newData = await getUserLocationWeather({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          isSilent: false,
          highAccuracy: true,
          timeout: 15000,
        });
        const shareLat = (newData && newData.lat) || pos.coords.latitude;
        const shareLng = (newData && newData.lon) || pos.coords.longitude;
        const shareLandmark = (newData && newData.landmark) || "";
        const mapUrl2 = `https://www.google.com/maps?q=${shareLat},${shareLng}`;
        const currentGenericStatus =
          newData && newData.isGeneric !== undefined ? newData.isGeneric : true;
        const composed2 = await buildShareText(
          shareLat,
          shareLng,
          shareLandmark,
          (newData && newData.locationName) || userWeather.locationName,
          currentGenericStatus,
        );
        const {
          baseMessage: baseMessage2,
          fullText: fullText2,
          tag: tag2,
        } = composed2;

        if (navigator.share) {
          try {
            await navigator.share({
              title: "我的位置",
              text: baseMessage2,
              url: mapUrl2,
            });
            showToast(`分享成功 — 來源: ${tag2}`);
          } catch (err) {
            if (
              err &&
              (err.name === "AbortError" || err.name === "NotAllowedError")
            ) {
              showToast("使用者取消分享", "info");
            } else {
              console.error("分享失敗，改為複製到剪貼簿:", err);
              await copyToClipboard(
                fullText2,
                "分享失敗，但位置已複製到剪貼簿",
              );
            }
          }
        } else {
          await copyToClipboard(fullText2, "位置與地標資訊已複製！");
        }

        return;
      } catch (err) {
        console.warn("高精度定位失敗，使用既有座標分享：", err);
        if (navigator.share) {
          try {
            await navigator.share({
              title: "我的位置",
              text: baseMessage,
              url: mapUrl,
            });
            showToast(`分享成功 — 來源: ${tag}`);
          } catch (err2) {
            if (
              err2 &&
              (err2.name === "AbortError" || err2.name === "NotAllowedError")
            ) {
              showToast("使用者取消分享", "info");
            } else {
              console.error("分享失敗，改為複製到剪貼簿:", err2);
              await copyToClipboard(fullText, "分享失敗，但位置已複製到剪貼簿");
            }
          }
        } else {
          await copyToClipboard(fullText, "位置與地標資訊已複製！");
        }

        return;
      } finally {
        setIsSharing(false);
      }
    }

    // 若完全沒有既有座標，則強制等待高精度定位結果後再分享
    setIsSharing(true);
    showToast("正在取得精準位置...", "success");

    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const newData = await getUserLocationWeather({
        coords: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        },
        isSilent: false,
        highAccuracy: true,
        timeout: 15000,
      });

      const lat = (newData && newData.lat) || pos.coords.latitude;
      const lng = (newData && newData.lon) || pos.coords.longitude;
      const landmark = (newData && newData.landmark) || "";

      const composed = await buildShareText(
        lat,
        lng,
        landmark,
        (newData && newData.locationName) || userWeather.locationName,
        (newData && newData.isGeneric) || false,
      );
      const { baseMessage, fullText, tag } = composed;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "我的位置",
            text: baseMessage,
            url: `https://www.google.com/maps?q=${lat},${lng}`,
          });
          showToast(`分享成功 — 來源: ${tag}`);
        } catch (err) {
          if (
            err &&
            (err.name === "AbortError" || err.name === "NotAllowedError")
          ) {
            showToast("使用者取消分享", "info");
          } else {
            console.error("分享失敗，改為複製到剪貼簿:", err);
            await copyToClipboard(fullText, "分享失敗，但位置已複製到剪貼簿");
          }
        }
      } else {
        await copyToClipboard(fullText, "位置與地標資訊已複製！");
      }
    } catch (err) {
      console.error("分享取得位置失敗:", err);
      showToast("無法取得精準位置", "error");
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    const forecastControllerRef = forecastAbortControllerRef;

    return () => {
      // 組件卸載時立即停止語音與 API 請求，避免記憶體洩漏或狀態更新錯誤
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        } catch (error) {
          console.error("清理語音朗讀資源時出錯:", error);
        }
      }

      abortAiRequests();
      abortPlacesRequests();
      forecastControllerRef.current?.abort();
    };
  }, [abortAiRequests, abortPlacesRequests]);

  const fetchWeatherForecast = React.useCallback(
    async ({ showLoading = false } = {}) => {
      if (!isVerified) return false;

      forecastAbortControllerRef.current?.abort();
      const controller = new AbortController();
      forecastAbortControllerRef.current = controller;

      if (showLoading) {
        setWeatherForecast((prev) => ({ ...prev, loading: true }));
      }

      try {
        const params = `hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weathercode,uv_index,uv_index_clear_sky,wind_speed_10m,wind_gusts_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,uv_index_clear_sky_max,wind_speed_10m_max,wind_gusts_10m_max,precipitation_probability_max,sunrise,sunset&forecast_days=7&timezone=auto`;

        const results = await Promise.all(
          tripConfig.locations.map(async (loc) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&${params}`;
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
              throw new Error(`Weather API HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
              throw new Error(data.reason || `Weather API error: ${loc.key}`);
            }

            if (data.timezone) setAutoTimeZone(data.timezone);
            return {
              key: loc.key,
              data: { ...data.daily, hourly: data.hourly },
            };
          }),
        );

        if (controller.signal.aborted) return false;

        const updatedAt = Date.now();
        const newForecast = Object.fromEntries(
          results.map(({ key, data }) => [key, data]),
        );
        const nextForecast = { ...newForecast, loading: false, updatedAt };

        tripStorage.setItem(
          "weather-forecast",
          JSON.stringify({ ...newForecast, updatedAt }),
        );
        setWeatherForecast(nextForecast);
        return true;
      } catch (error) {
        if (error?.name === "AbortError") return false;
        console.error("Failed to fetch weather:", error);
        setWeatherForecast((prev) => ({ ...prev, loading: false }));
        return false;
      } finally {
        if (forecastAbortControllerRef.current === controller) {
          forecastAbortControllerRef.current = null;
        }
      }
    },
    [isVerified],
  );

  useEffect(() => {
    if (!isVerified) return;

    const loadCachedForecast = () => {
      try {
        const cached = tripStorage.getItem("weather-forecast", [
          "trip_weather_forecast",
        ]);
        if (cached) {
          const parsed = JSON.parse(cached);
          setWeatherForecast({ ...parsed, loading: false });
          debugLog("📦 已載入 Day1~6 天氣快取");
        }
      } catch (e) {
        console.error("讀取天氣快取失敗", e);
      }
    };

    loadCachedForecast();

    fetchWeatherForecast();

    return () => {
      forecastAbortControllerRef.current?.abort();
    };
  }, [fetchWeatherForecast, isVerified]);

  useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleListening = (lang) => {
    if (!("webkitSpeechRecognition" in window)) {
      showToast("抱歉，您的瀏覽器不支援語音輸入功能。", "error");
      return;
    }

    if (listeningLang) {
      setListeningLang(null);
      return;
    }

    setListeningLang(lang);
    setInputMessage("");

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setListeningLang(null);
    };

    recognition.start();
  };

  const LANGUAGE_SPECS = {
    "ja-JP": {
      checkRegex: /[\u3040-\u309F\u30A0-\u30FF]/,
      cleanStrategy: "removeBrackets",
    },
    "th-TH": {
      checkRegex: /[\u0E00-\u0E7F]/,
      cleanStrategy: "keepOnlyMatches",
    },
    "ko-KR": {
      checkRegex: /[\uAC00-\uD7AF\u1100-\u11FF]/,
      cleanStrategy: "removeBrackets",
    },
    "vi-VN": {
      checkRegex: /[a-zA-Z\u00C0-\u1EF9]/,
      cleanStrategy: "removeBrackets",
    },
  };

  const handleSpeak = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("抱歉，您的瀏覽器不支援語音朗讀功能。");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToSpeak = text.replace(/\*\*/g, "");
    const configLangCode = tripConfig.language.code;

    const normalizeLang = (code) => code.replace("_", "-").toLowerCase();

    const targetVoice =
      availableVoices.find(
        (v) => normalizeLang(v.lang) === normalizeLang(configLangCode),
      ) ||
      availableVoices.find((v) =>
        normalizeLang(v.lang).includes(normalizeLang(configLangCode)),
      );

    // 🆕 導遊模式固定使用中文朗讀
    const shouldTryForeign =
      aiMode === "translate" && configLangCode !== "zh-TW";

    const spec = LANGUAGE_SPECS[configLangCode] || {
      checkRegex: /.*/,
      cleanStrategy: "removeBrackets",
    };

    if (shouldTryForeign) {
      if (spec.cleanStrategy === "keepOnlyMatches") {
        const matches = textToSpeak.match(new RegExp(spec.checkRegex, "g"));
        if (matches) textToSpeak = matches.join(" ");
      } else {
        textToSpeak = textToSpeak.replace(/\s*[()（].*?[)）]/g, "");
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (shouldTryForeign) {
      utterance.lang = configLangCode;
      if (targetVoice) {
        utterance.voice = targetVoice;
      } else {
        console.warn("未找到特定語音包，嘗試使用系統預設語言");
      }
    } else {
      utterance.lang = "zh-TW";
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech Error:", e);
      setIsSpeaking(false);
      if (e.error !== "interrupted") {
        showToast("語音播放失敗，請檢查手機設定", "error");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- 建立分享文字 (決策核心) ---
  const buildShareText = async (
    latitude,
    longitude,
    currentLandmark,
    locationName,
    isGeneric,
  ) => {
    const { finalLandmark, tag, updatedFromPoi } = await resolveShareLandmark({
      currentLandmark,
      isGeneric,
      locationName,
      latitude,
      longitude,
      getBestPOIImpl: getBestPOI,
      debugLog,
      debugGroup,
      debugGroupEnd,
    });

    if (updatedFromPoi) {
      // 同步更新 UI 上的地標資訊，讓使用者看到更精準的結果
      setUserWeather((prev) => ({
        ...prev,
        landmark: finalLandmark,
        isGeneric: false,
      }));
    }

    const { baseMessage, fullText } = buildShareTextLogic(
      latitude,
      longitude,
      finalLandmark,
      locationName,
    );
    return {
      baseMessage,
      fullText,
      finalLandmark,
      tag, // tag 保留在主組件處理，因為它與 POI 來源狀態有關
    };
  };

  const handleSwitchMode = async (newMode) => {
    if (aiMode === newMode) return;
    setAiMode(newMode);
    // 切換模式時，useEffect 會自動載入對應的對話記錄
  };

  // --- 測試模式觸發邏輯 (彩蛋) ---
  const handleTitleClick = () => {
    if (testModeClickCount === 0) {
      setTestModeClickCount(1);
    } else if (testModeClickCount < 9) {
      setTestModeClickCount(testModeClickCount + 1);
    } else if (testModeClickCount === 9) {
      setTestModeClickCount(10);
      showToast("🩷", "success");
    }
  };

  const handleInterruptClick = () => {
    if (testModeClickCount > 0) {
      setTestModeClickCount(0);
      showToast("連續點擊計數已重置", "info");
    }
  };

  const handleLockButtonClick = () => {
    // 若已達成彩蛋條件，則進入測試模式；否則執行正常的登出/鎖定
    if (testModeClickCount === 10) {
      setTestDateTime(new Date());
      setTestLatitude(userWeather?.lat || 35.6762);
      setTestLongitude(userWeather?.lon || 139.6503);
      setTestWeatherOverride({ overview: null, days: {} });
      handleTestModeOpen();
      setTestModeClickCount(0);
      showToast("🩷 進入測試模式！", "success");
    } else {
      abortAiRequests();
      abortPlacesRequests();
      gasUrlRef.current = "";
      gasTokenRef.current = "";
      setOtherUsersLocations([]);
      lockAuthentication();
    }
  };

  const handleClearChat = async () => {
    if (
      window.confirm(
        `確定要清除「${aiMode === "translate" ? "口譯" : "導遊"}」的所有紀錄嗎？`,
      )
    ) {
      const resetMsg = getAiWelcomeTemplate(aiMode, tripConfig);
      setMessages([resetMsg]);

      // 從 IndexedDB 清除
      try {
        const { aiChatDB } = await import("./utils/indexedDBManager.js");
        await aiChatDB.deleteMessages(aiMode);
      } catch (error) {
        console.error("清除 IndexedDB 失敗:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const tz = autoTimeZone || tripConfig.timeZone || "Asia/Taipei";
    const displayTime = isTestMode ? testDateTime : new Date();
    const localTimeStr = displayTime.toLocaleString("zh-TW", {
      timeZone: tz,
      hour12: false,
    });

    // 根據模式設定隨機的 Loading 提示，增加互動感
    setLoadingText(getNextAiLoadingText(aiMode));

    // 🔧 【重要】先清空輸入框，避免語音識別的異步更新覆蓋
    const messageText = inputMessage;
    const messageImage = selectedImage
      ? {
          data: selectedImage,
          filename: `image_${Date.now()}.jpg`,
        }
      : null;
    setInputMessage("");
    setSelectedImage(null);

    const userMsg = {
      id: `user_${Date.now()}`,
      role: "user",
      text: messageText,
      image: messageImage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const payload = buildAiChatPayload({
        aiMode,
        messages,
        userMsg,
        messageText,
        tripConfig,
        itineraryData,
        itineraryFlat,
        shopsFlat,
        localTimeStr,
        tz,
        isTestMode,
        testDateTime,
        hasLocationPermission,
        userWeather,
        debugLog,
      });

      const data = await callGeminiSafe(payload);
      const aiText = extractAiReplyText(data);
      setMessages((prev) => [
        ...prev,
        {
          id: `model_${Date.now()}`,
          role: "model",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      const errMsg = getAiErrorText(error);

      setMessages((prev) => [
        ...prev,
        {
          id: `model_error_${Date.now()}`,
          role: "model",
          text: errMsg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 天氣狀態判定 ---
  const current = activeDay === -1 ? null : itineraryData[activeDay];
  // 固定傳給 DayMap 的 events 參考，避免每次 render 觸發額外 fetch
  const dayMapEvents = React.useMemo(
    () => (current?.events ? current.events : []),
    [current?.events],
  );
  const currentLocation = getDailyLocationKey(
    activeDay,
    itineraryData,
    tripConfig,
  );

  // 使用 useMemo 鎖定天氣資料，優化滑動效能並處理測試模式覆蓋
  const displayWeather = React.useMemo(() => {
    const currentLocation = getDailyLocationKey(
      activeDay,
      itineraryData,
      tripConfig,
    );
    const weatherData = weatherForecast[currentLocation];
    const effectiveWeatherOverride =
      frozenTestWeatherOverride || testWeatherOverride;

    if (!weatherForecast.loading && weatherData && weatherData.time) {
      // 使用新的索引計算函式，根據行程狀態動態計算預報索引
      const forecastIndex = getWeatherForecastIndex(
        activeDay,
        tripStatus,
        currentTripDayIndex,
      );

      const maxTemp = Math.round(weatherData.temperature_2m_max[forecastIndex]);
      const minTemp = Math.round(weatherData.temperature_2m_min[forecastIndex]);

      let weatherCode;
      if (isTestMode) {
        if (activeDay === -1) {
          weatherCode =
            effectiveWeatherOverride.overview !== null
              ? effectiveWeatherOverride.overview
              : weatherData.weathercode[forecastIndex];
        } else {
          weatherCode =
            effectiveWeatherOverride.days[activeDay] !== undefined
              ? effectiveWeatherOverride.days[activeDay]
              : weatherData.weathercode[forecastIndex];
        }
      } else {
        weatherCode = weatherData.weathercode[forecastIndex];
      }

      const info = getWeatherInfo(weatherCode);

      return {
        icon: info.icon,
        temp: `${minTemp}°C / ${maxTemp}°C`,
        desc: info.text,
        advice: info.advice,
        code: weatherCode,
      };
    }

    return {
      icon: <Cloud className="w-7 h-7 text-stone-300" />,
      temp: "--",
      desc: weatherForecast.loading ? "載入中..." : "無資料",
      advice: weatherForecast.loading ? "請稍候" : "無法取得預報，請稍後再試",
    };
  }, [
    activeDay,
    weatherForecast,
    getWeatherInfo,
    isTestMode,
    testWeatherOverride,
    frozenTestWeatherOverride,
    tripStatus,
    currentTripDayIndex,
  ]);

  // 統一主題風格，根據天氣狀況動態調整環境色
  const theme = React.useMemo(() => {
    const currentCode =
      activeDay === -1 ? userWeather.weatherCode : displayWeather.code;
    const sky = getSkyCondition(currentCode);

    const ambientColors = {
      clear: isDarkMode
        ? currentTheme.ambientColors.clear.dark
        : currentTheme.ambientColors.clear.light,
      cloudy: isDarkMode
        ? currentTheme.ambientColors.cloudy.dark
        : currentTheme.ambientColors.cloudy.light,
      rain: isDarkMode
        ? currentTheme.ambientColors.rain.dark
        : currentTheme.ambientColors.rain.light,
      snow: isDarkMode
        ? currentTheme.ambientColors.snow.dark
        : currentTheme.ambientColors.snow.light,
      thunderstorm: isDarkMode
        ? currentTheme.ambientColors.thunderstorm.dark
        : currentTheme.ambientColors.thunderstorm.light,
      fog: isDarkMode
        ? currentTheme.ambientColors.fog.dark
        : currentTheme.ambientColors.fog.light,
    };

    const ambient = ambientColors[sky] || ambientColors.clear;

    return {
      bg: isDarkMode
        ? `${currentTheme.bgGradientDark} bg-[image:var(--bg-texture)] bg-fixed`
        : `${currentTheme.bgGradientLight} bg-[image:var(--bg-texture)] bg-fixed`,

      text: isDarkMode
        ? currentTheme.textColors?.dark || `text-${cBase}-100`
        : currentTheme.textColors?.light || `text-${cBase}-800`,

      textSec: isDarkMode
        ? currentTheme.textColors?.secDark || `text-${cBase}-300`
        : currentTheme.textColors?.secLight || `text-${cBase}-600`,

      cardBg: isDarkMode
        ? currentTheme.glassColors.card.dark
        : currentTheme.glassColors.card.light,

      // 邊框
      cardBorder: isDarkMode ? `border-white/10` : `border-${cBase}-200/40`,

      // 陰影系統（分層次）
      cardShadow: isDarkMode
        ? "shadow-2xl shadow-black/40"
        : `shadow-xl shadow-${cBase}-500/5`,

      // 額外陰影層級
      shadowSm: isDarkMode
        ? "shadow-sm shadow-black/30"
        : "shadow-sm shadow-stone-200/50",
      shadowMd: isDarkMode
        ? "shadow-lg shadow-black/35"
        : `shadow-md shadow-${cBase}-300/30`,
      shadowLg: isDarkMode
        ? "shadow-2xl shadow-black/40"
        : `shadow-lg shadow-${cBase}-400/20`,
      shadowXl: isDarkMode
        ? "shadow-2xl shadow-black/50"
        : `shadow-xl shadow-${cBase}-500/25`,

      // 強調色
      accent: isDarkMode ? `text-${cAccent}-300` : `text-${cAccent}-600`,
      accentBg: isDarkMode ? `bg-${cAccent}-500/20` : `bg-${cAccent}-100`,

      // 導覽列
      navBg: isDarkMode
        ? currentTheme.glassColors.nav.dark
        : currentTheme.glassColors.nav.light,

      // 導覽按鈕樣式（區別於卡片）
      navBtnStyle: isDarkMode
        ? "bg-[#2A2A2A]/60 border-white/15"
        : "bg-stone-100/85 border-stone-300/60 shadow-sm",

      // 裝飾光暈
      blob1: isDarkMode
        ? currentTheme.blobs.dark[0]
        : currentTheme.blobs.light[0],
      blob2: isDarkMode
        ? currentTheme.blobs.dark[1]
        : currentTheme.blobs.light[1],
      blob3: isDarkMode
        ? currentTheme.blobs.dark[2]
        : currentTheme.blobs.light[2],

      // 環境色樣式
      ambientStyle: { backgroundColor: ambient },
    };
  }, [
    isDarkMode,
    cBase,
    cAccent,
    currentTheme,
    activeDay,
    userWeather.weatherCode,
    displayWeather.code,
  ]);

  // Weather detail payload for the new page/component
  const detailWeatherData = React.useMemo(() => {
    if (activeDay === -1) {
      const desc =
        userWeather?.desc ||
        (userWeather?.weatherCode != null
          ? getWeatherData(userWeather.weatherCode)?.text
          : "");
      return userWeather
        ? { ...userWeather, desc, loading: userWeather.loading }
        : null;
    }

    const locKey = getDailyLocationKey(activeDay, itineraryData, tripConfig);
    const forecast = weatherForecast[locKey];
    if (!forecast) return null;

    const code = forecast.weathercode?.[activeDay] ?? forecast.weathercode?.[0];
    const info = code != null ? getWeatherData(code) : null;
    const locName =
      tripConfig.locations.find((l) => l.key === locKey)?.name || locKey;

    return {
      temp:
        forecast.temperature_2m_max?.[activeDay] ??
        forecast.temperature_2m_max?.[0] ??
        null,
      desc: info?.text || "",
      locationName: locName,
      weatherCode: code,
      hourly: forecast.hourly,
      daily: forecast,
      loading: weatherForecast.loading,
      updatedAt: weatherForecast.updatedAt,
    };
  }, [activeDay, userWeather, weatherForecast]);

  const weatherDetailLoading =
    !isAppReady ||
    (activeDay === -1 ? userWeather?.loading : weatherForecast.loading);

  // --- 初始化載入畫面 (Splash Screen) ---
  // 當已解鎖但定位或初始資料尚未就緒時顯示
  if (!isAppReady) {
    return (
      <main
        id="main-content"
        className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDarkMode ? currentTheme.mainBg.dark : currentTheme.mainBg.light}`}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full blur-3xl animate-blob opacity-20 ${theme.blob1}`}
          ></div>
          <div
            className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full blur-3xl animate-blob animation-delay-4000 opacity-20 ${theme.blob3}`}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
          <div
            className={`p-4 rounded-full shadow-xl ${isDarkMode ? "bg-neutral-800" : "bg-white"}`}
          >
            <LocateFixed className={`w-8 h-8 animate-spin ${colors.blue}`} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-widest mb-2">
              準備旅程中…
            </h1>
            <p className={`text-xs font-medium ${theme.textSec}`}>
              正在確認您的位置與天氣資訊
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 決定當前應顯示的天氣特效代碼
  let currentEffectCode =
    activeDay === -1 ? userWeather.weatherCode : displayWeather.code;

  // 應用測試模式或凍結的天氣覆寫
  const effectiveWeatherOverride =
    frozenTestWeatherOverride || testWeatherOverride;
  if (activeDay === -1 && effectiveWeatherOverride.overview !== null) {
    currentEffectCode = effectiveWeatherOverride.overview;
  } else if (
    activeDay >= 0 &&
    effectiveWeatherOverride.days[activeDay] !== undefined
  ) {
    currentEffectCode = effectiveWeatherOverride.days[activeDay];
  }

  const particleType = getParticleType(currentEffectCode, isDarkMode);
  const skyCondition = getSkyCondition(currentEffectCode);
  const isDayTime = !isDarkMode;
  let dynamicBgStyle = {};

  const weatherColors = currentTheme.weatherColors;

  // 根據天氣狀況動態調整背景色，增強沉浸感
  if (isDayTime) {
    const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(
      currentEffectCode,
    );
    const isSnowing = [71, 73, 75, 77, 85, 86].includes(currentEffectCode);
    const isFoggy = [45, 48].includes(currentEffectCode);
    const isThunderstorm = [95, 96, 99].includes(currentEffectCode);
    const isCloudy = [1, 2, 3].includes(currentEffectCode);

    if (isThunderstorm) {
      dynamicBgStyle = { backgroundColor: currentTheme.dynamicBg.rain.dark };
    } else if (isRaining) {
      dynamicBgStyle = { backgroundColor: weatherColors.rain };
    } else if (isSnowing) {
      dynamicBgStyle = { backgroundColor: weatherColors.snow };
    } else if (isFoggy) {
      dynamicBgStyle = { backgroundColor: currentTheme.dynamicBg.rain.light };
    } else if (isCloudy) {
      dynamicBgStyle = { backgroundColor: currentTheme.dynamicBg.cloud };
    }
  }

  return (
    <div
      style={{ ...containerStyle, ...dynamicBgStyle }}
      className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text} relative overflow-hidden font-sans touch-pan-y`}
      onTouchStart={handleMainTouchStart}
      onTouchMove={handleMainTouchMove}
      onTouchEnd={handleMainTouchEnd}
    >
      {connectionNotice ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[200] flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold shadow-xl backdrop-blur-lg ${
            connectionNotice === "offline"
              ? "border-amber-300/40 bg-amber-950/90 text-amber-100"
              : "border-emerald-300/40 bg-emerald-800/90 text-white"
          }`}
        >
          {connectionNotice === "offline" ? (
            <WifiOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Wifi aria-hidden="true" className="h-4 w-4" />
          )}
          <span>
            {connectionNotice === "offline"
              ? "目前離線，顯示已快取資料"
              : "已恢復網路連線"}
          </span>
        </div>
      ) : null}

      {/* 下拉重新整理指示器 */}
      <div
        className="fixed top-0 left-0 w-full flex justify-center pointer-events-none z-[100] transition-opacity duration-300"
        style={{
          transform: `translateY(${pullDistance - 40}px)`,
          opacity: pullDistance > 20 ? 1 : 0,
        }}
      >
        <div
          className={`p-2 rounded-full shadow-lg backdrop-blur-md border ${componentStyles.itineraryCard}`}
        >
          <RotateCcw
            className={`w-5 h-5 ${theme.accent} ${isRefreshing ? "animate-spin" : ""}`}
            style={{ transform: `rotate(${pullDistance * 3}deg)` }}
          />
        </div>
      </div>

      {/* 背景裝飾球：隨主題與天氣變換顏色 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-3xl animate-blob transition-colors duration-700 ${theme.blob1}`}
        ></div>
        <div
          className={`absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-3xl animate-blob animation-delay-2000 transition-colors duration-700 ${theme.blob2}`}
        ></div>
        <div
          className={`absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full blur-3xl animate-blob animation-delay-4000 transition-colors duration-700 ${theme.blob3}`}
        ></div>
      </div>

      <style>{`
      @keyframes cloudFloat {
          from { transform: translateX(-100%); }
          to { transform: translateX(100vw); }
      }
      @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
      }
      @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
      }
      .animate-success-glow { animation: successGlow 0.8s ease-out; }
      .animate-slide-up { animation: slideUp 0.3s ease-out; }
      .animate-fadeInLeft { animation: fadeInLeft 0.2s ease-out; }
      .animate-slide-down { animation: slideDown 0.3s ease-out; }
      .animate-scale-in { animation: scaleIn 0.25s ease-out; }
      .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      <SkyObjects isDay={!isDarkMode} condition={skyCondition} />
      <WeatherParticles type={particleType} isDay={!isDarkMode} />
      {/* 雷雨時疊加雨滴特效 */}
      {particleType === "lightning" && (
        <WeatherParticles type="rain" isDay={!isDarkMode} />
      )}

      <main
        id="main-content"
        className="max-w-md mx-auto relative min-h-screen flex flex-col z-10"
      >
        <TripHeader
          tripConfig={tripConfig}
          isDarkMode={isDarkMode}
          theme={theme}
          componentStyles={componentStyles}
          testModeClickCount={testModeClickCount}
          onTitleClick={handleTitleClick}
          onLock={handleLockButtonClick}
          onToggleTheme={() => {
            handleInterruptClick();
            toggleTheme();
          }}
          rateData={rateData}
          isOnline={isOnline}
        />

        {/* --- 分頁內容 --- */}
        <TripTabPanels
          activeTab={activeTab}
          visitedTabs={visitedTabs}
          activeDay={activeDay}
          changeDay={changeDay}
          direction={direction}
          slideVariants={slideVariants}
          navContainerRef={navContainerRef}
          navItemsRef={navItemsRef}
          itineraryData={itineraryData}
          isDarkMode={isDarkMode}
          theme={theme}
          componentStyles={componentStyles}
          tripConfig={tripConfig}
          tripStatus={tripStatus}
          daysUntilTrip={daysUntilTrip}
          checklistData={checklistData}
          currentTripDayIndex={currentTripDayIndex}
          weatherForecast={weatherForecast}
          userWeather={userWeather}
          displayWeather={displayWeather}
          isFlightInfoExpanded={isFlightInfoExpanded}
          setIsFlightInfoExpanded={setIsFlightInfoExpanded}
          handleCopy={handleCopy}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          getMapLink={getMapLink}
          colors={colors}
          currentTheme={currentTheme}
          handleWeatherDetailOpen={handleWeatherDetailOpen}
          isUpdatingLocation={isUpdatingLocation}
          isTestMode={isTestMode}
          testDateTime={testDateTime}
          getWeatherInfo={getWeatherInfo}
          getUserLocationWeather={getUserLocationWeather}
          handleMapModalToggle={handleMapModalToggle}
          scrollContainerRef={scrollContainerRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          current={current}
          currentLocation={currentLocation}
          dayMapEvents={dayMapEvents}
          otherUsersLocations={otherUsersLocations}
          currentUser={currentUser}
          maptilerKey={maptilerKey}
          guidesData={guidesData}
          usefulLinks={usefulLinks}
          shopGuideData={shopGuideData}
          aiMode={aiMode}
          handleSwitchMode={handleSwitchMode}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          showAiSearch={showAiSearch}
          setShowAiSearch={setShowAiSearch}
          aiSearchQuery={aiSearchQuery}
          setAiSearchQuery={setAiSearchQuery}
          getSearchResults={getSearchResults}
          scrollToMessage={scrollToMessage}
          handleClearChat={handleClearChat}
          messages={messages}
          renderMessage={renderMessage}
          handleSpeak={handleSpeak}
          isLoading={isLoading}
          loadingText={loadingText}
          chatEndRef={chatEndRef}
          setFullPreviewImage={setFullPreviewImage}
          expandedMessages={expandedMessages}
          toggleMessageExpand={toggleMessageExpand}
          messageRefs={messageRefs}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          listeningLang={listeningLang}
          toggleListening={toggleListening}
          fileInputRef={fileInputRef}
          handleImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          clearImage={clearImage}
          handleSendMessage={handleSendMessage}
          rateData={rateData}
          gasUrl={gasUrl}
          gasToken={gasToken}
          apiKey={apiKey}
          showToast={showToast}
        />

        <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-end gap-2">
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTabPreload={preloadTab}
              handleInterruptClick={() => {}}
              isDarkMode={isDarkMode}
              theme={currentTheme}
            />
            <TripToolsMenu
              isDarkMode={isDarkMode}
              isSharing={isSharing}
              locationSource={locationSource}
              hasLocationPermission={hasLocationPermission}
              onShareLocation={handleShareLocation}
              onOpenCalculator={handleCalculatorOpen}
            />
          </div>
        </div>

        {/* 匯率計算機彈窗 */}
        {isCalculatorOpen && (
          <Suspense
            fallback={<LazyPanelFallback label="載入匯率計算機中…" overlay />}
          >
            <CalculatorModal
              isOpen
              onClose={handleCalculatorClose}
              isDarkMode={isDarkMode}
              rateData={rateData}
              currencyCode={tripConfig.currency.code}
              currencyTarget={tripConfig.currency.target}
            />
          </Suspense>
        )}

        {/* 測試模式面板 (開發與測試用) */}
        {isTestMode && (
          <Suspense
            fallback={<LazyPanelFallback label="載入測試工具中…" overlay />}
          >
            <TestModePanel
              isOpen
              onClose={handleTestModeClose}
              testDateTime={testDateTime}
              onDateTimeChange={(newDateTime) => {
                debugLog(
                  `🧪 更新時間: ${testDateTime.toLocaleString("zh-TW")} -> ${newDateTime.toLocaleString("zh-TW")}`,
                );
                setTestDateTime(newDateTime);
              }}
              testLatitude={testLatitude}
              testLongitude={testLongitude}
              onLocationChange={(coords) => {
                debugLog(
                  `🧪 更新位置: (${testLatitude}, ${testLongitude}) -> (${coords.lat}, ${coords.lon})`,
                );
                setTestLatitude(coords.lat);
                setTestLongitude(coords.lon);
                // 測試模式下主動抓取新座標的天氣
                getUserLocationWeather({
                  isSilent: false,
                  coords: { latitude: coords.lat, longitude: coords.lon },
                });
              }}
              testWeatherOverride={testWeatherOverride}
              onWeatherChange={(newOverride) => {
                debugLog(
                  `🧪 更新天氣覆蓋: `,
                  testWeatherOverride,
                  ` -> `,
                  newOverride,
                );
                setTestWeatherOverride(newOverride);
              }}
              theme={theme}
              isDarkMode={isDarkMode}
              itineraryData={itineraryData}
              currentUserWeather={userWeather}
              isFrozen={!!frozenTestDateTime || !!frozenTestWeatherOverride}
              onFreeze={freezeTestSettings}
              onUnfreeze={unfreezeTestSettings}
              maptilerKey={maptilerKey}
            />
          </Suspense>
        )}

        {/* Toast 通知提示 */}
        {toast.show && (
          <div
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-5 py-2.5 rounded-full shadow-xl z-[60] flex items-center gap-2 animate-bounce backdrop-blur-lg border 
            ${
              toast.type === "error"
                ? isDarkMode
                  ? "bg-red-900/85 text-white border-red-700/60 ring-1 ring-red-600/30"
                  : "bg-red-500/85 text-white border-white/40 ring-1 ring-white/20"
                : isDarkMode
                  ? "bg-green-800/85 text-white border-green-700/60 ring-1 ring-green-600/30"
                  : "bg-emerald-600/85 text-white border-white/40 ring-1 ring-white/20"
            }`}
          >
            {toast.type === "error" ? (
              <X className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span className="text-sm font-bold tracking-wide">
              {toast.message}
            </span>
          </div>
        )}

        {/* 圖片放大預覽遮罩 */}
        <AnimatePresence>
          {fullPreviewImage && (
            <motion.div
              ref={previewDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="圖片預覽"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullPreviewImage(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                <img
                  src={fullPreviewImage}
                  alt="圖片完整預覽"
                  width="1200"
                  height="1200"
                  className="allow-touch-callout max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />
                {isIOSSafari && (
                  <div className="absolute bottom-4 left-4 text-[11px] md:text-xs text-white/90 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-lg border border-white/10 ring-1 ring-white/5 shadow-xl">
                    iOS 提示：長按圖片即可儲存
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex gap-2 px-2 py-2 rounded-full bg-black/50 backdrop-blur-lg border border-white/10 ring-1 ring-white/5 shadow-xl">
                  <button
                    onClick={handleDownloadPreview}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all duration-300 hover:scale-105 active:scale-95 ring-1 ring-white/10"
                    aria-label="下載圖片"
                    title="下載"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullPreviewImage(null);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all duration-300 hover:scale-105 active:scale-95 ring-1 ring-white/10"
                    aria-label="關閉預覽"
                    title="關閉"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 圖片上傳確認視窗 */}
        <AnimatePresence>
          {tempImage && (
            <motion.div
              ref={imageConfirmDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="確認上傳圖片"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex flex-col items-center justify-center overscroll-contain bg-black/95 p-4 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <img
                  src={tempImage}
                  alt="待確認的上傳圖片"
                  width="1200"
                  height="1200"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </motion.div>

              <p className="text-white/70 text-sm mt-6 mb-8 font-medium tracking-wide">
                照片清楚嗎？請確認是否使用此圖片
              </p>

              <div className="flex gap-6 w-full max-w-xs">
                <button
                  onClick={handleCancelImage}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-neutral-800/80 backdrop-blur-lg text-neutral-300 border border-neutral-700/60 ring-1 ring-neutral-600/30 hover:bg-neutral-700/90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <X className="w-5 h-5" /> 取消
                </button>
                <button
                  onClick={handleConfirmImage}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-sky-600/90 backdrop-blur-lg text-white border border-sky-500/40 ring-1 ring-sky-400/30 shadow-lg shadow-sky-900/30 hover:bg-sky-500/95 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> 確認使用
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* iOS PWA 安裝提示橫幅 */}
        <AnimatePresence>
          {showIOSInstallPrompt && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-[9999] mx-auto max-w-md"
              style={{
                paddingTop: "max(1rem, env(safe-area-inset-top))",
                paddingLeft: "max(1rem, env(safe-area-inset-left))",
                paddingRight: "max(1rem, env(safe-area-inset-right))",
              }}
            >
              <div className="mx-4 bg-gradient-to-br from-blue-600 to-blue-700 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-400/30 overflow-hidden">
                <div className="p-4 relative">
                  {/* 關閉按鈕 */}
                  <button
                    onClick={() => {
                      setShowIOSInstallPrompt(false);
                      tripStorage.setItem("ios-install-prompt-closed", "true");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors"
                    aria-label="關閉提示"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* 內容 */}
                  <div className="flex items-start gap-3 pr-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <Download className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1 text-white">
                      <h3 className="font-bold text-base mb-1">安裝到主畫面</h3>
                      <p className="text-sm text-blue-100 leading-relaxed mb-3">
                        將此 App 加入主畫面，享受完整螢幕體驗
                      </p>

                      {/* 步驟說明 */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs text-blue-50 space-y-2 border border-white/20">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            1
                          </span>
                          <span>
                            點擊底部的{" "}
                            <Share2 className="inline w-4 h-4 mx-0.5" />{" "}
                            分享按鈕
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            2
                          </span>
                          <span>選擇「加入主畫面」</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            3
                          </span>
                          <span>點擊右上角「新增」完成</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 螢幕方向鎖定警告 */}
        <AnimatePresence>
          {showOrientationWarning && (
            <motion.div
              ref={orientationDialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="orientation-warning-title"
              aria-describedby="orientation-warning-description"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center overscroll-contain p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowOrientationWarning(false)}
            >
              <motion.div
                initial={{ rotate: 90 }}
                animate={{ rotate: 0 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 max-w-sm text-center border-2 border-orange-300/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Phone className="w-12 h-12 text-white transform rotate-90" />
                </div>

                <h3
                  id="orientation-warning-title"
                  className="text-2xl font-bold text-white mb-3"
                >
                  請旋轉螢幕
                </h3>
                <p
                  id="orientation-warning-description"
                  className="text-white/90 text-base leading-relaxed mb-6"
                >
                  為了獲得最佳體驗
                  <br />
                  請將裝置轉回直向模式
                </p>

                <button
                  onClick={() => setShowOrientationWarning(false)}
                  className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 active:bg-orange-100 transition-colors shadow-lg"
                >
                  我知道了
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 天氣詳情彈窗 (Weather Detail Modal) - 🚀 優化：Keep Alive */}
        <div
          aria-hidden={!showWeatherDetail || !detailWeatherData}
          inert={!showWeatherDetail || !detailWeatherData}
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center overscroll-contain bg-black/60 backdrop-blur-sm p-4 transition-[opacity] duration-300 ${
            showWeatherDetail && detailWeatherData
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none delay-100"
          }`}
        >
          {detailWeatherData && (
            <>
              {/* Backdrop Click */}
              <button
                type="button"
                aria-label="關閉天氣詳情"
                className="absolute inset-0"
                onClick={handleWeatherDetailClose}
              />

              {/* Modal Content */}
              <div
                ref={weatherDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="天氣詳情"
                tabIndex={-1}
                className={`relative z-10 w-full max-w-[400px] transition-[opacity,transform] duration-300 ${
                  showWeatherDetail && detailWeatherData
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-4"
                }`}
              >
                <Suspense
                  fallback={<LazyPanelFallback label="載入天氣詳情中…" />}
                >
                  <WeatherDetail
                    weather={detailWeatherData}
                    activeDay={activeDay}
                    simulatedDate={
                      frozenTestDateTime ||
                      (isTestMode ? testDateTime : new Date())
                    }
                    loading={weatherDetailLoading}
                    isDarkMode={isDarkMode}
                    theme={currentTheme}
                    onClose={handleWeatherDetailClose}
                    onRefresh={async () => {
                      if (activeDay === -1) {
                        await getUserLocationWeather({ isSilent: false });
                      } else {
                        const refreshed = await fetchWeatherForecast({
                          showLoading: true,
                        });
                        showToast(
                          refreshed
                            ? "天氣預報已更新"
                            : "無法更新天氣預報，已保留原有資料",
                          refreshed ? "success" : "error",
                        );
                      }
                    }}
                    advice={(() => {
                      if (
                        userWeather?.temp == null ||
                        detailWeatherData.temp == null
                      )
                        return null;
                      const targetTemp =
                        detailWeatherData.daily?.temperature_2m_max?.[0] ||
                        detailWeatherData.temp;
                      const diff = targetTemp - userWeather.temp;
                      const absDiff = Math.abs(diff).toFixed(0);
                      const isColder = diff < 0;
                      const code = detailWeatherData.weatherCode;

                      const isRainy = [
                        51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99,
                      ].includes(code);
                      const isSnowy = [71, 73, 75, 77, 85, 86].includes(code);

                      let extraAdvice = "建議穿著輕便";
                      if (isColder && absDiff > 3) extraAdvice = "請加強保暖";
                      if (isRainy) extraAdvice += "並攜帶雨具";
                      if (isSnowy) extraAdvice += "並穿著防滑鞋";

                      return (
                        <>
                          天氣為 <b>{detailWeatherData.desc}</b>， 氣溫比目前
                          {isColder ? "低" : "高"}{" "}
                          <b
                            style={{ color: isColder ? "#007aff" : "#ff9500" }}
                          >
                            {absDiff}°C
                          </b>
                          ，{extraAdvice}。
                        </>
                      );
                    })()}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ItineraryApp;

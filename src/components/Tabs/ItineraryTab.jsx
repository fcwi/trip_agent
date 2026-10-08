import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import TripOverview from "../Itinerary/TripOverview.jsx";
import DaySelector from "../Itinerary/DaySelector.jsx";
import DayItinerary from "../Itinerary/DayItinerary.jsx";
import { useTripChecklist } from "../../hooks/useTripChecklist.js";

const DayMap = lazy(() => import("../DayMap.jsx"));

const DeferredDayMap = (props) => {
  const { isDarkMode } = props;
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    if (shouldLoad) return undefined;

    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const fallback = (
    <div
      role="status"
      aria-live="polite"
      className={`flex h-64 items-center justify-center rounded-xl border text-xs font-semibold ${
        isDarkMode
          ? "border-neutral-800 bg-neutral-900/30 text-neutral-400"
          : "border-stone-200 bg-white/60 text-stone-500"
      }`}
    >
      {shouldLoad ? "地圖載入中…" : "向下捲動時載入互動地圖"}
    </div>
  );

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          <DayMap {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

const ItineraryTab = ({
  activeDay,
  changeDay,
  direction,
  slideVariants,
  navContainerRef,
  navItemsRef,
  itineraryData,
  isDarkMode,
  theme,
  componentStyles,
  tripConfig,
  tripStatus,
  daysUntilTrip,
  checklistData,
  currentTripDayIndex,
  temporalContext,
  userWeather,
  displayWeather,
  isFlightInfoExpanded,
  setIsFlightInfoExpanded,
  handleCopy,
  expandedItems,
  toggleExpand,
  getMapLink,
  colors,
  handleWeatherDetailOpen,
  isUpdatingLocation,
  getWeatherInfo,
  getUserLocationWeather,
  handleMapModalToggle,
  scrollContainerRef,
  onTouchStart,
  onTouchEnd,
  pullDistance,
  isRefreshing,
  current,
  currentLocation,
  dayMapEvents,
  otherUsersLocations,
  currentUser,
  maptilerKey,
}) => {
  const { checklist, setChecklist, resetChecklist } =
    useTripChecklist(checklistData);

  // 滑動方向追蹤狀態
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isHorizontalSwipeRef = useRef(null);

  // 包裝 onTouchStart - 同時記錄起始位置
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipeRef.current = null;
    setSwipeDirection(null);
    setSwipeDistance(0);
    // 調用原始的 onTouchStart
    if (onTouchStart) onTouchStart(e);
  };

  // 新增 onTouchMove - 追蹤滑動方向
  const handleTouchMove = (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchCurrentX - touchStartRef.current.x;
    const diffY = Math.abs(touchCurrentY - touchStartRef.current.y);
    const absDiffX = Math.abs(diffX);

    // 判斷是否為水平滑動
    if (
      isHorizontalSwipeRef.current === null &&
      (absDiffX > 10 || diffY > 10)
    ) {
      isHorizontalSwipeRef.current = absDiffX > diffY;
    }

    // 更新滑動方向和距離
    if (isHorizontalSwipeRef.current && absDiffX > 20) {
      setSwipeDirection(diffX < 0 ? "left" : "right");
      setSwipeDistance(Math.min(absDiffX, 150));
    }
  };

  // 包裝 onTouchEnd - 重置狀態
  const handleTouchEnd = (e) => {
    setSwipeDirection(null);
    setSwipeDistance(0);
    isHorizontalSwipeRef.current = null;
    // 調用原始的 onTouchEnd
    if (onTouchEnd) onTouchEnd(e);
  };

  return (
    <div
      className="flex-1 space-y-5 px-4 pb-24 overflow-x-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={scrollContainerRef}
      style={{
        willChange: "scroll-position",
        transform: "translateZ(0)",
        WebkitPerspective: "1000px",
        perspective: "1000px",
      }}
    >
      {/* 滑動箭頭指示器 - 往左滑時顯示右側箭頭 */}
      <div
        className={`fixed right-2 top-1/2 z-50 pointer-events-none transition-all duration-200 ${
          swipeDirection === "left"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        }`}
        style={{
          transform: `translateY(-50%) translateX(${swipeDirection === "left" ? -swipeDistance * 0.3 : 0}px)`,
        }}
      >
        <div
          className={`p-2.5 rounded-full shadow-lg backdrop-blur-md ${
            isDarkMode
              ? "bg-sky-500/90 ring-1 ring-sky-400/30"
              : "bg-sky-500/90 ring-1 ring-sky-400/50"
          }`}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* 滑動箭頭指示器 - 往右滑時顯示左側箭頭 */}
      <div
        className={`fixed left-2 top-1/2 z-50 pointer-events-none transition-all duration-200 ${
          swipeDirection === "right"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75"
        }`}
        style={{
          transform: `translateY(-50%) translateX(${swipeDirection === "right" ? swipeDistance * 0.3 : 0}px)`,
        }}
      >
        <div
          className={`p-2.5 rounded-full shadow-lg backdrop-blur-md ${
            isDarkMode
              ? "bg-sky-500/90 ring-1 ring-sky-400/30"
              : "bg-sky-500/90 ring-1 ring-sky-400/50"
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </div>
      </div>
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

      <DaySelector
        {...{
          activeDay,
          changeDay,
          navContainerRef,
          navItemsRef,
          itineraryData,
          tripStatus,
          currentTripDayIndex,
        }}
      />

      {/* Animation Wrapper */}
      <div
        className="relative w-full h-full"
        style={{
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          isolation: "isolate",
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {activeDay === -1 ? (
            <motion.div
              key="overview"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              <TripOverview
                {...{
                  itineraryData,
                  tripConfig,
                  tripStatus,
                  daysUntilTrip,
                  currentTripDayIndex,
                  temporalContext,
                  changeDay,
                  isDarkMode,
                  theme,
                  colors,
                  userWeather,
                  handleWeatherDetailOpen,
                  getUserLocationWeather,
                  isUpdatingLocation,
                  getWeatherInfo,
                  isFlightInfoExpanded,
                  setIsFlightInfoExpanded,
                  handleCopy,
                  checklist,
                  setChecklist,
                  resetChecklist,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`day-${activeDay}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5"
            >
              <DayItinerary
                day={current}
                {...{
                  activeDay,
                  tripConfig,
                  currentLocation,
                  displayWeather,
                  handleWeatherDetailOpen,
                  expandedItems,
                  toggleExpand,
                  getMapLink,
                }}
                map={
                  <DeferredDayMap
                    events={dayMapEvents}
                    userLocation={userWeather}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    onModalToggle={handleMapModalToggle}
                    otherUsersLocations={otherUsersLocations}
                    currentUser={currentUser}
                    MAPTILER_KEY={maptilerKey}
                  />
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ItineraryTab;

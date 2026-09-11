import { useEffect, useRef, useState } from "react";

/**
 * Itinerary day pager: active day, slide direction, swipe, pull-to-refresh.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 *
 * Late-bound deps (location refresh / test-mode click counters) go through
 * `depsRef` so the hook can sit above those declarations without reordering
 * the shell.
 */
export const useItineraryDayPager = ({
  itineraryLength,
  scrollContainerRef,
  showWeatherDetail,
  isCalculatorOpen,
  isMapModalOpen,
  depsRef,
}) => {
  const toast = (message, type) => depsRef.current?.showToast?.(message, type);

  const [activeDay, setActiveDay] = useState(-1);
  const navContainerRef = useRef(null);
  const navItemsRef = useRef({});

  useEffect(() => {
    const currentTab = navItemsRef.current[activeDay];

    if (currentTab) {
      currentTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeDay]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeDay, scrollContainerRef]);

  const [touchStart, setTouchStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullThreshold = 80;
  const startYRef = useRef(0);

  const handleMainTouchStart = (e) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].pageY;
    }
  };

  const handleMainTouchMove = (e) => {
    if (startYRef.current === 0) return;
    const currentY = e.touches[0].pageY;
    const diff = currentY - startYRef.current;
    if (diff > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(diff * 0.4, pullThreshold + 20));
    }
  };

  const triggerRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const refresh = depsRef.current?.onPullRefresh;
      await Promise.all([refresh ? refresh() : Promise.resolve()]);
      toast("資訊已更新 ✨");
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err) {
      console.error("更新失敗:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMainTouchEnd = () => {
    if (pullDistance > pullThreshold) {
      triggerRefresh();
    }
    setPullDistance(0);
    startYRef.current = 0;
  };

  const [[, direction], setPage] = useState([activeDay, 0]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      position: "absolute",
      width: "100%",
      z: 0,
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      z: 0,
      zIndex: 1,
      willChange: "auto",
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
        opacity: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      position: "absolute",
      width: "100%",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      transition: {
        duration: 0.2,
        ease: "easeIn",
        opacity: { duration: 0.15 },
      },
    }),
  };

  const changeDay = (newDay) => {
    const newDirection = newDay > activeDay ? 1 : -1;
    setPage([newDay, newDirection]);
    setActiveDay(newDay);
  };

  const onTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = (e) => {
    if (!touchStart) return;

    if (showWeatherDetail || isCalculatorOpen || isMapModalOpen) {
      setTouchStart(null);
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const distanceX = touchStart.x - endX;
    const distanceY = touchStart.y - endY;

    const absX = Math.abs(distanceX);
    const absY = Math.abs(distanceY);

    const minSwipeDistance = 75;
    const slopeThreshold = 2.5;

    if (absX > minSwipeDistance && absX > absY * slopeThreshold) {
      const clickCount = depsRef.current?.testModeClickCount ?? 0;
      if (clickCount > 0) {
        depsRef.current?.setTestModeClickCount?.(0);
        toast("連續點擊計數已重置，請重新開始", "info");
      }

      if (distanceX > 0) {
        if (activeDay < itineraryLength - 1) {
          changeDay(activeDay + 1);
        }
      } else if (activeDay > -1) {
        changeDay(activeDay - 1);
      }
    }

    setTouchStart(null);
  };

  return {
    activeDay,
    setActiveDay,
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
  };
};

import { useCallback, useLayoutEffect, useRef } from "react";

export const useTabScrollRestoration = (activeTab) => {
  const scrollPositionsRef = useRef({});
  const isTabSwitchingRef = useRef(false);
  const rememberCurrentScroll = useCallback(() => {
    scrollPositionsRef.current[activeTab] = window.scrollY;
    isTabSwitchingRef.current = true;
  }, [activeTab]);

  useLayoutEffect(() => {
    const tab = activeTab;
    const rememberScrollPosition = () => {
      if (isTabSwitchingRef.current) return;
      scrollPositionsRef.current[tab] = window.scrollY;
    };
    const restoreFrame = requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPositionsRef.current[tab] ?? 0,
        behavior: "instant",
      });
      isTabSwitchingRef.current = false;
    });

    window.addEventListener("scroll", rememberScrollPosition, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(restoreFrame);
      rememberScrollPosition();
      window.removeEventListener("scroll", rememberScrollPosition);
    };
  }, [activeTab]);

  return rememberCurrentScroll;
};

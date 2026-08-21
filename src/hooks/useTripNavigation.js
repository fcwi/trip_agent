import { useCallback, useEffect, useState } from "react";

export const VALID_TABS = new Set([
  "itinerary",
  "finance",
  "ai",
  "shops",
  "guides",
]);

export const resolveTab = (search = "") => {
  const requestedTab = new URLSearchParams(search).get("tab");
  return VALID_TABS.has(requestedTab) ? requestedTab : "itinerary";
};

export const createTabUrl = (tab, href) => {
  const safeTab = VALID_TABS.has(tab) ? tab : "itinerary";
  const url = new URL(href);
  url.searchParams.set("tab", safeTab);
  return `${url.pathname}${url.search}${url.hash}`;
};

export const createNavigationState = (tab, modal) => ({
  tab: VALID_TABS.has(tab) ? tab : "itinerary",
  ...(modal ? { modal } : {}),
});

const currentTab = () => resolveTab(window.location.search);
const currentTabUrl = (tab) => createTabUrl(tab, window.location.href);

export const useTripNavigation = () => {
  const [activeTab, setActiveTab] = useState(currentTab);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([currentTab()]));
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state || {};
      const destinationTab = VALID_TABS.has(state.tab)
        ? state.tab
        : currentTab();

      setActiveTab(destinationTab);
      setVisitedTabs((previousTabs) => {
        if (previousTabs.has(destinationTab)) return previousTabs;
        const nextTabs = new Set(previousTabs);
        nextTabs.add(destinationTab);
        return nextTabs;
      });
      // DayMap 自己負責返回鍵關閉；前進時不強制重建昂貴的地圖實例。
      setActiveModal(state.modal === "map" ? null : state.modal || null);
    };

    window.addEventListener("popstate", handlePopState);

    const initialTab = currentTab();
    window.history.replaceState(
      createNavigationState(initialTab),
      "",
      currentTabUrl(initialTab),
    );

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const changeTab = useCallback(
    (newTab) => {
      if (!VALID_TABS.has(newTab) || newTab === activeTab) return;

      setActiveTab(newTab);
      setVisitedTabs((previousTabs) => {
        if (previousTabs.has(newTab)) return previousTabs;
        const nextTabs = new Set(previousTabs);
        nextTabs.add(newTab);
        return nextTabs;
      });
      window.history.pushState(
        createNavigationState(newTab),
        "",
        currentTabUrl(newTab),
      );
    },
    [activeTab],
  );

  const openModal = useCallback(
    (modal) => {
      setActiveModal(modal);
      window.history.pushState(
        createNavigationState(activeTab, modal),
        "",
        currentTabUrl(activeTab),
      );
    },
    [activeTab],
  );

  const closeModal = useCallback((modal) => {
    setActiveModal((currentModal) =>
      currentModal === modal ? null : currentModal,
    );
    if (window.history.state?.modal === modal) window.history.back();
  }, []);

  return {
    activeTab,
    visitedTabs,
    activeModal,
    changeTab,
    openModal,
    closeModal,
  };
};

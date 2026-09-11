import React, { Suspense } from "react";
import { LazyPanelFallback } from "./LazyPanelFallback.jsx";

const ItineraryTab = React.lazy(() => import("./Tabs/ItineraryTab.jsx"));
const FinanceTab = React.lazy(() => import("./Tabs/FinanceTab.jsx"));
const AIPanel = React.lazy(() => import("./AI/AIPanel.jsx"));
const GuidesTab = React.lazy(() => import("./Tabs/GuidesTab.jsx"));
const ShopsTab = React.lazy(() => import("./Tabs/ShopsTab.jsx"));

/**
 * Tab panels for the authenticated trip shell.
 * Behavior-equivalent extraction from AuthenticatedTripApp — no UX changes.
 */
export default function TripTabPanels({
  activeTab,
  visitedTabs,
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
  weatherForecast,
  userWeather,
  displayWeather,
  isFlightInfoExpanded,
  setIsFlightInfoExpanded,
  handleCopy,
  expandedItems,
  toggleExpand,
  getMapLink,
  colors,
  currentTheme,
  handleWeatherDetailOpen,
  isUpdatingLocation,
  isTestMode,
  testDateTime,
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
  guidesData,
  usefulLinks,
  shopGuideData,
  aiMode,
  handleSwitchMode,
  isSpeaking,
  setIsSpeaking,
  showAiSearch,
  setShowAiSearch,
  aiSearchQuery,
  setAiSearchQuery,
  getSearchResults,
  scrollToMessage,
  handleClearChat,
  messages,
  renderMessage,
  handleSpeak,
  isLoading,
  loadingText,
  chatEndRef,
  setFullPreviewImage,
  expandedMessages,
  toggleMessageExpand,
  messageRefs,
  inputMessage,
  setInputMessage,
  listeningLang,
  toggleListening,
  fileInputRef,
  handleImageSelect,
  selectedImage,
  clearImage,
  handleSendMessage,
  rateData,
  gasUrl,
  gasToken,
  apiKey,
  showToast,
}) {
  return (
    <>
  {/* --- 分頁內容 --- */}

  {/* 1. 行程分頁：首次造訪時載入，之後保留狀態 */}
  <div style={{ display: activeTab === "itinerary" ? "block" : "none" }}>
    {(activeTab === "itinerary" || visitedTabs.has("itinerary")) && (
      <Suspense fallback={<LazyPanelFallback label="載入行程內容中…" />}>
        <ItineraryTab
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
        />
      </Suspense>
    )}
  </div>

  {/* --- 頁籤：實用指南，切換時才載入 --- */}
  {activeTab === "guides" && (
    <Suspense fallback={<LazyPanelFallback label="載入實用指南中…" />}>
      <GuidesTab
        guidesData={guidesData}
        usefulLinks={usefulLinks}
        isDarkMode={isDarkMode}
        theme={theme}
        currentTheme={currentTheme}
        componentStyles={componentStyles}
      />
    </Suspense>
  )}

  {/* --- 頁籤：商家導覽，切換時才載入 --- */}
  {activeTab === "shops" && (
    <Suspense fallback={<LazyPanelFallback label="載入商家指南中…" />}>
      <ShopsTab
        shopGuideData={shopGuideData}
        getMapLink={getMapLink}
        isDarkMode={isDarkMode}
        theme={theme}
        componentStyles={componentStyles}
      />
    </Suspense>
  )}

  {/* --- 頁籤：AI 導遊，首次造訪時載入 --- */}
  <div style={{ display: activeTab === "ai" ? "block" : "none" }}>
    {(activeTab === "ai" || visitedTabs.has("ai")) && (
      <Suspense fallback={<LazyPanelFallback label="載入 AI 導遊中…" />}>
        <AIPanel
          isDarkMode={isDarkMode}
          theme={theme}
          currentTheme={currentTheme}
          componentStyles={componentStyles}
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
          tripConfig={tripConfig}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          listeningLang={listeningLang}
          toggleListening={toggleListening}
          fileInputRef={fileInputRef}
          handleImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          clearImage={clearImage}
          handleSendMessage={handleSendMessage}
        />
      </Suspense>
    )}
  </div>

  {/* --- 頁籤：記帳/記事，首次造訪時載入 --- */}
  <div style={{ display: activeTab === "finance" ? "block" : "none" }}>
    {(activeTab === "finance" || visitedTabs.has("finance")) && (
      <Suspense fallback={<LazyPanelFallback label="載入記帳資料中…" />}>
        <FinanceTab
          isDarkMode={isDarkMode}
          theme={theme}
          rateData={rateData} // 傳遞匯率資料
          gasUrl={gasUrl} // 傳遞 GAS URL
          gasToken={gasToken} // 傳遞 Token
          apiKey={apiKey} // 傳遞 Gemini API Key
          setFullPreviewImage={setFullPreviewImage} // 複用 App.jsx 的圖片預覽遮罩
          showToast={showToast} // 複用 Toast 提示
        />
      </Suspense>
    )}
  </div>

    </>
  );
}

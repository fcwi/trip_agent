import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getLandingOverview } from "../utils/landingOverview.js";

export default function TodayOverviewCard({
  itineraryData,
  tripConfig,
  checklistData,
  temporalContext,
  changeDay,
  isDarkMode,
  theme,
  componentStyles,
  currentTheme,
}) {
  const overview = React.useMemo(
    () =>
      getLandingOverview({
        itineraryData,
        tripConfig,
        checklistData,
        temporalContext,
      }),
    [checklistData, itineraryData, temporalContext, tripConfig],
  );
  const nextEvent = overview.nextEvent;

  return (
    <section
      aria-labelledby="today-overview-heading"
      className={`overflow-hidden rounded-[2rem] border backdrop-blur-2xl ${theme.cardShadow} ${componentStyles.itineraryCard}`}
      style={theme.ambientStyle}
    >
      <div
        className={`bg-gradient-to-r p-5 text-white ${isDarkMode ? currentTheme.buttonGradients.primary.dark : currentTheme.buttonGradients.primary.light}`}
      >
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
          {overview.eyebrow}
        </p>
        <h2
          id="today-overview-heading"
          className="text-xl font-black leading-tight"
        >
          {overview.day?.title || tripConfig.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/85">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {overview.locationName}
          </span>
          {overview.day?.events && (
            <span>{overview.day.events.length} 個行程節點</span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-xl p-2 ${theme.accentBg}`}>
            <Clock3 aria-hidden="true" className={`h-4 w-4 ${theme.accent}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${theme.textSec}`}
            >
              {overview.nextTiming}
            </p>
            {nextEvent ? (
              <>
                <p
                  className={`mt-1 text-base font-bold leading-snug ${theme.text}`}
                >
                  <span className={`mr-2 tabular-nums ${theme.accent}`}>
                    {nextEvent.time}
                  </span>
                  {nextEvent.title}
                </p>
                <p
                  className={`mt-1 flex items-center gap-1.5 text-xs ${theme.textSec}`}
                >
                  <MapPin
                    aria-hidden="true"
                    className="h-3.5 w-3.5 flex-none"
                  />
                  {overview.nextLocation}
                </p>
              </>
            ) : (
              <p className={`mt-1 text-sm font-semibold ${theme.text}`}>
                可以慢慢整理照片與旅程紀錄。
              </p>
            )}
          </div>
        </div>

        <div
          className={`rounded-2xl border p-3 ${isDarkMode ? "border-white/10 bg-black/15" : "border-stone-200/70 bg-white/55"}`}
        >
          <p
            className={`flex items-center gap-1.5 text-xs font-bold ${theme.text}`}
          >
            {overview.neededNow.length ? (
              <Sparkles
                aria-hidden="true"
                className={`h-3.5 w-3.5 ${theme.accent}`}
              />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="h-3.5 w-3.5 text-emerald-500"
              />
            )}
            現在需要
          </p>
          {overview.neededNow.length ? (
            <ul
              className={`mt-2 space-y-1.5 text-xs leading-relaxed ${theme.textSec}`}
            >
              {overview.neededNow.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className={theme.accent}>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-1 text-xs ${theme.textSec}`}>
              目前沒有需要立即處理的項目。
            </p>
          )}
        </div>

        {overview.status !== "after" && (
          <button
            type="button"
            onClick={() => changeDay(overview.dayIndex)}
            className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? "bg-neutral-700 text-neutral-100 hover:bg-neutral-600" : "bg-stone-200 text-stone-700 hover:bg-stone-300"}`}
          >
            查看{overview.status === "during" ? "今日" : "首日"}完整行程
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}

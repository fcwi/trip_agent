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
  const completedCount = checklistData.filter((item) => item.checked).length;
  return (
    <section
      aria-labelledby="today-overview-heading"
      className="travel-panel travel-today"
    >
      <p className="travel-eyebrow">{overview.eyebrow}</p>
      <h2 id="today-overview-heading">
        {overview.day?.title || tripConfig.title}
      </h2>
      <p className="travel-today__location">
        <MapPin aria-hidden="true" className="h-4 w-4" />
        {overview.locationName}
        <span> · {overview.day?.events.length || 0} 個行程節點</span>
      </p>
      {overview.status === "before" && (
        <div className="travel-preparation">
          <p>
            準備進度{" "}
            <strong>
              {completedCount}／{checklistData.length}
            </strong>
          </p>
          <progress
            aria-label="行前準備完成進度"
            value={completedCount}
            max={Math.max(1, checklistData.length)}
          />
        </div>
      )}
      <div className="travel-today__next">
        <Clock3 aria-hidden="true" className="h-5 w-5" />
        <div>
          <p className="travel-muted">{overview.nextTiming}</p>
          {nextEvent ? (
            <>
              <p className="travel-today__event">
                <span>{nextEvent.time}</span>
                {nextEvent.title}
              </p>
              <p className="travel-muted">{overview.nextLocation}</p>
            </>
          ) : (
            <p>
              {overview.status === "after"
                ? "回顧每日行程，收藏這趟旅程的足跡。"
                : "今天的安排已告一段落，可以慢慢休息。"}
            </p>
          )}
        </div>
      </div>
      <div className="travel-today__needs">
        <h3>
          {overview.neededNow.length ? (
            <Sparkles aria-hidden="true" className="h-4 w-4" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          )}
          現在需要
        </h3>
        {overview.neededNow.length ? (
          <ul>
            {overview.neededNow.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="travel-muted">目前沒有需要立即處理的項目。</p>
        )}
      </div>
      <button
        type="button"
        className="travel-primary-button"
        onClick={() =>
          changeDay(overview.status === "after" ? 0 : overview.nextDayIndex)
        }
      >
        {overview.actionLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </section>
  );
}

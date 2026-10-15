import { CloudOff, Info, Loader2, RefreshCw } from "lucide-react";
import "./UtilityState.css";

export default function UtilityState({
  kind = "empty",
  title,
  children,
  onRetry,
  retryLabel = "重新整理",
  showIcon = true,
}) {
  const Icon =
    kind === "loading" ? Loader2 : kind === "offline" ? CloudOff : Info;
  return (
    <div
      className="journal-utility-state"
      data-state={kind}
      role="status"
      aria-live="polite"
    >
      {showIcon && (
        <Icon
          aria-hidden="true"
          className={kind === "loading" ? "journal-state-spinner" : ""}
        />
      )}
      <div className="journal-utility-state__copy">
        <strong>{title}</strong>
        {children && <p>{children}</p>}
      </div>
      {onRetry && (
        <button type="button" className="journal-state-retry" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

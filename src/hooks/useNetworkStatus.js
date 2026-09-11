import { useEffect, useState } from "react";

/**
 * Online/offline status + short-lived connection notice for the trip shell.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [connectionNotice, setConnectionNotice] = useState(() =>
    navigator.onLine ? null : "offline",
  );

  useEffect(() => {
    let recoveryTimer;

    const handleOnline = () => {
      clearTimeout(recoveryTimer);
      setIsOnline(true);
      setConnectionNotice("online");
      recoveryTimer = setTimeout(() => setConnectionNotice(null), 3000);
    };
    const handleOffline = () => {
      clearTimeout(recoveryTimer);
      setIsOnline(false);
      setConnectionNotice("offline");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearTimeout(recoveryTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, connectionNotice };
};

import { useEffect, useState } from "react";
import { useModalAccessibility } from "./useModalAccessibility.js";
import { tripStorage } from "../utils/tripStorage.js";

const detectIOSSafari = () => {
  const ua = navigator.userAgent;
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafariEngine =
    /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
  return {
    isIOSSafari: isIOSDevice && isSafariEngine,
    isIOSDevice,
    isSafariEngine,
  };
};

/**
 * Mobile detection, iOS Safari install prompt, and landscape orientation warning.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
const detectIsMobile = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(ua);
  const isIOSLike =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isWindowsTouch = /Windows/i.test(ua) && navigator.maxTouchPoints > 0;
  const byViewport = window.innerWidth < 768;
  return isAndroid || isIOSLike || isWindowsTouch || byViewport;
};

export const useDeviceChrome = () => {
  const [isMobile, setIsMobile] = useState(detectIsMobile);
  const [isIOSSafari] = useState(() => detectIOSSafari().isIOSSafari);
  const [showIOSInstallPrompt, setShowIOSInstallPrompt] = useState(false);
  const [showOrientationWarning, setShowOrientationWarning] = useState(false);
  const orientationDialogRef = useModalAccessibility(
    showOrientationWarning,
    () => setShowOrientationWarning(false),
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(detectIsMobile());
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const { isIOSDevice, isSafariEngine } = detectIOSSafari();

    if (isIOSDevice && isSafariEngine) {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      const hasClosedPrompt = tripStorage.getItem("ios-install-prompt-closed", [
        "trip_agent_ios_install_prompt_closed",
        "ios_install_prompt_closed",
      ]);

      if (!isStandalone && !hasClosedPrompt) {
        const timer = setTimeout(() => {
          setShowIOSInstallPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;

      if (isLandscape && isMobile) {
        setShowOrientationWarning(true);

        const timer = setTimeout(() => {
          setShowOrientationWarning(false);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        setShowOrientationWarning(false);
      }
    };

    handleOrientationChange();

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    }

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
      if (screen.orientation) {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange,
        );
      }
    };
  }, [isMobile]);

  return {
    isMobile,
    isIOSSafari,
    showIOSInstallPrompt,
    setShowIOSInstallPrompt,
    showOrientationWarning,
    setShowOrientationWarning,
    orientationDialogRef,
  };
};

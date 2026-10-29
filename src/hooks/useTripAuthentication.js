import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_CREDENTIALS } from "../utils/credentialBundle.js";
import { authStorage } from "../utils/authStorage.js";
import { tripStorage } from "../utils/tripStorage.js";

import { requestSession } from "../utils/authClient.js";

const PENDING_LOGOUT = "logout-pending-v1";
const LOCK_REVISION = "last-lock-v1";

export const useTripAuthentication = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const lockRevisionRef = useRef(authStorage.getItem(LOCK_REVISION));
  const clearAuthentication = useCallback(() => {
    setCredentials(EMPTY_CREDENTIALS);
    setPassword("");
    setIsVerified(false);
  }, []);
  useEffect(() => {
    let active = true;
    authStorage.removeItem("password");
    authStorage.removeItem("remembered-unlock-password-v1");
    tripStorage.removeItem("password");
    localStorage.removeItem("trip_agent_password");
    const restore = async () => {
      if (authStorage.getItem(PENDING_LOGOUT)) {
        await requestSession("logout", {});
        authStorage.removeItem(PENDING_LOGOUT);
        return null;
      }
      return requestSession("session");
    };
    restore()
      .then((data) => {
        if (active && data) {
          lockRevisionRef.current = authStorage.getItem(LOCK_REVISION);
          setCredentials(data);
          setIsVerified(true);
        }
      })
      .catch((error) => {
        if (active && error.status !== 401) setAuthError(error.message);
      })
      .finally(() => {
        if (active) setIsAuthReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const handleAuthSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsAuthLoading(true);
      setAuthError("");
      try {
        if (authStorage.getItem(PENDING_LOGOUT)) {
          await requestSession("logout", {});
          authStorage.removeItem(PENDING_LOGOUT);
        }
        const data = await requestSession("login", {
          password,
          remember: rememberDevice,
        });
        lockRevisionRef.current = authStorage.getItem(LOCK_REVISION);
        setCredentials(data);
        setPassword("");
        setIsVerified(true);
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setIsAuthLoading(false);
      }
    },
    [password, rememberDevice],
  );
  const lock = useCallback(() => {
    authStorage.setItem(PENDING_LOGOUT, "true");
    authStorage.setItem(LOCK_REVISION, `${Date.now()}-${Math.random()}`);
    clearAuthentication();
    return requestSession("logout", {})
      .then(() => {
        authStorage.removeItem(PENDING_LOGOUT);
      })
      .catch(() => {
        setAuthError("網站已鎖定；請恢復連線完成伺服器登出，再重新登入。");
      });
  }, [clearAuthentication]);

  useEffect(() => {
    let active = true;
    const restoreCachedPage = async (event) => {
      if (!event.persisted) return;
      if (
        authStorage.getItem(PENDING_LOGOUT) ||
        authStorage.getItem(LOCK_REVISION) !== lockRevisionRef.current
      ) {
        clearAuthentication();
        return;
      }
      try {
        await requestSession("session");
      } catch (error) {
        if (active && error.status === 401) clearAuthentication();
      }
    };
    const syncLock = (event) => {
      if (
        event.key === "trip_agent:auth:last-lock-v1" &&
        event.newValue !== lockRevisionRef.current
      )
        clearAuthentication();
    };
    window.addEventListener("pageshow", restoreCachedPage);
    window.addEventListener("storage", syncLock);
    return () => {
      active = false;
      window.removeEventListener("pageshow", restoreCachedPage);
      window.removeEventListener("storage", syncLock);
    };
  }, [clearAuthentication]);
  return {
    isAuthReady,
    isVerified,
    password,
    setPassword,
    ...credentials,
    authError,
    isAuthLoading,
    rememberDevice,
    setRememberDevice,
    handleAuthSubmit,
    lock,
  };
};

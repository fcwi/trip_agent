import { useCallback, useEffect, useState } from "react";
import { EMPTY_CREDENTIALS } from "../utils/credentialBundle.js";
import { authStorage } from "../utils/authStorage.js";
import { tripStorage } from "../utils/tripStorage.js";

const requestSession = async (path, body) => {
  const response = await fetch(`/api/${path}`, {
    credentials: "same-origin",
    cache: "no-store",
    ...(body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
  if (!response.ok) throw new Error("登入失敗，請確認密碼與伺服器連線後重試");
  return response.json();
};
export const useTripAuthentication = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  useEffect(() => {
    let active = true;
    authStorage.removeItem("password");
    authStorage.removeItem("remembered-unlock-password-v1");
    tripStorage.removeItem("password");
    localStorage.removeItem("trip_agent_password");
    requestSession("session")
      .then((data) => {
        if (active) {
          setCredentials(data);
          setIsVerified(true);
        }
      })
      .catch(() => {})
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
        const data = await requestSession("login", {
          password,
          remember: rememberDevice,
        });
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
    setCredentials(EMPTY_CREDENTIALS);
    setPassword("");
    setIsVerified(false);
    return requestSession("logout", {}).catch(() => {
      setAuthError("登出未完成，請恢復連線後再次登出");
    });
  }, []);
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

import { useCallback, useEffect, useState } from "react";
import { CryptoUtils } from "../utils/crypto.js";
import {
  decryptCredentialBundle,
  EMPTY_CREDENTIALS,
} from "../utils/credentialBundle.js";
import { tripSessionStorage, tripStorage } from "../utils/tripStorage.js";

const REMEMBERED_PASSWORD_KEY = "remembered-unlock-password-v1";

const ENCRYPTED_PAYLOADS = Object.freeze({
  apiKey: (import.meta.env?.VITE_ENCODED_KEY || "").trim(),
  mapsApiKey: (import.meta.env?.VITE_ENCODED_MAPS_KEY || "").trim(),
  gasUrl: (import.meta.env?.VITE_ENCODED_GAS_URL || "").trim(),
  gasToken: (import.meta.env?.VITE_ENCODED_GAS_TOKEN || "").trim(),
  maptilerKey: (import.meta.env?.VITE_ENCODED_MAPTILER_KEY || "").trim(),
});

export const useTripAuthentication = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(() =>
    Boolean(tripStorage.getItem(REMEMBERED_PASSWORD_KEY)),
  );
  const [showEncryptTool, setShowEncryptTool] = useState(false);
  const [toolKey, setToolKey] = useState("");
  const [toolPwd, setToolPwd] = useState("");
  const [toolResult, setToolResult] = useState("");
  const [keyType, setKeyType] = useState("gemini");

  const attemptUnlock = useCallback(
    async (inputPassword, { isAuto = false, persist = false } = {}) => {
      setIsAuthLoading(true);
      setAuthError("");

      try {
        const decryptedCredentials = await decryptCredentialBundle({
          payloads: ENCRYPTED_PAYLOADS,
          password: inputPassword,
          decrypt: CryptoUtils.decrypt,
        });

        setCredentials(decryptedCredentials);
        setIsVerified(true);
        tripSessionStorage.setItem("password", inputPassword);
        if (persist) {
          tripStorage.setItem(REMEMBERED_PASSWORD_KEY, inputPassword);
        } else {
          tripStorage.removeItem(REMEMBERED_PASSWORD_KEY);
        }
        tripStorage.removeItem("password");
        localStorage.removeItem("trip_agent_password");
      } catch {
        if (!isAuto) setAuthError("密碼錯誤，請再試一次");
        if (isAuto) {
          tripSessionStorage.removeItem("password");
          if (persist) {
            tripStorage.removeItem(REMEMBERED_PASSWORD_KEY);
            setRememberDevice(false);
          }
        }
      } finally {
        setIsAuthLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const restoreAuthentication = async () => {
      try {
        const sessionPassword = tripSessionStorage.getItem("password");
        const rememberedPassword = tripStorage.getItem(REMEMBERED_PASSWORD_KEY);
        const savedPassword = sessionPassword || rememberedPassword;
        const shouldPersist = Boolean(rememberedPassword);

        setRememberDevice(shouldPersist);

        tripStorage.removeItem("password");
        localStorage.removeItem("trip_agent_password");

        if (savedPassword && ENCRYPTED_PAYLOADS.apiKey) {
          await attemptUnlock(savedPassword, {
            isAuto: true,
            persist: shouldPersist,
          });
        } else if (!ENCRYPTED_PAYLOADS.apiKey) {
          setIsVerified(true);
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    restoreAuthentication();
  }, [attemptUnlock]);

  const handleAuthSubmit = useCallback(
    (event) => {
      event.preventDefault();
      attemptUnlock(password, { persist: rememberDevice });
    },
    [attemptUnlock, password, rememberDevice],
  );

  const generateEncryptedString = useCallback(async () => {
    if (!toolKey || !toolPwd) {
      setToolResult("請輸入 Key 與密碼");
      return;
    }

    try {
      setToolResult(await CryptoUtils.encrypt(toolKey, toolPwd));
    } catch {
      setToolResult("加密失敗");
    }
  }, [toolKey, toolPwd]);

  const lock = useCallback(() => {
    tripSessionStorage.removeItem("password");
    tripStorage.removeItem(REMEMBERED_PASSWORD_KEY);
    setCredentials(EMPTY_CREDENTIALS);
    setPassword("");
    setRememberDevice(false);
    setIsVerified(false);
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
    showEncryptTool,
    setShowEncryptTool,
    toolKey,
    setToolKey,
    toolPwd,
    setToolPwd,
    toolResult,
    setToolResult,
    keyType,
    setKeyType,
    handleAuthSubmit,
    generateEncryptedString,
    lock,
  };
};

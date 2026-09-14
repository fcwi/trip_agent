import { useCallback, useEffect, useState } from "react";
import { CryptoUtils } from "../utils/crypto.js";
import {
  decryptCredentialBundle,
  EMPTY_CREDENTIALS,
} from "../utils/credentialBundle.js";
import { tripSessionStorage, tripStorage } from "../utils/tripStorage.js";
import { shouldAutoUnlockWithoutPassword } from "../utils/authPolicy.js";

const ENCRYPTED_PAYLOADS = Object.freeze({
  apiKey: (import.meta.env?.VITE_ENCODED_KEY || "").trim(),
  mapsApiKey: (import.meta.env?.VITE_ENCODED_MAPS_KEY || "").trim(),
  gasUrl: (import.meta.env?.VITE_ENCODED_GAS_URL || "").trim(),
  gasToken: (import.meta.env?.VITE_ENCODED_GAS_TOKEN || "").trim(),
  maptilerKey: (import.meta.env?.VITE_ENCODED_MAPTILER_KEY || "").trim(),
});

const clearPersistedPasswords = () => {
  tripSessionStorage.removeItem("password");
  tripStorage.removeItem("password");
  localStorage.removeItem("trip_agent_password");
};

export const useTripAuthentication = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(EMPTY_CREDENTIALS);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showEncryptTool, setShowEncryptTool] = useState(false);
  const [toolKey, setToolKey] = useState("");
  const [toolPwd, setToolPwd] = useState("");
  const [toolResult, setToolResult] = useState("");
  const [keyType, setKeyType] = useState("gemini");

  const attemptUnlock = useCallback(async (inputPassword, isAuto = false) => {
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
      clearPersistedPasswords();
    } catch {
      if (!isAuto) setAuthError("密碼錯誤，請再試一次");
      clearPersistedPasswords();
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const restoreAuthentication = async () => {
      try {
        clearPersistedPasswords();

        if (
          shouldAutoUnlockWithoutPassword(
            ENCRYPTED_PAYLOADS.apiKey,
            import.meta.env?.DEV,
          )
        ) {
          setIsVerified(true);
        }
      } finally {
        setIsAuthReady(true);
      }
    };

    restoreAuthentication();
  }, []);

  const handleAuthSubmit = useCallback(
    (event) => {
      event.preventDefault();
      attemptUnlock(password);
    },
    [attemptUnlock, password],
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
    clearPersistedPasswords();
    setCredentials(EMPTY_CREDENTIALS);
    setPassword("");
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

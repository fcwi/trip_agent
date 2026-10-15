import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useModalAccessibility } from "../hooks/useModalAccessibility.js";
import "./CalculatorModal.css";
import UtilityState from "./UtilityState.jsx";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

/**
 * CalculatorModal Component
 *
 * A functional calculator with real-time currency conversion capabilities.
 * Features:
 * 1. Basic arithmetic (+, -, *, /).
 * 2. Currency conversion based on provided exchange rates.
 * 3. Theme-aware styling (Light/Dark mode).
 * 4. Responsive design for mobile use.
 */
const CalculatorModal = ({
  isOpen,
  onClose,
  isDarkMode,
  rateData, // { current: number, loading: boolean, error: string }
  currencyCode, // Base currency (e.g., 'JPY')
  currencyTarget, // Target currency (e.g., 'TWD')
}) => {
  const dialogRef = useModalAccessibility(isOpen, onClose);
  const online = useOnlineStatus();
  const base = (currencyCode || "").toUpperCase();
  const target = (currencyTarget || "").toUpperCase();

  // State for calculator logic
  const [displayValue, setDisplayValue] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(true);

  // State for currency conversion logic
  const [fxDirection, setFxDirection] = useState("baseToTarget");
  const [currentUnit, setCurrentUnit] = useState(base);

  const rateReady =
    rateData &&
    !rateData.loading &&
    !rateData.error &&
    Number.isFinite(rateData.current) &&
    rateData.current > 0;

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    // Schedule state updates in a microtask to avoid cascading renders
    Promise.resolve().then(() => {
      setDisplayValue("0");
      setStoredValue(null);
      setPendingOperator(null);
      setIsNewEntry(true);
      setFxDirection("baseToTarget");
      setCurrentUnit(base);
    });
  }, [isOpen, base, target]);

  const rateHint = rateReady
    ? fxDirection === "baseToTarget"
      ? `1 ${base} = ${rateData.current.toFixed(4)} ${target}`
      : `1 ${target} = ${(1 / rateData.current).toFixed(4)} ${base}`
    : "";

  // if (!isOpen) return null; // Keep Alive optimization

  /**
   * Clamps the length of the display string to prevent overflow.
   */
  const clampLength = (val) => {
    const str = val.toString();
    if (!Number.isFinite(Number(val))) return "Error";
    if (str.length <= 14) return str;
    return parseFloat(val.toFixed(8)).toString();
  };

  const parseDisplay = () => parseFloat(displayValue.replace(/,/g, "")) || 0;

  // --- Input Handlers ---

  const inputDigit = (digit) => {
    setDisplayValue((prev) => {
      if (isNewEntry || prev === "0") {
        setIsNewEntry(false);
        return digit;
      }
      return prev.length >= 14 ? prev : `${prev}${digit}`;
    });
  };

  const inputDot = () => {
    setDisplayValue((prev) => {
      if (isNewEntry) {
        setIsNewEntry(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return `${prev}.`;
    });
  };

  const clearAll = () => {
    setDisplayValue("0");
    setStoredValue(null);
    setPendingOperator(null);
    setIsNewEntry(true);
    setCurrentUnit(base);
    setFxDirection("baseToTarget");
    // 重置為初始匯率提示：當前貨幣是base(JPY)，顯示1 JPY = X TWD
  };

  const toggleSign = () => {
    const value = parseDisplay();
    setDisplayValue(clampLength(value * -1));
  };

  // --- Calculation Logic ---

  const performCalc = (prev, next, op) => {
    switch (op) {
      case "+":
        return prev + next;
      case "-":
        return prev - next;
      case "*":
        return prev * next;
      case "/":
        return next === 0 ? NaN : prev / next;
      default:
        return next;
    }
  };

  const handleOperator = (op) => {
    const current = parseDisplay();
    if (storedValue === null) {
      setStoredValue(current);
    } else if (!isNewEntry && pendingOperator) {
      const result = performCalc(storedValue, current, pendingOperator);
      setStoredValue(result);
      setDisplayValue(clampLength(result));
    }
    setPendingOperator(op);
    setIsNewEntry(true);
  };

  const handleEqual = () => {
    if (pendingOperator === null || storedValue === null) return;
    const current = parseDisplay();
    const result = performCalc(storedValue, current, pendingOperator);
    setDisplayValue(clampLength(result));
    setStoredValue(null);
    setPendingOperator(null);
    setIsNewEntry(true);
  };

  /**
   * Handles currency conversion based on the current display value.
   */
  const handleFxConvert = () => {
    if (!rateReady) {
      return;
    }
    const current = parseDisplay();
    const rate = rateData.current;
    let result = current;
    if (fxDirection === "baseToTarget") {
      // 從 JPY 轉到 TWD，轉換後當前貨幣是 TWD
      result = current * rate;
      setFxDirection("targetToBase");
      setCurrentUnit(target);
    } else {
      // 從 TWD 轉回 JPY，轉換後當前貨幣是 JPY
      result = rate === 0 ? NaN : current / rate;
      setFxDirection("baseToTarget");
      setCurrentUnit(base);
    }
    setDisplayValue(clampLength(result));
    setStoredValue(null);
    setPendingOperator(null);
    setIsNewEntry(true);
  };

  const fxLabel = fxDirection === "baseToTarget" ? target : base;
  const themeClass = isDarkMode ? "theme-dark" : "theme-light";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-opacity duration-200 ${isOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="關閉計算機"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`calc-modal ${themeClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="計算機"
      >
        {/* Header */}
        <div className="calc-header">
          <div className="calc-header-title">
            <p className="calc-title-label">旅途計算機</p>
            <p className="calc-title-main">當前貨幣：{currentUnit}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="calc-close-btn"
            aria-label="關閉計算機"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="calc-content">
          {/* Display */}
          <div
            className="calc-display"
            aria-live="polite"
            style={{
              fontSize:
                displayValue.length > 10 ? "clamp(20px, 6vw, 30px)" : undefined,
            }}
          >
            {displayValue}
          </div>

          {/* Hint Message */}
          {rateHint && (
            <div className="calc-hint" role="status" aria-live="polite">
              {rateHint}
            </div>
          )}

          {!rateReady && (
            <UtilityState
              kind={
                !online ? "offline" : rateData?.loading ? "loading" : "error"
              }
              title={
                !online
                  ? "目前離線"
                  : rateData?.loading
                    ? "正在更新匯率"
                    : "匯率暫時無法取得"
              }
            >
              一般計算仍可使用，匯率恢復後即可換算。
            </UtilityState>
          )}

          {/* Keypad */}
          <div className="calc-keypad">
            <button className="calc-btn calc-btn-muted" onClick={clearAll}>
              AC
            </button>
            <button className="calc-btn calc-btn-muted" onClick={toggleSign}>
              +/-
            </button>
            <button
              className="calc-btn calc-btn-muted calc-btn-fx"
              disabled={!rateReady}
              onClick={handleFxConvert}
            >
              轉{fxLabel}
            </button>
            <button
              className="calc-btn calc-btn-operator"
              onClick={() => handleOperator("/")}
            >
              ÷
            </button>

            <button className="calc-btn" onClick={() => inputDigit("7")}>
              7
            </button>
            <button className="calc-btn" onClick={() => inputDigit("8")}>
              8
            </button>
            <button className="calc-btn" onClick={() => inputDigit("9")}>
              9
            </button>
            <button
              className="calc-btn calc-btn-operator"
              onClick={() => handleOperator("*")}
            >
              ×
            </button>

            <button className="calc-btn" onClick={() => inputDigit("4")}>
              4
            </button>
            <button className="calc-btn" onClick={() => inputDigit("5")}>
              5
            </button>
            <button className="calc-btn" onClick={() => inputDigit("6")}>
              6
            </button>
            <button
              className="calc-btn calc-btn-operator"
              onClick={() => handleOperator("-")}
            >
              -
            </button>

            <button className="calc-btn" onClick={() => inputDigit("1")}>
              1
            </button>
            <button className="calc-btn" onClick={() => inputDigit("2")}>
              2
            </button>
            <button className="calc-btn" onClick={() => inputDigit("3")}>
              3
            </button>
            <button
              className="calc-btn calc-btn-operator"
              onClick={() => handleOperator("+")}
            >
              +
            </button>

            <button
              className="calc-btn calc-btn-wide"
              onClick={() => inputDigit("0")}
            >
              0
            </button>
            <button className="calc-btn" onClick={inputDot}>
              .
            </button>
            <button className="calc-btn calc-btn-accent" onClick={handleEqual}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;

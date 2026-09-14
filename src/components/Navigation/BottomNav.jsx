import React from "react";
import { Home, DollarSign, MessageSquare, Store, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { id: "itinerary", label: "行程", icon: Home },
  { id: "finance", label: "記錄", icon: DollarSign },
  { id: "ai", label: "導遊", icon: MessageSquare, featured: true },
  { id: "shops", label: "商店", icon: Store },
  { id: "guides", label: "指南", icon: BookOpen },
];

const BottomNav = ({
  activeTab,
  onTabChange,
  onTabPreload,
  handleInterruptClick,
  isDarkMode,
  theme,
}) => {
  const cAccent = theme.colorAccent;

  const getFeaturedClasses = (isActive) => {
    const accents = {
      amber: isDarkMode
        ? "bg-amber-500 border-amber-400/30 text-white shadow-amber-500/20"
        : "bg-amber-400 border-amber-300/30 text-white shadow-amber-400/30",
      sky: isDarkMode
        ? "bg-sky-500 border-sky-400/30 text-white shadow-sky-500/20"
        : "bg-sky-400 border-sky-300/30 text-white shadow-sky-400/30",
      default: isDarkMode
        ? "bg-stone-600 border-stone-500/30 text-white"
        : "bg-stone-500 border-stone-400/30 text-white",
    };

    return `${accents[cAccent] || accents.default} ${
      isActive
        ? "scale-105 ring-2 ring-offset-1 ring-offset-transparent"
        : "opacity-90 group-hover:opacity-100"
    }`;
  };

  return (
    <nav aria-label="主要功能" className="relative z-50 w-auto">
      <div
        className={`flex h-[60px] items-center gap-1 rounded-full border px-3 shadow-xl backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-300 ${
          isDarkMode
            ? "bg-neutral-950/95 border-white/20 ring-1 ring-white/10 shadow-black/50"
            : "bg-white/90 border-white/40 ring-1 ring-black/5 shadow-black/10"
        }`}
      >
        {NAV_ITEMS.map(({ id, label, icon, featured }) => {
          const isActive = activeTab === id;
          const regularClasses = isActive
            ? isDarkMode
              ? "bg-white/15 text-white"
              : "bg-stone-100 text-stone-900"
            : isDarkMode
              ? "text-neutral-300 group-hover:bg-white/10 group-hover:text-white"
              : "text-stone-600 group-hover:bg-black/5 group-hover:text-stone-900";

          return (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-controls={`panel-${id}`}
              aria-label={`${label}${isActive ? "（目前分頁）" : ""}`}
              onPointerEnter={() => onTabPreload?.(id)}
              onPointerDown={() => onTabPreload?.(id)}
              onFocus={() => onTabPreload?.(id)}
              onClick={() => {
                handleInterruptClick();
                onTabChange(id);
              }}
              className="group relative flex min-h-11 min-w-[50px] flex-col items-center justify-center rounded-xl transition-[color,transform] duration-300"
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-[background-color,color,opacity,transform] duration-300 ${
                  featured
                    ? `border shadow-sm ${getFeaturedClasses(isActive)}`
                    : regularClasses
                }`}
              >
                {React.createElement(icon, {
                  className: `${featured ? "h-4 w-4 fill-current drop-shadow-sm" : "h-5 w-5"} ${isActive && !featured ? "stroke-[2.5px]" : "stroke-2"}`,
                })}
              </span>
              <span
                className={`mt-1 text-xs leading-none transition-colors duration-300 ${featured ? "font-bold" : "font-medium"} ${
                  isActive
                    ? isDarkMode
                      ? "text-white"
                      : "text-stone-900"
                    : isDarkMode
                      ? "text-neutral-300"
                      : "text-stone-600"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

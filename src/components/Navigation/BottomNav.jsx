import React from "react";
import { Home, DollarSign, MessageSquare, Store, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { id: "itinerary", label: "行程", icon: Home },
  { id: "finance", label: "記錄", icon: DollarSign },
  { id: "ai", label: "導遊", icon: MessageSquare },
  { id: "shops", label: "商店", icon: Store },
  { id: "guides", label: "指南", icon: BookOpen },
];
const BottomNav = ({
  activeTab,
  onTabChange,
  onTabPreload,
  handleInterruptClick,
}) => (
  <nav aria-label="主要功能" className="travel-nav">
    {NAV_ITEMS.map(({ id, label, icon }) => {
      const isActive = activeTab === id;
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
          className="travel-nav__item"
        >
          {React.createElement(icon, {
            "aria-hidden": true,
            className: "h-5 w-5",
            strokeWidth: isActive ? 2.25 : 1.75,
          })}
          <span>{label}</span>
        </button>
      );
    })}
  </nav>
);
export default BottomNav;

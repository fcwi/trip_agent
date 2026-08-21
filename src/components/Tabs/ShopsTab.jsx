import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Coffee,
  Info,
  MapPin,
  Scissors,
  Star,
  Store,
} from "lucide-react";

const ShopLink = ({ shop, querySuffix, getMapLink, isDarkMode, tone }) => {
  const tones = {
    amber: isDarkMode
      ? "border-amber-800/40 bg-amber-900/15 ring-1 ring-amber-700/20 hover:bg-amber-900/25"
      : "border-amber-100/60 bg-[#FFF8E1]/70 ring-1 ring-amber-100/30 hover:bg-[#FFF8E1]/90",
    rose: isDarkMode
      ? "border-rose-800/40 bg-rose-900/15 ring-1 ring-rose-700/20 hover:bg-rose-900/25"
      : "border-rose-100/60 bg-[#FFF0F5]/80 ring-1 ring-rose-100/30 hover:bg-[#FFF0F5]",
  };
  const accent = tone === "rose" ? "text-rose-400" : "text-amber-500";

  return (
    <a
      href={getMapLink(`${shop.name} ${querySuffix}`)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-11 items-center gap-3 rounded-xl border p-3 backdrop-blur-md ${tones[tone]}`}
    >
      <MapPin aria-hidden="true" className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-125 ${accent}`} />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-bold ${isDarkMode ? "text-neutral-200" : "text-[#37474F]"}`}>
            {shop.name}
          </span>
          <span
            className={`rounded-xl border px-1.5 py-0.5 text-[11px] shadow-sm ${
              isDarkMode
                ? "border-neutral-700 bg-neutral-800 text-neutral-400"
                : "border-stone-200 bg-white text-stone-500"
            }`}
          >
            {shop.tag}
          </span>
        </span>
        <span className={`mt-0.5 block text-xs ${isDarkMode ? "text-neutral-400" : "text-stone-500"}`}>
          {shop.note}
        </span>
      </span>
    </a>
  );
};

const ShopsTab = ({
  shopGuideData,
  getMapLink,
  isDarkMode,
  theme,
  componentStyles,
}) => {
  const [expandedShops, setExpandedShops] = useState({});
  const toggleShop = (index) => {
    setExpandedShops((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  return (
    <section
      id="panel-shops"
      aria-labelledby="tab-shops"
      className="flex-1 animate-fadeIn space-y-5 px-4 pb-24"
    >
      <div
        className={`rounded-[2rem] border p-5 backdrop-blur-2xl ${theme.cardShadow} ${componentStyles.itineraryCard}`}
        style={theme.ambientStyle}
      >
        <h2 className={`mb-4 flex items-center gap-2 text-lg font-bold ${theme.text}`}>
          <span
            aria-hidden="true"
            className={`rounded-xl p-1.5 backdrop-blur-md ${
              isDarkMode
                ? "bg-orange-900/25 ring-1 ring-orange-700/20"
                : "bg-[#FFF8E1]/80 ring-1 ring-orange-100/30"
            }`}
          >
            <Store className={`h-4 w-4 ${isDarkMode ? "text-amber-300" : "text-[#CD853F]"}`} />
          </span>
          商家與周邊指南
        </h2>
        <p className={`mb-4 ml-1 flex items-center gap-1.5 text-xs ${theme.textSec}`}>
          <Info aria-hidden="true" className="h-3 w-3" /> 點擊商家名稱即可開啟 Google Maps
        </p>

        <div className="space-y-3">
          {shopGuideData?.length ? (
            shopGuideData.map((areaData, index) => {
              const isOpen = Boolean(expandedShops[index]);
              const contentId = `shop-${index}-content`;

              return (
                <article
                  key={areaData.area || index}
                  className={`rounded-2xl border backdrop-blur-2xl transition-shadow hover:shadow-lg ${theme.cardShadow} ${componentStyles.itineraryCard}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleShop(index)}
                    className="flex min-h-11 w-full items-center justify-between rounded-2xl p-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className={`block text-base font-bold ${theme.accent}`}>{areaData.area}</span>
                      {!isOpen && (
                        <span className={`mt-0.5 block truncate text-xs ${theme.textSec}`}>{areaData.desc}</span>
                      )}
                    </span>
                    {isOpen ? (
                      <ChevronUp aria-hidden="true" className={`h-4 w-4 shrink-0 ${theme.textSec}`} />
                    ) : (
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 ${theme.textSec}`} />
                    )}
                  </button>

                  {isOpen && (
                    <div id={contentId} className="animate-fadeIn px-5 pb-5">
                      <p className={`mb-4 text-sm ${theme.textSec}`}>{areaData.desc}</p>

                      <div className="mb-5">
                        <h3 className={`mb-2.5 flex items-center gap-1.5 text-xs font-bold ${theme.textSec}`}>
                          <Star aria-hidden="true" className="h-3.5 w-3.5 text-amber-500" /> 行程重點商家
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          {areaData.mainShops?.map((shop, shopIndex) => (
                            <ShopLink
                              key={shop.name || shopIndex}
                              shop={shop}
                              querySuffix={areaData.mapQuerySuffix}
                              getMapLink={getMapLink}
                              isDarkMode={isDarkMode}
                              tone="amber"
                            />
                          ))}
                        </div>
                      </div>

                      {areaData.specialShops?.length ? (
                        <div className="mb-5">
                          <h3 className={`mb-2.5 flex items-center gap-1.5 text-xs font-bold ${theme.textSec}`}>
                            <Scissors aria-hidden="true" className="h-3.5 w-3.5 text-rose-400" /> 童裝與文具推薦
                          </h3>
                          <div className="grid grid-cols-1 gap-2.5">
                            {areaData.specialShops.map((shop, shopIndex) => (
                              <ShopLink
                                key={shop.name || shopIndex}
                                shop={shop}
                                querySuffix={areaData.mapQuerySuffix}
                                getMapLink={getMapLink}
                                isDarkMode={isDarkMode}
                                tone="rose"
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {areaData.nearbyChains?.length ? (
                        <div>
                          <h3 className={`mb-2.5 flex items-center gap-1.5 text-xs font-bold ${theme.textSec}`}>
                            <Coffee aria-hidden="true" className="h-3.5 w-3.5 text-stone-400" /> 附近常見連鎖 (1km內)
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {areaData.nearbyChains.map((chain, chainIndex) => (
                              <a
                                key={`${chain.name}-${chain.location || chainIndex}`}
                                href={getMapLink(`${chain.name} ${areaData.mapQuerySuffix}`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs shadow-sm backdrop-blur-md ${
                                  isDarkMode
                                    ? "border-neutral-700/60 bg-neutral-800/60 text-neutral-400 ring-1 ring-white/5 hover:border-sky-800 hover:text-sky-300"
                                    : "border-stone-200/60 bg-white/90 text-stone-500 ring-1 ring-black/5 hover:border-[#5D737E]/30 hover:text-[#5D737E]"
                                }`}
                              >
                                <span className="font-bold">{chain.name}</span>
                                <span className={`border-l pl-2 ${isDarkMode ? "border-neutral-600 text-neutral-500" : "border-stone-200 text-stone-400"}`}>
                                  {chain.location}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 backdrop-blur-md ${
                isDarkMode
                  ? "border-neutral-700/60 bg-neutral-800/15 ring-1 ring-white/5"
                  : "border-stone-200/60 bg-stone-50/70 ring-1 ring-black/5"
              }`}
            >
              <Store aria-hidden="true" className={`mb-3 h-12 w-12 opacity-40 ${isDarkMode ? "text-neutral-500" : "text-stone-400"}`} />
              <p className={`text-sm font-medium ${theme.textSec}`}>暫無商家資訊</p>
              <p className={`mt-1 text-xs ${isDarkMode ? "text-neutral-600" : "text-stone-400"}`}>敬請期待更多內容</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopsTab;

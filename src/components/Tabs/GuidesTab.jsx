import { createElement, useRef, useState } from "react";
import JournalSticker from "../Itinerary/JournalSticker.jsx";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Search,
  X,
} from "lucide-react";

const EmptyState = ({ icon: Icon, label, theme }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--travel-line)] bg-[var(--travel-subtle)] py-12">
    {createElement(Icon, {
      "aria-hidden": true,
      className: "mb-3 h-12 w-12 text-[var(--travel-muted)] opacity-50",
    })}
    <p className={`text-sm font-medium ${theme.textSec}`}>{label}</p>
    <p className="mt-1 text-xs text-[var(--travel-muted)]">
      敬請期待更多內容
    </p>
  </div>
);

const GuidesTab = ({
  guidesData,
  usefulLinks,
  isDarkMode,
  theme,
  currentTheme,
  componentStyles,
}) => {
  const [expandedGuides, setExpandedGuides] = useState({});
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const normalizedQuery = query.trim().normalize("NFKC").toLocaleLowerCase();
  const matches = (...values) =>
    values
      .filter((value) => typeof value === "string")
      .join(" ")
      .normalize("NFKC")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  const visibleGuides = (guidesData || [])
    .map((guide, index) => ({ guide, index }))
    .filter(({ guide }) =>
      matches(
        guide.title,
        guide.summary,
        ...(guide.steps || []),
        guide.link?.text,
        ...(guide.blogs || []).map((blog) => blog.title),
      ),
    );
  const visibleLinks = (usefulLinks || [])
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        matches(section.category, item.title, item.desc),
      ),
    }))
    .filter((section) => section.items.length);
  const clearSearch = () => {
    setQuery("");
    searchRef.current?.focus();
  };
  const toggleGuide = (index) => {
    setExpandedGuides((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  const sectionClasses = `journal-panel rounded-[2rem] border p-5 ${theme.cardShadow} ${componentStyles.itineraryCard}`;

  return (
    <section
      id="panel-guides"
      aria-labelledby="tab-guides"
      className="flex-1 animate-fadeIn space-y-5 px-4 pb-24"
    >
      <div className="journal-guide-search journal-panel">
        <label htmlFor="guide-search">搜尋指南與連結</label>
        <div className="journal-guide-search__field">
          <Search aria-hidden="true" className="h-4 w-4" />
          <input
            ref={searchRef}
            id="guide-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：入境、交通、保險"
          />
          {query && (
            <button
              type="button"
              aria-label="清除指南搜尋"
              onClick={clearSearch}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
        <p role="status" aria-live="polite">
          {visibleGuides.length} 篇指南 ·{" "}
          {visibleLinks.reduce((sum, section) => sum + section.items.length, 0)}{" "}
          個連結
        </p>
      </div>
      <div className={sectionClasses} style={theme.ambientStyle}>
        <h2
          className={`mb-4 flex items-center gap-2 text-lg font-bold ${theme.text}`}
        >
          <span
            aria-hidden="true"
            className={`rounded-xl p-1.5 backdrop-blur-md ${
              isDarkMode
                ? "bg-purple-900/25 ring-1 ring-purple-700/20"
                : "bg-[#E6E6FA]/70 ring-1 ring-purple-100/30"
            }`}
          >
            <BookOpen
              className={`h-4 w-4 ${isDarkMode ? "text-purple-300" : "text-[#9370DB]"}`}
            />
          </span>
          實用參考指南
          <JournalSticker kind="notebook" className="journal-section-sticker" />
        </h2>

        <div className="space-y-3">
          {visibleGuides.length ? (
            visibleGuides.map(({ guide, index }) => {
              const isOpen = Boolean(expandedGuides[index]);
              const contentId = `guide-${index}-content`;

              return (
                <article
                  key={guide.title || index}
                  className={`journal-entry rounded-2xl border backdrop-blur-2xl transition-shadow hover:shadow-lg ${theme.cardShadow} ${componentStyles.itineraryCard}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleGuide(index)}
                    className="flex min-h-11 w-full items-center gap-3 rounded-2xl p-4 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-md backdrop-blur-md ${
                        isDarkMode
                          ? "border-neutral-600/60 bg-neutral-800/60 ring-1 ring-white/5"
                          : "border-stone-100/60 bg-white/90 ring-1 ring-black/5"
                      }`}
                    >
                      {guide.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`journal-guide-title block break-words text-sm font-bold ${theme.text}`}
                      >
                        {guide.title}
                      </span>
                      {!isOpen && (
                        <span
                          className={`journal-guide-summary mt-0.5 block text-xs ${theme.textSec}`}
                        >
                          {guide.summary}
                        </span>
                      )}
                    </span>
                    {isOpen ? (
                      <ChevronUp
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${theme.textSec}`}
                      />
                    ) : (
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${theme.textSec}`}
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      className="journal-guide-content animate-fadeIn px-5 pb-5"
                    >
                      <p
                        className={`mb-4 text-sm leading-relaxed ${theme.textSec}`}
                      >
                        {guide.summary}
                      </p>
                      <div
                        className={`journal-guide-steps my-3 rounded-xl border p-3.5 backdrop-blur-md ${
                          isDarkMode
                            ? "border-neutral-700/60 bg-black/15 ring-1 ring-white/5"
                            : "border-stone-200/60 bg-[#F9F9F6]/80 ring-1 ring-black/5"
                        }`}
                      >
                        <h3
                          className={`mb-2.5 flex items-center gap-1.5 text-xs font-bold ${theme.textSec}`}
                        >
                          <FileText
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />{" "}
                          操作重點
                        </h3>
                        <ol
                          className={`list-inside list-decimal space-y-2 pl-1 text-sm marker:font-bold ${theme.textSec} ${
                            isDarkMode
                              ? "marker:text-sky-300"
                              : "marker:text-sky-600"
                          }`}
                        >
                          {guide.steps?.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="pl-1 leading-relaxed"
                            >
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="space-y-3">
                        <a
                          href={guide.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-center text-sm font-bold shadow-sm backdrop-blur-md ${
                            isDarkMode
                              ? `${currentTheme.tagColors.transport.dark} ring-1 ring-sky-700/20 hover:bg-sky-900/40`
                              : `${currentTheme.tagColors.transport.light} ring-1 ring-sky-100/30 hover:bg-[#D0E0FC]`
                          }`}
                        >
                          {guide.link.text}
                          <ExternalLink
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                        </a>
                        {guide.blogs?.length ? (
                          <div
                            className={`border-t pt-3 ${isDarkMode ? "border-neutral-700" : "border-stone-200"}`}
                          >
                            <h3
                              className={`mb-2 text-[11px] font-bold uppercase tracking-wide ${
                                isDarkMode
                                  ? "text-neutral-500"
                                  : "text-stone-400"
                              }`}
                            >
                              相關圖文教學
                            </h3>
                            <div className="space-y-1.5">
                              {guide.blogs.map((blog, blogIndex) => (
                                <a
                                  key={blog.url || blogIndex}
                                  href={blog.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex min-h-11 items-center gap-2 rounded-xl p-1.5 text-xs ${
                                    isDarkMode
                                      ? "text-neutral-400 hover:bg-neutral-700/60 hover:text-sky-300"
                                      : "text-stone-500 hover:bg-stone-100/80 hover:text-[#3B5998]"
                                  }`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? "bg-neutral-600" : "bg-stone-300"}`}
                                  />
                                  <span className="journal-guide-blog-title underline decoration-stone-300 decoration-1 underline-offset-4">
                                    {blog.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : normalizedQuery ? (
            <p className="travel-muted">沒有符合的指南，試試其他關鍵字。</p>
          ) : (
            <EmptyState
              icon={BookOpen}
              label="暫無參考指南"
              isDarkMode={isDarkMode}
              theme={theme}
            />
          )}
        </div>
      </div>

      <div className={sectionClasses} style={theme.ambientStyle}>
        <h2
          className={`mb-4 flex items-center gap-2 text-lg font-bold ${theme.text}`}
        >
          <span
            aria-hidden="true"
            className={`rounded-xl p-1.5 backdrop-blur-md ${
              isDarkMode
                ? "bg-blue-900/25 ring-1 ring-blue-700/20"
                : "bg-[#E8F0FE]/70 ring-1 ring-blue-100/30"
            }`}
          >
            <LinkIcon
              className={`h-4 w-4 ${isDarkMode ? "text-blue-300" : "text-[#3B5998]"}`}
            />
          </span>
          實用連結百寶箱
        </h2>

        <div className="space-y-4">
          {visibleLinks.length ? (
            visibleLinks.map((section, sectionIndex) => (
              <section key={section.category || sectionIndex}>
                <h3
                  className={`mb-2.5 w-fit rounded-xl border px-3 py-1.5 text-xs font-bold backdrop-blur-md ${
                    isDarkMode
                      ? "border-blue-800/40 bg-blue-900/25 text-blue-300 ring-1 ring-blue-700/20"
                      : "border-blue-100/60 bg-[#E8F0FE]/80 text-[#3B5998] ring-1 ring-blue-100/30"
                  }`}
                >
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <a
                      key={item.url || itemIndex}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`journal-entry group flex min-h-11 items-center gap-3 rounded-2xl border p-4 backdrop-blur-2xl transition-shadow hover:shadow-lg ${theme.cardShadow} ${componentStyles.itineraryCard}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-md backdrop-blur-md ${
                          isDarkMode
                            ? "border-neutral-600/60 bg-neutral-800/60 ring-1 ring-white/5"
                            : "border-stone-100/60 bg-white/90 ring-1 ring-black/5"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`flex items-center gap-1.5 text-sm font-bold ${theme.text}`}
                        >
                          {item.title}
                          <ExternalLink
                            aria-hidden="true"
                            className={`h-3 w-3 ${theme.textSec}`}
                          />
                        </span>
                        <span
                          className={`mt-0.5 block text-xs ${theme.textSec}`}
                        >
                          {item.desc}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))
          ) : normalizedQuery ? (
            <p className="travel-muted">沒有符合的連結，試試其他關鍵字。</p>
          ) : (
            <EmptyState
              icon={LinkIcon}
              label="暫無實用連結"
              isDarkMode={isDarkMode}
              theme={theme}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default GuidesTab;

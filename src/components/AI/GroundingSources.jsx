import { safeGroundingUrl } from "../../utils/aiGrounding.js";

export default function GroundingSources({ grounding }) {
  if (!grounding) return null;
  const sources = (grounding.sources || []).filter((source) =>
    safeGroundingUrl(source.uri),
  );
  return (
    <aside className="journal-grounding" aria-label="回答查證來源">
      {sources.length ? (
        <>
          <p>
            參考來源 · 回覆時間{" "}
            {new Date(grounding.checkedAt).toLocaleString("zh-TW")}
          </p>
          <ul>
            {sources.map((source, index) => (
              <li key={source.uri}>
                <a href={source.uri} target="_blank" rel="noopener noreferrer">
                  [{index + 1}] {source.title}
                </a>
                <span
                  className={
                    source.type === "maps" ? "journal-maps-attribution" : ""
                  }
                  translate="no"
                >
                  {source.type === "maps" ? "Google Maps" : "Google Search"}
                </span>
              </li>
            ))}
          </ul>
          <p>營業與交通資訊可能異動，請以官方公告及現場資訊為準。</p>
        </>
      ) : (
        <p>本次未附即時查證來源；營業時間、票價與交通異動請另行確認。</p>
      )}
      {grounding.searchSuggestions && (
        <iframe
          title="Google Search 搜尋建議"
          sandbox="allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; form-action 'none'">${grounding.searchSuggestions}`}
        />
      )}
    </aside>
  );
}

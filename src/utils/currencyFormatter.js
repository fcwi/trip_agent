const formatterCache = new Map();

const getFormatter = (currency, locale, maximumFractionDigits) => {
  const normalizedCurrency = String(currency || "TWD").toUpperCase();
  const cacheKey = `${locale}:${normalizedCurrency}:${maximumFractionDigits}`;

  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(
      cacheKey,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: normalizedCurrency,
        currencyDisplay: "symbol",
        maximumFractionDigits,
      }),
    );
  }

  return formatterCache.get(cacheKey);
};

export const formatCurrency = (
  value,
  currency,
  { locale = "en-US", maximumFractionDigits = 0 } = {},
) =>
  getFormatter(currency, locale, maximumFractionDigits).format(
    Number(value) || 0,
  );

export const getCurrencySymbol = (currency, locale = "en-US") =>
  getFormatter(currency, locale, 0)
    .formatToParts(0)
    .find(({ type }) => type === "currency")?.value ||
  String(currency || "").toUpperCase();

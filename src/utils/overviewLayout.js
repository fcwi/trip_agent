export function getOverviewSectionOrder(status) {
  if (status === "during") return ["today", "days", "weather", "flights"];
  if (status === "after")
    return ["today", "memories", "days", "flights", "weather"];
  return ["today", "flights", "checklist", "days", "weather"];
}

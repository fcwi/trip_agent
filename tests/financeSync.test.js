import assert from "node:assert/strict";
import test from "node:test";
import {
  enqueuePendingDelete,
  mergeFinanceRecords,
  removePendingDelete,
} from "../src/utils/financeSync.js";

test("preserves unsynced local records while accepting cloud updates", () => {
  const result = mergeFinanceRecords({
    cloudRecords: [
      { id: 1, content: "cloud update", timestamp: "2026-01-01T01:00:00Z" },
      { id: 2, content: "cloud only", timestamp: "2026-01-01T02:00:00Z" },
    ],
    localRecords: [
      {
        id: "1",
        content: "local edit",
        synced: false,
        timestamp: "2026-01-01T01:00:00Z",
      },
      {
        id: 3,
        content: "offline add",
        synced: false,
        timestamp: "2026-01-01T03:00:00Z",
      },
    ],
  });

  assert.deepEqual(
    result.map(({ id, content, synced }) => ({ id, content, synced })),
    [
      { id: "1", content: "local edit", synced: false },
      { id: "2", content: "cloud only", synced: true },
      { id: "3", content: "offline add", synced: false },
    ],
  );
});

test("does not restore records with pending cloud deletes", () => {
  const result = mergeFinanceRecords({
    cloudRecords: [{ id: "7", content: "still in cloud" }],
    localRecords: [],
    pendingDeletes: [{ id: 7, type: "finance" }],
  });

  assert.deepEqual(result, []);
});

test("deduplicates and removes pending deletes by normalized id", () => {
  const queued = enqueuePendingDelete([{ id: "8", type: "note" }], {
    id: 8,
    type: "finance",
  });
  assert.deepEqual(queued, [{ id: "8", type: "finance" }]);
  assert.deepEqual(removePendingDelete(queued, 8), []);
});

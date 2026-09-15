export const normalizeFinanceRecordId = (value) => String(value ?? "");

const timestampValue = (record) => {
  const value = new Date(record?.timestamp || 0).getTime();
  return Number.isFinite(value) ? value : 0;
};

export const mergeFinanceRecords = ({
  cloudRecords = [],
  localRecords = [],
  pendingDeletes = [],
}) => {
  const deletedIds = new Set(
    pendingDeletes.map((entry) =>
      normalizeFinanceRecordId(
        entry && typeof entry === "object" ? entry.id : entry,
      ),
    ),
  );
  const recordsById = new Map();

  for (const record of cloudRecords) {
    const id = normalizeFinanceRecordId(record.id);
    if (!id || deletedIds.has(id)) continue;
    recordsById.set(id, { ...record, id, synced: true });
  }

  for (const record of localRecords) {
    const id = normalizeFinanceRecordId(record.id);
    if (!id || deletedIds.has(id)) continue;
    if (record.synced !== true) {
      recordsById.set(id, { ...record, id });
    }
  }

  return [...recordsById.values()].sort(
    (left, right) => timestampValue(left) - timestampValue(right),
  );
};

export const enqueuePendingDelete = (queue = [], record) => {
  const id = normalizeFinanceRecordId(record?.id);
  if (!id) return queue;
  return [
    ...queue.filter((entry) => normalizeFinanceRecordId(entry.id) !== id),
    { id, type: record?.type || "finance" },
  ];
};

export const removePendingDelete = (queue = [], recordId) => {
  const id = normalizeFinanceRecordId(recordId);
  return queue.filter((entry) => normalizeFinanceRecordId(entry.id) !== id);
};

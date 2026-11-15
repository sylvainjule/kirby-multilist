/**
 * Replace a paginated page of edited rows without losing the rest of the list.
 * IDs are preserved for already-known rows and generated only when missing.
 * This function never mutates its inputs.
 */
export function mergeEditedRows(items, editedRows, offset, limit, uuid) {
    const rows = items.map((row) => ({ ...row }));
    const pageLength = limit ? Math.min(limit, Math.max(0, rows.length - offset)) : rows.length;
    const previous = rows.slice(offset, offset + pageLength);
    const mapped = editedRows.map((row, index) => ({
        ...row,
        _id: row._id ?? previous[index]?._id ?? uuid()
    }));
    rows.splice(offset, pageLength, ...mapped);
    return rows;
}

/** Reorder a copy of the current rows from SortableJS indices. */
export function moveRow(items, from, to) {
    const rows = items.map((row) => ({ ...row }));
    if (!Number.isInteger(from) || !Number.isInteger(to)) return rows;
    if (from < 0 || to < 0 || from >= rows.length || to >= rows.length) return rows;
    if (from === to) return rows;
    const [row] = rows.splice(from, 1);
    rows.splice(to, 0, row);
    return rows;
}

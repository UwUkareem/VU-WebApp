/**
 * Redistributes weights across a list of weighted items so they sum to 100.
 *
 * Items whose IDs are in `lockedIds` keep their current weight (or the
 * explicit `targetWeight` when the item matches `targetId`).  All other
 * ("auto") items share the remaining budget equally, with any integer
 * remainder distributed one-by-one to the first auto items.
 *
 * When every item is locked and there is nothing left to auto-distribute,
 * `lockedIds` is cleared and an even split is applied to all items.
 *
 * @param {Array<{ id: string, weight: number }>} items
 * @param {Set<string>}  lockedIds        Mutable set of manually-edited IDs
 * @param {string|null}  [targetId=null]   Item currently being edited
 * @param {number}       [targetWeight=0]  New weight for `targetId`
 * @returns {Array<{ id: string, weight: number }>}  Items with updated weights
 */
export function redistributeWeights(items, lockedIds, targetId = null, targetWeight = 0) {
  if (!items.length) return items;

  const autoItems = items.filter((i) => !lockedIds.has(i.id) && i.id !== targetId);

  if (!autoItems.length) {
    if (targetId) {
      return items.map((i) => (i.id === targetId ? { ...i, weight: targetWeight } : i));
    }
    // All locked — reset to even split
    lockedIds.clear();
    const base = Math.floor(100 / items.length);
    const rem = 100 - base * items.length;
    return items.map((i, idx) => ({ ...i, weight: base + (idx < rem ? 1 : 0) }));
  }

  const lockedSum =
    items
      .filter((i) => lockedIds.has(i.id) && i.id !== targetId)
      .reduce((s, i) => s + (parseInt(i.weight, 10) || 0), 0) + (targetId ? targetWeight : 0);

  const remaining = Math.max(0, 100 - lockedSum);
  const base = Math.floor(remaining / autoItems.length);
  const rem = remaining - base * autoItems.length;
  const autoIds = new Set(autoItems.map((i) => i.id));

  let idx = 0;
  return items.map((i) => {
    if (i.id === targetId) return { ...i, weight: targetWeight };
    if (autoIds.has(i.id)) return { ...i, weight: base + (idx++ < rem ? 1 : 0) };
    return i;
  });
}

/**
 * Same as `redistributeWeights` but operates on two parallel lists that share
 * a single 100% weight pool (used by MockConfigForm for criteria + questions).
 *
 * @param {Array} listA  First list  (e.g. criteria)
 * @param {Array} listB  Second list (e.g. questions)
 * @param {Set<string>}  lockedIds
 * @param {string|null}  targetId
 * @param {number}       targetWeight
 * @returns {{ listA: Array, listB: Array }}
 */
export function redistributeWeightsPair(
  listA,
  listB,
  lockedIds,
  targetId = null,
  targetWeight = 0
) {
  const combined = [...listA, ...listB];
  const updated = redistributeWeights(combined, lockedIds, targetId, targetWeight);
  return {
    listA: updated.slice(0, listA.length),
    listB: updated.slice(listA.length),
  };
}

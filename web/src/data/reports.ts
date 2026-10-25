// Reports go to a Google Sheet through a Google Apps Script web app (see reports/README.md).
import type { Column } from './types';

const REPORTS_URL =
  'https://script.google.com/macros/s/AKfycbwPIql969AdnJ-jQFjARXdB2nBd_PFcfq_gtVeZiIvdezlCVy2NN618KRV2SOESk94A/exec';

export type ReportReason =
  | 'unrelated'
  | 'coincidental'
  | 'wrong-entity'
  | 'other';

const sent = new Set<string>(); // joins reported since the page loaded
const pairKey = (a: Column, b: Column) => [a.key, b.key].sort().join('|');

export const wasReported = (a: Column, b: Column) => sent.has(pairKey(a, b));

const label = (c: Column) => `${c.dataset.title} › ${c.name} (${c.resource})`;

export async function sendReport(
  column: Column,
  other: Column,
  reason: ReportReason,
  note: string,
) {
  const report = {
    column_a: column.key,
    column_b: other.key,
    label_a: label(column),
    label_b: label(other),
    score: column.joins.find(j => j.other === other)?.score,
    reason,
    note: note.trim(),
  };
  // A plain-text body keeps this a simple request, which Apps Script accepts without a CORS preflight.
  const response = await fetch(REPORTS_URL, {
    method: 'POST',
    body: JSON.stringify(report),
  });
  const result = await response.json();
  if (!result.ok) throw new Error(result.error);
  sent.add(pairKey(column, other));
}

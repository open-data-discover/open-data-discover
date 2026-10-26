import { use } from 'react';

import { loadData, loadManifest } from './load';
import type { Data } from './types';

let data: Promise<Data> | undefined;
let analyzedAt: Promise<Date | null> | undefined;

/** Suspends until the analysis results load; throws to the nearest error boundary if they can't. */
export function useData() {
  return use((data ??= loadData()));
}

/** When the analysis ran, or null if the manifest can't be loaded. Loads only the manifest. */
export function useAnalyzedAt() {
  return use(
    (analyzedAt ??= loadManifest().then(
      m => new Date(m.created_at),
      () => null,
    )),
  );
}

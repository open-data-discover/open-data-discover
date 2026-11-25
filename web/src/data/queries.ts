import type { Column, Dataset } from './types';

export function joinsFor(
  column: Column,
  { includeSameDataset = false } = {},
) {
  return includeSameDataset
    ? column.joins
    : column.joins.filter(j => j.other.dataset !== column.dataset);
}

/** Datasets whose title or publisher contains the query. */
export function searchDatasets(datasets: Dataset[], query: string) {
  const q = query.trim().toLowerCase();
  return datasets.filter(d =>
    `${d.title} ${d.publisher}`.toLowerCase().includes(q),
  );
}

export function findDatasetByTitle(datasets: Dataset[], title: string) {
  const t = title.trim().toLowerCase();
  return datasets.find(d => d.title.toLowerCase() === t);
}

/** A dataset's joinable columns grouped by resource, in file order. */
export function joinableColumnsByResource(dataset: Dataset) {
  const groups = new Map<string, Column[]>();
  for (const c of dataset.columns.filter(c => c.joinable))
    groups.set(c.resource, [...(groups.get(c.resource) ?? []), c]);
  return groups;
}

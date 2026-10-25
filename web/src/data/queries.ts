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

/** A dataset's columns grouped by resource, in file order. */
export function columnsByResource(dataset: Dataset) {
  const groups = new Map<string, Column[]>();
  for (const c of dataset.columns)
    groups.set(c.resource, [...(groups.get(c.resource) ?? []), c]);
  return groups;
}

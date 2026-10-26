import type { Column } from './data/types';

// Some column keys contain slashes, so the column route is a splat (`column/*`).
export const columnPath = (column: Column) =>
  `/column/${encodeURIComponent(column.key)}`;

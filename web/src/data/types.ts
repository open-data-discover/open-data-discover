export interface Dataset {
  name: string;
  title: string;
  publisher: string;
  /** Columns with at least one join to another dataset, in file order. */
  columns: Column[];
}

export interface Column {
  id: number;
  key: string;
  name: string;
  resource: string;
  dataset: Dataset;
  samples: string[];
  /** Best first. */
  joins: Join[];
}

/** A join seen from one of its columns. */
export interface Join {
  other: Column;
  /** Share of this column's distinct values found in the other. */
  contained: number;
  /** Share of the other column's distinct values found in this one. */
  contains: number;
  shared: number;
  score: number;
}

export interface Data {
  analyzedAt: Date;
  columns: Column[];
  byKey: Map<string, Column>;
  /** Datasets with a join to another dataset, by title. */
  datasets: Dataset[];
}

// The files as `analyze` writes them.

export interface Manifest {
  created_at: string;
  packages: { name: string; title: string; owner: string }[];
}

export interface ColumnRow {
  id: number;
  key: string;
  package: string;
  resource: string;
  column: string;
  samples: string[];
}

export interface JoinRow {
  id_a: number;
  id_b: number;
  shared: number;
  containment_a_in_b: number;
  containment_b_in_a: number;
  score: number;
}

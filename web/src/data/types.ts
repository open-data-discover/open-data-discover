export interface Dataset {
  name: string;
  title: string;
  publisher: string;
  /** One or two sentences from the portal. */
  excerpt: string;
  /** The portal's longer description, in Markdown. */
  description: string;
  /** The portal's topics, such as "Transportation". */
  topics: string[];
  /** The portal's civic issues, such as "Affordable housing"; often none. */
  civicIssues: string[];
  tags: string[];
  /** Every column of its CSVs, in file order. */
  columns: Column[];
  /** Has a column that joins with another dataset. */
  joinable: boolean;
}

export interface Column {
  /** Row in `columns.parquet`, or -1 if the column wasn't profiled (its values are too short to join). */
  id: number;
  key: string;
  name: string;
  resource: string;
  dataset: Dataset;
  samples: string[];
  /** Joins with a column in another dataset. */
  joinable: boolean;
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
  /** Every analyzed dataset, by title. */
  datasets: Dataset[];
}

// The files as `analyze` writes them.

export interface Manifest {
  created_at: string;
  packages: { name: string; title: string; owner: string }[];
}

export interface DatasetRow {
  name: string;
  id: string;
  title: string;
  publisher: string;
  excerpt: string;
  description: string;
  topics: string[];
  civic_issues: string[];
  tags: string[];
  /** Table, Map, Document, ... */
  category: string;
  refresh_rate: string;
  /** YYYY-MM-DD, or empty. */
  last_refreshed: string;
  /** Every column of the dataset's CSVs, in file order. */
  columns: HeaderColumn[];
}

export interface HeaderColumn {
  resource_id: string;
  resource: string;
  name: string;
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

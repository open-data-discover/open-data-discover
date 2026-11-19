import { parquetReadObjects } from 'hyparquet';

import type {
  Column,
  ColumnRow,
  Data,
  Dataset,
  DatasetRow,
  HeaderColumn,
  Join,
  JoinRow,
  Manifest,
} from './types';

export const MIN_SCORE = 0.3;

const BASE = `${import.meta.env.BASE_URL}data`;

let manifestRequest: Promise<Manifest> | undefined;

/** The manifest alone, fetched once and shared with `loadData`. */
export function loadManifest() {
  return (manifestRequest ??= readJson<Manifest>(`${BASE}/manifest.json`));
}

export async function loadData(): Promise<Data> {
  const [manifest, datasets, columns, joins] = await Promise.all([
    loadManifest(),
    readParquet<DatasetRow>(`${BASE}/datasets.parquet`),
    readParquet<ColumnRow>(`${BASE}/columns.parquet`),
    readParquet<JoinRow>(`${BASE}/joins.parquet`),
  ]);
  return buildData(manifest, datasets, columns, joins);
}

export function buildData(
  manifest: Manifest,
  datasetRows: DatasetRow[],
  columnRows: ColumnRow[],
  joinRows: JoinRow[],
): Data {
  const datasets = datasetsFrom(manifest, datasetRows);
  const columns = columnRows.map(row => columnFromRow(row, datasets));
  const byKey = new Map(columns.map(c => [c.key, c]));
  attachJoins(columns, joinRows);
  flagJoinable(columns);
  listColumns(datasets, columns, byKey, datasetRows);

  return {
    analyzedAt: new Date(manifest.created_at),
    columns,
    byKey,
    datasets: byTitle([...datasets.values()]),
  };
}

// Fetching

async function fetchOk(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response;
}

async function readJson<T>(url: string) {
  return (await (await fetchOk(url)).json()) as T;
}

async function readParquet<T>(url: string) {
  const file = await (await fetchOk(url)).arrayBuffer();
  return (await parquetReadObjects({ file })) as T[];
}

// Building

function newDataset(name: string, title = name, publisher = ''): Dataset {
  return {
    name,
    title,
    publisher,
    excerpt: '',
    description: '',
    topics: [],
    civicIssues: [],
    tags: [],
    columns: [],
    joinable: false,
  };
}

/** The manifest's datasets, described by `datasets.parquet` where it has them. */
function datasetsFrom(manifest: Manifest, rows: DatasetRow[]) {
  const datasets = new Map(
    manifest.packages.map(p => [
      p.name,
      newDataset(p.name, p.title || p.name, p.owner ?? ''),
    ]),
  );
  for (const row of rows)
    Object.assign(datasetNamed(datasets, row.name), {
      title: row.title || row.name,
      publisher: row.publisher,
      excerpt: row.excerpt,
      description: row.description,
      topics: row.topics,
      civicIssues: row.civic_issues,
      tags: row.tags,
    });
  return datasets;
}

/** The dataset with this name, added if the manifest doesn't list it. */
function datasetNamed(datasets: Map<string, Dataset>, name: string) {
  if (!datasets.has(name)) datasets.set(name, newDataset(name));
  return datasets.get(name)!;
}

function columnFromRow(row: ColumnRow, datasets: Map<string, Dataset>): Column {
  return {
    id: row.id,
    key: row.key,
    name: row.column,
    resource: row.resource,
    dataset: datasetNamed(datasets, row.package),
    samples: row.samples,
    joinable: false,
    joins: [],
  };
}

/** Gives each column its joins. They arrive sorted by score, so each list stays best first. */
function attachJoins(columns: Column[], joinRows: JoinRow[]) {
  for (const row of joinRows) {
    if (row.score < MIN_SCORE) break;
    const a = columns[row.id_a];
    const b = columns[row.id_b];
    a.joins.push(joinTo(b, row.containment_a_in_b, row.containment_b_in_a, row));
    b.joins.push(joinTo(a, row.containment_b_in_a, row.containment_a_in_b, row));
  }
}

function joinTo(
  other: Column,
  contained: number,
  contains: number,
  { shared, score }: JoinRow,
): Join {
  return { other, contained, contains, shared, score };
}

function joinsAnotherDataset(column: Column) {
  return column.joins.some(j => j.other.dataset !== column.dataset);
}

/** Flags the columns, and their datasets, that join with another dataset. */
function flagJoinable(columns: Column[]) {
  for (const column of columns) {
    column.joinable = joinsAnotherDataset(column);
    if (column.joinable) column.dataset.joinable = true;
  }
}

/** A column that wasn't profiled, so it has no samples or joins. */
function unprofiledColumn(dataset: Dataset, key: string, header: HeaderColumn): Column {
  return {
    id: -1,
    key,
    name: header.name,
    resource: header.resource,
    dataset,
    samples: [],
    joinable: false,
    joins: [],
  };
}

/** Lists each dataset's columns in file order, from the CSV headers in `datasets.parquet`. */
function listColumns(
  datasets: Map<string, Dataset>,
  columns: Column[],
  byKey: Map<string, Column>,
  datasetRows: DatasetRow[],
) {
  const listed = new Set<Column>();
  for (const row of datasetRows) {
    const dataset = datasetNamed(datasets, row.name);
    for (const header of row.columns) {
      const key = `${header.resource_id}::${header.name}`;
      const column = byKey.get(key) ?? unprofiledColumn(dataset, key, header);
      dataset.columns.push(column);
      listed.add(column);
    }
  }
  // Profiled columns missing from the headers still get listed.
  for (const column of columns)
    if (!listed.has(column)) column.dataset.columns.push(column);
}

function byTitle(datasets: Dataset[]) {
  return datasets.sort((a, b) => a.title.localeCompare(b.title));
}

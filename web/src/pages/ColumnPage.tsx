import { Suspense } from 'react';
import { useParams } from 'react-router';

import ColumnSummary from '../components/ColumnSummary';
import DatasetPicker, { DatasetPickerLoading } from '../components/DatasetPicker';
import JoinList from '../components/JoinList';
import { useData } from '../data/useData';

export default function ColumnPage() {
  return (
    <main className="wrap">
      <Suspense
        fallback={
          <div className="pt-6">
            <DatasetPickerLoading />
            <p role="status" className="py-6 text-dim">
              Loading the analysis…
            </p>
          </div>
        }>
        <Column />
      </Suspense>
    </main>
  );
}

function Column() {
  const key = useParams()['*'] ?? '';
  const column = useData().byKey.get(key);

  return (
    <>
      <title>
        {`${column?.name ?? 'Unknown column'} · Open Data Discover: Toronto`}
      </title>
      <div className="pt-6">
        {/* Remount on a new column so the picker shows its dataset. */}
        <DatasetPicker key={key} column={column} />
      </div>
      {column ? (
        <>
          <ColumnSummary column={column} />
          <JoinList column={column} />
        </>
      ) : (
        <section className="py-6">
          <p>This column is not in the analysis.</p>
          <p className="mt-1 wrap-anywhere text-dim">{key}</p>
        </section>
      )}
    </>
  );
}

import { Suspense } from 'react';
import { Link, Navigate, useLocation } from 'react-router';

import DatasetPicker, { DatasetPickerLoading } from '../components/DatasetPicker';
import ExploreDatasets from '../components/ExploreDatasets';

export default function Home() {
  // The old site put the column in the hash: /#column=<key>
  const legacyKey = new URLSearchParams(useLocation().hash.slice(1)).get('column');
  if (legacyKey)
    return <Navigate replace to={`/column/${encodeURIComponent(legacyKey)}`} />;

  return (
    <section className="home-section">
      {/* Search Header */}
      <div className="home-header-area">
        <h1 className="home-main-title">
          Open Data Discover
        </h1>
        <p className="home-main-subtitle">
          Select a column from any City of Toronto open dataset to find columns in
          other datasets that share its values.
        </p>

        <Suspense fallback={<DatasetPickerLoading size="large" />}>
          <DatasetPicker size="large" />
        </Suspense>

        <p className="mt-6 text-[0.85rem]">
          <Link to="/about#how-to-use" className="text-dim underline">
            How Do I Use This Tool?
          </Link>
        </p>
      </div>

      <hr className="my-10 border-t border-[var(--line)]" />

      <Suspense fallback={null}>
        <ExploreDatasets />
      </Suspense>
    </section>
  );
}

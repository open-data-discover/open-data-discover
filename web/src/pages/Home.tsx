import { Suspense } from 'react';
import { Link, Navigate, useLocation } from 'react-router';

import DatasetPicker, { DatasetPickerLoading } from '../components/DatasetPicker';

export default function Home() {
  // The old site put the column in the hash: /#column=<key>
  const legacyKey = new URLSearchParams(useLocation().hash.slice(1)).get('column');
  if (legacyKey)
    return <Navigate replace to={`/column/${encodeURIComponent(legacyKey)}`} />;

  return (
    <section className="wrap max-w-[44rem] pt-[clamp(3rem,12vh,6rem)] pb-10 text-center">
      <h1 className="mb-3 text-[clamp(2rem,6vw,2.9rem)] leading-[1.1] font-[750] tracking-[-0.035em]">
        Open Data Discover
      </h1>
      <p className="mx-auto mb-8 max-w-[34rem] text-[clamp(1.05rem,2.5vw,1.2rem)] leading-normal text-dim">
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
    </section>
  );
}

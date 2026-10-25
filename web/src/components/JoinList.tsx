import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router';

import { number, plural } from '../data/format';
import { joinsFor } from '../data/queries';
import type { Column, Join } from '../data/types';
import { columnPath } from '../paths';
import Examples from './Examples';
import Pagination from './Pagination';
import ReportButton from './ReportButton';
import ScoreButton from './ScoreButton';

const PAGE_SIZE = 10;

/** The columns that join with `column`, a page at a time. The page and toggle live in the URL. */
export default function JoinList({ column }: { column: Column }) {
  const [params, setParams] = useSearchParams();
  const heading = useRef<HTMLDivElement>(null);

  const includeSameDataset = params.get('same') === '1';
  const joins = joinsFor(column, { includeSameDataset });
  const sameDataset = column.joins.length - joinsFor(column).length;

  const pageCount = Math.max(1, Math.ceil(joins.length / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number(params.get('page')) || 1));
  const first = (page - 1) * PAGE_SIZE;
  const shown = joins.slice(first, first + PAGE_SIZE);

  const search = (p: number) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('page', String(p));
    else next.delete('page');
    return `?${next}`;
  };

  function toggleSameDataset(checked: boolean) {
    const next = new URLSearchParams(params);
    if (checked) next.set('same', '1');
    else next.delete('same');
    next.delete('page');
    setParams(next, { preventScrollReset: true, replace: true });
  }

  // Announced when the column, page or filter changes.
  const status =
    `${plural(joins.length, 'joinable column')} for ${column.name} in ${column.dataset.title}` +
    (pageCount > 1
      ? `, showing ${number(first + 1)} to ${number(first + shown.length)}`
      : '');

  return (
    <section className="pb-10">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {/* A new element each time, so the same text is still announced. */}
        <span key={`${column.key}|${page}|${includeSameDataset}`}>{status}</span>
      </p>
      <div
        ref={heading}
        className="flex scroll-mt-4 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
        <h2 className="text-[1.15rem] font-semibold">
          {plural(joins.length, 'joinable column')}
          {pageCount > 1 && (
            <span className="ml-2 text-sm font-normal text-dim">
              {number(first + 1)}–{number(first + shown.length)}
            </span>
          )}
        </h2>
        {sameDataset > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-dim">
            <input
              type="checkbox"
              checked={includeSameDataset}
              onChange={e => toggleSameDataset(e.target.checked)}
            />
            Include {number(sameDataset)} from the same dataset
          </label>
        )}
      </div>

      <ol>
        {shown.map(join => (
          <JoinRow key={join.other.id} column={column} join={join} />
        ))}
      </ol>

      <Pagination
        page={page}
        pageCount={pageCount}
        search={search}
        onNavigate={() => heading.current?.scrollIntoView({ block: 'nearest' })}
      />
    </section>
  );
}

function JoinRow({ column, join }: { column: Column; join: Join }) {
  const { other } = join;
  return (
    <li className="relative grid grid-cols-[7rem_1fr] gap-5 border-b border-line py-5 pr-10 max-sm:grid-cols-1 max-sm:gap-1 max-sm:pr-0">
      <ScoreButton join={join} />
      <ReportButton column={column} other={other} />
      <div className="min-w-0 max-sm:pr-8">
        <Link to={columnPath(other)} className="wrap-anywhere">
          <span className="text-fg">{other.dataset.title}</span>
          <span aria-hidden="true" className="px-1.5 text-dim">
            ›
          </span>
          <span className="font-semibold">{other.name}</span>
        </Link>
        <span className="mt-0.5 block text-sm wrap-anywhere text-dim">
          {other.resource}
        </span>
        <Examples values={other.samples.slice(0, 3)} />
      </div>
    </li>
  );
}

import { portalHref } from '../data/format';
import type { Column } from '../data/types';
import Examples from './Examples';
import ExternalLink from './ExternalLink';

export default function ColumnSummary({ column }: { column: Column }) {
  const { dataset } = column;
  return (
    <section className="py-6">
      <p className="text-dim">
        {dataset.title}
        {dataset.publisher && ` · ${dataset.publisher}`}
      </p>
      <h1 className="mt-1 text-[1.6rem] font-bold tracking-[-0.02em] break-words">
        {column.name}
      </h1>
      <p className="mt-1 text-sm text-dim">
        {column.resource} ·{' '}
        <ExternalLink href={portalHref(dataset.name)}>
          open.toronto.ca ↗
        </ExternalLink>
      </p>
      <Examples values={column.samples} />
    </section>
  );
}

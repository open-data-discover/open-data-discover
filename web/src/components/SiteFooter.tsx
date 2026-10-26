import { Suspense } from 'react';

import { useAnalyzedAt } from '../data/useData';
import ExternalLink from './ExternalLink';

export default function SiteFooter() {
  return (
    <footer className="wrap mt-auto border-t border-line pt-5 pb-8 text-sm text-dim">
      <p>
        Made at Civic Tech Toronto · Data sourced from{' '}
        <ExternalLink href="https://open.toronto.ca/">
          Open Data Toronto
        </ExternalLink>
        <Suspense>
          <AnalyzedAt />
        </Suspense>
      </p>
    </footer>
  );
}

function AnalyzedAt() {
  const date = useAnalyzedAt();
  if (!date) return null;
  return (
    <>
      {' '}
      on{' '}
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </time>
    </>
  );
}

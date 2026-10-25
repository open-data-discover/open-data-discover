import { Link } from 'react-router';

/** Page numbers to show: the first, the last, and two either side of the current one. */
function pageNumbers(page: number, pageCount: number) {
  const pages: (number | '…')[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 2) pages.push(p);
    else if (pages.at(-1) !== '…') pages.push('…');
  }
  return pages;
}

const item =
  'focus-ring grid h-9 min-w-9 place-items-center rounded-md px-2 tabular-nums';

export default function Pagination({
  page,
  pageCount,
  search,
  onNavigate,
}: {
  page: number;
  pageCount: number;
  /** The search string for a page, e.g. `?page=2`. */
  search: (page: number) => string;
  onNavigate?: () => void;
}) {
  if (pageCount <= 1) return null;

  const step = (to: number, label: string, text: string) =>
    to < 1 || to > pageCount ? (
      <span className={`${item} text-dim opacity-50`} aria-hidden="true">
        {text}
      </span>
    ) : (
      <Link
        to={{ search: search(to) }}
        preventScrollReset
        onClick={onNavigate}
        aria-label={label}
        className={`${item} hover:bg-accent-soft hover:no-underline`}>
        {text}
      </Link>
    );

  return (
    <nav aria-label="Pages" className="mt-6 flex flex-wrap items-center justify-center gap-1">
      {step(page - 1, 'Previous page', '‹ Prev')}
      {pageNumbers(page, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className={`${item} text-dim`}>
            …
          </span>
        ) : (
          <Link
            key={p}
            to={{ search: search(p) }}
            preventScrollReset
            onClick={onNavigate}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={`${item} hover:bg-accent-soft hover:no-underline current:bg-accent current:text-surface`}>
            {p}
          </Link>
        ),
      )}
      {step(page + 1, 'Next page', 'Next ›')}
    </nav>
  );
}

import { Link, NavLink } from 'react-router';

import ExternalLink from './ExternalLink';

const navLink =
  'focus-ring text-[0.925rem] font-medium text-dim hover:text-fg ' +
  'current:text-fg current:underline current:decoration-accent current:decoration-2 current:underline-offset-[0.35em]';

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface py-[0.85rem]">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <Link
          to="/"
          className="focus-ring text-[1.05rem] font-bold tracking-[-0.015em] text-fg hover:text-accent hover:no-underline">
          Open Data Discover: Toronto
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-1">
          <NavLink to="/about" className={navLink}>
            About
          </NavLink>
          <ExternalLink href="https://civictech.ca/" className={navLink}>
            Civic Tech Toronto
          </ExternalLink>
          <ExternalLink
            href="https://github.com/open-data-discover/open-data-discover"
            className={navLink}>
            GitHub
          </ExternalLink>
        </nav>
      </div>
    </header>
  );
}

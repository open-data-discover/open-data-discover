import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export default function NotFound() {
  const error = useRouteError();
  const missing =
    !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <main className="wrap py-16 text-center">
      <title>
        {missing ? 'Page Not Found' : 'Something Went Wrong'} · Open Data
        Discover: Toronto
      </title>
      <h1 className="mb-3 text-[clamp(1.8rem,5vw,2.25rem)] font-[750] tracking-[-0.03em]">
        {missing ? 'Page not found' : 'Something went wrong'}
      </h1>
      <p className="mb-6 text-dim">
        {missing
          ? 'There’s nothing at this address.'
          : 'This page hit an error while loading. Try again in a moment.'}
      </p>
      <Link to="/" className="focus-ring">
        Back to Open Data Discover
      </Link>
    </main>
  );
}

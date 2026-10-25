import type { ReactNode } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import DotGrid from '../components/DotGrid';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <>
      <DotGrid />
      <SiteHeader />
      {children ?? <Outlet />}
      <SiteFooter />
      <ScrollRestoration />
    </>
  );
}

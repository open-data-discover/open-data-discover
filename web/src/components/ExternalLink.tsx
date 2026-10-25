import type { ComponentProps } from 'react';

export default function ExternalLink(props: ComponentProps<'a'>) {
  return <a target="_blank" rel="noopener" {...props} />;
}

import { useLayoutEffect, useRef, useState } from 'react';

export default function Examples({ values }: { values: string[] }) {
  if (!values.length) return null;
  return (
    <p className="mt-2 flex flex-wrap items-baseline gap-1.5 text-[0.85rem]">
      <span className="mr-0.5 text-xs tracking-[0.04em] text-dim uppercase">
        Examples
      </span>
      {values.map((v, i) => (
        <Example key={i} value={v} />
      ))}
    </p>
  );
}

/** A value cut off to fit shows in full on hover, and expands in place when clicked. */
function Example({ value }: { value: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    if (expanded) return;
    const el = ref.current!;
    const measure = () => setTruncated(el.scrollWidth > el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  const toggle = () => setExpanded(!expanded);
  const toggleable = truncated || expanded;

  return (
    <q
      ref={ref}
      title={truncated && !expanded ? value : undefined}
      {...(toggleable && {
        role: 'button',
        tabIndex: 0,
        'aria-expanded': expanded,
        onClick: toggle,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        },
      })}
      className={`max-w-full rounded border border-line bg-surface px-1.5 py-px ${
        expanded ? 'wrap-anywhere whitespace-normal' : 'truncate sm:max-w-64'
      } ${toggleable ? 'focus-ring cursor-pointer hover:border-dim' : ''}`}>
      {value}
    </q>
  );
}

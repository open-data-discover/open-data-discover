// Hover or focus previews the explanation; click or tap pins it open.
// Phones get a bottom sheet instead of a popover beside the score.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { overlapLevel, percent, type OverlapLevel } from '../data/format';
import type { Join } from '../data/types';

const barColor: Record<OverlapLevel, string> = {
  high: 'bg-bar',
  medium: 'bg-overlap-medium',
  low: 'bg-overlap-low',
};

const mobile = matchMedia('(max-width: 40rem)');

// The open explanation: opening another closes it, and hovering waits while it is pinned.
let current: { id: string; pinned: boolean; close: () => void } | null = null;

export default function ScoreButton({ join }: { join: Join }) {
  const { other } = join;
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);
  // A tap focuses the button mid-tap; opening then would cover the tap and turn its click into an outside click.
  const touched = useRef(false);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const inside = (target: EventTarget | null) =>
    target instanceof Node &&
    (button.current?.contains(target) || panel.current?.contains(target));

  function show({ hover = false } = {}) {
    if (hover && current?.pinned && current.id !== id) return;
    if (current && current.id !== id) current.close();
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function close() {
    clearTimeout(closeTimer.current);
    setOpen(false);
    setPinned(false);
  }

  function closeSoon() {
    clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (!inside(document.activeElement)) setOpen(false);
    }, 180);
  }

  function closeAndFocus() {
    close();
    button.current?.focus({ preventScroll: true });
  }

  // Show the popover and keep it by the score; close it on Escape, a click outside, or a scroll.
  useEffect(() => {
    const el = panel.current!;
    if (!open) {
      if (el.matches(':popover-open')) el.hidePopover();
      return;
    }
    if (!el.matches(':popover-open')) el.showPopover();
    const position = () => place(button.current!, el);
    position();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAndFocus();
      }
    };
    const onClick = (e: MouseEvent) => !inside(e.target) && close();
    const onScroll = (e: Event) => !inside(e.target) && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    document.addEventListener('scroll', onScroll, true);
    addEventListener('resize', position);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      document.removeEventListener('scroll', onScroll, true);
      removeEventListener('resize', position);
    };
  }, [open]);

  useEffect(() => {
    if (open) current = { id, pinned, close };
    else if (current?.id === id) current = null;
  }, [id, open, pinned]);

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      if (current?.id === id) current = null;
    },
    [id],
  );

  const hoverHandlers = {
    onPointerEnter: (e: React.PointerEvent) =>
      e.pointerType === 'mouse' && show({ hover: true }),
    onPointerLeave: (e: React.PointerEvent) =>
      e.pointerType === 'mouse' && !pinned && !inside(e.relatedTarget) && closeSoon(),
    onBlur: (e: React.FocusEvent) => !pinned && !inside(e.relatedTarget) && closeSoon(),
  };

  return (
    <div className="self-start">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="dialog"
        onPointerDown={e => (touched.current = e.pointerType !== 'mouse')}
        onFocus={() => !touched.current && show()}
        onClick={() => (open && pinned ? close() : (show(), setPinned(true)))}
        {...hoverHandlers}
        className="focus-ring flex w-full cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left tabular-nums hover:border-line hover:bg-surface aria-expanded:border-line aria-expanded:bg-surface max-sm:min-h-11 max-sm:w-auto max-sm:px-0 sm:block">
        <span className="text-lg font-semibold">{percent(join.score)}</span>
        <span className="block text-[0.7rem] whitespace-nowrap text-dim">
          Value overlap <span aria-hidden="true">ⓘ</span>
        </span>
        <Bar ratio={join.score} className="mt-1.5 h-1.5 max-sm:mt-0 max-sm:w-16" />
        <span className="sr-only">
          {' '}
          with {other.name} in {other.dataset.title}. Show explanation.
        </span>
      </button>

      <div
        ref={panel}
        id={id}
        popover="manual"
        role="dialog"
        aria-labelledby={`${id}-title`}
        {...hoverHandlers}
        className="fixed inset-auto m-0 max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-line bg-surface p-[1.15rem] text-sm wrap-anywhere text-fg shadow-[0_0.75rem_2.5rem_rgb(0_0_0/0.18)] max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[85dvh] max-sm:w-full max-sm:rounded-b-none max-sm:pb-[max(1.15rem,env(safe-area-inset-bottom))]">
        <header className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="text-[1.1rem] leading-[1.4] font-semibold">
            This score shows how many values in one column appear in the other.
          </h2>
          <button
            type="button"
            aria-label="Close explanation"
            onClick={closeAndFocus}
            className="focus-ring -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center text-2xl text-dim">
            ×
          </button>
        </header>
        <p className="mt-2.5 mb-5 text-[0.85rem] text-dim">
          The higher of the two percentages becomes the score.
        </p>
        <Direction ratio={join.contained}>
          {percent(join.contained)} of the selected column in your chosen
          dataset appear in <Code>{other.name}</Code> in{' '}
          <Code>{other.dataset.title}</Code>.
        </Direction>
        <Direction ratio={join.contains}>
          {percent(join.contains)} of <Code>{other.name}</Code> appear in your
          selected column.
        </Direction>
        <p className="border-t border-line pt-3.5 text-[0.8rem] text-dim">
          Shared values do not guarantee the columns mean the same thing.
        </p>
        <Link to="/about#the-method" className="mt-2 inline-block">
          How scores work →
        </Link>
      </div>
    </div>
  );
}

/** Beside the score if it fits, otherwise below or above it, always inside the window. */
function place(button: HTMLElement, panel: HTMLElement) {
  panel.style.left = panel.style.top = '';
  if (mobile.matches) return;
  const rect = button.getBoundingClientRect();
  const { width, height } = panel.getBoundingClientRect();
  const margin = 16;
  const beside = rect.right + 12 + width <= innerWidth - margin;
  const below = rect.bottom + 8;
  const left = beside ? rect.right + 12 : rect.left;
  const top = beside
    ? Math.max(margin, Math.min(rect.top, innerHeight - height - margin))
    : below + height <= innerHeight - margin
      ? below
      : Math.max(margin, rect.top - height - 8);
  panel.style.left = `${Math.max(margin, Math.min(left, innerWidth - width - margin))}px`;
  panel.style.top = `${top}px`;
}

function Bar({ ratio, className }: { ratio: number; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block overflow-hidden rounded-full bg-line ${className}`}>
      <span
        className={`block h-full ${barColor[overlapLevel(ratio)]}`}
        style={{ width: percent(ratio) }}
      />
    </span>
  );
}

function Direction({ ratio, children }: { ratio: number; children: ReactNode }) {
  return (
    <div className="my-4">
      <p>{children}</p>
      <Bar ratio={ratio} className="my-2 h-[0.45rem]" />
    </div>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-line px-1 py-px text-[0.95em] box-decoration-clone">
      {children}
    </code>
  );
}

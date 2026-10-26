// A red ! in a join's corner that opens a dialog, below it, for reporting the join.
import { useEffect, useRef, useState } from 'react';

import { sendReport, wasReported, type ReportReason } from '../data/reports';
import type { Column } from '../data/types';

const reasons: [ReportReason, string][] = [
  ['unrelated', 'The columns are unrelated'],
  ['coincidental', 'The values overlap by coincidence (IDs, years, small numbers)'],
  ['wrong-entity', 'They describe different kinds of data'],
  ['other', 'Something else'],
];

export default function ReportButton({
  column,
  other,
}: {
  column: Column;
  other: Column;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [reported, setReported] = useState(() => wasReported(column, other));
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  function open() {
    if (reported) return;
    setStatus('');
    dialog.current!.querySelector('form')!.reset();
    dialog.current!.showModal();
    place(button.current!, dialog.current!);
  }

  // The status line makes the dialog taller.
  useEffect(() => {
    if (dialog.current?.open) place(button.current!, dialog.current);
  }, [status]);

  useEffect(() => {
    const onResize = () =>
      dialog.current?.open && place(button.current!, dialog.current);
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setSending(true);
    setStatus('Sending…');
    try {
      await sendReport(
        column,
        other,
        fields.get('reason') as ReportReason,
        String(fields.get('note') ?? ''),
      );
      setReported(true);
      dialog.current?.close();
    } catch (error) {
      setStatus(`Could not send the report: ${(error as Error).message}.`);
    } finally {
      setSending(false);
    }
  }

  // Close on a click that starts and ends on the backdrop (the form fills the dialog box).
  const pressedBackdrop = useRef(false);

  return (
    <>
      <button
        ref={button}
        type="button"
        title={reported ? 'Reported' : 'Report this join'}
        aria-disabled={reported || undefined}
        onClick={open}
        className="focus-ring absolute top-4 right-0 grid size-7 cursor-pointer place-items-center text-[1.15rem] leading-none font-bold text-danger aria-disabled:cursor-default aria-disabled:text-dim">
        <span aria-hidden="true">!</span>
        <span className="sr-only">
          {reported ? 'Reported' : 'Report'} the join with {other.name} in{' '}
          {other.dataset.title}
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={`report-${other.id}`}
        onPointerDown={e => (pressedBackdrop.current = e.target === dialog.current)}
        onClick={e =>
          pressedBackdrop.current && e.target === dialog.current && dialog.current.close()
        }
        className="report-dialog fixed inset-auto m-0 w-[min(24rem,calc(100vw-1rem))] rounded-lg border border-line bg-surface p-0 text-fg shadow-[0_0.5rem_1.5rem_rgb(0_0_0/0.15)] backdrop:bg-transparent">
        <form onSubmit={submit} className="px-5 py-4 text-[0.95rem]">
          <h2 id={`report-${other.id}`} className="text-[1.05rem] font-semibold">
            Report this join
          </h2>
          <p className="mt-1 wrap-anywhere text-dim">
            With {other.dataset.title} › {other.name} ({other.resource})
          </p>

          <fieldset className="mt-4">
            <legend className="mb-1.5 font-semibold">What’s wrong with it?</legend>
            {reasons.map(([value, text], i) => (
              <label key={value} className="flex cursor-pointer items-baseline gap-2 py-0.5">
                <input type="radio" name="reason" value={value} required={i === 0} />
                {text}
              </label>
            ))}
          </fieldset>

          <label className="mt-3 block font-semibold">
            Note <span className="font-normal text-dim">(optional)</span>
            <textarea
              name="note"
              rows={3}
              maxLength={1000}
              className="mt-1.5 block w-full resize-y rounded-lg border border-line bg-bg px-2.5 py-2 font-normal focus:outline-2 focus:-outline-offset-1 focus:outline-accent"
            />
          </label>

          {status && (
            <p role="status" className="mt-3 text-dim">
              {status}
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="focus-ring cursor-pointer rounded-lg bg-accent-soft px-4 py-2 text-accent hover:underline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="focus-ring cursor-pointer rounded-lg bg-accent px-4 py-2 text-surface hover:underline disabled:cursor-default disabled:opacity-60">
              Send report
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

/** Below the button, right edges aligned, inside the window. */
function place(button: HTMLElement, dialog: HTMLElement) {
  const anchor = button.getBoundingClientRect();
  const { width, height } = dialog.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  const gap = 8;
  dialog.style.left = `${Math.max(gap, Math.min(anchor.right - width, clientWidth - width - gap))}px`;
  dialog.style.top = `${Math.max(gap, Math.min(anchor.bottom + gap / 2, clientHeight - height - gap))}px`;
}

import { useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router';

import {
  columnsByResource,
  findDatasetByTitle,
  searchDatasets,
} from '../data/queries';
import type { Column } from '../data/types';
import { useData } from '../data/useData';
import { columnPath } from '../paths';

type Size = 'large' | 'compact';

const field = {
  large: 'h-[3.35rem] px-[0.9rem] text-[1.05rem]',
  compact: 'h-[2.875rem] px-[0.7rem]',
};

const fieldBase =
  'w-full rounded-lg border border-line bg-surface text-left placeholder:text-dim focus:outline-2 focus:-outline-offset-1 focus:outline-accent disabled:text-dim';

/** Pick a dataset by title or publisher, then one of its columns to open it. */
export default function DatasetPicker({
  column,
  size = 'compact',
}: {
  column?: Column;
  size?: Size;
}) {
  const { datasets } = useData();
  const navigate = useNavigate();
  const listId = useId();
  const optionId = (i: number) => `${listId}-${i}`;
  const columnSelect = useRef<HTMLSelectElement>(null);

  const [query, setQuery] = useState(column?.dataset.title ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const dataset = findDatasetByTitle(datasets, query);
  // A dataset already picked shows the whole list, so the user can browse to another.
  const matches = searchDatasets(datasets, dataset ? '' : query);

  useEffect(() => {
    if (open && active >= 0)
      document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
  });

  function show() {
    setOpen(true);
  }

  function hide() {
    setOpen(false);
    setActive(-1);
  }

  function pick(i: number) {
    // Render first, so the column select is enabled before it takes focus.
    flushSync(() => {
      setQuery(matches[i].title);
      hide();
    });
    columnSelect.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const n = matches.length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (open && n)
        setActive(event.key === 'ArrowDown' ? (active + 1) % n : (active < 1 ? n : active) - 1);
      show();
    } else if (event.key === 'Enter' && matches[active]) {
      event.preventDefault();
      pick(active);
    } else if (event.key === 'Escape') {
      hide();
    }
  }

  return (
    <form className="flex flex-wrap gap-2" onSubmit={e => e.preventDefault()}>
      <label className="relative min-w-0 flex-[2_1_12rem]">
        <span className="sr-only">Dataset</span>
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          placeholder="Search datasets or publishers"
          autoComplete="off"
          spellCheck={false}
          className={`${fieldBase} ${field[size]}`}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setActive(-1);
            show();
          }}
          onFocus={show}
          onClick={show}
          onBlur={hide}
          onKeyDown={onKeyDown}
        />
        <ul
          id={listId}
          role="listbox"
          hidden={!open}
          // Keep focus in the box while clicking the list.
          onMouseDown={e => e.preventDefault()}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-80 overflow-y-auto rounded-lg border border-line bg-surface py-1 text-left shadow-lg">
          {matches.length ? (
            matches.map((d, i) => (
              <li
                key={d.name}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                onClick={() => pick(i)}
                className="cursor-pointer px-[0.7rem] py-1.5 hover:bg-accent-soft aria-selected:bg-accent-soft">
                {d.title}
                <span className="block text-[0.85rem] text-dim">{d.publisher}</span>
              </li>
            ))
          ) : (
            <li className="px-[0.7rem] py-1.5 text-dim">No matching datasets</li>
          )}
        </ul>
      </label>

      <label className="relative min-w-0 flex-[1_1_12rem]">
        <span className="sr-only">Column</span>
        <select
          ref={columnSelect}
          disabled={!dataset}
          className={`${fieldBase} ${field[size]}`}
          value={column && column.dataset === dataset ? column.key : ''}
          onChange={e => {
            const picked = dataset?.columns.find(c => c.key === e.target.value);
            if (picked) navigate(columnPath(picked));
          }}>
          <option value="">Choose a column</option>
          {dataset &&
            [...columnsByResource(dataset)].map(([resource, columns]) => (
              <optgroup key={resource} label={resource}>
                {columns.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
        </select>
      </label>
    </form>
  );
}

/** Stands in for the picker while the datasets load. */
export function DatasetPickerLoading({ size = 'compact' }: { size?: Size }) {
  return (
    <form className="flex flex-wrap gap-2">
      <input
        aria-label="Dataset"
        placeholder="Loading datasets…"
        disabled
        className={`${fieldBase} ${field[size]} min-w-0 flex-[2_1_12rem]`}
      />
      <select
        aria-label="Column"
        disabled
        className={`${fieldBase} ${field[size]} min-w-0 flex-[1_1_12rem]`}>
        <option>Choose a column</option>
      </select>
    </form>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { portalHref } from '../data/format';
import type { Dataset } from '../data/types';
import { useData } from '../data/useData';
import { columnPath } from '../paths';

const ALL = 'All';

const sortedUnique = (values: string[]) =>
  [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

/** Browse datasets by publisher, topic or civic issue; a dataset's title opens its details. */
export default function ExploreDatasets() {
  const { datasets } = useData();
  const [selectedPublisher, setSelectedPublisher] = useState(ALL);
  const [selectedTopic, setSelectedTopic] = useState(ALL);
  const [selectedCivicIssue, setSelectedCivicIssue] = useState(ALL);
  const [activeModalDataset, setActiveModalDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalDataset(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const uniquePublishers = sortedUnique(datasets.map(ds => ds.publisher));
  const publishers = [ALL, ...uniquePublishers];
  const topics = [ALL, ...sortedUnique(datasets.flatMap(ds => ds.topics))];
  const civicIssues = [ALL, ...sortedUnique(datasets.flatMap(ds => ds.civicIssues))];

  const filteredDatasets = datasets.filter(ds => {
    if (selectedPublisher !== ALL && ds.publisher !== selectedPublisher) return false;
    if (selectedTopic !== ALL && !ds.topics.includes(selectedTopic)) return false;
    if (selectedCivicIssue !== ALL && !ds.civicIssues.includes(selectedCivicIssue)) return false;
    return true;
  });

  const badgeIndex = (publisher: string) => {
    const i = uniquePublishers.indexOf(publisher);
    return i >= 0 ? i % 5 : 0;
  };

  return (
    <>
      {/* Explore Datasets Section */}
      <div className="explore-section">
        <h2 className="explore-heading">
          Explore Datasets
        </h2>
        <p className="explore-subtext">
          Browse City of Toronto datasets by publisher, topic, or civic issue.
        </p>

        {/* Dropdown Filters Grid */}
        <div className="filter-grid">
          <div>
            <label className="filter-label">
              PUBLISHER
            </label>
            <select
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="filter-select"
            >
              {publishers.map((pub) => (
                <option key={pub} value={pub}>
                  {pub === ALL ? 'All Publishers' : pub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="filter-label">
              TOPIC
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="filter-select"
            >
              {topics.map((top) => (
                <option key={top} value={top}>
                  {top === ALL ? 'All Topics' : top}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="filter-label">
              CIVIC ISSUE
            </label>
            <select
              value={selectedCivicIssue}
              onChange={(e) => setSelectedCivicIssue(e.target.value)}
              className="filter-select"
            >
              {civicIssues.map((issue) => (
                <option key={issue} value={issue}>
                  {issue === ALL ? 'All Civic Issues' : issue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dataset Cards Grid */}
        <div className="dataset-cards-grid">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.name}
              className="dataset-card-item"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setActiveModalDataset(ds)}
                  className="dataset-card-title focus:outline-none"
                >
                  {ds.title}
                </button>
                <p className="dataset-card-desc">
                  {ds.excerpt || ds.description}
                </p>

                {/* Clickable Publisher and Topic Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ds.publisher && (
                    <button
                      type="button"
                      onClick={() => setSelectedPublisher(ds.publisher)}
                      data-publisher-index={badgeIndex(ds.publisher)}
                      className="publisher-badge cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      title={`Filter by ${ds.publisher}`}
                    >
                      {ds.publisher}
                    </button>
                  )}
                  {ds.topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSelectedTopic(topic)}
                      className="publisher-badge cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      title={`Filter by ${topic}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Footer Download Link */}
              <div className="dataset-card-footer">
                <a
                  href={portalHref(ds.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dataset-card-link"
                >
                  Get Dataset <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Details Modal */}
      {activeModalDataset && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveModalDataset(null)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {activeModalDataset.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span
                    data-publisher-index={badgeIndex(activeModalDataset.publisher)}
                    className="publisher-badge inline-block"
                  >
                    {activeModalDataset.publisher}
                  </span>
                  {[...activeModalDataset.topics, ...activeModalDataset.civicIssues].map((label) => (
                    <span key={label} className="publisher-badge inline-block">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDataset(null)}
                className="modal-close-btn focus:outline-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div>
                <h4 className="modal-section-title">
                  Description
                </h4>
                <p className="modal-description-text">
                  {activeModalDataset.excerpt || activeModalDataset.description}
                </p>
                {activeModalDataset.excerpt &&
                  activeModalDataset.description &&
                  activeModalDataset.description !== activeModalDataset.excerpt && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-[0.8rem] text-[var(--accent)]">
                        Full description
                      </summary>
                      {/* The portal's description is Markdown; shown as plain text for now. */}
                      <p className="modal-description-text mt-2 whitespace-pre-line">
                        {activeModalDataset.description}
                      </p>
                    </details>
                  )}
              </div>

              <div>
                <h4 className="modal-section-title mb-2">
                  Columns ({activeModalDataset.columns.length})
                </h4>
                {activeModalDataset.columns.length > 0 ? (
                  <div className="modal-dictionary-container">
                    {activeModalDataset.columns.map((col) => (
                      <div key={col.key} className="modal-dictionary-row">
                        {col.joinable ? (
                          <Link
                            to={columnPath(col)}
                            className="font-mono text-[var(--accent)] font-semibold hover:underline"
                            title="Find columns that join with this one"
                          >
                            {col.name}
                          </Link>
                        ) : (
                          <code className="font-mono text-[var(--text)] font-semibold">{col.name}</code>
                        )}
                        <span className="text-[11px] text-dim italic">{col.resource}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dim italic">
                    No column details available for this dataset.
                  </p>
                )}
                <p className="mt-2 text-[11px] text-dim">
                  Joinable columns are linked.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <a
                href={portalHref(activeModalDataset.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-footer-link"
              >
                Get Dataset <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveModalDataset(null)}
                className="modal-footer-action-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

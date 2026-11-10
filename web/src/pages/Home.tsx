import { useState, useEffect, Suspense } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { parquetRead } from 'hyparquet';
import DatasetPicker, { DatasetPickerLoading } from '../components/DatasetPicker';

interface ManifestPackage {
  id: string;
  title: string;
  owner: string;
  name: string;
  columns?: string[];
}

interface DatasetCard {
  id: string;
  title: string;
  description: string;
  publisher: string;
  topic: string;
  civicIssue: string;
  tags: string[];
  downloadUrl: string;
  name: string;
  columns: string[];
}

export default function Home() {
  const legacyKey = new URLSearchParams(useLocation().hash.slice(1)).get('column');
  if (legacyKey)
    return <Navigate replace to={`/column/${encodeURIComponent(legacyKey)}`} />;

  const [datasets, setDatasets] = useState<DatasetCard[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCivicIssue, setSelectedCivicIssue] = useState('All');
  const [activeModalDataset, setActiveModalDataset] = useState<DatasetCard | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const manifestUrl = `${normalizedBase}data/manifest.json`;
    const parquetUrl = `${normalizedBase}data/columns.parquet`;

    async function loadData() {
      try {
        const manifestRes = await fetch(manifestUrl);
        if (!manifestRes.ok) throw new Error(`Failed to load manifest: ${manifestRes.statusText}`);
        const manifestData = await manifestRes.json();

        const columnsMap: Record<string, string[]> = {};
        try {
          const parquetRes = await fetch(parquetUrl);
          if (parquetRes.ok) {
            const arrayBuffer = await parquetRes.arrayBuffer();
            await new Promise<void>((resolve) => {
              parquetRead({
                file: arrayBuffer,
                rowFormat: 'object',
                onComplete: (rows: any[]) => {
                  rows.forEach((row) => {
                    const dsKey = row.dataset || row.name || row.package || row.dataset_name;
                    const colName = row.column || row.column_name || row.col;
                    if (dsKey && colName) {
                      if (!columnsMap[dsKey]) columnsMap[dsKey] = [];
                      if (!columnsMap[dsKey].includes(colName)) {
                        columnsMap[dsKey].push(colName);
                      }
                    }
                  });
                  resolve();
                },
              });
            });
          }
        } catch (parquetErr) {
          console.warn('Could not load columns.parquet in Home modal:', parquetErr);
        }

        const mapped = manifestData.packages.map((pkg: ManifestPackage) => {
          const parquetCols =
            columnsMap[pkg.name] ||
            columnsMap[pkg.id] ||
            columnsMap[pkg.title] ||
            [];

          const combinedColumns = Array.from(new Set([...(pkg.columns || []), ...parquetCols]));

          return {
            id: pkg.id,
            title: pkg.title.trim(),
            description: `City of Toronto open dataset published by ${pkg.owner}.`,
            publisher: pkg.owner,
            topic: 'City Operations',
            civicIssue: 'Municipal Data',
            tags: [pkg.owner],
            downloadUrl: `https://open.toronto.ca/dataset/${pkg.name}/`,
            name: pkg.name,
            columns: combinedColumns,
          };
        });

        mapped.sort((a: DatasetCard, b: DatasetCard) => a.title.localeCompare(b.title));

        setDatasets(mapped);
      } catch (err) {
        console.error('Failed to load dataset data:', err);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalDataset(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const publishers = ['All', ...Array.from(new Set(datasets.map((ds) => ds.publisher).filter(Boolean)))];
  const uniquePublishers = Array.from(new Set(datasets.map((ds) => ds.publisher).filter(Boolean))) as string[];
  const topics = ['All', ...Array.from(new Set(datasets.map((ds) => ds.topic).filter(Boolean)))];
  const civicIssues = ['All', ...Array.from(new Set(datasets.map((ds) => ds.civicIssue).filter(Boolean)))];

  const filteredDatasets = datasets.filter((ds) => {
    if (selectedPublisher !== 'All' && ds.publisher !== selectedPublisher) return false;
    if (selectedTopic !== 'All' && ds.topic !== selectedTopic) return false;
    if (selectedCivicIssue !== 'All' && ds.civicIssue !== selectedCivicIssue) return false;
    return true;
  });

  return (
    <section className="home-section">
      {/* Search Header */}
      <div className="home-header-area">
        <h1 className="home-main-title">
          Open Data Discover
        </h1>
        <p className="home-main-subtitle">
          Select a column from any City of Toronto open dataset to find columns in
          other datasets that share its values.
        </p>

        <Suspense fallback={<DatasetPickerLoading size="large" />}>
          <DatasetPicker size="large" />
        </Suspense>

        <p className="mt-6 text-[0.85rem]">
          <Link to="/about#how-to-use" className="text-dim underline">
            How Do I Use This Tool?
          </Link>
        </p>
      </div>

      <hr className="my-10 border-t border-[var(--line)]" />

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
                  {pub === 'All' ? 'All Publishers' : pub}
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
              disabled
              className="filter-select"
            >
              {topics.map((top) => (
                <option key={top} value={top}>
                  {top === 'All' ? 'All Topics' : top}
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
              disabled
              className="filter-select"
            >
              {civicIssues.map((issue) => (
                <option key={issue} value={issue}>
                  {issue === 'All' ? 'All Civic Issues' : issue}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dataset Cards Grid */}
        <div className="dataset-cards-grid">
          {filteredDatasets.map((ds) => {
            const pubIndex = uniquePublishers.indexOf(ds.publisher);
            const badgeIndex = pubIndex >= 0 ? pubIndex % 5 : 0;

            return (
              <div
                key={ds.id}
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
                    {ds.description}
                  </p>

                  {/* Clickable Publisher Tag Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {ds.tags?.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedPublisher(ds.publisher)}
                        data-publisher-index={badgeIndex}
                        className="publisher-badge cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        title={`Filter by ${ds.publisher}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Footer Download Link */}
                <div className="dataset-card-footer">
                  <a
                    href={ds.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dataset-card-link"
                  >
                    Get Dataset <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            );
          })}
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
                <div className="mt-2">
                  <span
                    data-publisher-index={
                      uniquePublishers.indexOf(activeModalDataset.publisher) >= 0
                        ? uniquePublishers.indexOf(activeModalDataset.publisher) % 5
                        : 0
                    }
                    className="publisher-badge inline-block"
                  >
                    {activeModalDataset.publisher}
                  </span>
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
                  {activeModalDataset.description}
                </p>
              </div>

              <div>
                <h4 className="modal-section-title mb-2">
                  Data Dictionary ({activeModalDataset.columns.length})
                </h4>
                {activeModalDataset.columns.length > 0 ? (
                  <div className="modal-dictionary-container">
                    {activeModalDataset.columns.map((col) => (
                      <div key={col} className="modal-dictionary-row">
                        <code className="font-mono text-[var(--text)] font-semibold">{col}</code>
                        <span className="text-[11px] text-dim italic">Column</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dim italic">
                    No column details available for this dataset.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <a
                href={activeModalDataset.downloadUrl}
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
    </section>
  );
}
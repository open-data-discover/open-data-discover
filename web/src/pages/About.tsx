import type { ReactNode } from 'react';

import ExternalLink from '../components/ExternalLink';

const sections = [
  { id: 'the-data', title: 'The Data' },
  { id: 'the-method', title: 'The Method' },
  { id: 'how-to-use', title: 'How to Use This Tool' },
];

export default function About() {
  return (
    <section className="wrap pt-12 pb-16">
      <title>About · Open Data Discover: Toronto</title>

      <header className="mb-8">
        <h1 className="mb-3 text-[clamp(1.8rem,5vw,2.25rem)] font-[750] tracking-[-0.03em]">
          About Open Data Discover
        </h1>
        <Lead>
          The City of Toronto's{' '}
          <ExternalLink href="https://open.toronto.ca/">
            Open Data Portal
          </ExternalLink>{' '}
          contains hundreds of public datasets—tracking everything from
          neighborhood park locations and to transit schedules. However,
          figuring out how different datasets can be connected or combined can
          be challenging.
        </Lead>
        <Lead>
          <strong>Open Data Discover</strong> aims to improve the
          discoverability of Toronto's open datasets, by making it easier to see
          the structure of each dataset's resources and showing possible joins
          across different sets.
        </Lead>
        <Lead>
          Whether you are already using a dataset and want an easy way to see
          other datasets you can combine or incorporate into your project, or
          are just getting started on a project and want to explore what public
          data the city has to offer, this tool is designed to make Toronto's
          open data easier to explore and use.
        </Lead>

        <nav
          aria-label="About page navigation"
          className="mt-6 mb-2 flex flex-wrap justify-center gap-2">
          {sections.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="focus-ring inline-block rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-fg transition-colors hover:border-dim hover:bg-bg hover:no-underline">
              {title}
            </a>
          ))}
        </nav>
      </header>

      <hr className="my-10 border-line" />

      <Section number={1} {...sections[0]}>
        <Subsection>
          <P>
            <ExternalLink href="https://open.toronto.ca/">
              Open Data Toronto
            </ExternalLink>{' '}
            is the official open data portal maintained by the City of Toronto.
            Its core purpose is to make municipal government data freely
            available to the public in open, machine-readable formats.
          </P>
          <P>
            <strong>Goal:</strong> Promotes civic transparency, data-driven
            decision-making, municipal accountability, and public innovation. It
            allows community members, developers, academics, journalists, and
            businesses to build apps, analyze urban trends, or conduct research.
          </P>
          <P>
            <strong>Licensing:</strong> All datasets are released under the Open
            Government Licence – Toronto. This licence allows worldwide,
            royalty-free, perpetual use, modification, and redistribution for
            both commercial and non-commercial purposes, provided appropriate
            attribution is given to the City.
          </P>
        </Subsection>

        <Subsection>
          <H3>Available Datasets &amp; Formats</H3>
          <P>
            The catalog contains hundreds of datasets spanning dozens of City
            divisions and agencies. Key categories include:
          </P>
          <List>
            <Item label="Transportation & Mobility">
              Road closures, traffic signals, cycling routes, TTC transit
              schedules, parking locations, and collision statistics.
            </Item>
            <Item label="Public Health & Safety">
              Shelter occupancy and capacity, DineSafe restaurant inspection
              records, paramedic response times, and Toronto Police Service
              event logs.
            </Item>
            <Item label="Parks, Forestry & Recreation">
              Urban tree canopy inventories, park facility locations, trail
              networks, and recreational program listings.
            </Item>
            <Item label="City Governance & Finance">
              Approved municipal budgets, lobbyist registry data, council votes,
              active business licenses, and short-term rental registrations.
            </Item>
            <Item label="Environment & Infrastructure">
              Garbage/recycling collection schedules, water meter data, green
              roof locations, and energy consumption.
            </Item>
            <Item label="Geospatial & Mapping">
              City ward boundaries, property parcels, elevation data, and 3D
              massing models.
            </Item>
          </List>
          <P>
            <strong>Formats:</strong> Data can typically be downloaded in
            standard structured formats such as CSV, GeoJSON, SHP (Shapefile),
            JSON, and XML, or queried directly via the portal's open API (CKAN
            API).
          </P>
        </Subsection>

        <Subsection>
          <H3>How Current Is the Data?</H3>
          <P>
            Data freshness varies depending on the specific dataset and its
            underlying operational source.
          </P>

          <H4>Refresh Rates</H4>
          <P>
            Each dataset on the portal lists an official "Refresh Rate" metadata
            field set by the publishing division:
          </P>
          <List>
            <Item label="Daily / Real-Time">
              Frequently updated feeds (e.g., daily shelter occupancy, active
              traffic events, dynamic transit schedules).
            </Item>
            <Item label="As Available">
              Updated dynamically as new events or administrative changes occur.
            </Item>
            <Item label="Monthly / Quarterly">
              Operational records updated on fixed cycles (e.g., DineSafe
              inspection logs, housing statistics).
            </Item>
            <Item label="Annually">
              Year-end or cycle-based datasets (e.g., annual municipal budgets,
              major financial reports).
            </Item>
            <Item label="Will Not Be Refreshed / Historical">
              One-off studies, legacy datasets, or archived historical
              collections.
            </Item>
          </List>

          <H4>Timestamp</H4>
          <P>
            Every dataset page includes a "Data Last Refreshed" timestamp. This
            field shows the date and time the portal's automated pipeline last
            pulled data from the source department.
          </P>
        </Subsection>
      </Section>

      <Section number={2} {...sections[1]}>
        <Subsection>
          <H3>Candidate Joins &amp; Profiling</H3>
          <P>
            A <strong>candidate join</strong> represents a pair of columns from
            two different <abbr title="Comma-Separated Values">CSV</abbr> files
            in the Open Data catalog that share overlapping values. To discover
            these connections, the analysis pipeline profiles every complete
            dataset in the catalog, building unique value lists for each column
            after standardizing text (converting to lowercase and removing extra
            spaces).
          </P>
        </Subsection>

        <Subsection>
          <H3>Containment &amp; Score Calculation</H3>
          <P>
            To determine how strongly two columns relate, the algorithm
            evaluates set overlap based on shared unique values:
          </P>
          <List>
            <Item label="Shared Unique Values">
              The total number of distinct entries that appear in both Column A
              and Column B.
            </Item>
            <Item label="Containment Ratio">
              Measures what percentage of Column A's unique entries can be found
              inside Column B:
              <br />
              <code aria-label="Containment ratio formula: Shared unique values divided by distinct values in Column A">
                Containment (A to B) = Shared Unique Values ÷ Distinct Values in
                Column A
              </code>
            </Item>
            <Item label="Overall Score">
              Takes the higher of the two directional containment ratios:
              <br />
              <code aria-label="Overall score formula: Maximum value of Containment A to B or Containment B to A">
                Overall Score = Maximum of (Containment A to B, Containment B to
                A)
              </code>
            </Item>
          </List>
          <P>
            Using the maximum directional containment score (ranging from{' '}
            <code>0.00</code> to <code>1.00</code>) ensures that subset
            relationships stand out—such as a list of 20 neighborhood parks
            whose names are entirely contained within a larger city-wide
            inventory of 1,000 parks.
          </P>
        </Subsection>

        <Subsection>
          <H3>Algorithmic Scope &amp; Limitations</H3>
          <P>
            To maintain high performance across hundreds of datasets, the
            detection pipeline operates within defined technical boundaries:
          </P>
          <List>
            <Item label="Exact Text Matching">
              Comparisons require exact text matches. The algorithm does not use{' '}
              <abbr title="Natural Language Processing">NLP</abbr> or fuzzy
              matching, so variations like "Avenue" versus "Ave" are not counted
              as matching values.
            </Item>
            <Item label="Skipped Short & System Columns">
              System keys (such as <code>_id</code>), columns with fewer than 8
              unique entries, or columns averaging 6 characters or fewer per
              cell are excluded to filter out generic identifiers, dates, and
              status codes.
            </Item>
            <Item label="Common Value Filtering">
              Extremely frequent terms that appear across dozens of different
              datasets are excluded to prevent cluttering results with trivial
              matches.
            </Item>
            <Item label="Coincidental Overlaps">
              High scores reflect statistical string overlap rather than
              guaranteed meaning. Unrelated datasets sharing identical code
              numbers or common names may occasionally yield high scores by
              chance.
            </Item>
          </List>
        </Subsection>
      </Section>

      <Section number={3} {...sections[2]}>
        <Subsection>
          <H3>Select a Dataset</H3>
          <P>
            Search or use the drop-down in the Data section to select a dataset.
            Then select a column to view its join results.
          </P>

          <div className="my-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <Screenshot
              src={`${import.meta.env.BASE_URL}images/image_a1.png`}
              alt="Selecting a dataset and column"
              caption="Dataset Selection"
            />
            <Screenshot
              src={`${import.meta.env.BASE_URL}images/image_a2.png`}
              alt="Viewing join results and scores"
              caption="Columns"
            />
          </div>

          <H3>View Results</H3>
          <P>
            The score next to each result shows how strongly its values overlap
            with your selected column—a higher score means a higher likelihood
            that the two datasets can be connected or combined.
          </P>

          <Screenshot
            src={`${import.meta.env.BASE_URL}images/image_a3.png`}
            alt="Viewing join results and scores"
            caption="Join Results & Scores"
          />

          <P>
            Clicking any result row opens that dataset and displays its matching
            columns, allowing you to follow connections and explore related data
            across the entire catalog.
          </P>
        </Subsection>
      </Section>
    </section>
  );
}

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article id={id} className="mb-14">
      <header className="mb-7 flex items-baseline gap-3 border-b border-line pb-2.5">
        <span className="text-[0.85rem] font-bold tracking-[0.05em] text-dim tabular-nums">
          {String(number).padStart(2, '0')}
        </span>
        <h2 className="text-[1.4rem] font-bold tracking-[-0.01em]">{title}</h2>
      </header>
      {children}
    </article>
  );
}

function Subsection({ children }: { children: ReactNode }) {
  return <section className="mb-9">{children}</section>;
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-7 text-[1.1rem] leading-[1.6] text-dim">{children}</p>;
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 text-[1.2rem] leading-[1.3] font-semibold first:mt-0">
      {children}
    </h3>
  );
}

function H4({ children }: { children: ReactNode }) {
  return (
    <h4 className="mt-[1.15rem] mb-1.5 text-[1.025rem] leading-[1.35] font-semibold">
      {children}
    </h4>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-3.5 leading-[1.6]">{children}</p>;
}

function List({ children }: { children: ReactNode }) {
  return <ul className="mt-2 mb-[1.15rem] list-disc pl-5">{children}</ul>;
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="mb-[0.45rem] leading-[1.55] last:mb-0">
      <strong>{label}:</strong> {children}
    </li>
  );
}

function Screenshot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-4">
      <img
        src={src}
        alt={alt}
        className="block h-auto w-full rounded-lg border border-line bg-surface"
      />
      <figcaption className="mt-1.5 text-center text-[0.825rem] text-dim">
        {caption}
      </figcaption>
    </figure>
  );
}

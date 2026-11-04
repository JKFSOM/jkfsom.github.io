import { useMemo, useState } from 'react';

import './explorer.css';
import {
  benchmarkCtr,
  ctr,
  missedClicks,
  opportunities,
  siteMedianCtr,
  type Opportunity,
} from './opportunities';

const number = new Intl.NumberFormat('en-GB');
const percent = (value: number) => `${value.toFixed(1)}%`;
const categories = [...new Set(opportunities.map((item) => item.category))];

function CtrChart({ item }: { item: Opportunity }) {
  const peak = siteMedianCtr[0];
  const queryCtr = ctr(item);
  return (
    <figure className="ox-chart">
      <div
        className="ox-bars"
        role="img"
        aria-label={`Site median click-through rate by position. This query earns ${percent(queryCtr)} against a median of ${percent(benchmarkCtr(item))} at position ${item.benchmarkPosition}.`}
      >
        {siteMedianCtr.map((value, index) => {
          const isBenchmark = index + 1 === item.benchmarkPosition;
          return (
            <span key={index} className="ox-column">
              <span
                className={isBenchmark ? 'ox-bar ox-bar--benchmark' : 'ox-bar'}
                style={{ height: `${(value / peak) * 100}%` }}
              >
                {isBenchmark && (
                  <i className="ox-marker" style={{ bottom: `${(queryCtr / value) * 100}%` }} />
                )}
              </span>
              <span className="ox-axis">{index + 1}</span>
            </span>
          );
        })}
      </div>
      <figcaption>
        Site median CTR by position. The coral line marks this query.
      </figcaption>
    </figure>
  );
}

export default function OpportunityExplorer() {
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState(opportunities[0]);

  const visible = useMemo(
    () => opportunities.filter((item) => !filter || item.category === filter),
    [filter],
  );

  const applyFilter = (category: string | null) => {
    setFilter(category);
    const next = opportunities.filter((item) => !category || item.category === category);
    if (!next.includes(selected)) setSelected(next[0]);
  };

  const filters = [null, ...categories];

  return (
    <section className="ox" aria-label="SEO opportunity explorer">
      <header className="ox-toolbar">
        <h2>Opportunity explorer</h2>
        <p>Synthetic data, for illustration</p>
      </header>

      <div className="ox-filters" role="group" aria-label="Filter by category">
        {filters.map((category) => {
          const count = category
            ? opportunities.filter((item) => item.category === category).length
            : opportunities.length;
          return (
            <button
              key={category ?? 'all'}
              type="button"
              aria-pressed={filter === category}
              onClick={() => applyFilter(category)}
            >
              {category ?? 'All'} {count}
            </button>
          );
        })}
      </div>

      <div className="ox-panes">
        <div className="ox-main">
          <table>
            <caption className="visually-hidden">Queries with a detected opportunity</caption>
            <thead>
              <tr>
                <th scope="col">Query</th>
                <th scope="col">Category</th>
                <th scope="col">Impressions</th>
                <th scope="col">Clicks</th>
                <th scope="col">CTR</th>
                <th scope="col">Position</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.query} className={item === selected ? 'is-selected' : undefined}>
                  <th scope="row">
                    <button
                      type="button"
                      aria-pressed={item === selected}
                      onClick={() => setSelected(item)}
                    >
                      {item.query}
                    </button>
                  </th>
                  <td className="ox-category">{item.category}</td>
                  <td data-label="Impressions">{number.format(item.impressions)}</td>
                  <td data-label="Clicks">{number.format(item.clicks)}</td>
                  <td data-label="CTR">{percent(ctr(item))}</td>
                  <td data-label="Position">{item.position}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ox-context">
            <CtrChart item={selected} />
            <div className="ox-method">
              <h3>Method</h3>
              <p>
                Queries are compared with the median CTR this site earns at the benchmark
                position, then ranked by estimated missed clicks.
              </p>
            </div>
          </div>
        </div>

        <div className="ox-detail" aria-live="polite">
          <div>
            <h3 className="ox-query">{selected.query}</h3>
            <p className="ox-sub">{selected.category}</p>
          </div>

          <div className="ox-measured">
            <p className="ox-badge">
              <i /> Measured
            </p>
            <dl>
              <div>
                <dd>{percent(ctr(selected))}</dd>
                <dt>CTR</dt>
              </div>
              <div>
                <dd>{percent(benchmarkCtr(selected))}</dd>
                <dt>Median at position {selected.benchmarkPosition}</dt>
              </div>
              <div>
                <dd>{number.format(missedClicks(selected))}</dd>
                <dt>Missed clicks, 28 days</dt>
              </div>
            </dl>
          </div>

          <div className="ox-inferred">
            <p className="ox-badge ox-badge--inferred">
              <i /> Example of inferred output
            </p>
            <p className="ox-explanation">{selected.explanation}</p>
            <p className="ox-disclaimer">Written by hand for this example.</p>
          </div>
        </div>
      </div>

      <footer className="ox-footer">
        Static example. The arithmetic runs in your browser, and no model runs here.
      </footer>
    </section>
  );
}

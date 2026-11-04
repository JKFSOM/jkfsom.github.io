/**
 * Synthetic data for the explorer. The scoring below is real arithmetic. The
 * explanations are hand-written examples of what a model might produce.
 */
export const siteMedianCtr = [28, 15, 9.5, 6.1, 4.4, 3.2, 2.5, 1.9, 1.6, 1.3];

export interface Opportunity {
  query: string;
  category: 'Low CTR' | 'Striking distance' | 'Cannibalisation' | 'Content gap';
  impressions: number;
  clicks: number;
  position: number;
  /** The position this query is measured against. */
  benchmarkPosition: number;
  explanation: string;
}

export const opportunities: Opportunity[] = [
  {
    query: 'late payment interest calculator',
    category: 'Low CTR',
    impressions: 18400,
    clicks: 276,
    position: 4.2,
    benchmarkPosition: 4,
    explanation:
      'The page defines late payment interest, but searchers want a calculator. Neither the title nor the description mentions one. Move the calculator to the top and name it in the title.',
  },
  {
    query: 'invoice payment terms template',
    category: 'Striking distance',
    impressions: 9120,
    clicks: 219,
    position: 8.6,
    benchmarkPosition: 4,
    explanation:
      'The page lists terms but offers nothing to download. Adding a copyable template would match what searchers came for and give other sites a reason to link to it.',
  },
  {
    query: 'how long to keep invoices uk',
    category: 'Striking distance',
    impressions: 6480,
    clicks: 97,
    position: 11.3,
    benchmarkPosition: 4,
    explanation:
      'The answer sits in the fourth paragraph of a general guide. State the retention period in the first sentence and give the question its own heading.',
  },
  {
    query: 'credit note vs refund',
    category: 'Cannibalisation',
    impressions: 4760,
    clicks: 333,
    position: 3.1,
    benchmarkPosition: 3,
    explanation:
      'Two pages appear to compete for this query. Merging them into one comparison would give searchers a clearer result.',
  },
  {
    query: 'statement of account example',
    category: 'Content gap',
    impressions: 3940,
    clicks: 59,
    position: 14.8,
    benchmarkPosition: 4,
    explanation:
      'No page targets this query directly. A short worked example would cover it, and the existing invoicing guide could link to it.',
  },
];

export const ctr = ({ clicks, impressions }: Opportunity) => (clicks / impressions) * 100;

export const benchmarkCtr = ({ benchmarkPosition }: Opportunity) =>
  siteMedianCtr[benchmarkPosition - 1];

export const missedClicks = (item: Opportunity) =>
  Math.max(0, Math.round((item.impressions * (benchmarkCtr(item) - ctr(item))) / 100));

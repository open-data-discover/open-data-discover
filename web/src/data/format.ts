export const number = (n: number) => n.toLocaleString('en-CA');

export const percent = (x: number) => `${Math.round(x * 100)}%`;

export const plural = (n: number, word: string) =>
  `${n ? number(n) : 'no'} ${word}${n === 1 ? '' : 's'}`;

export type OverlapLevel = 'high' | 'medium' | 'low';

export const overlapLevel = (score: number): OverlapLevel =>
  score >= 0.8 ? 'high' : score >= 0.5 ? 'medium' : 'low';

export const portalHref = (datasetName: string) =>
  `https://open.toronto.ca/dataset/${encodeURIComponent(datasetName)}/`;

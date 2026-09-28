import type { FoodInputs } from './analysis';

export type View = 'overview' | 'analyze' | 'materials' | 'history' | 'assistant';

export interface AnalysisSeed {
  key: number;
  commodityId: string | null;
  inputs?: FoodInputs;
}
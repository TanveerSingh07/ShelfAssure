export type CommodityClass = 'dry-snack' | 'fresh-produce' | 'dry-powder' | 'dry-cereal' | 'chilled-dairy';
export type StorageType = 'ambient' | 'chilled' | 'frozen';
export type TransportMode = 'local' | 'regional' | 'long-haul';
export type Level = 'Low' | 'Moderate' | 'High' | 'Critical';
export type EvidenceStatus = 'Measured' | 'Literature' | 'Manufacturer' | 'Reference';
export type PackFeature = 'n2-flush' | 'vacuum' | 'transparent' | 'anti-fog' | 'carton' | 'bulk' | 'reclosable';
export type LayerKind =
'PET' |
'BOPP' |
'CPP' |
'PE' |
'Metal' |
'Alu' |
'EVOH' |
'PA' |
'Paper' |
'PLA' |
'PP' |
'Cellulose';
export type MaterialFamily =
'Mono film' |
'Laminate' |
'Metallized' |
'High barrier' |
'Breathable' |
'Rigid' |
'Paper-based' |
'Woven';

export interface FoodInputs {
  moisture: number;
  fat: number;
  pH: number;
  aw: number;
  respirationRate: number | null;
  shelfLifeDays: number;
  temperature: number;
  rh: number;
  storage: StorageType;
  transport: TransportMode;
  retailLight: boolean;
}

export interface RespirationProfile {
  r10: number;
  q10: number;
  rq: number;
  targetO2: [number, number];
  targetCO2: [number, number];
  optimalTemp: number;
  optimalDays: number;
  fillWeightKg: number;
  headspaceMl: number;
  filmAreaM2: number;
}

export interface Commodity {
  id: string;
  name: string;
  category: string;
  cls: CommodityClass;
  image: string;
  tagline: string;
  packFormat: string;
  defaults: FoodInputs;
  fragility: number;
  bulk: boolean;
  preferred: PackFeature[];
  requiredFeature?: PackFeature;
  keyRisks: string[];
  respiration?: RespirationProfile;
}

export interface Layer {
  name: string;
  kind: LayerKind;
  microns: number;
}

export interface Material {
  id: string;
  name: string;
  family: MaterialFamily;
  layers: Layer[];
  thicknessRange: [number, number];
  otr: number | null;
  otrCond: string;
  wvtr: number | null;
  wvtrCond: string;
  light: number;
  seal: number;
  mechanical: number;
  tempRange: [number, number];
  foodContact: boolean;
  breathable: boolean;
  paperBased: boolean;
  features: PackFeature[];
  costPerM2: number;
  recyclability: string;
  carbon: number;
  sustainScore: number;
  evidence: EvidenceStatus;
  source: string;
  typicalUse: string;
}

export type RequirementKey = 'oxygen' | 'moisture' | 'gas' | 'light' | 'mechanical' | 'seal' | 'temperature';

export interface Requirement {
  key: RequirementKey;
  label: string;
  short: string;
  score: number;
  level: Level;
  target: string;
  drivers: string[];
}

export interface RequirementProfile {
  requirements: Requirement[];
  maxOTR: number | null;
  maxWVTR: number | null;
  minLight: number;
  minMechanical: number;
  minSeal: number;
  isProduce: boolean;
  riskClass: string;
  primaryRisk: string;
  warnings: string[];
}

export type CandidateStatus = 'feasible' | 'conditional' | 'rejected';
export type ShelfFit = 'Meets target' | 'Marginal' | 'Below target' | 'Validation required';

export interface CheckResult {
  label: string;
  ok: boolean | null;
  detail: string;
}

export interface CandidateResult {
  material: Material;
  status: CandidateStatus;
  checks: CheckResult[];
  protection: number;
  costScore: number;
  sustainScore: number;
  overall: number;
  confidence: number;
  shelfLife: {low: number;high: number;} | null;
  shelfFit: ShelfFit;
  rank: number | null;
  eqO2: number | null;
  featureMatch: PackFeature[];
}

export interface Priorities {
  protection: number;
  cost: number;
  sustainability: number;
}

export interface SavedAnalysis {
  id: string;
  commodityId: string;
  commodityName: string;
  date: string;
  recommendation: string;
  feasibleCount: number;
  screened: number;
  shelfFit: ShelfFit;
  inputs: FoodInputs;
  ruleVersion: string;
  modelVersion: string;
  dbVersion: string;
  owner: string;
}

export interface MapPoint {
  hour: number;
  o2: number;
  co2: number;
}

export interface MapSimulation {
  points: MapPoint[];
  eqO2: number;
  eqCO2: number;
  status: 'in-target' | 'above-target' | 'anaerobic';
}
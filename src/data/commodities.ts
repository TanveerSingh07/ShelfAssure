import type { Commodity } from '../types/analysis';

export const commodities: Commodity[] = [
{
  id: 'potato-chips',
  name: 'Potato Chips',
  category: 'Fried snack',
  cls: 'dry-snack',
  image: "/bd93e94b-1817-442c-bd1e-681bfa3a5128.jpg",
  tagline: 'High-fat, ultra-dry and fragile',
  packFormat: 'Pillow pouch · 52 g',
  defaults: {
    moisture: 2,
    fat: 35,
    pH: 6.0,
    aw: 0.25,
    respirationRate: null,
    shelfLifeDays: 120,
    temperature: 30,
    rh: 70,
    storage: 'ambient',
    transport: 'regional',
    retailLight: true
  },
  fragility: 0.9,
  bulk: false,
  preferred: ['n2-flush'],
  keyRisks: ['Oxidative rancidity', 'Loss of crispness', 'Breakage']
},
{
  id: 'fresh-tomatoes',
  name: 'Fresh Tomatoes',
  category: 'Fresh vegetable',
  cls: 'fresh-produce',
  image: "/a57e3bd6-abf3-43dc-bbbf-812450c146d8.jpg",
  tagline: 'Living, respiring and moisture-rich',
  packFormat: 'Retail pack · 500 g',
  defaults: {
    moisture: 94,
    fat: 0.2,
    pH: 4.3,
    aw: 0.99,
    respirationRate: 6,
    shelfLifeDays: 14,
    temperature: 12,
    rh: 90,
    storage: 'chilled',
    transport: 'regional',
    retailLight: false
  },
  fragility: 0.7,
  bulk: false,
  preferred: ['anti-fog'],
  keyRisks: ['Respiration & ripening', 'Water loss', 'Anaerobic off-flavours'],
  respiration: {
    r10: 6,
    q10: 2.2,
    rq: 0.9,
    targetO2: [3, 5],
    targetCO2: [2, 5],
    optimalTemp: 12,
    optimalDays: 21,
    fillWeightKg: 0.5,
    headspaceMl: 600,
    filmAreaM2: 0.12
  }
},
{
  id: 'wheat-flour',
  name: 'Whole Wheat Flour',
  category: 'Milled staple',
  cls: 'dry-powder',
  image: "/9f8a33a9-e567-4277-9111-0ad8851faf38.jpg",
  tagline: 'Hygroscopic, bulk and cost-sensitive',
  packFormat: 'Retail bag · 5 kg',
  defaults: {
    moisture: 12,
    fat: 2,
    pH: 6.1,
    aw: 0.6,
    respirationRate: null,
    shelfLifeDays: 180,
    temperature: 30,
    rh: 75,
    storage: 'ambient',
    transport: 'regional',
    retailLight: true
  },
  fragility: 0.2,
  bulk: true,
  preferred: ['bulk'],
  keyRisks: ['Moisture pick-up & caking', 'Insect infestation', 'Bran lipid rancidity']
},
{
  id: 'cornflakes',
  name: 'Breakfast Cereal',
  category: 'Ready-to-eat cereal',
  cls: 'dry-cereal',
  image: "/0994ebe3-fe02-42a4-8859-65926c3bdccd.jpg",
  tagline: 'Crisp, aromatic and long shelf life',
  packFormat: 'Carton · 475 g',
  defaults: {
    moisture: 3,
    fat: 1,
    pH: 6.5,
    aw: 0.3,
    respirationRate: null,
    shelfLifeDays: 240,
    temperature: 30,
    rh: 65,
    storage: 'ambient',
    transport: 'regional',
    retailLight: true
  },
  fragility: 0.6,
  bulk: false,
  preferred: ['carton'],
  keyRisks: ['Loss of crispness', 'Flavour loss', 'Crushing']
},
{
  id: 'paneer',
  name: 'Fresh Paneer',
  category: 'Chilled dairy',
  cls: 'chilled-dairy',
  image: "/15e243cd-3857-48ef-96fb-ebbfc4592561.jpg",
  tagline: 'High moisture, high aw, cold chain',
  packFormat: 'Vacuum block · 200 g',
  defaults: {
    moisture: 55,
    fat: 22,
    pH: 5.6,
    aw: 0.95,
    respirationRate: null,
    shelfLifeDays: 21,
    temperature: 4,
    rh: 85,
    storage: 'chilled',
    transport: 'regional',
    retailLight: false
  },
  fragility: 0.3,
  bulk: false,
  preferred: ['vacuum', 'transparent'],
  requiredFeature: 'vacuum',
  keyRisks: ['Mould & yeast growth', 'Surface drying', 'Fat oxidation']
}];


export function getCommodity(id: string): Commodity | undefined {
  return commodities.find((c) => c.id === id);
}
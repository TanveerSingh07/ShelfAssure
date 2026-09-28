export interface KnowledgeEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string[];
  sources: string[];
}

export const knowledgeBase: KnowledgeEntry[] = [
{
  id: 'otr-wvtr',
  question: 'What do OTR and WVTR mean, and why do test conditions matter?',
  keywords: ['otr', 'wvtr', 'transmission', 'barrier', 'condition'],
  answer: [
  'OTR (oxygen transmission rate) is the volume of oxygen passing through one square metre of packaging per day, in cc/m²·day. WVTR (water vapour transmission rate) is the mass of water vapour passing through, in g/m²·day. For both, lower means a better barrier.',
  'Neither value belongs to the polymer name alone. Both depend on thickness, structure, temperature and humidity. That is why ShelfAssure stores every value together with its test conditions, and only compares values measured under matching conditions.'],

  sources: ['ASTM D3985 — OTR test method', 'ASTM F1249 — WVTR test method', 'ShelfAssure data rule §4']
},
{
  id: 'chips-met',
  question: 'Why is metallized film recommended for chips?',
  keywords: ['chips', 'metallized', 'met', 'snack', 'bopp'],
  answer: [
  'Potato chips are about 35% fat and 2% moisture. That combination needs a critical oxygen barrier (against rancidity) and a critical moisture barrier (against loss of crispness). A vapour-deposited aluminium layer on BOPP delivers both while also blocking light.',
  'High-barrier MET-BOPP meets both targets at a lower cost than foil laminates. It also works with nitrogen flushing, which cushions the chips and lowers the oxygen left inside the pack.'],

  sources: ['Robertson, Food Packaging (3rd ed.), ch. 14', 'Film manufacturer TDS · HB-MET 2026']
},
{
  id: 'map',
  question: 'How does modified atmosphere packaging work for fresh produce?',
  keywords: ['map', 'modified', 'atmosphere', 'produce', 'tomato', 'respiration', 'perforat'],
  answer: [
  'Fresh produce keeps respiring after harvest: it consumes O₂ and releases CO₂. In a sealed pack with the right permeability, O₂ falls and CO₂ rises until the gas the produce uses is balanced by the gas the film lets through.',
  'For tomatoes, a balance of about 3–5% O₂ slows ripening. If the film is too tight or the temperature rises, O₂ can fall below about 1.5%. The produce then switches to anaerobic respiration and develops off-flavours. This is why ShelfAssure checks MAP behaviour at the storage temperature you enter.'],

  sources: ['FAO — Modified-atmosphere information (AC300e)', 'FAO — Fresh fruit and vegetable packaging guidance']
},
{
  id: 'recycle',
  question: 'Are multi-layer laminates recyclable?',
  keywords: ['recycl', 'laminate', 'sustainab', 'multi', 'compost'],
  answer: [
  'Most multi-polymer laminates, such as PET/Alu/PE or PA/PE, cannot be separated in today’s recycling streams. Mono-material structures (all-PE or all-PP) and separable formats (a liner inside a carton) have better end-of-life routes.',
  'ShelfAssure shows sustainability as a trade-off among options that are already technically feasible. It never lets sustainability promote a structure that fails the product’s protection needs.'],

  sources: ['FSSAI Packaging Regulations, 2018', 'Plastic Waste Management (Amendment) Rules']
},
{
  id: 'testing',
  question: 'What tests do I need before launching a new pack?',
  keywords: ['test', 'validation', 'launch', 'migration', 'checklist'],
  answer: [
  'A recommendation is a shortlist for physical validation, not a certification. The usual checks are: food-contact compliance with overall and specific migration testing, OTR and WVTR measured on your actual laminate, seal strength and leak testing, drop and compression testing for your distribution route, and a product-specific shelf-life study.',
  'Every ShelfAssure report ends with this checklist, tailored to the recommended structure.'],

  sources: ['IS 9845 — Migration testing', 'ASTM F88 — Seal strength', 'FSSAI Packaging Regulations, 2018']
},
{
  id: 'fssai',
  question: 'What does FSSAI require for food-contact packaging?',
  keywords: ['fssai', 'regulat', 'food-contact', 'food grade', 'compliance', 'law'],
  answer: [
  'The Food Safety and Standards (Packaging) Regulations, 2018 require packaging materials in direct contact with food to be food-grade and to meet the applicable Indian Standards and migration limits. Recycled plastics face specific restrictions for direct food contact.',
  'ShelfAssure treats food-contact status as a hard filter: a non-food-grade material is excluded, however strong its other scores.'],

  sources: ['FSSAI — Packaging Regulations 2018, compendium 02-04-2025', 'FSSAI — Packaging amendments']
}];


export const suggestedQuestions = knowledgeBase.map((k) => k.question);
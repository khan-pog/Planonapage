export const PLANTS = [
  "Granulation",
  "Mineral Acid",
  "Ammonia & Laboratory",
  "Camp",
  "Power & Utilities",
] as const;

export const DISCIPLINES = [
  "HSE",
  "Rotating",
  "Static",
  "EIC",
] as const;

export type Plant = typeof PLANTS[number];
export type Discipline = typeof DISCIPLINES[number]; 
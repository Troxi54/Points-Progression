import {
  createUniqueObject,
  objectEntries,
  objectFromEntries,
} from "@/core/utils/object";
import { Player } from "./types";

export const minifiedPlayerMap = createUniqueObject({
  gameVersion: 0,
  lastTick: 1,
  hideBoughtUpgrades: 2,
  stableProgressBars: 3,
  exponentialNotation: 4,
  autosave: 5,
  saveBeforeUnload: 6,
  upgrades: 7,
  repeatableUpgrades: 8,
  resetLayers: 9,
  dimensionId: 10,
  points: 11,
  bestRun: 12,
  bestPointsOfRun: 13,
  tier: 14,
  madeTierTimes: 15,
  ampliflux: 16,
  vermytes: 17,
  bestVermytes: 18,
  vermora: 19,
  enteredAmplivault: 20,
  amplivaultLevel: 21,
  bestSoftcapperLevel: 22,
  energyReactors: 23,
  energy: 24,
  everReachedCores: 25,
  everMadeCoreReset: 26,
  cores: 27,
  darkEnergy: 28,
  madeNullithResets: 29,
  reachedBreakAmplivault: 30,
  amplivaultBroken: 31,
  nullionInput: 32,
  nullions: 33,
  everEnteredSliph: 34,
  dertoints: 35,
  mallirtTotalDertoints: 36,
  offlineProgressWorks: 37,
  offlineOffset: 38,
  everReachedCappergy: 39,
  cappergy: 40,
  XP: 41,
  unspentOfflineTime: 42,
  nux: 43,
  everTriggeredNuxar: 44,
  nexusLevel: 45,
  bestNexusLevel: 46,
  amplivoid: 47,
  bestPoints: 48,
} as const satisfies Record<keyof Player, number>);

export type MinifiedPlayerMap = typeof minifiedPlayerMap;

export const unminifiedPlayerMap = objectFromEntries(
  objectEntries(minifiedPlayerMap).map(([key, value]) => {
    return [value, key];
  }),
) as { [K in keyof MinifiedPlayerMap as MinifiedPlayerMap[K]]: K };

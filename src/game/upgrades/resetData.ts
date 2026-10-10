import type { UpgradeContainerId } from "@game/upgrades/types";
import { UpgradeResetData } from "./resetTypes";

/**
 * Reset behaviour is kept separate from UI upgrade definitions so reset code
 * can use it without importing upgrade containers and creating a module cycle.
 */
const upgradeResetData: Record<UpgradeContainerId, UpgradeResetData> = {
  reset: {
    resetsOn: "tier",
  },
  tier: {
    resetsOn: "vermyros",
    keepsByUpgrade: {
      1: { reset: [1] },
      2: { reset: [2] },
    },
  },
  vermyros: {
    resetsOn: "nullith",
    keepsByUpgrade: {
      2: { reset: "all", tier: [1, 2] },
      3: { tier: [3, 4, 5, 6] },
    },
  },
  nullith: {
    keepsByUpgrade: {
      2: { reset: "all", tier: "all", vermyros: [1, 2, 3, 4] },
      3: { vermyros: [5, 6, 7, 8] },
      4: { vermyros: [9, 10] },
    },
  },
  dertoint: {
    resetsOn: "mallirt",
  },
  mallirt: {
    resetsOn: "level",
    keepsByUpgrade: {
      1: { dertoint: [1, 2] },
      2: { dertoint: [3, 4] },
    },
  },
  level: {
    resetsOn: "xagyros",
    keepsByUpgrade: {
      1: { dertoint: [1, 2], mallirt: [1] },
      2: { dertoint: [3, 4], mallirt: [2] },
      3: { mallirt: [3] },
      4: { mallirt: [4] },
    },
  },
  xagyros: {
    keepsByUpgrade: {
      1: { dertoint: "all", mallirt: "all" },
      2: { level: [1, 2] },
      3: { level: [3, 4] },
      4: { level: [5, 6] },
    },
  },
};

export default upgradeResetData;

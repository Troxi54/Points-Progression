import type { DecimalSource } from "break_eternity.js";
import type { GameVersion } from "@core/types/version";
import createDecimal from "@core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 2,
    patch: 7,
  } as GameVersion,
  endgameAt: createDecimal("1e250000"),
  rankTiers: [
    { name: "Rank Up", progress: createDecimal(0.04) },
    { name: "Tier Up", progress: createDecimal(0.1) },
    { name: "Tetr Up", progress: createDecimal(0.24) },
    { name: "Pent Up", progress: createDecimal(0.6) },
    { name: "Hex Up", progress: createDecimal(1) },
  ] as const,
  getRankTierName(progress: DecimalSource) {
    const currentProgress = createDecimal(progress).clamp(0, 1);

    for (let index = this.rankTiers.length - 1; index >= 0; index--) {
      const tier = this.rankTiers[index];
      if (currentProgress.greaterThanOrEqualTo(tier.progress)) {
        return tier.name;
      }
    }

    return this.rankTiers[0].name;
  },
} as const;

export default gameConfig;

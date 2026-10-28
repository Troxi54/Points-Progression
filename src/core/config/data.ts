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
    { name: "Rank Up", progress: createDecimal(0.04), multiplier: 1.5 },
    { name: "Tier Up", progress: createDecimal(0.1), multiplier: 2.25 },
    { name: "Tetr Up", progress: createDecimal(0.24), multiplier: 3.5 },
    { name: "Pent Up", progress: createDecimal(0.6), multiplier: 6 },
    { name: "Hex Up", progress: createDecimal(1), multiplier: 10 },
  ] as const,
  getRankTierIndex(progress: DecimalSource) {
    const currentProgress = createDecimal(progress).clamp(0, 1);

    for (let index = this.rankTiers.length - 1; index >= 0; index--) {
      const tier = this.rankTiers[index];
      if (currentProgress.greaterThanOrEqualTo(tier.progress)) {
        return index;
      }
    }

    return 0;
  },
  getRankTierName(progress: DecimalSource) {
    return this.rankTiers[this.getRankTierIndex(progress)]?.name ?? "Rank Up";
  },
  getRankTierMultiplier(progress: DecimalSource) {
    const index = this.getRankTierIndex(progress);
    return createDecimal(this.rankTiers[index]?.multiplier ?? 1);
  },
} as const;

export default gameConfig;

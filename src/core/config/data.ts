import type { GameVersion } from "@core/types/version";
import createDecimal from "@core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 2,
    patch: 2,
  } as GameVersion,
  endgameAt: createDecimal("1e9075"),
} as const;

export default gameConfig;

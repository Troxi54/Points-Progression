import { GameVersion } from "@core/types/version";
import createDecimal from "@core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 1,
  } as GameVersion,
  endgameAt: createDecimal("1e5650"),
} as const;

export default gameConfig;

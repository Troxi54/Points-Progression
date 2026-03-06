import { GameVersion } from "@core/types/version";
import createDecimal from "@core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 0,
    patch: 11,
  } as GameVersion,
  endgameAt: createDecimal("1e4025"),
} as const;

export default gameConfig;

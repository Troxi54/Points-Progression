import type { GameVersion } from "@core/schemas/version";
import createDecimal from "@core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 2,
    patch: 7,
  } satisfies GameVersion,
  dev: true,
  endgameAt: createDecimal("1e9075"),
};

export default gameConfig;

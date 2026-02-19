import { GameVersion } from "./types";
import createDecimal from "@/core/utils/decimal";

const gameConfig = {
  gameName: "Points Progression",
  gameVersion: {
    major: 1,
    minor: 0,
    patch: 8,
  } as GameVersion,
  endgameAt: createDecimal("1e4025"),
} as const;

export default gameConfig;

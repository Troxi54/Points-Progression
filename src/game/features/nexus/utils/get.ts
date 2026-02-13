import { MergedPlayer } from "@/game/player/merged/types";
import nexusMilestones from "../data";
import Decimal from "break_eternity.js";
import createDecimal from "@/core/utils/decimal";
import { arrayLastIndex } from "@/core/utils/array";

export function getNexusCost(mergedPlayer: MergedPlayer): Decimal | null {
  const levelDecimal = mergedPlayer.player.nexusLevel;
  if (
    levelDecimal.isNan() ||
    !levelDecimal.isFinite() ||
    levelDecimal.lessThan(0)
  ) {
    return null;
  }

  const level = levelDecimal.floor().toNumber();
  if (!Number.isSafeInteger(level)) return null;
  if (level > arrayLastIndex(nexusMilestones)) return null;

  return createDecimal(nexusMilestones[level].cost);
}

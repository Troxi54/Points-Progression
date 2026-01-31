import { MergedPlayer } from "@/game/player/merged/types";
import nexusMilestones from "../data";
import Decimal from "break_eternity.js";
import createDecimal from "@/core/utils/decimal";
import { arrayLastIndex } from "@/core/utils/array";

export function getNexusCost(mergedPlayer: MergedPlayer): Decimal | null {
  const level = mergedPlayer.player.nexusLevel.toNumber();
  if (level > arrayLastIndex(nexusMilestones)) return null;

  return createDecimal(nexusMilestones[level].cost);
}

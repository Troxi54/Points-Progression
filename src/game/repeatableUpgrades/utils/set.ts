import type { Player } from "@game/player/schemas";
import type Decimal from "break_eternity.js";
import type { RepeatableUpgradeId } from "../ids";

export function setRepeatableUpgradeLevel(
  player: Player,
  repeatableUpgradeId: RepeatableUpgradeId,
  value: Decimal,
) {
  player.repeatableUpgrades[repeatableUpgradeId] = value;
}

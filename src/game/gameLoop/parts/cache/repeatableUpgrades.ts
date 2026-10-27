import type { GameLoopPartState } from "@game/gameLoop/types";
import { tickRepeatableUpgradeCache } from "@game/repeatableUpgrades/utils/tick";

export default function gameLoopUpdateRepeatableUpgradeCache(
  state: GameLoopPartState,
) {
  const { mergedPlayer } = state;

  state.assignMergedPlayer(tickRepeatableUpgradeCache(mergedPlayer));
}

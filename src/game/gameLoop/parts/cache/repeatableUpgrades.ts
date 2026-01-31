import { GameLoopPartState } from "@/game/gameLoop/types";
import { applyUpdatedRepeatableUpgrades } from "@/game/repeatableUpgrades/utils/apply";

export default function gameLoopUpdateRepeatableUpgradeCache(
  state: GameLoopPartState
) {
  const { mergedPlayer } = state;

  state.assignMergedPlayer(applyUpdatedRepeatableUpgrades(mergedPlayer));
}

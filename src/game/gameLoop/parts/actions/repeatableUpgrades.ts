import type { GameLoopPartState } from "@game/gameLoop/types";
import { tickRepeatableUpgradeAutobuy } from "@game/repeatableUpgrades/utils/tick";

export default function gameLoopRepeatableUpgrades(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  state.assignMergedPlayer(tickRepeatableUpgradeAutobuy(mergedPlayer));
}

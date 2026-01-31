import { GameLoopPartState } from "@/game/gameLoop/types";
import { tickAllRepeatableUpgrades } from "@/game/repeatableUpgrades/utils/apply";

export default function gameLoopRepeatableUpgrades(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  state.assignMergedPlayer(tickAllRepeatableUpgrades(mergedPlayer));
}

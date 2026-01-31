import { GameLoopPartState } from "@/game/gameLoop/types";
import { tickAllResetLayers } from "@/game/resetLayers/utils/apply";

export default function gameLoopResetLayers(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  state.assignMergedPlayer(
    tickAllResetLayers(mergedPlayer, state.deltaTimeSession)
  );
}

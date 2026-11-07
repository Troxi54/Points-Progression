import type { GameLoopPartState } from "@game/gameLoop/types";
import { setFixedResetLayerDates } from "@game/resetLayers/utils/set";
import { tickAllResetLayers } from "@game/resetLayers/utils/tick";

export default function gameLoopResetLayers(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  tickAllResetLayers(mergedPlayer, state.deltaTimeSession);

  setFixedResetLayerDates(mergedPlayer, state.currentGameTime);
}

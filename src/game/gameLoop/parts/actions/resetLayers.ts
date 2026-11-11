import type { GameLoopPartState } from "@game/gameLoop/types";
import { setFixedResetLayerDates } from "@game/resetLayers/utils/set";
import { tickResetLayerTriggers } from "@game/resetLayers/utils/tick";

export default function gameLoopResetLayers(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  tickResetLayerTriggers(mergedPlayer, state.deltaTimeSession);

  setFixedResetLayerDates(mergedPlayer, state.currentGameTime);
}

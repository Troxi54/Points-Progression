import type { GameLoopPartState } from "@game/gameLoop/types";
import { tickResetLayerCache } from "@game/resetLayers/utils/tick";

export function gameLoopResetLayerCache(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  tickResetLayerCache(mergedPlayer);
}

import type { GameLoopPartState } from "@game/gameLoop/types";
//import { getInfiniteModeLayerCountToRender } from "@game/features/infiniteMode/utils/get";

export function gameLoopUpdateStates(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  //cachedPlayer.infiniteMode.unlocked = isInfiniteModeUnlocked(mergedPlayer);
  /* cachedPlayer.infiniteMode.layerCountToRender =
    getInfiniteModeLayerCountToRender(mergedPlayer); */
}

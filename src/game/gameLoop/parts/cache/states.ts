import { getInfiniteModeLayerCountToRender } from "@game/features/infiniteMode/utils/get";
import { isInfiniteModeUnlocked } from "@game/features/infiniteMode/utils/is";
import { GameLoopPartState } from "@game/gameLoop/types";

export function gameLoopUpdateStates(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  cachedPlayer.infiniteMode.unlocked = isInfiniteModeUnlocked(mergedPlayer);
  cachedPlayer.infiniteMode.layerCountToRender =
    getInfiniteModeLayerCountToRender(mergedPlayer);
}

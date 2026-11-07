import type { GameLoopPartState } from "@game/gameLoop/types";
import { syncCachedCurrencies } from "@game/currencies/utils/sync";
import { syncCachedRepeatableUpgrades } from "@game/repeatableUpgrades/utils/sync";
import { syncCachedResetLayers } from "@game/resetLayers/utils/sync";
//import { getInfiniteModeLayerCountToRender } from "@game/features/infiniteMode/utils/get";

export function gameLoopUpdateStates(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  syncCachedCurrencies(cachedPlayer);
  syncCachedRepeatableUpgrades(cachedPlayer);
  syncCachedResetLayers(cachedPlayer);
  //cachedPlayer.infiniteMode.unlocked = isInfiniteModeUnlocked(mergedPlayer);
  /* cachedPlayer.infiniteMode.layerCountToRender =
    getInfiniteModeLayerCountToRender(mergedPlayer); */
}

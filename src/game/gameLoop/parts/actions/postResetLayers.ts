import formulas from "@game/formulas/data";
import { GameLoopPartState } from "@/game/gameLoop/types";
import { getHighestResetDuration } from "@/game/resetLayers/utils/get";

export default function gameLoopPostResetLayers(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { player, cachedPlayer } = mergedPlayer;

  cachedPlayer.highestResetDuration = getHighestResetDuration(mergedPlayer);

  player.bestRun = formulas.firstResetLayerRun(mergedPlayer, player.bestRun);
}

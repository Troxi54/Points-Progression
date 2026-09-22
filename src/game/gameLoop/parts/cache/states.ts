import { isInfiniteModeUnlocked } from "@game/features/infiniteMode/utils/is";
import { GameLoopPartState } from "@game/gameLoop/types";

export function gameLoopUpdateStates(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  cachedPlayer.infiniteModeUnlocked = isInfiniteModeUnlocked(mergedPlayer);
}

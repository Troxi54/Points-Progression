import type { GameLoopPartState } from "@game/gameLoop/types";
import type { MergedPlayer } from "@game/player/merged/types";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { getCurrentTime } from "@core/utils/time";
import { createMergedPlayerState } from "@game/player/merged/utils";

export function createGameLoopPartState(
  mergedPlayer: MergedPlayer,
): GameLoopPartState {
  const currentTime = getCurrentTime();

  const { player, cachedPlayer } = mergedPlayer;

  const deltaTimeMs = Math.max(currentTime - player.lastTick, 0);
  const deltaTime = deltaTimeMs / 1000;
  const deltaTimeSession = Math.max(
    currentTime - cachedPlayer.lastTickSession,
    0,
  );

  return {
    ...createMergedPlayerState(mergedPlayer),
    currentTime,
    currentGameTime: getCurrentGameTime(mergedPlayer, currentTime),
    deltaTime,
    deltaTimeMs,
    deltaTimeSession,
  };
}

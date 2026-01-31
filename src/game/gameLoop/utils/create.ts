import { GameLoopPartState } from "@/game/gameLoop/types";
import { createMergedPlayerState } from "@/game/player/merged/utils";
import { MergedPlayer } from "@/game/player/merged/types";
import { mergeObjects } from "@/core/utils/object";
import { getCurrentGameTime, getCurrentTime } from "@/core/utils/time";

export function createGameLoopPartState(
  mergedPlayer: MergedPlayer,
  currentTime: number = getCurrentTime()
): GameLoopPartState {
  const { player, cachedPlayer } = mergedPlayer;

  const deltaTimeTPS = Math.max(currentTime - player.lastTick, 0);
  const deltaTime = deltaTimeTPS / 1000;
  const deltaTimeSession = Math.max(
    currentTime - cachedPlayer.lastTickSession,
    0
  );

  const override = {
    currentTime,
    currentGameTime: getCurrentGameTime(mergedPlayer, currentTime),
    deltaTime,
    deltaTimeTPS,
    deltaTimeSession
  } as const satisfies Partial<GameLoopPartState>;

  const mergedPlayerState = createMergedPlayerState(mergedPlayer);

  return mergeObjects(mergedPlayerState, override);
}

import { canAutoSave, savePlayer } from "@game/player/persistence/save";
import { GameLoopPartState } from "../types";
import offlineConfig from "@game/offline/config";
import { clamp } from "@core/utils/number";
import cachedPlayerConfig from "@game/player/cached/config";

export default function gameLoopPostTick(state: GameLoopPartState) {
  const { mergedPlayer, currentTime } = state;
  const { player, cachedPlayer } = mergedPlayer;

  if (cachedPlayer.offlineProgress) {
    cachedPlayer.offlineProgressTicksCompleted = Math.min(
      cachedPlayer.offlineProgressTicksCompleted +
        cachedPlayer.offlineProgressSpeed,
      offlineConfig.ticksOnTrigger
    );

    if (
      cachedPlayer.offlineProgressTicksCompleted >= offlineConfig.ticksOnTrigger
    ) {
      cachedPlayer.offlineProgress = false;
    }

    const offlineDeltaTime = currentTime - cachedPlayer.offlineProgressLastTick;

    player.offlineOffset += offlineDeltaTime;
    cachedPlayer.offlineProgressLastTick = currentTime;

    player.unspentOfflineTime =
      (1 -
        clamp(
          cachedPlayer.offlineProgressTicksCompleted /
            offlineConfig.ticksOnTrigger,
          0,
          1
        )) *
      cachedPlayer.offlineProgressFullTime;
  } else {
    player.unspentOfflineTime = 0;
  }

  const instantTPS = 1000 / state.deltaTimeSession;
  if (cachedPlayer.ticksPerSecond === 0) {
    cachedPlayer.ticksPerSecond = instantTPS;
  }

  cachedPlayer.ticksPerSecond +=
    (instantTPS - cachedPlayer.ticksPerSecond) * cachedPlayerConfig.TPSSmooth;

  player.lastTick = currentTime;
  cachedPlayer.lastTickSession = currentTime;

  if (canAutoSave(mergedPlayer, currentTime)) {
    savePlayer(player);
    cachedPlayer.lastSave = currentTime;
  }
}

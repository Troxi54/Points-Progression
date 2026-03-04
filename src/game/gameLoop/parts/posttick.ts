import { canAutoSave, savePlayer } from "@game/player/persistence/save";
import { GameLoopPartState } from "../types";
import offlineConfig from "@game/offline/config";
import { clamp, safeNumber } from "@core/utils/number";
import cachedPlayerConfig from "@game/player/cached/config";
import { calculateTicksForOfflineTime } from "@game/offline/utils/calculate";

export default function gameLoopPostTick(state: GameLoopPartState) {
  const { mergedPlayer, currentTime } = state;
  const { player, cachedPlayer } = mergedPlayer;

  if (cachedPlayer.offlineProgress) {
    const { offlineProgressFullTime } = cachedPlayer;
    const ticksOnTrigger = calculateTicksForOfflineTime(
      offlineProgressFullTime,
    );

    let offlineProgressSpeed = cachedPlayer.offlineProgressSpeed;
    if (!Number.isFinite(offlineProgressSpeed) || offlineProgressSpeed <= 0) {
      offlineProgressSpeed = 1;
    }
    offlineProgressSpeed = Math.min(
      offlineProgressSpeed,
      offlineConfig.maxSpeed,
    );
    cachedPlayer.offlineProgressSpeed = offlineProgressSpeed;

    cachedPlayer.offlineProgressTicksCompleted = Math.min(
      cachedPlayer.offlineProgressTicksCompleted + offlineProgressSpeed,
      ticksOnTrigger,
    );

    if (cachedPlayer.offlineProgressTicksCompleted >= ticksOnTrigger) {
      cachedPlayer.offlineProgress = false;
    }

    const offlineDeltaTime = currentTime - cachedPlayer.offlineProgressLastTick;

    player.offlineOffset += offlineDeltaTime;
    cachedPlayer.offlineProgressLastTick = currentTime;

    player.unspentOfflineTime =
      (1 -
        clamp(
          cachedPlayer.offlineProgressTicksCompleted / ticksOnTrigger,
          0,
          1,
        )) *
      offlineProgressFullTime;
  } else {
    player.unspentOfflineTime = 0;
  }

  let instantTPS = safeNumber(
    state.deltaTimeSession > 0 ? 1000 / state.deltaTimeSession : 0,
  );

  if (instantTPS > 0) {
    if (cachedPlayer.ticksPerSecond === 0) {
      cachedPlayer.ticksPerSecond = instantTPS;
    }

    cachedPlayer.ticksPerSecond +=
      (instantTPS - cachedPlayer.ticksPerSecond) * cachedPlayerConfig.TPSSmooth;
  }

  player.lastTick = currentTime;
  cachedPlayer.lastTickSession = currentTime;

  if (canAutoSave(mergedPlayer, currentTime)) {
    savePlayer(player);
    cachedPlayer.lastSave = currentTime;
  }
}

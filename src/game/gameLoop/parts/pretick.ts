import { getPlayerState } from "@game/player/store/store";
import { copyObject } from "@core/utils/object";
import { mergePlayer } from "@game/player/merged/utils";
import { createGameLoopPartState } from "../utils/create";
import offlineConfig from "@game/offline/config";

export default function gameLoopPreTick(currentTime: number) {
  const { player, cachedPlayer, setMergedPlayer } = getPlayerState();

  const newPlayer = copyObject(player);
  const newCachedPlayer = copyObject(cachedPlayer);

  const mergedPlayer = mergePlayer(newPlayer, newCachedPlayer);
  const partState = createGameLoopPartState(mergedPlayer, currentTime);

  let timeSpeed = 1;
  if (newCachedPlayer.offlineProgress) {
    const offlineProgressSpeed = Number.isFinite(newCachedPlayer.offlineProgressSpeed)
      ? Math.min(Math.max(newCachedPlayer.offlineProgressSpeed, 1), offlineConfig.maxSpeed)
      : 1;
    const offlineProgressFullTime = Number.isFinite(newCachedPlayer.offlineProgressFullTime)
      ? Math.max(newCachedPlayer.offlineProgressFullTime, 0)
      : 0;

    newCachedPlayer.offlineProgressSpeed = offlineProgressSpeed;
    newCachedPlayer.offlineProgressFullTime = offlineProgressFullTime;

    const tickTime =
      (offlineProgressSpeed / offlineConfig.ticksOnTrigger) *
      offlineProgressFullTime;
    if (partState.deltaTimeTPS > 0) {
      timeSpeed = tickTime / partState.deltaTimeTPS;
    }
    if (!Number.isFinite(timeSpeed) || timeSpeed < 0) {
      timeSpeed = 1;
    }
  }

  newCachedPlayer.timeSpeed = timeSpeed;
  partState.deltaTime *= timeSpeed;

  return { partState, setMergedPlayer };
}

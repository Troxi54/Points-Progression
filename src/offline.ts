import { getCurrentTime } from "@utils/timeUtils";
import { cacheUpdates } from "@gameLoop/cacheUpdates";
import { usePlayerStore } from "@player/playerStore";
import { mergePlayer } from "@player/playerUtils";

export function calculateOfflineTierResets() {
  const { player, cachedPlayer, setPlayer } = usePlayerStore.getState();
  if (
    !player.boughtThirdTierUpgrade ||
    !player.autoTierEnabled ||
    player.boughtSecondVermyrosUpgrade
  )
    return;

  const merged = mergePlayer(player, cachedPlayer);

  cacheUpdates.nullionEffect(merged);
  cacheUpdates.tierResetGain(merged);

  const deltaTime = Math.max((getCurrentTime() - player.lastTick) / 1000, 0);

  setPlayer({
    madeTierTimes: player.madeTierTimes.plus(
      player.approximateTiersPerSecond
        .times(cachedPlayer.tierResetGain)
        .times(deltaTime)
        .floor()
    )
  });
}

export function calculateOfflineNullithResets() {
  const { player, cachedPlayer, setPlayer } = usePlayerStore.getState();
  if (!player.boughtFourthNullithUpgrade || !player.autoNullithEnabled) return;

  const merged = mergePlayer(player, cachedPlayer);

  cacheUpdates.nullionEffect(merged);
  cacheUpdates.nullithResetGain(merged);

  const deltaTime = Math.max((getCurrentTime() - player.lastTick) / 1000, 0);

  setPlayer({
    madeNullithResets: player.madeNullithResets.plus(
      player.approximateNullithResetsPerSecond
        .times(cachedPlayer.nullithResetGain)
        .times(deltaTime)
        .floor()
    )
  });
}

export function calculateOfflineProgress() {
  calculateOfflineTierResets();
  calculateOfflineNullithResets();
}

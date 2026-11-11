import type { CurrencyId } from "@game/currencies/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { ResetLayerId } from "@game/resetLayers/ids";
import { getCachedCurrencyProp } from "@game/currencies/utils/get";
import { getResetLayerPlayerData } from "@game/resetLayers/utils/get";

export function generateOfflineResets(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
  currencyId: CurrencyId,
  deltaTime: number,
): void {
  const { player, cachedPlayer } = mergedPlayer;

  if (!cachedPlayer.offlineProgress) return;

  const { autoEnabled, offlineResetsPerSecond } = getResetLayerPlayerData(
    player,
    resetLayerId,
  );
  if (!autoEnabled) return;
  if (
    !offlineResetsPerSecond ||
    !Number.isFinite(offlineResetsPerSecond) ||
    offlineResetsPerSecond < 0
  )
    return;

  const gain = getCachedCurrencyProp(cachedPlayer, currencyId, "gain");
  const gainPerSecond = gain
    .multiply(deltaTime)
    .multiply(offlineResetsPerSecond);

  player[currencyId] = player[currencyId].plus(gainPerSecond);
}

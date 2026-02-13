import { applyGeneratedCurrencies } from "@/game/currencies/utils/apply";
import { CurrencyId } from "@/game/currencies/types";
import { getCachedCurrencyProp } from "@/game/currencies/utils/get";
import { GameLoopPartState } from "@/game/gameLoop/types";
import { ResetLayerId } from "@/game/resetLayers/types";
import { getResetLayerPlayerData } from "@/game/resetLayers/utils/get";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import formulas from "@game/formulas/data";

export default function gameLoopGenerateCurrencies(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { player } = mergedPlayer;

  state.assignPlayerForMergedPlayer(
    applyGeneratedCurrencies(mergedPlayer, state.deltaTime),
  );

  gameLoopGenerateOfflineResets(
    state,
    "tier",
    "madeTierTimes",
    hasUpgradeById(player, "tier_3"),
  );

  gameLoopGenerateOfflineResets(
    state,
    "nullith",
    "madeNullithResets",
    hasUpgradeById(player, "nullith_4"),
  );

  player.bestPoints = formulas.bestPoints(mergedPlayer);
}

export function gameLoopGenerateOfflineResets(
  state: GameLoopPartState,
  resetLayerId: ResetLayerId,
  currencyId: CurrencyId,
  condition: boolean = true,
): void {
  const { mergedPlayer } = state;
  const { player, cachedPlayer } = mergedPlayer;

  if (!cachedPlayer.offlineProgress || !condition) return;

  const { autoEnabled, resetsPerSecond } = getResetLayerPlayerData(
    player,
    resetLayerId,
  );
  if (!autoEnabled) return;
  if (!Number.isFinite(resetsPerSecond) || resetsPerSecond <= 0) return;

  const gain = getCachedCurrencyProp(cachedPlayer, currencyId, "gain");
  const gainPerSecond = gain
    .multiply(state.deltaTime)
    .multiply(resetsPerSecond);

  player[currencyId] = player[currencyId].plus(gainPerSecond);
}

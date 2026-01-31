import { applyUpdatedCurrencyEffects } from "@/game/currencies/utils/apply";
import effectFormulas from "@game/formulas/effects";
import { GameLoopPartState } from "@/game/gameLoop/types";

export default function gameLoopUpdateEffects(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  state.assignCachedPlayerForMergedPlayer(
    applyUpdatedCurrencyEffects(mergedPlayer)
  );

  updateOtherEffects(state);
}

function updateOtherEffects(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  cachedPlayer.runEffect = effectFormulas.firstResetLayerRun(mergedPlayer);
  cachedPlayer.runDertointEffect =
    effectFormulas.firstResetLayerRunDertoints(mergedPlayer);
  cachedPlayer.bestPointsOfRunEffect =
    effectFormulas.bestPointsOfRun(mergedPlayer);
  cachedPlayer.bestPointsOfRunVermoraEffect =
    effectFormulas.bestPointsOfRunVermora(mergedPlayer);

  cachedPlayer.tierEffect = effectFormulas.tier(mergedPlayer);
  cachedPlayer.tierVermyteEffect = effectFormulas.tierVermytes(mergedPlayer);

  cachedPlayer.bestVermytesEffect = effectFormulas.bestVermytes(mergedPlayer);
  cachedPlayer.bestVermytesPointsEffect =
    effectFormulas.bestVermytesPoints(mergedPlayer);

  cachedPlayer.amplivaultEffect = effectFormulas.amplivault(mergedPlayer);

  cachedPlayer.firstDertointUpgradeEffect =
    effectFormulas.firstDertointUpgrade(mergedPlayer);

  cachedPlayer.levelDertointEffect = effectFormulas.levelDertoint(mergedPlayer);
}

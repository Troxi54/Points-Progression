import { applyUpdatedCurrencyGains } from "@/game/currencies/utils/apply";
import { parseNullionInput } from "@/game/features/nullifice/utils";
import formulas from "@game/formulas/data";
import { GameLoopPartState } from "@/game/gameLoop/types";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

export default function gameLoopUpdateGains(state: GameLoopPartState) {
  const { mergedPlayer } = state;

  state.assignCachedPlayerForMergedPlayer(
    applyUpdatedCurrencyGains(mergedPlayer),
  );

  updateRelated(state);
}

function updateRelated(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { player, cachedPlayer } = mergedPlayer;

  if (hasUpgradeById(player, "vermyros_8"))
    player.bestVermytes = formulas.bestVermytes(mergedPlayer);

  cachedPlayer.nullionInputConverted = parseNullionInput(player);

  cachedPlayer.level = formulas.level(mergedPlayer);

  cachedPlayer.gameProgress = formulas.gameProgress(mergedPlayer);
}

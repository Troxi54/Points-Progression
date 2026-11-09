import type { GameLoopPartState } from "@game/gameLoop/types";
import { generateCurrencies } from "@game/currencies/utils/generate";
import formulas from "@game/formulas/data";
import { generateOfflineResets } from "@game/offline/utils/generate";
import { hasUpgradeById } from "@game/upgrades/utils/has";

export default function gameLoopGenerateCurrencies(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { player } = mergedPlayer;

  generateCurrencies(mergedPlayer, state.deltaTime);

  if (hasUpgradeById(player, "tier_3")) {
    generateOfflineResets(
      mergedPlayer,
      "tier",
      "madeTierTimes",
      state.deltaTime,
    );
  }

  if (hasUpgradeById(player, "nullith_4")) {
    generateOfflineResets(
      mergedPlayer,
      "nullith",
      "madeNullithResets",
      state.deltaTime,
    );
  }

  player.bestPoints = formulas.bestPoints(mergedPlayer);
}

import type { GameLoopPartState } from "@game/gameLoop/types";
import { getNexusCost } from "@game/features/nexus/utils/get";
import formulas from "@game/formulas/data";

export default function gameLoopUpdateRequirements(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { cachedPlayer } = mergedPlayer;

  cachedPlayer.tierRequirement = formulas.tierRequirement(mergedPlayer);

  cachedPlayer.amplivaultRequirement =
    formulas.amplivaultRequirement(mergedPlayer);

  cachedPlayer.XPForThisLevel = formulas.XPForThisLevel(mergedPlayer);
  cachedPlayer.XPForNextLevel = formulas.XPForNextLevel(mergedPlayer);

  cachedPlayer.nexusCost = getNexusCost(mergedPlayer);
}

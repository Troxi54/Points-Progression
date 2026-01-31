import formulas from "@game/formulas/data";
import { getNexusCost } from "@/game/features/nexus/utils/get";
import { GameLoopPartState } from "@/game/gameLoop/types";

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

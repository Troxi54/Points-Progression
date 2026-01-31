import { getNewAmplivaultLevel } from "@/game/features/amplivault/utils";
import coreConfig from "@/game/features/cores/config";
import formulas from "@game/formulas/data";
import { GameLoopPartState } from "@/game/gameLoop/types";
import { applyResetLayerAuto } from "@/game/resetLayers/utils/apply";
import { calculateSoftcapperLevel } from "@/game/softcappers/utils/calculate";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

export default function gameLoopPreResetLayers(state: GameLoopPartState) {
  const { mergedPlayer } = state;
  const { player, cachedPlayer } = mergedPlayer;

  if (hasUpgradeById(player, "tier_4")) {
    player.bestPointsOfRun = formulas.bestPointsOfRun(mergedPlayer);

    state.assignPlayerForMergedPlayer(
      applyResetLayerAuto(player, "reset", false)
    );
  }

  const newSoftcapperLevel = (cachedPlayer.softcapperLevel =
    calculateSoftcapperLevel(mergedPlayer, "points", player.points));
  if (newSoftcapperLevel.greaterThan(player.bestSoftcapperLevel)) {
    player.bestSoftcapperLevel = newSoftcapperLevel;
  }

  if (player.energy.greaterThanOrEqualTo(coreConfig.unlocksAt))
    player.everReachedCores = true;

  if (hasUpgradeById(player, "vermyros_4")) {
    state.assignPlayerForMergedPlayer(
      applyResetLayerAuto(player, "tier", true)
    );
  }

  if (hasUpgradeById(player, "vermyros_8")) {
    state.assignPlayerForMergedPlayer(
      applyResetLayerAuto(player, "vermyros", false)
    );
  }

  if (player.amplivaultBroken && player.enteredAmplivault) {
    player.enteredAmplivault = false;
  }

  player.amplivaultLevel = getNewAmplivaultLevel(mergedPlayer);

  if (hasUpgradeById(player, "nullith_5")) {
    state.assignPlayerForMergedPlayer(
      applyResetLayerAuto(
        player,
        "nullith",
        player.enteredAmplivault && !player.reachedBreakAmplivault
      )
    );
  }

  if (player.cappergy.greaterThan(0)) {
    player.everReachedCappergy = true;
  }
}

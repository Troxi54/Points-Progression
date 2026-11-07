import createDecimal from "@core/utils/decimal";
import { mergeObjects, objectAssign } from "@core/utils/object";
import { hasNexusLevelsSelection } from "@game/features/nexus/utils/selector";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const resetResetLayer = defineResetLayer<"normal">({
  id: "reset",
  goal: createDecimal(1e6),
  playerSelector: ({ mergedPlayer }) => {
    const { player, cachedPlayer } = mergedPlayer;

    return mergeObjects(
      {
        bestRun: player.bestRun,
        bestPointsOfRun: player.bestPointsOfRun,
        runEffect: cachedPlayer.runEffect,
        bestPointsOfRunEffect: cachedPlayer.bestPointsOfRunEffect,
        boughtBenefluxUpgrade: getRepeatableUpgradeLevel(
          player,
          "beneflux",
        ).greaterThan(0),
      },
      hasNexusLevelsSelection(mergedPlayer, [
        [2, "2"],
        [3, "3"],
      ] as const),
    );
  },
  reset: ({ player }, defaultMergedPlayer) => {
    player.points = defaultMergedPlayer.player.points;
    player.repeatableUpgrades.point = getRepeatableUpgradeLevel(
      defaultMergedPlayer,
      "point",
    );
  },
  reward: (mergedPlayer, spentTime) => {
    const { player } = mergedPlayer;

    objectAssign(player, {
      bestRun: formulas.firstResetLayerRun(mergedPlayer, spentTime),
      bestPointsOfRun: formulas.bestPointsOfRun(mergedPlayer),
    });
  },
});

export default resetResetLayer;

import createDecimal from "@core/utils/decimal";
import { mergeObjects } from "@core/utils/object";
import { hasNexusLevelsSelection } from "@game/features/nexus/utils/selector";
import formulas from "@game/formulas/data";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import { defineResetLayer } from "@game/resetLayers/utils/create";

const resetResetLayer = defineResetLayer<"normal">({
  id: "reset",
  goal: createDecimal(1e6),
  usePlayer: ({ mergedPlayer }) => {
    const { player, cachedPlayer } = mergedPlayer;

    return mergeObjects(
      {
        bestRun: player.bestRun,
        bestPointsOfRun: player.bestPointsOfRun,
        runEffect: cachedPlayer.runEffect,
        bestPointsOfRunEffect: cachedPlayer.bestPointsOfRunEffect,
      },
      hasNexusLevelsSelection(mergedPlayer, [
        [2, "2"],
        [3, "3"],
      ] as const),
    );
  },
  reset: (_, defaultMergedPlayer) => {
    return {
      player: {
        points: defaultMergedPlayer.player.points,
        repeatableUpgrades: {
          point: getRepeatableUpgradeLevel(defaultMergedPlayer, "point"),
        },
      },
    };
  },
  reward: (mergedPlayer, spentTime) => {
    return {
      player: {
        bestRun: formulas.firstResetLayerRun(mergedPlayer, spentTime),
        bestPointsOfRun: formulas.bestPointsOfRun(mergedPlayer),
      },
    };
  },
});

export default resetResetLayer;

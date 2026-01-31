import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { everPerformedResetLayers } from "@/game/resetLayers/utils/selector";
import { hasUpgrades } from "@/game/upgrades/utils/has";
import { mergeObjects } from "@/core/utils/object";

export const appStateSelector = () =>
  usePlayerFields(
    {
      player: [
        "dimensionId",
        "bestSoftcapperLevel",
        "everMadeCoreReset",
        "everReachedCappergy"
      ]
    },
    {
      additionalSelectors: (state) => {
        const upgrades = hasUpgrades(state, {
          tier: [3, 4],
          vermyros: [1, 3, 4, 5, 7, 8, 9, 10],
          nullith: [3, 4, 5, 6, 7, 8],
          mallirt: [4],
          level: [3, 4]
        } as const);

        const performs = everPerformedResetLayers(state, [
          "reset",
          "tier",
          "vermyros",
          "nullith",
          "mallirt",
          "level"
        ]);

        return mergeObjects(upgrades, performs);
      }
    }
  );

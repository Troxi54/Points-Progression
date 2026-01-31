import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { everPerformedResetLayers } from "@/game/resetLayers/utils/selector";
import { hasUpgrades } from "@/game/upgrades/utils/has";
import { mergeObjects } from "@/core/utils/object";

const menuInfoFormulaSelector = () => {
  return usePlayerFields(
    {
      player: [
        "everReachedCores",
        "everMadeCoreReset",
        "amplivaultLevel",
        "amplivaultBroken",
        "everEnteredSliph",
        "everReachedCappergy",
        "bestNexusLevel"
      ]
    },
    {
      additionalSelectors: ({ mergedPlayer }) => {
        const upgrades = hasUpgrades(mergedPlayer, {
          tier: [4],
          vermyros: [1, 5, 8, 10],
          nullith: [4, 6],
          level: [4]
        } as const);

        const performs = everPerformedResetLayers(mergedPlayer, [
          "reset",
          "tier",
          "vermyros",
          "nullith",
          "mallirt",
          "level"
        ]);

        return mergeObjects(upgrades, performs);
      },
      useFormat: true
    }
  );
};

export default menuInfoFormulaSelector;

import { everPerformed } from "@/game/resetLayers/utils/get";
import { createUpgradeDataContainer } from "@/game/upgrades/utils/create";
import { hasOneOfUpgrades } from "@/game/upgrades/utils/has";

const resetUpgrades = createUpgradeDataContainer({
  id: "reset",
  usePlayer: ({ mergedPlayer }) => ({
    everMadeTier: everPerformed(mergedPlayer, "tier")
  }),
  spendCurrency: ({ player }) =>
    !hasOneOfUpgrades(player, {
      tier: [1],
      vermyros: [1],
      nullith: [1]
    }),
  forceShow: ({ player }) => everPerformed(player, "tier"),
  upgrades: [
    {
      id: "reset_1",
      description: "Prevents Point Upgrade from spending Points",
      cost: 1e20
    },
    {
      id: "reset_2",
      description: "Automates Point Upgrade",
      cost: 1e23
    }
  ]
});

export default resetUpgrades;

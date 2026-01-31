import { everPerformed } from "@/game/resetLayers/utils/get";
import { createUpgradeDataContainer } from "@/game/upgrades/utils/create";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

const mallirtUpgrades = createUpgradeDataContainer({
  id: "mallirt",
  dimensionId: "sliph",
  currency: "mallirtTotalDertoints",
  spendCurrency: ({ player }) => !hasUpgradeById(player, "level_1"),
  usePlayer: ({ mergedPlayer }) => ({
    everPerformedLevel: everPerformed(mergedPlayer, "level")
  }),
  forceShow: ({ player }) => everPerformed(player, "level"),
  upgrades: [
    {
      id: "mallirt_1",
      description: "Keeps 1-2 Dertoint upgrades",
      cost: 5.5e6
    },
    {
      id: "mallirt_2",
      description: "Keeps 3-4 Dertoint upgrades",
      cost: 2.7e7
    },
    {
      id: "mallirt_3",
      description: "Squares Dark Energy effect",
      cost: 7.435e11
    },
    {
      id: "mallirt_4",
      description:
        "Squares Dark Energy effect again and Automates Dertoint Upgrade",
      cost: 3.21e13
    }
  ]
});

export default mallirtUpgrades;

import { formatEffectForCurrency } from "@/core/format/effect";
import { everPerformed } from "@/game/resetLayers/utils/get";
import { createUpgradeDataContainer } from "@/game/upgrades/utils/create";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

const dertointUpgrades = createUpgradeDataContainer({
  id: "dertoint",
  dimensionId: "sliph",
  currency: "dertoints",
  usePlayer: ({ mergedPlayer }) => ({
    everMadeMallirt: everPerformed(mergedPlayer, "mallirt")
  }),
  forceShow: ({ player }) => everPerformed(player, "mallirt"),
  spendCurrency: ({ player }) => !hasUpgradeById(player, "level_1"),
  upgrades: [
    {
      id: "dertoint_1",
      usePlayer: ({ mergedPlayer }) => ({
        firstDertointUpgradeEffect:
          mergedPlayer.cachedPlayer.firstDertointUpgradeEffect
      }),
      description: ({ cachedPlayer }) =>
        `Boosts Dertoints based on Points (${formatEffectForCurrency(
          cachedPlayer.firstDertointUpgradeEffect,
          "dertoints"
        )})`,
      cost: 100
    },
    {
      id: "dertoint_2",
      description: "Applies Nullion effect to Tier Resets",
      cost: 7.5e3
    },
    {
      id: "dertoint_3",
      description: "Applies Nullion effect to Dertoints",
      cost: 8.25e4
    },
    {
      id: "dertoint_4",
      description: "Prevents Dertoint Upgrade from spending Dertoints",
      cost: 9e5
    }
  ]
});

export default dertointUpgrades;

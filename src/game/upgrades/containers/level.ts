import { createUpgradeDataContainer } from "@/game/upgrades/utils/create";

const levelUpgrades = createUpgradeDataContainer({
  id: "level",
  dimensionId: "sliph",
  currency: "mallirtTotalDertoints",
  upgrades: [
    {
      id: "level_1",
      description:
        "Prevents Dertoint and Mallirt upgrades from spending Dertoints and keeps Mallirt Upgrade 1",
      cost: 5e25
    },
    {
      id: "level_2",
      description:
        "Generates Total Dertoints equal to 0.01% of Total Dertoints you could gain per second and keeps Mallirt Upgrade 2",
      cost: 1e28
    },
    {
      id: "level_3",
      description:
        "Generates Total Dertoints equal to 0.1% of Total Dertoints you could gain per second and keeps Mallirt Upgrade 3",
      cost: 2.78e32
    },
    {
      id: "level_4",
      description:
        "Unlocks Amplivoid, generates Total Dertoints equal to 1% of Total Dertoints you could gain per second, and keeps Mallirt Upgrade 4",
      cost: 5.065e92
    },
    {
      id: "level_5",
      description:
        "Generates Total Dertoints equal to 10% of Total Dertoints you could gain per second and prevents Amplivoid Upgrade from spending Amplivoid",
      cost: 4.45e131
    },
    {
      id: "level_6",
      description:
        "Generates Total Dertoints equal to 100% of Total Dertoints you could gain per second and automates Amplivoid Upgrade",
      cost: 8.1e154
    }
  ]
});

export default levelUpgrades;

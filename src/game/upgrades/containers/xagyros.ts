import { createUpgradeDataContainer } from "../utils/create";

const xagyrosUpgrades = createUpgradeDataContainer({
  id: "xagyros",
  dimensionId: "sliph",
  currency: "dertoints",
  upgrades: [
    {
      id: "xagyros_1",
      description: "Keeps all Dertoint and Mallirt upgrades",
      cost: "1e230",
    },
    {
      id: "xagyros_2",
      description: "Keeps Level Upgrade 1 and Level Upgrade 2",
      cost: "1e240",
    },
    {
      id: "xagyros_3",
      description: "Keeps Level Upgrade 3 and Level Upgrade 4",
      cost: "1e265",
    },
    {
      id: "xagyros_4",
      description:
        "Automatically updates Score and keeps Level Upgrade 5 and Level Upgrade 6",
      cost: "1e300",
    },
  ],
});

export default xagyrosUpgrades;

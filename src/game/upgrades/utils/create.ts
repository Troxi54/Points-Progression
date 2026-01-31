import {
  BuiltUpgradeDataContainer,
  UpgradeDataContainer
} from "@/game/upgrades/types";
import createDecimal from "@/core/utils/decimal";

export function createUpgradeDataContainer(
  upgradeContainer: UpgradeDataContainer
): BuiltUpgradeDataContainer {
  upgradeContainer.upgrades.forEach((upgrade) => {
    upgrade.cost = createDecimal(upgrade.cost);
  });
  return upgradeContainer as BuiltUpgradeDataContainer;
}

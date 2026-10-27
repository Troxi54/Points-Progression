import type {
  BuiltUpgradeContainerConfig,
  UpgradeContainerConfig,
} from "@game/upgrades/types";
import createDecimal from "@core/utils/decimal";

export function createUpgradeContainerConfig(
  upgradeContainer: UpgradeContainerConfig,
): BuiltUpgradeContainerConfig {
  upgradeContainer.upgrades.forEach((upgrade) => {
    upgrade.cost = createDecimal(upgrade.cost);
  });
  return upgradeContainer as BuiltUpgradeContainerConfig;
}

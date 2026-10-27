import type { MergedPlayer } from "@game/player/merged/types";
import type { PartialPlayer } from "@game/player/types";
import type { UpgradeContainerId, UpgradeId } from "@game/upgrades/types";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import {
  getUpgradeConfig,
  getUpgradeContainerConfig,
  getUpgradeContainerDimensionId,
  getUpgradeCurrency,
} from "./get";
import { hasPreviousUpgrade, hasUpgrade } from "./has";
import { splitUpgradeId } from "./id";
import { setUpgrade } from "./set";

export function buyUpgrade(
  mergedPlayer: MergedPlayer,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
): PartialPlayer | undefined {
  const containerConfig = getUpgradeContainerConfig(containerId);
  const upgradeConfig = getUpgradeConfig(containerId, upgradeNumber);

  const { player } = mergedPlayer;

  const dimensionId = getUpgradeContainerDimensionId(containerConfig);
  const dimensionWorks = shouldDimensionWork(mergedPlayer, dimensionId);

  if (!dimensionWorks) return;

  const { cost } = upgradeConfig;
  const isPurchased = hasUpgrade(player, containerId, upgradeNumber);

  if (isPurchased) return;

  const previousUpgradePurchased = hasPreviousUpgrade(
    player,
    containerId,
    upgradeNumber,
    upgradeConfig,
  );

  if (!previousUpgradePurchased) return;

  const currencyName = getUpgradeCurrency(upgradeConfig, containerConfig);
  const currencyValue = player[currencyName];
  const enoughCurrencyValue = currencyValue.greaterThanOrEqualTo(cost);

  if (!enoughCurrencyValue) return;

  const takesCurrencyProperty =
    upgradeConfig.spendCurrency ?? containerConfig.spendCurrency;
  const takesCurrency =
    typeof takesCurrencyProperty === "function"
      ? takesCurrencyProperty(mergedPlayer)
      : takesCurrencyProperty === undefined
        ? true
        : takesCurrencyProperty;

  return {
    ...setUpgrade(player, containerId, upgradeNumber),
    ...(takesCurrency ? { [currencyName]: currencyValue.minus(cost) } : {}),
  };
}

export function buyUpgradeById(
  mergedPlayer: MergedPlayer,
  upgradeId: UpgradeId,
) {
  const splitId = splitUpgradeId(upgradeId);
  return buyUpgrade(mergedPlayer, ...splitId);
}

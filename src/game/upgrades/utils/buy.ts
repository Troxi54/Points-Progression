import type { MergedPlayer } from "@game/player/merged/types";
import type { UpgradeId } from "@game/upgrades/types";
import type { UpgradeContainerId } from "../ids";
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
) {
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

  const currencyId = getUpgradeCurrency(upgradeConfig, containerConfig);
  const currencyValue = player[currencyId];
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

  if (takesCurrency) {
    player[currencyId] = currencyValue.minus(cost);
  }

  setUpgrade(player, containerId, upgradeNumber, true);
}

export function buyUpgradeById(
  mergedPlayer: MergedPlayer,
  upgradeId: UpgradeId,
) {
  const splitId = splitUpgradeId(upgradeId);
  buyUpgrade(mergedPlayer, ...splitId);
}

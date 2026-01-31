import { PlayerLike, PartialPlayer } from "@/game/player/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { parsePlayerLike } from "@/game/player/utils";
import {
  UpgradeContainerId,
  UpgradeData,
  UpgradeDataContainer,
  UpgradeId,
} from "@/game/upgrades/types";
import { deepCopy, objectEntries } from "@/core/utils/object";
import { splitUpgradeId } from "./id";
import { hasPreviousUpgrade, hasUpgrade } from "./has";
import { getUpgradeContainerDimensionId, getUpgradeCurrency } from "./get";
import { shouldDimensionWork } from "@/game/dimensions/utils/check";

export function applyUpgrade(
  playerLike: PlayerLike,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
  value: boolean = true,
): PartialPlayer {
  const player = parsePlayerLike(playerLike);
  const upgrades = player.upgrades;

  if (!upgrades) return {};

  const index = upgradeNumber - 1;

  if (upgrades[containerId]?.[index] === value) return {};

  const newUpgrades = deepCopy(upgrades, 2);

  let container = newUpgrades[containerId];
  if (!container) {
    container = newUpgrades[containerId] = [];
  }

  const length = container.length;
  const emptyUpgrades = upgradeNumber - length;

  if (emptyUpgrades > 0) {
    const arrayToFill = Array<boolean>(emptyUpgrades).fill(false);
    container.push(...arrayToFill);
  }

  container[index] = value;

  return {
    upgrades: newUpgrades,
  };
}

export function applyUpgradeById(
  playerLike: PlayerLike,
  upgradeId: UpgradeId,
  value: boolean = true,
) {
  const split = splitUpgradeId(upgradeId);
  return applyUpgrade(playerLike, ...split, value);
}

export function applyUpgradesById(
  playerLike: PlayerLike,
  upgrades: Partial<Record<UpgradeId, boolean>>,
): PartialPlayer {
  const player = parsePlayerLike(playerLike);
  const currentUpgrades = player.upgrades;

  if (!currentUpgrades) return player;

  const newUpgrades = deepCopy(currentUpgrades, 2);

  for (const [upgradeId, value] of objectEntries(upgrades)) {
    const [containerName, upgradeNumber] = splitUpgradeId(upgradeId);
    const index = upgradeNumber - 1;

    if (value === undefined) continue;

    let container = newUpgrades[containerName];
    if (container === undefined) continue;

    if (!container) {
      container = newUpgrades[containerName] = [];
    }

    const length = container.length;
    const emptyUpgrades = upgradeNumber - length;

    if (emptyUpgrades > 0) {
      const arrayToFill = Array<boolean>(emptyUpgrades).fill(false);
      container.push(...arrayToFill);
    }

    container[index] = value;
  }

  return {
    upgrades: newUpgrades,
  };
}

export function applyBoughtUpgrade(
  mergedPlayer: MergedPlayer,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
  upgradeData: UpgradeData,
  containerData: UpgradeDataContainer,
): PartialPlayer | undefined {
  const { player } = mergedPlayer;

  const dimensionId = getUpgradeContainerDimensionId(containerData);
  const dimensionWorks = shouldDimensionWork(mergedPlayer, dimensionId);

  if (!dimensionWorks) return;

  const { cost } = upgradeData;
  const isPurchased = hasUpgrade(player, containerId, upgradeNumber);

  if (isPurchased) return;

  const previousUpgradePurchased = hasPreviousUpgrade(
    player,
    containerId,
    upgradeNumber,
    upgradeData,
  );

  if (!previousUpgradePurchased) return;

  const currencyName = getUpgradeCurrency(upgradeData, containerData);
  const currencyValue = player[currencyName];
  const enoughCurrencyValue = currencyValue.greaterThanOrEqualTo(cost);

  if (!enoughCurrencyValue) return;

  const takesCurrencyProperty =
    upgradeData.spendCurrency ?? containerData.spendCurrency;
  const takesCurrency =
    typeof takesCurrencyProperty === "function"
      ? takesCurrencyProperty(mergedPlayer)
      : takesCurrencyProperty === undefined
        ? true
        : takesCurrencyProperty;

  return {
    ...applyUpgrade(player, containerId, upgradeNumber),
    ...(takesCurrency ? { [currencyName]: currencyValue.minus(cost) } : {}),
  };
}

export function applyBoughtUpgradeById(
  mergedPlayer: MergedPlayer,
  upgradeId: UpgradeId,
  upgradeData: UpgradeData,
  containerData: UpgradeDataContainer,
) {
  const splitId = splitUpgradeId(upgradeId);
  return applyBoughtUpgrade(
    mergedPlayer,
    ...splitId,
    upgradeData,
    containerData,
  );
}

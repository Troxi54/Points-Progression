import { copyObject, deepCopy, objectEntries } from "@core/utils/object";
import type { PlayerLike, PartialPlayer } from "@game/player/types";
import { parsePlayerLike } from "@game/player/utils";
import type { UpgradeContainerId, UpgradeId } from "../types";
import { splitUpgradeId } from "./id";

export function setUpgrade(
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
    const arrayToFill = Array.from<boolean>({ length: emptyUpgrades }).fill(
      false,
    );
    container.push(...arrayToFill);
  }

  container[index] = value;

  return {
    upgrades: newUpgrades,
  };
}

export function setUpgradeById(
  playerLike: PlayerLike,
  upgradeId: UpgradeId,
  value: boolean = true,
) {
  const split = splitUpgradeId(upgradeId);
  return setUpgrade(playerLike, ...split, value);
}

export function setUpgradesById(
  playerLike: PlayerLike,
  upgrades: Partial<Record<UpgradeId, boolean>>,
): PartialPlayer {
  const player = parsePlayerLike(playerLike);
  const currentUpgrades = player.upgrades;

  if (!currentUpgrades) return player;

  const newUpgrades = copyObject(currentUpgrades);
  const touchedContainers = new Set<UpgradeContainerId>();

  for (const [upgradeId, value] of objectEntries(upgrades)) {
    const [containerName, upgradeNumber] = splitUpgradeId(upgradeId);
    const index = upgradeNumber - 1;

    if (value === undefined) continue;

    let container = newUpgrades[containerName];
    if (container === undefined) continue;

    if (!touchedContainers.has(containerName)) {
      container = container ? [...container] : [];
      newUpgrades[containerName] = container;
      touchedContainers.add(containerName);
    }

    if (!container) {
      container = newUpgrades[containerName] = [];
    }

    const length = container.length;
    const emptyUpgrades = upgradeNumber - length;

    if (emptyUpgrades > 0) {
      const arrayToFill = Array.from<boolean>({ length: emptyUpgrades }).fill(
        false,
      );
      container.push(...arrayToFill);
    }

    container[index] = value;
  }

  return {
    upgrades: newUpgrades,
  };
}

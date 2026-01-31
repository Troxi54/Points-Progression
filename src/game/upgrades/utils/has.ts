import { PlayerLike } from "@/game/player/types";
import { parsePlayerLike } from "@/game/player/utils";
import {
  UpgradeCollection,
  UpgradeContainerId,
  UpgradeData,
  UpgradeId,
  UpgradesFlags,
} from "@/game/upgrades/types";
import { splitUpgradeId } from "./id";
import { objectEntries, mergeObjects } from "@/core/utils/object";
import { hasUpgradeSelection } from "./selector";

export function hasUpgrade(
  playerLike: PlayerLike,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
): boolean {
  const index = upgradeNumber - 1;
  if (index < 0) return false;

  const player = parsePlayerLike(playerLike);

  const container = player?.upgrades?.[containerId];
  return container?.[index] === true;
}
export function hasUpgradeById(
  playerLike: PlayerLike,
  upgradeId: UpgradeId,
): boolean {
  const splitId = splitUpgradeId(upgradeId);
  return hasUpgrade(playerLike, ...splitId);
}
/**
 * Note: requires `upgrades` to be 'as const' to properly define types
 */

export function hasUpgrades<T extends UpgradeCollection>(
  playerLike: Exclude<PlayerLike, undefined>,
  upgrades: T,
): UpgradesFlags<T>;

export function hasUpgrades<T extends UpgradeCollection>(
  playerLike: PlayerLike,
  upgrades: T,
): UpgradesFlags<T> | undefined;

export function hasUpgrades<T extends UpgradeCollection>(
  playerLike: PlayerLike,
  upgrades: T,
): UpgradesFlags<T> | undefined {
  const player = parsePlayerLike(playerLike);
  if (!player) return;

  let result: Record<UpgradeId, boolean> = {};

  for (const [id, numbers] of objectEntries(upgrades)) {
    if (!numbers) continue;
    (numbers as number[]).forEach((n) => {
      result = mergeObjects(
        result,
        hasUpgradeSelection(player, id as UpgradeContainerId, n),
      );
    });
  }

  return result;
}
export function hasOneOfUpgrades<T extends UpgradeCollection>(
  playerLike: PlayerLike,
  upgrades: T,
): boolean {
  const player = parsePlayerLike(playerLike);
  if (!player) return false;

  for (const [key, numbers] of Object.entries(upgrades)) {
    const containerName = key as UpgradeContainerId;
    for (const n of numbers) {
      if (hasUpgrade(player, containerName, n)) return true;
    }
  }

  return false;
}
export function hasAllOfUpgrades<T extends UpgradeCollection>(
  playerLike: PlayerLike,
  upgrades: T,
): boolean {
  const player = parsePlayerLike(playerLike);
  if (!player) return false;

  for (const [key, numbers] of Object.entries(upgrades)) {
    const containerName = key as UpgradeContainerId;
    for (const n of numbers) {
      if (!hasUpgrade(player, containerName, n)) return false;
    }
  }

  return true;
}

export function hasPreviousUpgrade(
  playerLike: PlayerLike,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
  upgradeData: UpgradeData,
) {
  const player = parsePlayerLike(playerLike);

  const { previousUpgradeId } = upgradeData;
  if (upgradeNumber > 1 && !previousUpgradeId) {
    return hasUpgrade(player, containerId, upgradeNumber - 1);
  } else if (previousUpgradeId) {
    return hasUpgradeById(player, previousUpgradeId);
  }

  return true;
}

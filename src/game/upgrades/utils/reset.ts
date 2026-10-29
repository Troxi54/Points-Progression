import type { PartialPlayer, Player } from "@game/player/types";
import type { ResetLayerId } from "@game/resetLayers/types";
import type { UpgradeContainerId } from "@game/upgrades/types";
import type {KeptUpgrades} from "../resetTypes";
import { copyObject, objectEntries } from "@core/utils/object";
import resetLayers from "@game/resetLayers/data";
import upgradeResetData from "@game/upgrades/resetData";

function getResetLayerPosition(resetLayerId: ResetLayerId) {
  for (const [dimensionId, layers] of objectEntries(resetLayers)) {
    const index = layers.findIndex((layer) => layer.id === resetLayerId);
    if (index >= 0) return { dimensionId, index };
  }
}

function isContainerReset(
  containerId: UpgradeContainerId,
  resetLayerId: ResetLayerId,
): boolean {
  const resetsOn = upgradeResetData[containerId].resetsOn;
  if (resetsOn == null) return false;

  const containerPosition = getResetLayerPosition(resetsOn);
  const resetPosition = getResetLayerPosition(resetLayerId);
  if (!containerPosition || !resetPosition) return false;

  return (
    containerPosition.dimensionId === resetPosition.dimensionId &&
    containerPosition.index <= resetPosition.index
  );
}

function restoreUpgrades(
  upgrades: Player["upgrades"],
  source: Player["upgrades"],
  keptUpgrades: KeptUpgrades,
) {
  const result = copyObject(upgrades);
  const copiedContainers = new Set<UpgradeContainerId>();

  for (const [containerId, upgradeNumbers] of objectEntries(keptUpgrades)) {
    if (!upgradeNumbers) continue;
    const sourceContainer = source[containerId];
    if (!sourceContainer) continue;

    let targetContainer = result[containerId];
    if (!targetContainer) {
      targetContainer = Array.from<boolean>({
        length: sourceContainer.length,
      }).fill(false);
      result[containerId] = targetContainer;
      copiedContainers.add(containerId);
    } else if (!copiedContainers.has(containerId)) {
      targetContainer = [...targetContainer];
      result[containerId] = targetContainer;
      copiedContainers.add(containerId);
    }

    if (upgradeNumbers === "all") {
      for (let index = 0; index < sourceContainer.length; index++) {
        targetContainer[index] = sourceContainer[index] === true;
      }
    } else {
      for (const upgradeNumber of upgradeNumbers) {
        const index = upgradeNumber - 1;
        if (index < 0 || index >= sourceContainer.length) continue;

        targetContainer[index] = sourceContainer[index] === true;
      }
    }
  }

  return result;
}

/**
 * Clears every upgrade container reset by this layer or a lower one, then
 * restores the ranges granted by upgrades bought before the reset cascade.
 * It is intentionally called once per layer from low to high: the highest
 * layer's retention rules are consequently the final result.
 */
export function applyResetLayerUpgradeReset(
  player: Player,
  sourcePlayer: Player,
  resetLayerId: ResetLayerId,
): PartialPlayer {
  const upgrades = copyObject(player.upgrades);

  for (const [containerId] of objectEntries(upgradeResetData)) {
    if (!isContainerReset(containerId, resetLayerId)) continue;

    const existing = upgrades[containerId];
    if (existing) upgrades[containerId] = existing.map(() => false);
  }

  const keepsByUpgrade = upgradeResetData[resetLayerId].keepsByUpgrade;
  if (!keepsByUpgrade) return { upgrades };

  let result = upgrades;
  for (const [upgradeNumber, keptUpgrades] of objectEntries(keepsByUpgrade)) {
    if (!keptUpgrades) continue;
    const sourceContainer = sourcePlayer.upgrades[resetLayerId];
    const index = Number(upgradeNumber) - 1;
    if (sourceContainer?.[index] !== true) continue;

    result = restoreUpgrades(result, sourcePlayer.upgrades, keptUpgrades);
  }

  return { upgrades: result };
}

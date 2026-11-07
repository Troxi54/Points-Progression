import type { Player } from "@game/player/schemas";
import type { ResetLayerId } from "@game/resetLayers/ids";
import type { UpgradeContainerId } from "../ids";
import type { KeptUpgrades } from "../resetTypes";
import { objectEntries } from "@core/utils/object";
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
  for (const [containerId, upgradeNumbers] of objectEntries(keptUpgrades)) {
    if (!upgradeNumbers) continue;

    const sourceContainer = source[containerId];
    if (!sourceContainer) continue;

    let targetContainer = upgrades[containerId];

    if (!targetContainer) {
      targetContainer = Array.from<boolean>({
        length: sourceContainer.length,
      }).fill(false);

      upgrades[containerId] = targetContainer;
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
) {
  const { upgrades } = player;
  const sourceUpgrades = sourcePlayer.upgrades;

  for (const [containerId] of objectEntries(upgradeResetData)) {
    if (!isContainerReset(containerId, resetLayerId)) continue;

    upgrades[containerId]?.fill(false);
  }

  const keepsByUpgrade = upgradeResetData[resetLayerId].keepsByUpgrade;
  if (!keepsByUpgrade) return;

  const sourceContainer = sourceUpgrades[resetLayerId];

  for (const [upgradeNumber, keptUpgrades] of objectEntries(keepsByUpgrade)) {
    if (!keptUpgrades) continue;

    const index = Number(upgradeNumber) - 1;
    if (sourceContainer?.[index] !== true) continue;

    restoreUpgrades(upgrades, sourceUpgrades, keptUpgrades);
  }
}

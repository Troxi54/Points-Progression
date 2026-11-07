import type { PlayerLike } from "@game/player/types";
import type { UpgradeContainerId } from "../ids";
import type { UpgradeId } from "../types";
import { objectEntries } from "@core/utils/object";
import { parsePlayerLike } from "@game/player/utils";
import { splitUpgradeId } from "./id";

export function setUpgrade(
  playerLike: PlayerLike,
  containerId: UpgradeContainerId,
  upgradeNumber: number,
  value: boolean = true,
) {
  const player = parsePlayerLike(playerLike);
  const upgrades = player.upgrades;

  if (!upgrades) return;

  const index = upgradeNumber - 1;

  let container = upgrades[containerId];
  if (!container) {
    container = upgrades[containerId] = [];
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

export function setUpgradeById(
  playerLike: PlayerLike,
  upgradeId: UpgradeId,
  value: boolean = true,
) {
  const split = splitUpgradeId(upgradeId);
  setUpgrade(playerLike, ...split, value);
}

export function setUpgradesById(
  playerLike: PlayerLike,
  upgrades: Partial<Record<UpgradeId, boolean>>,
) {
  const player = parsePlayerLike(playerLike);

  for (const [upgradeId, value] of objectEntries(upgrades)) {
    setUpgradeById(player, upgradeId, value);
  }
}

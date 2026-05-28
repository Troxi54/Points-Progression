import type { PlayerLike } from "@game/player/types";
import type { UpgradeContainerId, UpgradeId } from "@game/upgrades/types";
import { objectFromEntries } from "@core/utils/object";
import { parsePlayerLike } from "@game/player/utils";
import { hasUpgrade, hasUpgradeById } from "./has";
import { createUpgradeId } from "./id";

export function hasUpgradeSelection<
  T extends UpgradeContainerId,
  O extends number,
>(
  playerLike: PlayerLike,
  containerName: T,
  upgradeNumber: O,
): Record<UpgradeId<T, O>, boolean> {
  const player = parsePlayerLike(playerLike);

  const id = createUpgradeId(containerName, upgradeNumber);
  const has = hasUpgrade(player, containerName, upgradeNumber);

  return objectFromEntries([[id, has]]);
}

export function hasUpgradeSelectionById<T extends UpgradeId>(
  playerLike: PlayerLike,
  upgradeId: T,
): Record<T, boolean> {
  const has = hasUpgradeById(playerLike, upgradeId);

  return objectFromEntries([[upgradeId, has]]);
}

import type { UpgradeId } from "@game/upgrades/types";
import type { UpgradeContainerId } from "../ids";

export function splitUpgradeId(
  upgradeId: UpgradeId,
): [UpgradeContainerId, number] {
  const split = upgradeId.split("_");
  return [split[0] as UpgradeContainerId, Number(split[1])];
}

export function createUpgradeId<T extends UpgradeContainerId, O extends number>(
  containerName: T,
  upgradeNumber: O,
): UpgradeId<T, O> {
  return `${containerName}_${upgradeNumber}`;
}

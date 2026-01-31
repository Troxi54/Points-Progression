import { UpgradeId, UpgradeContainerId } from "@/game/upgrades/types";

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

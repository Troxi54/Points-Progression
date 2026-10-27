import type {
  MergedPlayer,
  PartialMergedPlayer,
} from "@game/player/merged/types";
import {
  copyObject,
  deepCopy,
  mergeObjects,
  objectEntries,
  objectKeys,
} from "@core/utils/object";
import {
  assignCachedPlayerForMergedPlayer,
  assignMergedPlayer,
} from "@game/player/merged/utils";
import { parseValueGetter } from "@game/player/utils";
import { flatRepeatableUpgrades } from "../data";
import { buyRepeatableUpgradeMax } from "./buy";
import { updateCachedRepeatableUpgrade } from "./update";

export function tickRepeatableUpgradeAutobuy(
  mergedPlayer: MergedPlayer,
): PartialMergedPlayer {
  const result = copyObject(mergedPlayer);

  for (const [id, upgradeData] of objectEntries(flatRepeatableUpgrades)) {
    const shouldAutobuy = parseValueGetter(upgradeData.autobuy, mergedPlayer);

    if (!shouldAutobuy) {
      continue;
    }

    const purchased = buyRepeatableUpgradeMax(result, id);

    assignMergedPlayer(result, mergeObjects(result, purchased));
  }

  return result;
}

export function tickRepeatableUpgradeCache(
  mergedPlayer: MergedPlayer,
): PartialMergedPlayer {
  const result = deepCopy(mergedPlayer, 2);

  for (const id of objectKeys(flatRepeatableUpgrades)) {
    const updated = updateCachedRepeatableUpgrade(result, id);

    assignCachedPlayerForMergedPlayer(result, updated);
  }

  return result;
}

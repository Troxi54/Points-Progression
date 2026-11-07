import type { MergedPlayer } from "@game/player/merged/types";
import { objectEntries, objectKeys } from "@core/utils/object";
import { parseValueGetter } from "@game/player/utils";
import { flatRepeatableUpgrades } from "../data";
import { buyRepeatableUpgradeMax } from "./buy";
import { updateCachedRepeatableUpgrade } from "./update";

export function tickRepeatableUpgradeAutobuy(mergedPlayer: MergedPlayer) {
  for (const [id, upgradeConfig] of objectEntries(flatRepeatableUpgrades)) {
    const shouldAutobuy = parseValueGetter(upgradeConfig.autobuy, mergedPlayer);

    if (!shouldAutobuy) {
      continue;
    }

    buyRepeatableUpgradeMax(mergedPlayer, id);
  }
}

export function tickRepeatableUpgradeCache(mergedPlayer: MergedPlayer) {
  for (const id of objectKeys(flatRepeatableUpgrades)) {
    updateCachedRepeatableUpgrade(mergedPlayer, id);
  }
}

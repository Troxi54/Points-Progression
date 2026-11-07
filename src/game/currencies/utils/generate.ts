import type { MergedPlayer } from "@game/player/merged/types";
import { objectEntries } from "@core/utils/object";
import { parseValueGetter } from "@game/player/utils";
import currencyConfig from "../data";
import { getCachedCurrencyProp } from "./get";

export function generateCurrencies(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
) {
  const { player, cachedPlayer } = mergedPlayer;

  for (const [currencyId, data] of objectEntries(currencyConfig)) {
    const passiveGain = getCachedCurrencyProp(
      cachedPlayer,
      currencyId,
      "passiveGain",
    );
    if (passiveGain.equals(0)) continue;

    const passiveGainWorks = parseValueGetter(
      data.passiveGainWorks,
      mergedPlayer,
    );

    if (!passiveGainWorks) continue;

    const oldValue = mergedPlayer.player[currencyId];
    const newValue = oldValue.plus(passiveGain.multiply(deltaTime));

    player[currencyId] = newValue;
  }
}

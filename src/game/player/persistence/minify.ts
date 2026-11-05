import type { MinifiedPlayer, PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";
import { setWithFill } from "@core/utils/array";
import { isDecimal } from "@core/utils/decimal";
import {
  objectEntries,
  objectFromEntries,
  shallowEqual,
} from "@core/utils/object";
import {
  minifiedPlayerMap,
  unminifiedPlayerMap,
} from "@game/player/minifiedNames";
import { getDefaultPlayer, requiredPlayerProps } from "@game/player/schemas";
import { getDefaultResetLayerPlayerData } from "@game/resetLayers/playerData";

export function minifyPlayer(player: Player): MinifiedPlayer {
  const defaultPlayer = getDefaultPlayer();

  const result: MinifiedPlayer = [];

  for (const [key, value] of objectEntries(player)) {
    const index = minifiedPlayerMap[key];
    const defaultValue = defaultPlayer[key];

    if (requiredPlayerProps.has(key)) {
      setWithFill(result, index, value, "");
      continue;
    }

    if (
      (isDecimal(value) &&
        isDecimal(defaultValue) &&
        value.equals(defaultValue)) ||
      Object.is(value, defaultValue)
    ) {
      continue;
    }

    if (key === "resetLayers") {
      const newData: (typeof player)["resetLayers"] = {};
      const defaultResetLayer = getDefaultResetLayerPlayerData();
      for (const [resetLayerId, resetLayerData] of objectEntries(player[key])) {
        if (!resetLayerData) continue;
        if (shallowEqual(resetLayerData, defaultResetLayer)) continue;

        newData[resetLayerId] = resetLayerData;
      }

      setWithFill(result, index, newData, "");
      continue;
    }

    setWithFill(result, index, value, "");
  }

  return result;
}

export function unminifyPlayer(minified: MinifiedPlayer): PartialPlayer {
  return objectFromEntries(
    minified
      .map(
        (
          value,
          index,
        ): [PropertyKey, MinifiedPlayer[keyof MinifiedPlayer]] | null => {
          const key =
            unminifiedPlayerMap[index as keyof typeof unminifiedPlayerMap];
          if (value === "" || key === undefined) return null;

          return [key, value];
        },
      )
      .filter((value) => value != null),
  ) as PartialPlayer;
}

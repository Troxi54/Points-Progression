import {
  getDefaultPlayer,
  getDefaultResetLayerPlayerData,
  requiredPlayerProps,
} from "@/game/player/default";
import {
  minifiedPlayerMap,
  unminifiedPlayerMap,
} from "@/game/player/minifiedNames";
import { MinifiedPlayer, PartialPlayer, Player } from "@/game/player/types";
import { isDecimal } from "@/core/utils/decimal";
import { isNil } from "@/core/utils/nil";
import {
  objectEntries,
  objectFromEntries,
  shallowEqual,
} from "@/core/utils/object";
import { setWithFill } from "@core/utils/array";

export function minifyPlayer(player: Player): MinifiedPlayer {
  const defaultPlayer = getDefaultPlayer();

  let result: MinifiedPlayer = [];

  for (const [key, value] of objectEntries(player)) {
    const index = minifiedPlayerMap[key];
    const defaultValue = defaultPlayer[key];

    if (requiredPlayerProps.has(key)) {
      result[index] = value;
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
      .filter((value) => !isNil(value)),
  ) as PartialPlayer;
}

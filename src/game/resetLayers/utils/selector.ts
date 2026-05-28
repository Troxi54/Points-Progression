import type { PlayerLike, ResetLayerPlayerData } from "@game/player/types";
import type { ResetLayerId, ResetLayerPlayerSelector } from "../types";
import { objectFromEntries } from "@core/utils/object";
import { parsePlayerLike } from "@game/player/utils";
import { everPerformed, getResetLayerPlayerDataProps } from "./get";

export function getResetLayerPlayerSelection<
  T extends ResetLayerId,
  P extends (keyof ResetLayerPlayerData)[],
>(
  playerLike: PlayerLike,
  resetLayerId: T,
  properties: P,
): {
  [K in P[number] as ResetLayerPlayerSelector<T, K>]: ResetLayerPlayerData[K];
} {
  const player = parsePlayerLike(playerLike);

  const data = getResetLayerPlayerDataProps(player, resetLayerId, properties);

  return objectFromEntries(
    properties.map((property) => {
      const propertyName = property as P[number];

      const key: ResetLayerPlayerSelector<T, typeof propertyName> =
        `resetLayer_${resetLayerId}_${propertyName}`;
      const value = data[propertyName];

      return [key, value];
    }),
  ) as ReturnType<typeof getResetLayerPlayerSelection>;
}

export function everPerformedResetLayers<T extends ResetLayerId[]>(
  playerLike: PlayerLike,
  resetLayerIds: T,
): {
  [K in T[number] as ResetLayerPlayerSelector<
    K,
    "everPerformed"
  >]: ResetLayerPlayerData["everPerformed"];
} {
  const player = parsePlayerLike(playerLike);

  return objectFromEntries(
    resetLayerIds.map((id) => {
      const key: ResetLayerPlayerSelector<T[number], "everPerformed"> =
        `resetLayer_${id}_everPerformed`;
      const value = everPerformed(player, id);

      return [key, value];
    }),
  ) as ReturnType<typeof everPerformedResetLayers>;
}

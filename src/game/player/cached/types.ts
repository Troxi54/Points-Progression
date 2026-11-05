import type { PartialMergedPlayer } from "@game/player/merged/types";
import type { PlayerState } from "@game/player/store/types";
import type { getDefaultCachedPlayer } from "./default";

export type CachedPlayer = ReturnType<typeof getDefaultCachedPlayer>;

export type CachedPlayerLike =
  | CachedPlayer
  | Partial<CachedPlayer>
  | PartialMergedPlayer
  | PlayerState
  | undefined;

export type PartialCachedPlayer = Partial<CachedPlayer>;

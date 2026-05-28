import type { MergedPlayer } from "./types";
import { getDefaultCachedPlayer } from "@game/player/cached/default";
import { getDefaultPlayer } from "@game/player/default";
import { mergePlayer } from "./utils";

export default function getDefaultMergedPlayer(): MergedPlayer {
  return mergePlayer(getDefaultPlayer(), getDefaultCachedPlayer());
}

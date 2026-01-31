import { getDefaultCachedPlayer } from "@/game/player/cached/default";
import { getDefaultPlayer } from "@/game/player/default";
import { MergedPlayer } from "./types";
import { mergePlayer } from "./utils";

export default function getDefaultMergedPlayer(): MergedPlayer {
  return mergePlayer(getDefaultPlayer(), getDefaultCachedPlayer());
}

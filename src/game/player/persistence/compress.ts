import { Player } from "@/game/player/types";
import { minifyPlayer } from "./minify";
import { compressToEncodedURIComponent } from "lz-string";

function compressPlayerToString(player: Player): string {
  const minified = minifyPlayer(player);

  let converted = JSON.stringify(minified);
  converted = converted.slice(1, converted.length - 1);

  const compressed = compressToEncodedURIComponent(converted);

  return compressed;
}

export function serializePlayer(player: Player): string {
  return compressPlayerToString(player);
}

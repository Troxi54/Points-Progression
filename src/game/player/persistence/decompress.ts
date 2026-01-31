import { MinifiedPlayer, PartialPlayer } from "@/game/player/types";
import { isObject } from "@/core/utils/object";
import { decompressFromEncodedURIComponent } from "lz-string";

function convertToPlayer(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return false;
  }
}

export function decompressPlayerString(
  str: string,
): MinifiedPlayer | PartialPlayer | undefined {
  if (!str) return;

  try {
    const decompressed = decompressFromEncodedURIComponent(str);
    if (!decompressed) throw new Error();

    const converted = convertToPlayer(decompressed);
    if (isObject(converted)) throw new Error();

    const addedBrackets = "[" + decompressed + "]";
    const parsed = convertToPlayer(addedBrackets);

    if (!Array.isArray(parsed)) throw new Error();

    return parsed;
  } catch {
    try {
      const converted = atob(str);
      if (!converted) throw new Error();

      const parsed = convertToPlayer(converted);
      if (!isObject(parsed)) throw new Error();

      return parsed;
    } catch {
      return undefined;
    }
  }
}

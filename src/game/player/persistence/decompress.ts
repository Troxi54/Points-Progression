import type { MinifiedPlayer, PartialPlayer } from "@game/player/types";
import { isObject } from "@core/utils/object";
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

  const decompressed = decompressFromEncodedURIComponent(str);

  if (decompressed) {
    const addedBrackets = `[${decompressed}]`;
    const parsed = convertToPlayer(addedBrackets);

    if (Array.isArray(parsed)) return parsed;
  }

  try {
    const converted = atob(str);

    if (!converted) return;

    const parsed = convertToPlayer(converted);

    if (isObject(parsed)) return parsed;
  } catch {}
}

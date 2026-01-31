import { GameVersion } from "./types";

export function gameVersionToString(version: GameVersion): string {
  const { major, minor, patch, subpatch } = version;

  const parts = [major, minor, patch].filter((s) => s !== undefined);

  let result = parts.join(".");
  if (subpatch) result += subpatch;

  return result;
}

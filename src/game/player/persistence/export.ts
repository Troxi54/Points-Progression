import { getPlayerState } from "@/game/player/store/store";
import { serializePlayer } from "./compress";

export function exportPlayer(): string {
  const { player } = getPlayerState();

  const serialized = serializePlayer(player);
  return serialized;
}

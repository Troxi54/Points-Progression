import { getPlayerState } from "@game/player/store";
import { isInfiniteModeUnlocked } from "./is";

export function toggleInfiniteMode() {
  const { player, setPlayer } = getPlayerState();

  const entered = player.enteredInfiniteMode;
  const unlocked = isInfiniteModeUnlocked(player);

  if (!entered && !unlocked) return;

  setPlayer({
    enteredInfiniteMode: !entered,
  });
}

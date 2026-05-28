import { getPlayerState } from "@game/player/store";
import resetGame from "@main/resetGame";
import { loadPlayer } from "./load";

export function importPlayer(str?: string) {
  const loaded = loadPlayer(str);
  if (!loaded) return;

  const { setPlayer } = getPlayerState();
  setPlayer(loaded);

  resetGame();
}

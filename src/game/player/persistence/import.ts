import { getPlayerState } from "@/game/player/store/store";
import { loadPlayer } from "./load";
import resetGame from "@app/resetGame";

export function importPlayer(str?: string) {
  const loaded = loadPlayer(str);
  if (!loaded) return;

  const { setPlayer } = getPlayerState();
  setPlayer(loaded);

  resetGame();
}

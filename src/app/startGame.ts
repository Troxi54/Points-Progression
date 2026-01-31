import { importPlayer } from "@game/player/persistence/import";
import startGameLoop from "@game/gameLoop/start";

export default function startGame() {
  importPlayer();
  startGameLoop();
}

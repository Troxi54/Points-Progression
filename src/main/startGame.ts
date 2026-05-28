import startGameLoop from "@game/gameLoop/start";
import { importPlayer } from "@game/player/persistence/import";

export default function startGame() {
  importPlayer();
  startGameLoop();
}

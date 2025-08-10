import { updateAllCache } from "./gameLoop/cacheUpdates";
import { startGameLoop } from "./gameLoop/gameLoop";
import { calculateOfflineProgress } from "./offline";
import { usePlayerStore } from "./player/playerStore";
import {
  loadPlayerFromLocalStorage,
  savePlayerToLocalStorage
} from "./player/playerUtils";
import { addUncountableWords } from "./pluralizeRules";

function loadPlayerData() {
  const player = loadPlayerFromLocalStorage();
  if (player) {
    const { setPlayer } = usePlayerStore.getState();
    setPlayer(player);
  }
}

function saveOnLeaving() {
  window.addEventListener("beforeunload", () => {
    savePlayerToLocalStorage();
  });
}

export function resetGame() {
  calculateOfflineProgress();
  updateAllCache();
}

export function startGame() {
  addUncountableWords();
  loadPlayerData();
  saveOnLeaving();
  resetGame();
  startGameLoop();
}

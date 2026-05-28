import type { GameLoopPartState } from "@game/gameLoop/types";
import gameLoopGenerateCurrencies from "./actions/generate";
import gameLoopPostResetLayers from "./actions/postResetLayers";
import gameLoopPreResetLayers from "./actions/preResetLayers";
import gameLoopRepeatableUpgrades from "./actions/repeatableUpgrades";
import gameLoopResetLayers from "./actions/resetLayers";

export default function gameLoopActions(state: GameLoopPartState) {
  gameLoopGenerateCurrencies(state);
  gameLoopRepeatableUpgrades(state);
  gameLoopPreResetLayers(state);
  gameLoopResetLayers(state);
  gameLoopPostResetLayers(state);
}

import { GameLoopPartState } from "@/game/gameLoop/types";
import gameLoopRepeatableUpgrades from "./actions/repeatableUpgrades";
import gameLoopResetLayers from "./actions/resetLayers";
import gameLoopGenerateCurrencies from "./actions/generate";
import gameLoopPreResetLayers from "./actions/preResetLayers";
import gameLoopPostResetLayers from "./actions/postResetLayers";

export default function gameLoopActions(state: GameLoopPartState) {
  gameLoopGenerateCurrencies(state);
  gameLoopRepeatableUpgrades(state);
  gameLoopPreResetLayers(state);
  gameLoopResetLayers(state);
  gameLoopPostResetLayers(state);
}

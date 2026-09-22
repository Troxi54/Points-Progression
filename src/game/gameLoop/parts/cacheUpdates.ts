import type { GameLoopPartState } from "@game/gameLoop/types";
import gameLoopUpdateEffects from "./cache/effects";
import gameLoopUpdateGains from "./cache/gains";
import gameLoopUpdateRepeatableUpgradeCache from "./cache/repeatableUpgrades";
import gameLoopUpdateRequirements from "./cache/requirements";
import { gameLoopUpdateStates } from "./cache/states";

export default function gameLoopUpdateCache(state: GameLoopPartState) {
  gameLoopUpdateStates(state);
  gameLoopUpdateEffects(state);
  gameLoopUpdateRepeatableUpgradeCache(state);
  gameLoopUpdateGains(state);
  gameLoopUpdateRequirements(state);
}

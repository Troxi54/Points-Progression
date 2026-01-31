import { GameLoopPartState } from "@/game/gameLoop/types";
import gameLoopUpdateEffects from "./cache/effects";
import gameLoopUpdateGains from "./cache/gains";
import gameLoopUpdateRepeatableUpgradeCache from "./cache/repeatableUpgrades";
import gameLoopUpdateRequirements from "./cache/requirements";

export default function gameLoopUpdateCache(state: GameLoopPartState) {
  gameLoopUpdateEffects(state);
  gameLoopUpdateRepeatableUpgradeCache(state);
  gameLoopUpdateGains(state);
  gameLoopUpdateRequirements(state);
}

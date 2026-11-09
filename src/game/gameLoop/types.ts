import type { MergedPlayerState } from "@game/player/merged/types";

export interface GameLoopPartState extends MergedPlayerState {
  currentTime: number;
  currentGameTime: number;
  deltaTime: number;
  deltaTimeMs: number;
  deltaTimeSession: number;
}

import { MergedPlayerState } from "@/game/player/merged/types";

export interface GameLoopPartState extends MergedPlayerState {
  currentTime: number;
  currentGameTime: number;
  deltaTime: number;
  deltaTimeTPS: number;
  deltaTimeSession: number;
}

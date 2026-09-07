import offlineConfig from "../config";

export function calculateTicksForOfflineTime(time: number): number {
  const seconds = Math.floor(time / 1000);
  return Math.min(offlineConfig.maxTicksOnTrigger, seconds);
}

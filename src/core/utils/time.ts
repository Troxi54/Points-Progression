export function getRealCurrentTime(): number {
  return performance.timeOrigin + performance.now();
}

let currentTime: number | null = null;

export function getCurrentTime(): number {
  return currentTime ?? updateCurrentTime();
}

export function updateCurrentTime(): number {
  return (currentTime = getRealCurrentTime());
}

export function getTimeSince(date: number): number {
  return getCurrentTime() - date;
}

export function checkElapsedTime(time: number | null): time is number {
  return time !== null && Number.isFinite(time) && time > 0;
}

export function fixTime(
  time: number | null | undefined,
  currentTime: number = getCurrentTime(),
): number | null {
  if (time == null) return null;

  return Math.min(currentTime, time);
}

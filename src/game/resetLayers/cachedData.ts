export function getDefaultCachedResetLayer() {
  return {
    duration: null as number | null,
    lastResetDuration: null as number | null,
    resetsPerSecond: 0,
  };
}

export type CachedResetLayer = ReturnType<typeof getDefaultCachedResetLayer>;

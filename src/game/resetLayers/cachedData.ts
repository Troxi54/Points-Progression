export function getDefaultCachedResetLayer() {
  return {
    duration: null as number | null,
    lastResetDuration: null as number | null,
  };
}

export type CachedResetLayer = ReturnType<typeof getDefaultCachedResetLayer>;

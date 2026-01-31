const resetLayerConfig = {
  maxResetsPerSecond: 60,
  progressBarsStartLockingAt: 10,
  firstResetLayerBestRunLimit: 10,
  firstResetLayerWorstRunLimit: 86_400_000,
  tierRequirementScaling: 1000
} as const;

export default resetLayerConfig;

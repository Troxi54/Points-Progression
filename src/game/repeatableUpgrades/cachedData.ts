import createDecimal from "@core/utils/decimal";

export function getDefaultCachedRepeatableUpgrade() {
  return {
    cost: createDecimal(Infinity),
    effect: createDecimal(1),
    bulk: createDecimal(0),
    maxed: false,
  };
}

export type CachedRepeatableUpgrade = ReturnType<
  typeof getDefaultCachedRepeatableUpgrade
>;

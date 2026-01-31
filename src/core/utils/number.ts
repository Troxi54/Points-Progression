export function averageNumber(nums: readonly number[]): number {
  if (nums.length === 0) return 0;

  return nums.reduce((sum, x) => sum + x, 0) / nums.length;
}

export function clamp(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) {
    return min;
  }

  if (max !== undefined && value > max) {
    return max;
  }

  return value;
}

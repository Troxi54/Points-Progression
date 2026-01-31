export function copyArray<T>(array: readonly T[]): T[] {
  return array.slice();
}

export function isEmpty(array: readonly unknown[]): boolean {
  return array.length === 0;
}

export function arrayAt<T>(array: readonly T[], index: number): T | undefined {
  const length = array.length;

  if (length === 0) return undefined;
  if (index < 0) index += length;

  return array[index];
}

export function arrayLastItem<T>(array: readonly T[]): T | undefined {
  const length = array.length;
  return length ? array[length - 1] : undefined;
}

export function arrayFirstItem<T>(array: readonly T[]): T | undefined {
  return array[0];
}

export function arrayLastIndex(array: readonly unknown[]): number {
  return Math.max(array.length - 1, 0);
}

export function setWithFill<T>(arr: T[], index: number, value: T, fill: T) {
  if (index >= arr.length) {
    arr.length = index + 1;
    arr.fill(
      fill,
      arr.findIndex((v) => v === undefined),
      index,
    );
  }
  arr[index] = value;
}

import Decimal from "break_eternity.js";

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function hasKey<K extends PropertyKey, T>(
  key: K,
  obj: unknown
): obj is Partial<Record<K, T>> {
  return isObject(obj) && key in obj;
}

export function mergeObjects<T, U>(base: T, override: U): T & U {
  return { ...base, ...override };
}

export function assignKey<T, K extends keyof T>(
  obj: Partial<T>,
  key: K,
  value: T[K]
) {
  obj[key] = value;
}

function smartMergeDecimalObject<T>(oldObj: T, newObj: Partial<T>): T {
  const result = { ...oldObj };

  for (const key in newObj) {
    if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;

    const k = key as keyof T;
    const oldVal = oldObj[k];
    const newVal = newObj[k];

    if (
      oldVal instanceof Decimal &&
      newVal instanceof Decimal &&
      !oldVal.equals(newVal)
    ) {
      result[k] = newVal as T[typeof k];
    } else if (
      !(oldVal instanceof Decimal && newVal instanceof Decimal) &&
      oldVal !== newVal
    ) {
      result[k] = newVal as T[typeof k];
    }
  }

  return result;
}

export function updateObject<T>(prev: T, next?: Partial<T>) {
  if (!next) return prev;
  return smartMergeDecimalObject(prev, next);
}

export function copyObject<T extends Readonly<object>>(object: T): T {
  return { ...object };
}

export function objectEntries<T>(obj: T) {
  if (!isObject(obj)) return [];
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function objectFromEntries<K extends PropertyKey, V>(entries: [K, V][]) {
  return Object.fromEntries(entries) as { [P in K]: V };
}

export function objectKeys<T extends Readonly<object>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function objectAssign<T extends object>(
  base: T,
  override: Partial<T> | undefined
): T {
  return Object.assign(base, override);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepCopy<T>(obj: T, depth: number = Infinity): T {
  if (depth < 1 || obj === null || typeof obj !== "object") {
    return obj;
  }

  const root = (Array.isArray(obj) ? [] : {}) as T;
  const stack: Array<{
    parent: any;
    key: string | number | null;
    value: any;
    depth: number;
  }> = [{ parent: root, key: null, value: obj, depth }];

  while (stack.length) {
    const { parent, key, value, depth: d } = stack.pop()!;
    const target =
      key === null
        ? parent
        : Array.isArray(value)
          ? (parent[key] = [])
          : (parent[key] = {});

    for (const k in value) {
      if (Object.prototype.hasOwnProperty.call(value, k)) {
        const v = value[k];
        if (v !== null && typeof v === "object" && d > 1) {
          stack.push({ parent: target, key: k, value: v, depth: d - 1 });
        } else {
          target[k] = v;
        }
      }
    }
  }

  return root;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function createUniqueObject<
  T extends Readonly<Record<string, unknown>>
>(obj: {
  [K in keyof T]: T[K] extends T[Exclude<keyof T, K>] ? never : T[K];
}) {
  return obj;
}

export function shallowEqual<T extends Readonly<object>>(
  obj1: T,
  obj2: T
): boolean {
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

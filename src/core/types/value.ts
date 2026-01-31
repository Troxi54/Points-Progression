export type ValueOf<T> = T[keyof T];

export type ValueOfArray<T extends unknown[]> = T[number];

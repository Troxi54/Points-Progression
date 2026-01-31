/* eslint-disable @typescript-eslint/no-explicit-any */
export type FunctionType = (...args: any[]) => any;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NotFunction<T> = T extends FunctionType ? never : T;

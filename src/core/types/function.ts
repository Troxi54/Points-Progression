export type FunctionType = (...args: any[]) => any;

export type NotFunction<T> = T extends FunctionType ? never : T;

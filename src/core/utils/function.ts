export function isFunction(value: unknown): value is CallableFunction {
  return typeof value === "function";
}

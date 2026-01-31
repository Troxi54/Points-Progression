import { Nil } from "@/core/types/primitives";

export function isNil(value: unknown): value is Nil {
  return value == null;
}

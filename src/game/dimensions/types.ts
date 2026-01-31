import { BooleanGetter } from "@/game/player/types";

export type DimensionId = "normal" | "sliph";

export interface DimensionData<T extends DimensionId = DimensionId> {
  pauseOtherDimensions:
    | Partial<
        Record<
          Exclude<DimensionId, T> extends never
            ? DimensionId
            : Exclude<DimensionId, T>,
          BooleanGetter
        >
      >
    | BooleanGetter;
}

export type PartialDimensionData<T extends DimensionId = DimensionId> = Partial<
  DimensionData<T>
>;

export type DimensionContainer = Partial<{
  [K in DimensionId]: DimensionData<K>;
}>;
export type PartialDimensionContainer = Partial<{
  [K in DimensionId]: PartialDimensionData<K>;
}>;

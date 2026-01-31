import { ScrollPosition } from "@/core/types/vector";
import { DimensionId } from "@/game/dimensions/types";
import { useLayoutEffect, useRef } from "react";

type Props = {
  dimensionId: DimensionId;
};

function useDimensionScroll({ dimensionId }: Props) {
  const scrollPositions = useRef<Partial<Record<DimensionId, ScrollPosition>>>(
    {}
  );

  const prevDimensionId = useRef<DimensionId>(dimensionId);
  const root = document.documentElement;

  if (dimensionId !== prevDimensionId.current) {
    scrollPositions.current[prevDimensionId.current] = {
      scrollTop: root.scrollTop,
      scrollLeft: root.scrollLeft
    };

    prevDimensionId.current = dimensionId;
  }

  useLayoutEffect(() => {
    let position = scrollPositions.current[dimensionId];
    if (!position) {
      position = {
        scrollLeft: 0,
        scrollTop: 0
      };
    }

    root.scrollTo({
      top: position.scrollTop,
      left: position.scrollLeft,
      behavior: "instant"
    });
  }, [dimensionId]);
}

export default useDimensionScroll;

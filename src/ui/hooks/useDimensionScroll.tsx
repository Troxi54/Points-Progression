import type { ScrollPosition } from "@core/types/vector";
import type { DimensionId } from "@game/dimensions/types";
import { useLayoutEffect, useRef } from "react";

interface Props {
  dimensionId: DimensionId;
}

function useDimensionScroll({ dimensionId }: Props) {
  const scrollPositionsRef = useRef<
    Partial<Record<DimensionId, ScrollPosition>>
  >({});

  const prevDimensionIdRef = useRef<DimensionId>(dimensionId);
  const root = document.documentElement;

  if (dimensionId !== prevDimensionIdRef.current) {
    scrollPositionsRef.current[prevDimensionIdRef.current] = {
      scrollTop: root.scrollTop,
      scrollLeft: root.scrollLeft,
    };

    prevDimensionIdRef.current = dimensionId;
  }

  useLayoutEffect(() => {
    let position = scrollPositionsRef.current[dimensionId];
    if (!position) {
      position = {
        scrollLeft: 0,
        scrollTop: 0,
      };
    }

    root.scrollTo({
      top: position.scrollTop,
      left: position.scrollLeft,
      behavior: "instant",
    });
  }, [dimensionId, root]);
}

export default useDimensionScroll;

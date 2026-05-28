import type { ChildrenProps } from "@core/types/react";
import type { DimensionId } from "@game/dimensions/types";
import type { ComponentType } from "react";
import { isDimension } from "@game/dimensions/utils/compare";
import { getPlayerState } from "@game/player/store";

interface Props extends ChildrenProps {
  dimensionId: DimensionId;
  layers?: ComponentType[];
}

function DimensionLayout({ dimensionId, children, layers }: Props) {
  const { mergedPlayer } = getPlayerState();
  if (!isDimension(dimensionId, mergedPlayer.player.dimensionId)) return null;

  return (
    <>
      {layers?.map((Layer, index) => (
        <Layer key={index} />
      ))}
      {children}
    </>
  );
}

export default DimensionLayout;

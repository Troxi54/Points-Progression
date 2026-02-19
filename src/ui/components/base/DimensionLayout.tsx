import { ChildrenProps } from "@/core/types/react";
import { DimensionId } from "@/game/dimensions/types";
import { isDimension } from "@/game/dimensions/utils/compare";
import { getPlayerState } from "@game/player/store/store";
import { ComponentType } from "react";

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

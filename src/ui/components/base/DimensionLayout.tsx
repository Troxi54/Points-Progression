import { AppLayoutProps, AppLayoutState } from "@/ui/app/types";
import { ChildrenProps } from "@/core/types/react";
import { DimensionId } from "@/game/dimensions/types";
import { isDimension } from "@/game/dimensions/utils/compare";
import { ComponentType } from "react";

interface Props extends ChildrenProps {
  dimensionId: DimensionId;
  appLayoutState: AppLayoutState;
  layers?: ComponentType<AppLayoutProps>[];
}

function DimensionLayout({
  dimensionId,
  appLayoutState,
  children,
  layers
}: Props) {
  const { appState } = appLayoutState;

  if (!isDimension(dimensionId, appState.dimensionId)) return null;

  return (
    <>
      {layers?.map((Layer, index) => (
        <Layer appLayoutState={appLayoutState} key={index} />
      ))}
      {children}
    </>
  );
}

export default DimensionLayout;

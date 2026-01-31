import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayout from "@/ui/components/base/DimensionLayout";
import SliphDimensionLayer1 from "./layers/layer1";
import SliphDimensionLayer2 from "./layers/layer2";

function SliphDimension({ appLayoutState }: AppLayoutProps) {
  return (
    <DimensionLayout
      dimensionId="sliph"
      appLayoutState={appLayoutState}
      layers={[SliphDimensionLayer1, SliphDimensionLayer2]}
    />
  );
}

export default SliphDimension;

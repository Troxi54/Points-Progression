import { AppLayoutProps } from "@/ui/app/types";
import DimensionLayout from "@/ui/components/base/DimensionLayout";
import NormalDimensionLayer1 from "./layers/layer1";
import NormalDimensionLayer2 from "./layers/layer2";
import NormalDimensionLayer3 from "./layers/layer3";
import NormalDimensionLayer4 from "./layers/layer4";

function NormalDimension({ appLayoutState }: AppLayoutProps) {
  return (
    <DimensionLayout
      dimensionId="normal"
      appLayoutState={appLayoutState}
      layers={[
        NormalDimensionLayer1,
        NormalDimensionLayer2,
        NormalDimensionLayer3,
        NormalDimensionLayer4
      ]}
    />
  );
}

export default NormalDimension;

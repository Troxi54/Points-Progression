import DimensionLayout from "@/ui/components/base/DimensionLayout";
import NormalDimensionLayer1 from "./layers/layer1";
import NormalDimensionLayer2 from "./layers/layer2";
import NormalDimensionLayer3 from "./layers/layer3";
import NormalDimensionLayer4 from "./layers/layer4";

function NormalDimension() {
  return (
    <DimensionLayout
      dimensionId="normal"
      layers={[
        NormalDimensionLayer1,
        NormalDimensionLayer2,
        NormalDimensionLayer3,
        NormalDimensionLayer4,
      ]}
    />
  );
}

export default NormalDimension;

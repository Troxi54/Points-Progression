import DimensionLayout from "@ui/components/base/DimensionLayout";
import SliphDimensionLayer1 from "./layers/layer1";
import SliphDimensionLayer2 from "./layers/layer2";
import SliphDimensionLayer3 from "./layers/layer3";

function SliphDimension() {
  return (
    <DimensionLayout
      dimensionId="sliph"
      layers={[
        SliphDimensionLayer1,
        SliphDimensionLayer2,
        SliphDimensionLayer3,
      ]}
    />
  );
}

export default SliphDimension;

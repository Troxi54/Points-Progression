import Dimension from "@ui/components/features/Dimension";
import SliphDimensionLayer1 from "./layers/layer1";
import SliphDimensionLayer2 from "./layers/layer2";
import SliphDimensionLayer3 from "./layers/layer3";

function SliphDimension() {
  return (
    <Dimension
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
